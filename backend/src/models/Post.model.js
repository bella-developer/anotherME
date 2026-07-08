import mongoose from 'mongoose';

/**
 * Post Model
 * Represents a multi-paragraph post within a circle
 * Includes atomic reaction counters and moderation fields
 */

const postSchema = new mongoose.Schema(
  {
    // Author reference (never populated in responses)
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // Room type (determines feedback system)
    room: {
      type: String,
      required: true,
      enum: ['dark', 'fantasy', 'philo'],
      index: true
    },

    // Circle references (multiple circles per post)
    circles: [{
      circleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Circle',
        required: true
      },
      name: String,
      color: String,
      icon: String
    }],

    // Legacy single circle reference (for backward compatibility)
    circleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Circle',
      index: true
    },

    // Category tag for content organization (room-specific)
    category: {
      type: String,
      required: true,
      enum: [
        // Dark Room categories
        'CONFESSION', 'REGRET', 'DARK',
        // Fantasy Room categories
        'CREATIVE', 'DAYDREAM', 'FUNNY', 'FUTURISTIC',
        // Philo Room categories
        'SPIRITUAL', 'SHADOW', 'DEEP',
        // Legacy categories (for backward compatibility)
        'LOSS', 'SOLITUDE', 'HOPE', 'FEAR', 'GRIEF', 'ANXIETY', 'LONELINESS'
      ],
      index: true
    },

    // Optional title (for Climb and Philo rooms)
    title: {
      type: String,
      maxlength: 200
    },

    // State for Climb room ideas
    climbState: {
      type: String,
      enum: ['forming', 'sharpening', 'expanding', 'execution'],
      default: 'forming'
    },

    // Original content (before sanitization)
    content: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 5000
    },

    // HTML-sanitized content for safe display
    contentSanitized: {
      type: String,
      required: true
    },

    // Image attachment (optional)
    image: {
      url: {
        type: String,
        default: null
      },
      publicId: {
        type: String,
        default: null
      },
      width: {
        type: Number,
        default: null
      },
      height: {
        type: Number,
        default: null
      },
      format: {
        type: String,
        default: null
      }
    },

    // Atomic reaction counters (room-specific)
    reactions: {
      // Dark Room reactions
      iFeelYou: { type: Number, default: 0, min: 0 },
      notGood: { type: Number, default: 0, min: 0 },
      youreNotAlone: { type: Number, default: 0, min: 0 },
      sendingStrength: { type: Number, default: 0, min: 0 },
      
      // Fantasy Room reactions
      vibe: { type: Number, default: 0, min: 0 },
      dream: { type: Number, default: 0, min: 0 },
      inspire: { type: Number, default: 0, min: 0 },
      wild: { type: Number, default: 0, min: 0 },
      
      // Philo Room reactions
      lamp: { type: Number, default: 0, min: 0 },
      spark: { type: Number, default: 0, min: 0 },
      clap: { type: Number, default: 0, min: 0 },
      
      // Legacy reactions (for backward compatibility)
      iRelate: { type: Number, default: 0, min: 0 },
      imListening: { type: Number, default: 0, min: 0 },
      theAbyss: { type: Number, default: 0, min: 0 }
    },

    // Track which users reacted (for idempotence)
    userReactions: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      type: {
        type: String,
        required: true
      }
    }],

    // Denormalized comment count for performance
    commentCount: {
      type: Number,
      default: 0,
      min: 0
    },

    // Moderation fields
    isHidden: {
      type: Boolean,
      default: false
    },

    hiddenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    hiddenAt: {
      type: Date,
      default: null
    },

    // Circle topic post fields
    isCircleTopic: {
      type: Boolean,
      default: false,
      index: true
    },

    circleTopicSetAt: {
      type: Date,
      default: null
    },

    circleTopicSetBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    collection: 'posts'
  }
);

// Compound indexes for efficient queries
postSchema.index({ room: 1, createdAt: -1 }); // Room feed
postSchema.index({ circleId: 1, createdAt: -1 }); // Circle feed (legacy)
postSchema.index({ 'circles.circleId': 1, createdAt: -1 }); // Multi-circle feed
postSchema.index({ category: 1, createdAt: -1 }); // Category feed
postSchema.index({ authorId: 1, createdAt: -1 }); // User posts
postSchema.index({ createdAt: -1 }); // Global feed
postSchema.index({ room: 1, climbState: 1, createdAt: -1 }); // Climb room state

// Index for filtering hidden content
postSchema.index({ isHidden: 1 });

// Index for circle topic posts
postSchema.index({ 'circles.circleId': 1, isCircleTopic: 1 });
postSchema.index({ circleId: 1, isCircleTopic: 1 }); // Legacy support

/**
 * Add a reaction atomically (one reaction per user per post)
 * If user already has a different reaction, it will be replaced
 * @param {string} userId - User ID adding the reaction
 * @param {string} reactionType - Type of reaction (like, support, insightful)
 * @returns {Promise<boolean>} - True if reaction was added, false if already exists
 */
