import { generateOpaqueId } from './id.utils.js';
import { calculateLevel } from '../services/gamification.service.js';

/**
 * Response Sanitization Utilities
 * Ensures API responses never expose internal authorIds or sensitive fields
 * Uses MongoDB ObjectIds directly (they are non-sequential and safe to expose)
 * Implements Requirements: 3.4, 4.4, 5.5, 19.5, 20.1, 20.3, 20.4
 */

/**
 * Get highest level stat for a user across all rooms
 * @param {Object} userStats - User stats object
 * @returns {Object|null} { stat, level, room } or null if no stats
 */
function getHighestLevelStatOverall(userStats) {
  if (!userStats) {
    return null;
  }

  let highestStat = null;
  let highestLevel = 0;
  let highestRoom = null;

  for (const [room, stats] of Object.entries(userStats)) {
    for (const [stat, xp] of Object.entries(stats)) {
      const level = calculateLevel(xp);
      if (level > highestLevel) {
        highestLevel = level;
        highestStat = stat;
        highestRoom = room;
      }
    }
  }

  return highestStat ? { stat: highestStat, level: highestLevel, room: highestRoom } : null;
}

/**
 * Get highest level stat for a user in a specific room
 * @param {Object} userStats - User stats object
 * @param {string} room - Room type (climb, dark, philo)
 * @returns {Object|null} { stat, level } or null if no stats
 */
function getHighestLevelStat(userStats, room) {
  if (!userStats || !userStats[room]) {
    return null;
  }

  const roomStats = userStats[room];
  let highestStat = null;
  let highestLevel = 0;

  for (const [stat, xp] of Object.entries(roomStats)) {
    const level = calculateLevel(xp);
    if (level > highestLevel) {
      highestLevel = level;
      highestStat = stat;
    }
  }

  return highestStat ? { stat: highestStat, level: highestLevel } : null;
}

/**
 * Sanitize user data for public API responses
 * Never expose: _id, password, isBanned, banExpiresAt, lastActive
 * @param {Object} user - User document or plain object
 * @returns {Object} Sanitized user object
 */
export function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  // Handle Mongoose document
  const userData = user.toObject ? user.toObject() : user;

  return {
    id: userData._id.toString(), // Use MongoDB ObjectId directly
    username: userData.username,
    age: userData.age || null,
    gender: userData.gender || null,
    role: userData.role || 'user', // Include role for authorization
    createdAt: userData.createdAt,
  };
}

/**
 * Sanitize post data for public API responses
 * Never expose: _id, authorId, circleId (raw), isHidden, hiddenBy, hiddenAt
 * @param {Object} post - Post document or plain object
 * @param {Object} options - Optional configuration
 * @param {boolean} options.includeAuthorUsername - Whether to include author username (requires populated author)
 * @param {boolean} options.includeCircleName - Whether to include circle name (requires populated circle)
 * @param {string} options.userId - Current user ID to filter userReactions
 * @returns {Object} Sanitized post object
 */
export function sanitizePost(post, options = {}) {
  if (!post) {
    return null;
  }

  // Handle Mongoose document
  const postData = post.toObject ? post.toObject() : post;

  const sanitized = {
    id: postData._id.toString(), // Use MongoDB ObjectId directly
    room: postData.room,
    title: postData.title || null,
    content: postData.contentSanitized, // Only sanitized content
    category: postData.category,
    image: postData.image || null, // Include image data if present
    reactions: postData.reactions || {},
    commentCount: postData.commentCount || 0,
    createdAt: postData.createdAt,
    updatedAt: postData.updatedAt,
    // Never include: _id, authorId, circleId (raw), content (unsanitized), isHidden, hiddenBy, hiddenAt
  };

  // Include user's reactions if userId provided
  if (options.userId && postData.userReactions) {
    sanitized.userReactions = postData.userReactions
      .filter(r => r.userId.toString() === options.userId.toString())
      .map(r => r.type);
  }

  // Include isAuthor flag if userId provided (for UI logic)
  if (options.userId) {
    sanitized.isAuthor = postData.authorId.toString() === options.userId.toString();
  }

  // Include circles array with sanitized data
  if (postData.circles && postData.circles.length > 0) {
    sanitized.circles = postData.circles.map(circle => {
      const circleIdValue = circle.circleId?._id?.toString() || circle.circleId?.toString();
      return {
        id: circleIdValue,
        circleId: circleIdValue, // Include for backward compatibility
        name: circle.name,
        fullName: circle.circleId?.name || circle.name,
        description: circle.circleId?.description || null,
        room: circle.circleId?.room || null, // Include room field for badges
        color: circle.color,
        icon: circle.icon
      };
    });
  }

  // Optionally include author username (if populated and requested)
  if (options.includeAuthorUsername && postData.authorId?.username) {
    sanitized.author = {
      username: postData.authorId.username,
    };
  }

  // Legacy: Optionally include single circle name (if populated and requested)
  if (options.includeCircleName && postData.circleId?.name) {
    sanitized.circle = {
      id: postData.circleId._id.toString(),
      name: postData.circleId.name,
      room: postData.circleId.room || null, // Include room field for badges
    };
  }

  return sanitized;
}

