import mongoose from 'mongoose';

/**
 * User Model
 * Represents a user with username-based identity
 * Optional demographics (age, gender)
 */

const userSchema = new mongoose.Schema(
  {
    // Username for login and public identity (unique, required)
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      index: true,
      match: /^[a-z0-9_-]+$/ // Only lowercase alphanumeric, underscore, hyphen
    },

    // Hashed password
    password: {
      type: String,
      required: true,
      minlength: 60 // bcrypt hash length
    },

    // Optional email for account recovery
    email: {
      type: String,
      sparse: true, // Allows multiple null values
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      default: null
    },

    // Google OAuth
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      default: null
    },

    profilePicture: {
      type: String,
      default: null
    },

    fullName: {
      type: String,
      default: null
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },

    // Password reset tokens
    resetPasswordToken: {
      type: String,
      default: null
    },

    resetPasswordExpires: {
      type: Date,
      default: null
    },

    // Optional demographic information (no PII)
    age: {
      type: Number,
      min: 18,
      max: 100,
      default: null
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say', null],
      default: null
    },

    // Failed login attempts tracking
    failedLoginAttempts: {
      type: Number,
      default: 0
    },

    lastFailedLogin: {
      type: Date,
      default: null
    },

    accountLockedUntil: {
      type: Date,
      default: null
    },

    // Last activity timestamp
    lastActive: {
      type: Date,
      default: Date.now
    },

    // Ban management
    isBanned: {
      type: Boolean,
      default: false,
      index: true
    },

    banExpiresAt: {
      type: Date,
      default: null
    },

    // Gamification Stats - Room-specific XP and levels
    stats: {
      climb: {
        genius: { type: Number, default: 0 },    // Originality, innovation
        hustle: { type: Number, default: 0 },    // Execution, effort
        legend: { type: Number, default: 0 }     // Impact, vision
      },
      dark: {
        depth: { type: Number, default: 0 },     // Emotional resonance
        mystery: { type: Number, default: 0 },   // Intrigue, curiosity
        wisdom: { type: Number, default: 0 }     // Insight, understanding
      },
      philo: {
        logic: { type: Number, default: 0 },     // Reasoning, clarity
        insight: { type: Number, default: 0 },   // Deep understanding
        impact: { type: Number, default: 0 }     // Influence, reach
      }
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    collection: 'users'
  }
);

// Compound index for ban cleanup queries
userSchema.index({ isBanned: 1, banExpiresAt: 1 });

// Index for sorting by creation date
userSchema.index({ createdAt: 1 });

/**
 * Invalidate all sessions for this user
 * Note: Actual session invalidation happens at the session store level
 * This method is kept for compatibility but sessions are managed separately
 */
userSchema.methods.invalidateSessions = async function() {
  // Sessions are managed by express-session and MongoDB
  // Individual session invalidation happens through session.destroy()
  // This is a placeholder for future session management logic
  await this.save();
};

/**
 * Check if account is locked due to failed login attempts
 * @returns {boolean}
 */
userSchema.methods.isAccountLocked = function() {
  if (!this.accountLockedUntil) {
    return false;
  }
  return this.accountLockedUntil > new Date();
};

/**
 * Increment failed login attempts
 * Locks account after 5 failed attempts within 24 hours
 */
userSchema.methods.incrementFailedLogins = async function() {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  // Reset counter if last failed login was more than 24 hours ago
  if (!this.lastFailedLogin || this.lastFailedLogin < oneDayAgo) {
    this.failedLoginAttempts = 1;
    this.lastFailedLogin = now;
  } else {
    this.failedLoginAttempts += 1;
    this.lastFailedLogin = now;
  }
  
  // Lock account after 5 failed attempts
  if (this.failedLoginAttempts >= 5) {
    // Lock for 24 hours
    this.accountLockedUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
  
  await this.save();
};

/**
 * Reset failed login attempts after successful login
 */
userSchema.methods.resetFailedLogins = async function() {
  this.failedLoginAttempts = 0;
  this.lastFailedLogin = null;
  this.accountLockedUntil = null;
  await this.save();
};

/**
 * Check if user is currently banned
 * @returns {boolean}
 */
userSchema.methods.isCurrentlyBanned = function() {
  if (!this.isBanned) {
    return false;
  }
  
  if (!this.banExpiresAt) {
    return true; // Permanent ban
  }
  
  return this.banExpiresAt > new Date();
};

/**
 * Update last active timestamp
 */
userSchema.methods.updateLastActive = async function() {
  try {
    await User.findByIdAndUpdate(
      this._id,
      { lastActive: new Date() },
      { new: false }
    );
  } catch (error) {
    // Silently fail - this is a non-critical operation
    console.error('Failed to update last active:', error.message);
  }
};

/**
 * Ban user temporarily
 * @param {number} durationMs - Ban duration in milliseconds
 */
userSchema.methods.banTemporarily = async function(durationMs) {
  this.isBanned = true;
  this.banExpiresAt = new Date(Date.now() + durationMs);
  await this.save();
};

/**
 * Ban user permanently
 */
userSchema.methods.banPermanently = async function() {
  this.isBanned = true;
  this.banExpiresAt = null;
  await this.save();
};

/**
 * Unban user
 */
userSchema.methods.unban = async function() {
  this.isBanned = false;
  this.banExpiresAt = null;
  await this.save();
};

/**
 * Transform user document for API responses
 * Never expose sensitive fields
 */
userSchema.methods.toSafeObject = function() {
  return {
    username: this.username,
    email: this.email,
    age: this.age,
    gender: this.gender,
    createdAt: this.createdAt
  };
};

// Prevent accidental exposure of sensitive fields in JSON
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    delete ret.isBanned;
    delete ret.banExpiresAt;
    delete ret.lastActive;
    delete ret.updatedAt;
    delete ret.failedLoginAttempts;
    delete ret.lastFailedLogin;
    delete ret.accountLockedUntil;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

export default User;