postSchema.methods.addReaction = async function(userId, reactionType) {
  // Check if user already reacted with this exact type
  const existingReaction = this.userReactions.find(
    r => r.userId.toString() === userId.toString() && r.type === reactionType
  );

  if (existingReaction) {
    return false; // Idempotent - already reacted with this type
  }

  // Check if user has any other reaction on this post
  const otherReaction = this.userReactions.find(
    r => r.userId.toString() === userId.toString() && r.type !== reactionType
  );

  if (otherReaction) {
    // Remove the old reaction first
    await this.constructor.findOneAndUpdate(
      { _id: this._id },
      {
        $inc: { [`reactions.${otherReaction.type}`]: -1 },
        $pull: { userReactions: { userId, type: otherReaction.type } }
      }
    );

    // Then add the new reaction
    const result = await this.constructor.findOneAndUpdate(
      { _id: this._id },
      {
        $inc: { [`reactions.${reactionType}`]: 1 },
        $push: { userReactions: { userId, type: reactionType } }
      },
      { new: true }
    );

    if (result) {
      this.reactions = result.reactions;
      this.userReactions = result.userReactions;
      return true;
    }
  } else {
    // Add new reaction (user hasn't reacted yet)
    const result = await this.constructor.findOneAndUpdate(
      { _id: this._id },
      {
        $inc: { [`reactions.${reactionType}`]: 1 },
        $push: { userReactions: { userId, type: reactionType } }
      },
      { new: true }
    );

    if (result) {
      this.reactions[reactionType] = result.reactions[reactionType];
      this.userReactions = result.userReactions;
      return true;
    }
  }

  return false;
};

/**
 * Remove a reaction atomically
 * @param {string} userId - User ID removing the reaction
 * @param {string} reactionType - Type of reaction to remove
 * @returns {Promise<boolean>} - True if reaction was removed, false if didn't exist
 */
postSchema.methods.removeReaction = async function(userId, reactionType) {
  // Check if user has this reaction
  const existingReaction = this.userReactions.find(
    r => r.userId.toString() === userId.toString() && r.type === reactionType
  );

  if (!existingReaction) {
    return false; // Idempotent - no reaction to remove
  }

  // Remove reaction atomically
  const result = await this.constructor.findOneAndUpdate(
    { _id: this._id },
    {
      $inc: { [`reactions.${reactionType}`]: -1 },
      $pull: { userReactions: { userId, type: reactionType } }
    },
    { new: true }
  );

  if (result) {
    this.reactions[reactionType] = result.reactions[reactionType];
    this.userReactions = result.userReactions;
    return true;
  }

  return false;
};

/**
 * Increment comment count atomically
 */
postSchema.methods.incrementCommentCount = async function() {
  await this.constructor.findByIdAndUpdate(
    this._id,
    { $inc: { commentCount: 1 } }
  );
  this.commentCount += 1;
};

/**
 * Decrement comment count atomically
 */
postSchema.methods.decrementCommentCount = async function() {
  await this.constructor.findByIdAndUpdate(
    this._id,
    { $inc: { commentCount: -1 } }
  );
  this.commentCount -= 1;
};

/**
 * Hide post (moderation action)
 * @param {string} moderatorId - ID of moderator hiding the post
 */
postSchema.methods.hide = async function(moderatorId) {
  this.isHidden = true;
  this.hiddenBy = moderatorId;
  this.hiddenAt = new Date();
  await this.save();
};

/**
 * Unhide post
 */
postSchema.methods.unhide = async function() {
  this.isHidden = false;
  this.hiddenBy = null;
  this.hiddenAt = null;
  await this.save();
};

/**
 * Check if user has reacted with specific type
 * @param {string} userId - User ID to check
 * @param {string} reactionType - Reaction type to check
 * @returns {boolean}
 */
postSchema.methods.hasUserReacted = function(userId, reactionType) {
  return this.userReactions.some(
    r => r.userId.toString() === userId.toString() && r.type === reactionType
  );
};

/**
 * Transform post document for API responses
 * Never expose sensitive fields
 */
postSchema.methods.toSafeObject = function() {
  return {
    content: this.contentSanitized,
    category: this.category,
    reactions: this.reactions,
    commentCount: this.commentCount,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
    // Never include: _id, authorId, circleId (raw), userReactions, isHidden, hiddenBy, hiddenAt
  };
};

// Prevent accidental exposure of sensitive fields in JSON
postSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.authorId;
    delete ret.circleId;
    delete ret.content; // Only expose sanitized content
    delete ret.userReactions;
    delete ret.isHidden;
    delete ret.hiddenBy;
    delete ret.hiddenAt;
    return ret;
  }
});

const Post = mongoose.model('Post', postSchema);

export default Post;
