import mongoose from 'mongoose';

/**
 * Circle Model
 * Represents a community space where users can post and interact
 * Supports non-unique names and visibility controls
 */

const circleSchema = new mongoose.Schema(
  {
    // Circle name (non-unique)
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100
    },

    // Circle description
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500
    },

    // Creator reference (for moderation purposes only)
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // Visibility setting
    visibility: {
      type: String,
      enum: ['public', 'restricted'],
      default: 'public',
      index: true
    },

    // Denormalized member count for performance
    memberCount: {
      type: Number,
      default: 0,
      min: 0
    },

    // Denormalized post count for performance
    postCount: {
      type: Number,
      default: 0,
      min: 0
    },

    // Allowed categories for posts in this circle
    categories: [{
      type: String,
      enum: [
        // Dark Room categories
        'CONFESSION', 'REGRET', 'DARK',
        // Climb Room categories
        'IDEA', 'FUTURISTIC', 'BUSINESS', 'ENTREPRENEUR',
        // Philo Room categories
        'SPIRITUAL', 'SHADOW', 'DEEP',
        // Legacy categories
        'LOSS', 'SOLITUDE', 'HOPE', 'FEAR', 'GRIEF', 'ANXIETY', 'LONELINESS'
      ]
    }],

    // Room identifier (optional - for filtering circles by room)
    room: {
      type: String,
      enum: ['dark', 'climb', 'philo', null],
      default: null,
      index: true
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    collection: 'circles'
  }
);

// Text index for search functionality
circleSchema.index({ name: 'text', description: 'text' });

// Compound index for visibility-based queries
circleSchema.index({ visibility: 1, createdAt: -1 });

// Index for sorting by creation date
circleSchema.index({ createdAt: -1 });

/**
 * Increment post count atomically
 */
circleSchema.methods.incrementPostCount = async function() {
  await this.constructor.findByIdAndUpdate(
    this._id,
    { $inc: { postCount: 1 } }
  );
  this.postCount += 1;
};

/**
 * Decrement post count atomically
 */
circleSchema.methods.decrementPostCount = async function() {
  await this.constructor.findByIdAndUpdate(
    this._id,
    { $inc: { postCount: -1 } }
  );
  this.postCount -= 1;
};

/**
 * Increment member count atomically
 */
circleSchema.methods.incrementMemberCount = async function() {
  await this.constructor.findByIdAndUpdate(
    this._id,
    { $inc: { memberCount: 1 } }
  );
  this.memberCount += 1;
};

/**
 * Decrement member count atomically
 */
circleSchema.methods.decrementMemberCount = async function() {
  await this.constructor.findByIdAndUpdate(
    this._id,
    { $inc: { memberCount: -1 } }
  );
  this.memberCount -= 1;
};

/**
 * Check if user is the circle creator (for moderation)
 * @param {string} userId - User ID to check
 * @returns {boolean}
 */
circleSchema.methods.isCreator = function(userId) {
  return this.creatorId.toString() === userId.toString();
};

/**
 * Transform circle document for API responses
 * Never expose sensitive fields
 */
circleSchema.methods.toSafeObject = function() {
  return {
    name: this.name,
    description: this.description,
    visibility: this.visibility,
    memberCount: this.memberCount,
    postCount: this.postCount,
    categories: this.categories,
    room: this.room,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
    // Never include: _id, creatorId
  };
};

// Prevent accidental exposure of sensitive fields in JSON
circleSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.creatorId;
    return ret;
  }
});

const Circle = mongoose.model('Circle', circleSchema);

export default Circle;
