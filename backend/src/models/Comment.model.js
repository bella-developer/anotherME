import mongoose from 'mongoose';

/**
 * Comment Model
 * Represents a comment or reply in a circle discussion
 * Supports nested replies with depth limiting
 */

const commentSchema = new mongoose.Schema(
  {
    // Author reference (never populated in responses)
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // Circle reference
    circleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Circle',
      required: true,
      index: true
    },

    // Post reference (optional - for post comments)
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      default: null,
      index: true
    },

    // Parent comment reference (null for top-level comments)
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
      index: true
    },

    // Original content (before sanitization)
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 2000
    },

    // HTML-sanitized content for safe display
    contentSanitized: {
      type: String,
      required: true
    },

    // Nesting depth (0 for top-level, max 5)
    depth: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 5
    },

    // Reaction counters
    reactions: {
      resonate: {
        type: Number,
        default: 0,
        min: 0
      },
      echo: {
        type: Number,
        default: 0,
        min: 0
      }
    },

    // Track which users reacted
    userReactions: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      type: {
        type: String,
        enum: ['resonate', 'echo'],
        required: true
      }
    }],

    // Reply count for this comment
    replyCount: {
      type: Number,
      default: 0,
      min: 0
    },

    // Soft delete flag
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: 'comments'
  }
);

// Compound indexes for efficient queries
commentSchema.index({ circleId: 1, parentId: 1, createdAt: -1 }); // Get comments by circle and parent
commentSchema.index({ circleId: 1, postId: 1, parentId: 1, createdAt: -1 }); // Get comments by circle, topic, and parent
commentSchema.index({ postId: 1, createdAt: -1 }); // Get comments by topic post
commentSchema.index({ authorId: 1, createdAt: -1 }); // User comments
commentSchema.index({ createdAt: -1 }); // Recent comments

/**
 * Add a reaction atomically
 */
commentSchema.methods.addReaction = async function(userId, reactionType) {
  const existingReaction = this.userReactions.find(
    r => r.userId.toString() === userId.toString() && r.type === reactionType
  );

  if (existingReaction) {
    return false;
  }

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

  return false;
};

/**
 * Remove a reaction atomically
 */
commentSchema.methods.removeReaction = async function(userId, reactionType) {
  const existingReaction = this.userReactions.find(
    r => r.userId.toString() === userId.toString() && r.type === reactionType
  );

  if (!existingReaction) {
    return false;
  }

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
 * Soft delete comment
 */
commentSchema.methods.softDelete = async function() {
  this.isDeleted = true;
  this.content = '[deleted]';
  this.contentSanitized = '[deleted]';
  await this.save();
};

/**
 * Check if comment can have replies (depth limit)
 */
commentSchema.methods.canHaveReplies = function() {
  return this.depth < 5;
};

/**
 * Get depth for a reply to this comment
 */
commentSchema.methods.getReplyDepth = function() {
  return this.depth + 1;
};

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