/**
 * Sanitize circle data for public API responses
 * Never expose: _id, creatorId (raw)
 * @param {Object} circle - Circle document or plain object
 * @param {Object} options - Optional configuration
 * @param {boolean} options.includeCreatorAlias - Whether to include creator username (requires populated creator)
 * @returns {Object} Sanitized circle object
 */
export function sanitizeCircle(circle, options = {}) {
  if (!circle) {
    return null;
  }

  // Handle Mongoose document
  const circleData = circle.toObject ? circle.toObject() : circle;

  const sanitized = {
    id: circleData._id.toString(), // Use MongoDB ObjectId directly
    name: circleData.name,
    description: circleData.description,
    visibility: circleData.visibility,
    memberCount: circleData.memberCount || 0,
    postCount: circleData.postCount || 0,
    topicCount: circleData.topicCount || 0, // Number of topics (0-3)
    categories: circleData.categories || [],
    room: circleData.room || null, // Include room field for badges
    createdAt: circleData.createdAt,
    updatedAt: circleData.updatedAt,
    // Never include: _id, creatorId (raw)
  };

  // Include active user count if available
  if (circleData.activeUserCount !== undefined) {
    sanitized.activeUserCount = circleData.activeUserCount;
  }

  // Optionally include creator username (if populated and requested)
  if (options.includeCreatorAlias && circleData.creatorId?.username) {
    sanitized.creator = {
      username: circleData.creatorId.username,
    };
  }

  return sanitized;
}

/**
 * Sanitize comment data for public API responses
 * Never expose: _id, postId, authorId, parentId (raw)
 * @param {Object} comment - Comment document or plain object
 * @param {Object} options - Optional configuration
 * @param {boolean} options.includeAuthorAlias - Whether to include author username (requires populated author)
 * @returns {Object} Sanitized comment object
 */
export function sanitizeComment(comment, options = {}) {
  if (!comment) {
    return null;
  }

  // Handle Mongoose document
  const commentData = comment.toObject ? comment.toObject() : comment;

  const sanitized = {
    id: generateOpaqueId(commentData._id.toString()), // Opaque ID
    content: commentData.contentSanitized, // Only sanitized content
    depth: commentData.depth,
    isDeleted: commentData.isDeleted || false,
    reactions: {
      resonate: commentData.reactions?.resonate || 0,
      echo: commentData.reactions?.echo || 0
    },
    replyCount: commentData.replyCount || 0,
    createdAt: commentData.createdAt,
    // Never include: _id, postId, authorId, parentId (raw), content (unsanitized), updatedAt
  };

  // Optionally include author username (if populated and requested)
  if (options.includeAuthorAlias && commentData.authorId?.username) {
    sanitized.author = {
      username: commentData.authorId.username,
    };
  }

  // Include parent ID as opaque if it exists
  if (commentData.parentId) {
    sanitized.parentId = generateOpaqueId(commentData.parentId.toString());
  }

  return sanitized;
}

/**
 * Sanitize comment data for circle comments (uses real MongoDB IDs for replies)
 * Circle comments need real IDs so replies can reference parent comments
 * @param {Object} comment - Comment document or plain object
 * @param {Object} options - Optional configuration
 * @returns {Object} Sanitized comment object with real MongoDB ID
 */
export function sanitizeCircleComment(comment, options = {}) {
  if (!comment) {
    return null;
  }

  // Handle Mongoose document
  const commentData = comment.toObject ? comment.toObject() : comment;

  const sanitized = {
    id: commentData._id.toString(), // Use real MongoDB ObjectId for circle comments
    content: commentData.contentSanitized, // Only sanitized content
    depth: commentData.depth,
    isDeleted: commentData.isDeleted || false,
    reactions: {
      resonate: commentData.reactions?.resonate || 0,
      echo: commentData.reactions?.echo || 0
    },
    replyCount: commentData.replyCount || 0,
    createdAt: commentData.createdAt,
    // Never include: _id, postId, authorId (raw), parentId (raw), content (unsanitized), updatedAt
  };

  // Include user reactions if present (already filtered to current user)
  if (commentData.userReactions) {
    sanitized.userReactions = commentData.userReactions;
  }

  // Include isOwnComment flag if present
  if (commentData.isOwnComment !== undefined) {
    sanitized.isOwnComment = commentData.isOwnComment;
  }

  // Handle author data - check if manually attached first, then check populated authorId
  if (commentData.author) {
    // Manually attached author data (from manual population)
    sanitized.author = {
      username: commentData.author.username,
    };
    
    if (commentData.author.levelBadge) {
      sanitized.author.levelBadge = commentData.author.levelBadge;
    }
  } else if (commentData.authorId?.username) {
    // Populated authorId (from mongoose populate)
    sanitized.author = {
      username: commentData.authorId.username,
    };
    
    // Include level badge info if stats are available
    if (commentData.authorId.stats) {
      const levelBadge = getHighestLevelStatOverall(commentData.authorId.stats);
      if (levelBadge) {
        sanitized.author.levelBadge = levelBadge;
      }
    }
  } else if (typeof commentData.authorId === 'object' && commentData.authorId?.username) {
    sanitized.author = {
      username: commentData.authorId.username,
    };
    
    // Include level badge info if stats are available
    if (commentData.authorId.stats) {
      const levelBadge = getHighestLevelStatOverall(commentData.authorId.stats);
      if (levelBadge) {
        sanitized.author.levelBadge = levelBadge;
      }
    }
  }

  // Include parent ID as real MongoDB ID if it exists
  if (commentData.parentId) {
    sanitized.parentId = commentData.parentId.toString();
  }

  return sanitized;
}

/**
 * Sanitize an array of documents
 * @param {Array} items - Array of documents
 * @param {Function} sanitizeFunc - Sanitization function to apply
 * @param {Object} options - Options to pass to sanitization function
 * @returns {Array} Array of sanitized objects
 */
export function sanitizeArray(items, sanitizeFunc, options = {}) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => sanitizeFunc(item, options)).filter(Boolean);
}

/**
 * Create a paginated response with sanitized data
 * @param {Array} items - Array of documents to sanitize
 * @param {Function} sanitizeFunc - Sanitization function to apply
 * @param {Object} pagination - Pagination metadata
 * @param {string} pagination.cursor - Opaque cursor for next page
 * @param {boolean} pagination.hasMore - Whether more results exist
 * @param {number} pagination.total - Total count (optional)
 * @param {Object} options - Options to pass to sanitization function
 * @returns {Object} Paginated response object
 */
export function createPaginatedResponse(
  items,
  sanitizeFunc,
  pagination,
  options = {}
) {
  return {
    data: sanitizeArray(items, sanitizeFunc, options),
    pagination: {
      cursor: pagination.cursor || null,
      hasMore: pagination.hasMore || false,
      ...(pagination.total !== undefined && { total: pagination.total }),
    },
  };
}

/**
 * Create a success response
 * @param {*} data - Response data
 * @param {string} message - Optional success message
 * @returns {Object} Success response object
 */
export function createSuccessResponse(data, message = null) {
  const response = {
    status: 'success',
    data,
  };

  if (message) {
    response.message = message;
  }

  return response;
}

/**
 * Create an error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {string} code - Machine-readable error code
 * @param {Object} details - Optional error details
 * @returns {Object} Error response object
 */
export function createErrorResponse(message, statusCode, code, details = null) {
  const response = {
    status: 'error',
    statusCode,
    message,
    code,
  };

  if (details) {
    response.details = details;
  }

  return response;
}

/**
 * Sanitize error for public API response
 * Never expose stack traces or internal details in production
 * @param {Error} error - Error object
 * @param {string} requestId - Request ID for correlation
 * @returns {Object} Sanitized error response
 */
export function sanitizeError(error, requestId) {
  const response = {
    status: 'error',
    statusCode: error.statusCode || 500,
    message: error.userMessage || error.message || 'An unexpected error occurred',
    code: error.code || 'INTERNAL_ERROR',
    requestId,
  };

  // Add validation details if present
  if (error.validationErrors) {
    response.details = error.validationErrors;
  }

  // Add retry-after for rate limits
  if (error.statusCode === 429 && error.retryAfter) {
    response.retryAfter = error.retryAfter;
  }

  // Never expose stack traces in production
  if (process.env.NODE_ENV !== 'production' && error.stack) {
    response.stack = error.stack;
  }

  return response;
}
