import Circle from '../models/Circle.model.js';
import Post from '../models/Post.model.js';
import Comment from '../models/Comment.model.js';
import { decodeOpaqueId } from '../utils/id.utils.js';

/**
 * Circle Service
 * Handles circle creation, listing, searching, and moderation
 * Implements Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */

/**
 * Helper: Get topic count for a circle
 * @param {ObjectId} circleId - MongoDB ObjectId of the circle
 * @returns {Promise<number>} Number of topics (0-3)
 */
async function getCircleTopicCount(circleId) {
  try {
    const count = await Post.countDocuments({
      $or: [
        { circleId: circleId, isCircleTopic: true },
        { 'circles.circleId': circleId, isCircleTopic: true }
      ]
    });
    return count;
  } catch (error) {
    console.error('Error getting circle topic count:', error);
    return 0;
  }
}

/**
 * Create a new circle
 * @param {string} userId - Creator's user ID
 * @param {Object} circleData - Circle data
 * @param {string} circleData.name - Circle name (non-unique)
 * @param {string} circleData.description - Circle description
 * @param {string} circleData.visibility - Visibility setting (public/restricted)
 * @param {Array<string>} circleData.categories - Allowed categories
 * @returns {Promise<Object>} Created circle
 */
export async function createCircle(userId, circleData) {
  if (!userId) {
    const error = new Error('User ID is required');
    error.statusCode = 401;
    error.code = 'MISSING_USER_ID';
    error.userMessage = 'Authentication required';
    throw error;
  }

  const { name, description, visibility = 'public', categories = [], room } = circleData;

  // Validate required fields
  if (!name || !description) {
    const error = new Error('Name and description are required');
    error.statusCode = 400;
    error.code = 'MISSING_REQUIRED_FIELDS';
    error.userMessage = 'Circle name and description are required';
    throw error;
  }

  // Validate room if provided
  if (room && !['dark', 'fantasy', 'philo'].includes(room)) {
    const error = new Error('Invalid room value');
    error.statusCode = 400;
    error.code = 'INVALID_ROOM';
    error.userMessage = 'Room must be either dark, fantasy, or philo';
    throw error;
  }

  // Check if user already has a circle in this room (1 circle per room limit)
  if (room) {
    const existingCircleInRoom = await Circle.findOne({
      creatorId: userId,
      room: room
    });

    if (existingCircleInRoom) {
      const error = new Error('You already have a circle in this room');
      error.statusCode = 400;
      error.code = 'CIRCLE_LIMIT_PER_ROOM';
      error.userMessage = `You can only create one circle per room. You already have "${existingCircleInRoom.name}" in the ${room} room.`;
      throw error;
    }
  }

  // Check total circles created by user today (3 circles per day limit)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const circlesCreatedToday = await Circle.countDocuments({
    creatorId: userId,
    createdAt: { $gte: todayStart }
  });

  if (circlesCreatedToday >= 3) {
    const error = new Error('Daily circle creation limit reached');
    error.statusCode = 429;
    error.code = 'DAILY_CIRCLE_LIMIT';
    error.userMessage = 'You can only create 3 circles per day. Please try again tomorrow.';
    throw error;
  }

  // Create circle document
  const circle = new Circle({
    name: name.trim(),
    description: description.trim(),
    creatorId: userId,
    visibility,
    categories,
    room: room || null, // Optional room field
    memberCount: 0,
    postCount: 0
  });

  // Save circle to database
  try {
    await circle.save();
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const err = new Error('Validation failed');
      err.statusCode = 400;
      err.code = 'VALIDATION_ERROR';
      err.userMessage = 'Invalid circle data provided';
      err.validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      throw err;
    }
    throw error;
  }

  return circle;
}

/**
 * List circles with cursor-based pagination
 * @param {Object} options - Query options
 * @param {string} options.cursor - Opaque cursor for pagination
 * @param {number} options.limit - Number of results per page (default: 20, max: 50)
 * @param {string} options.visibility - Filter by visibility (optional)
 * @param {string} options.room - Filter by room type (optional: 'dark', 'fantasy', 'philo')
 * @returns {Promise<Object>} Paginated circles
 */
export async function listCircles(options = {}) {
  const { cursor, limit = 20, visibility, room } = options;
  
  // Validate and cap limit
  const pageLimit = Math.min(Math.max(1, limit), 50);

  // Build query
  const query = {};

  // Filter by visibility if specified
  if (visibility) {
    if (!['public', 'restricted'].includes(visibility)) {
      const error = new Error('Invalid visibility value');
      error.statusCode = 400;
      error.code = 'INVALID_VISIBILITY';
      error.userMessage = 'Visibility must be either public or restricted';
      throw error;
    }
    query.visibility = visibility;
  }

  // Filter by room if specified
  if (room) {
    if (!['dark', 'fantasy', 'philo'].includes(room)) {
      const error = new Error('Invalid room value');
      error.statusCode = 400;
      error.code = 'INVALID_ROOM';
      error.userMessage = 'Room must be either dark, fantasy, or philo';
      throw error;
    }
    query.room = room;
  }

  // Apply cursor for pagination
  if (cursor) {
    try {
      const decodedCursor = Buffer.from(cursor, 'base64url').toString('utf-8');
      const [timestamp, id] = decodedCursor.split('|');
      
      if (!timestamp || !id) {
        throw new Error('Invalid cursor format');
      }

      // Cursor-based pagination: find documents created before the cursor
      query.$or = [
        { createdAt: { $lt: new Date(timestamp) } },
        { 
          createdAt: new Date(timestamp),
          _id: { $lt: id }
        }
      ];
    } catch (error) {
      const err = new Error('Invalid cursor');
      err.statusCode = 400;
      err.code = 'INVALID_CURSOR';
      err.userMessage = 'Invalid pagination cursor';
      throw err;
    }
  }

  // Fetch circles with limit + 1 to check if there are more results
  const circles = await Circle.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(pageLimit + 1)
    .lean();

  // Check if there are more results
  const hasMore = circles.length > pageLimit;
  
  // Remove the extra document if it exists
  if (hasMore) {
    circles.pop();
  }

  // Add active user count to each circle
  for (const circle of circles) {
    const uniqueUsers = await Comment.distinct('authorId', {
      circleId: circle._id,
      isDeleted: false
    });
    circle.activeUserCount = uniqueUsers.length;
    
    // Add topic count (0-3)
    circle.topicCount = await getCircleTopicCount(circle._id);
  }

  // Generate next cursor if there are more results
  let nextCursor = null;
  if (hasMore && circles.length > 0) {
    const lastCircle = circles[circles.length - 1];
    const cursorData = `${lastCircle.createdAt.toISOString()}|${lastCircle._id}`;
    nextCursor = Buffer.from(cursorData).toString('base64url');
  }

  return {
    circles,
    pagination: {
      cursor: nextCursor,
      hasMore,
      limit: pageLimit
    }
  };
}

/**
 * Search circles by name or description
 * @param {Object} options - Search options
 * @param {string} options.query - Search query string
 * @param {string} options.cursor - Opaque cursor for pagination
 * @param {number} options.limit - Number of results per page (default: 20, max: 50)
 * @returns {Promise<Object>} Paginated search results
 */
export async function searchCircles(options = {}) {
  const { query: searchQuery, cursor, limit = 20 } = options;

  if (!searchQuery || searchQuery.trim().length === 0) {
    // If no search query, return all circles
    return listCircles({ cursor, limit });
  }

  // Validate and cap limit
  const pageLimit = Math.min(Math.max(1, limit), 50);

  // Build text search query
  const query = {
    $text: { $search: searchQuery.trim() }
  };

  // Apply cursor for pagination
  if (cursor) {
    try {
      const decodedCursor = Buffer.from(cursor, 'base64url').toString('utf-8');
      const [score, id] = decodedCursor.split('|');
      
      if (!score || !id) {
        throw new Error('Invalid cursor format');
      }

      // For text search, we use score-based pagination
      query.$or = [
        { score: { $meta: 'textScore', $lt: parseFloat(score) } },
        {
          score: { $meta: 'textScore', $eq: parseFloat(score) },
          _id: { $lt: id }
        }
      ];
    } catch (error) {
      const err = new Error('Invalid cursor');
      err.statusCode = 400;
      err.code = 'INVALID_CURSOR';
      err.userMessage = 'Invalid pagination cursor';
      throw err;
    }
  }

  // Fetch circles with text search score
  const circles = await Circle.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' }, _id: -1 })
    .limit(pageLimit + 1)
    .lean();

  // Check if there are more results
  const hasMore = circles.length > pageLimit;
  
  // Remove the extra document if it exists
  if (hasMore) {
    circles.pop();
  }

  // Generate next cursor if there are more results
  let nextCursor = null;
  if (hasMore && circles.length > 0) {
    const lastCircle = circles[circles.length - 1];
    const cursorData = `${lastCircle.score}|${lastCircle._id}`;
    nextCursor = Buffer.from(cursorData).toString('base64url');
  }

  return {
    circles,
    pagination: {
      cursor: nextCursor,
      hasMore,
      limit: pageLimit
    }
  };
}

/**
 * Get circle by ID with active user count
 * @param {string} circleId - Circle's opaque ID
 * @returns {Promise<Object>} Circle document with activeUserCount
 */
export async function getCircleById(circleId) {
  if (!circleId) {
    const error = new Error('Circle ID is required');
    error.statusCode = 400;
    error.code = 'MISSING_CIRCLE_ID';
    error.userMessage = 'Circle ID is required';
    throw error;
  }

  // Decode opaque ID
  let mongoId;
  try {
    mongoId = decodeOpaqueId(circleId);
  } catch (error) {
    const err = new Error('Invalid circle ID');
    err.statusCode = 400;
    err.code = 'INVALID_CIRCLE_ID';
    err.userMessage = 'Invalid circle ID format';
    throw err;
  }

  // Fetch circle from database
  const circle = await Circle.findById(mongoId).lean();

  if (!circle) {
    const error = new Error('Circle not found');
    error.statusCode = 404;
    error.code = 'CIRCLE_NOT_FOUND';
    error.userMessage = 'Circle not found';
    throw error;
  }

  // Count unique users who have commented in this circle
  const uniqueUsers = await Comment.distinct('authorId', {
    circleId: mongoId,
    isDeleted: false
  });

  // Add active user count to circle
  circle.activeUserCount = uniqueUsers.length;
  
  // Add topic count (0-3)
  circle.topicCount = await getCircleTopicCount(mongoId);

  return circle;
}

/**
 * Remove a post from a circle (moderation action)
 * Only circle creator can perform this action
 * @param {string} userId - Moderator's user ID
 * @param {string} circleId - Circle's opaque ID
 * @param {string} postId - Post's opaque ID
 * @returns {Promise<Object>} Success message
 */
export async function removePost(userId, circleId, postId) {
  if (!userId) {
    const error = new Error('User ID is required');
    error.statusCode = 401;
    error.code = 'MISSING_USER_ID';
    error.userMessage = 'Authentication required';
    throw error;
  }

  if (!circleId || !postId) {
    const error = new Error('Circle ID and Post ID are required');
    error.statusCode = 400;
    error.code = 'MISSING_REQUIRED_FIELDS';
    error.userMessage = 'Circle ID and Post ID are required';
    throw error;
  }

  // Decode opaque IDs
  let mongoCircleId, mongoPostId;
  try {
    mongoCircleId = decodeOpaqueId(circleId);
    mongoPostId = decodeOpaqueId(postId);
  } catch (error) {
    const err = new Error('Invalid ID format');
    err.statusCode = 400;
    err.code = 'INVALID_ID';
    err.userMessage = 'Invalid circle or post ID format';
    throw err;
  }

  // Fetch circle
  const circle = await Circle.findById(mongoCircleId);

  if (!circle) {
    const error = new Error('Circle not found');
    error.statusCode = 404;
    error.code = 'CIRCLE_NOT_FOUND';
    error.userMessage = 'Circle not found';
    throw error;
  }

  // Verify user is the circle creator
  if (!circle.isCreator(userId)) {
    const error = new Error('Unauthorized');
    error.statusCode = 403;
    error.code = 'UNAUTHORIZED';
    error.userMessage = 'Only the circle creator can remove posts';
    throw error;
  }

  // Fetch post
  const post = await Post.findById(mongoPostId);

  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    error.code = 'POST_NOT_FOUND';
    error.userMessage = 'Post not found';
    throw error;
  }

  // Verify post belongs to this circle
  if (post.circleId.toString() !== mongoCircleId.toString()) {
    const error = new Error('Post does not belong to this circle');
    error.statusCode = 400;
    error.code = 'POST_NOT_IN_CIRCLE';
    error.userMessage = 'Post does not belong to this circle';
    throw error;
  }

  // Hide the post (soft delete for moderation)
  await post.hide(userId);

  // Decrement circle post count
  await circle.decrementPostCount();

  return {
    message: 'Post removed successfully'
  };
}

/**
 * Remove a comment from a circle (moderation action)
 * Only circle creator can perform this action
 * @param {string} userId - Moderator's user ID
 * @param {string} circleId - Circle's opaque ID
 * @param {string} commentId - Comment's opaque ID
 * @returns {Promise<Object>} Success message
 */
export async function removeComment(userId, circleId, commentId) {
  if (!userId) {
    const error = new Error('User ID is required');
    error.statusCode = 401;
    error.code = 'MISSING_USER_ID';
    error.userMessage = 'Authentication required';
    throw error;
  }

  if (!circleId || !commentId) {
    const error = new Error('Circle ID and Comment ID are required');
    error.statusCode = 400;
    error.code = 'MISSING_REQUIRED_FIELDS';
    error.userMessage = 'Circle ID and Comment ID are required';
    throw error;
  }

  // Decode opaque IDs
  let mongoCircleId, mongoCommentId;
  try {
    mongoCircleId = decodeOpaqueId(circleId);
    mongoCommentId = decodeOpaqueId(commentId);
  } catch (error) {
    const err = new Error('Invalid ID format');
    err.statusCode = 400;
    err.code = 'INVALID_ID';
    err.userMessage = 'Invalid circle or comment ID format';
    throw err;
  }

  // Fetch circle
  const circle = await Circle.findById(mongoCircleId);

  if (!circle) {
    const error = new Error('Circle not found');
    error.statusCode = 404;
    error.code = 'CIRCLE_NOT_FOUND';
    error.userMessage = 'Circle not found';
    throw error;
  }

  // Verify user is the circle creator
  if (!circle.isCreator(userId)) {
    const error = new Error('Unauthorized');
    error.statusCode = 403;
    error.code = 'UNAUTHORIZED';
    error.userMessage = 'Only the circle creator can remove comments';
    throw error;
  }

  // Fetch comment
  const comment = await Comment.findById(mongoCommentId);

  if (!comment) {
    const error = new Error('Comment not found');
    error.statusCode = 404;
    error.code = 'COMMENT_NOT_FOUND';
    error.userMessage = 'Comment not found';
    throw error;
  }

  // Fetch the post to verify it belongs to this circle
  const post = await Post.findById(comment.postId);

  if (!post) {
    const error = new Error('Associated post not found');
    error.statusCode = 404;
    error.code = 'POST_NOT_FOUND';
    error.userMessage = 'Associated post not found';
    throw error;
  }

  // Verify post belongs to this circle
  if (post.circleId.toString() !== mongoCircleId.toString()) {
    const error = new Error('Comment does not belong to this circle');
    error.statusCode = 400;
    error.code = 'COMMENT_NOT_IN_CIRCLE';
    error.userMessage = 'Comment does not belong to this circle';
    throw error;
  }

  // Soft delete the comment
  await comment.softDelete();

  // Decrement post comment count
  await post.decrementCommentCount();

  return {
    message: 'Comment removed successfully'
  };
}

/**
 * Get all topic posts for a circle (up to 3)
 * @param {string} circleId - Circle ID (opaque ID)
 * @returns {Promise<Array>} Array of topic posts (max 3, sorted by most recent)
 */
export async function getCircleTopicPosts(circleId) {
  if (!circleId) {
    const error = new Error('Circle ID is required');
    error.statusCode = 400;
    error.code = 'MISSING_CIRCLE_ID';
    throw error;
  }

  // Decode opaque ID to MongoDB ObjectId
  let mongoId;
  try {
    mongoId = decodeOpaqueId(circleId);
  } catch (error) {
    const err = new Error('Invalid circle ID');
    err.statusCode = 400;
    err.code = 'INVALID_CIRCLE_ID';
    throw err;
  }

  // Find all topic posts for this circle (max 3, most recent first)
  const topicPosts = await Post.find({
    $or: [
      { circleId: mongoId, isCircleTopic: true },
      { 'circles.circleId': mongoId, isCircleTopic: true }
    ],
    isHidden: false
  })
  .sort({ circleTopicSetAt: -1 })
  .limit(3)
  .lean();

  return topicPosts;
}

/**
 * Get the topic post for a circle (legacy - returns most recent)
 * @param {string} circleId - Circle ID (opaque ID)
 * @returns {Promise<Object|null>} Topic post or null if none exists
 */
export async function getCircleTopicPost(circleId) {
  const topics = await getCircleTopicPosts(circleId);
  return topics.length > 0 ? topics[0] : null;
}

/**
 * Set a post as the topic for a circle
 * Only one topic post per circle is allowed
 * @param {string} userId - User ID setting the topic
 * @param {string} circleId - Circle ID (opaque ID)
 * @param {string} postId - Post ID to set as topic (opaque ID)
 * @returns {Promise<Object>} Updated post
 */
export async function setCircleTopicPost(userId, circleId, postId) {
  if (!userId) {
    const error = new Error('User ID is required');
    error.statusCode = 401;
    error.code = 'MISSING_USER_ID';
    throw error;
  }

  if (!circleId || !postId) {
    const error = new Error('Circle ID and Post ID are required');
    error.statusCode = 400;
    error.code = 'MISSING_REQUIRED_FIELDS';
    throw error;
  }

  // Decode opaque IDs
  let mongoCircleId, mongoPostId;
  try {
    mongoCircleId = decodeOpaqueId(circleId);
    mongoPostId = decodeOpaqueId(postId);
  } catch (error) {
    const err = new Error('Invalid ID format');
    err.statusCode = 400;
    err.code = 'INVALID_ID';
    throw err;
  }

  // Get the circle
  const circle = await Circle.findById(mongoCircleId);
  if (!circle) {
    const error = new Error('Circle not found');
    error.statusCode = 404;
    error.code = 'CIRCLE_NOT_FOUND';
    throw error;
  }

  // Get the post
  const post = await Post.findById(mongoPostId);
  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    error.code = 'POST_NOT_FOUND';
    throw error;
  }

  // Check if post is hidden
  if (post.isHidden) {
    const error = new Error('Cannot set hidden post as topic');
    error.statusCode = 400;
    error.code = 'POST_HIDDEN';
    throw error;
  }

  // Verify post belongs to this circle
  const belongsToCircle = 
    (post.circleId && post.circleId.toString() === mongoCircleId.toString()) ||
    (post.circles && post.circles.some(c => c.circleId.toString() === mongoCircleId.toString()));

  if (!belongsToCircle) {
    const error = new Error('Post does not belong to this circle');
    error.statusCode = 400;
    error.code = 'POST_NOT_IN_CIRCLE';
    throw error;
  }

  // Authorization: Only circle creator or post author can set topic
  const isCircleCreator = circle.creatorId.toString() === userId.toString();
  const isPostAuthor = post.authorId.toString() === userId.toString();

  if (!isCircleCreator && !isPostAuthor) {
    const error = new Error('Only circle creator or post author can set topic');
    error.statusCode = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  // Check if this post is already a topic for this circle
  if (post.isCircleTopic) {
    // Already a topic, just return it
    return post;
  }

  // Count existing topics for this circle
  const existingTopicsCount = await Post.countDocuments({
    $or: [
      { circleId: mongoCircleId, isCircleTopic: true },
      { 'circles.circleId': mongoCircleId, isCircleTopic: true }
    ]
  });

  // If we already have 3 topics, remove the oldest one
  if (existingTopicsCount >= 3) {
    const oldestTopic = await Post.findOne({
      $or: [
        { circleId: mongoCircleId, isCircleTopic: true },
        { 'circles.circleId': mongoCircleId, isCircleTopic: true }
      ]
    })
    .sort({ circleTopicSetAt: 1 }) // Oldest first
    .limit(1);

    if (oldestTopic) {
      oldestTopic.isCircleTopic = false;
      oldestTopic.circleTopicSetAt = null;
      oldestTopic.circleTopicSetBy = null;
      await oldestTopic.save();
    }
  }

  // Set this post as a topic (add to existing topics, up to 3 max)
  post.isCircleTopic = true;
  post.circleTopicSetAt = new Date();
  post.circleTopicSetBy = userId;
  await post.save();

  return post;
}

/**
 * Remove topic status from a post
 * @param {string} userId - User ID removing the topic
 * @param {string} circleId - Circle ID (opaque ID)
 * @returns {Promise<Object>} Success message
 */
export async function removeCircleTopicPost(userId, circleId) {
  if (!userId) {
    const error = new Error('User ID is required');
    error.statusCode = 401;
    error.code = 'MISSING_USER_ID';
    throw error;
  }

  if (!circleId) {
    const error = new Error('Circle ID is required');
    error.statusCode = 400;
    error.code = 'MISSING_CIRCLE_ID';
    throw error;
  }

  // Decode opaque ID
  let mongoCircleId;
  try {
    mongoCircleId = decodeOpaqueId(circleId);
  } catch (error) {
    const err = new Error('Invalid circle ID');
    err.statusCode = 400;
    err.code = 'INVALID_CIRCLE_ID';
    throw err;
  }

  // Get the circle
  const circle = await Circle.findById(mongoCircleId);
  if (!circle) {
    const error = new Error('Circle not found');
    error.statusCode = 404;
    error.code = 'CIRCLE_NOT_FOUND';
    throw error;
  }

  // Authorization: Only circle creator can remove topic
  if (circle.creatorId.toString() !== userId.toString()) {
    const error = new Error('Only circle creator can remove topic');
    error.statusCode = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  // Remove topic status
  await Post.updateMany(
    {
      $or: [
        { circleId: mongoCircleId, isCircleTopic: true },
        { 'circles.circleId': mongoCircleId, isCircleTopic: true }
      ]
    },
    {
      $set: {
        isCircleTopic: false,
        circleTopicSetAt: null,
        circleTopicSetBy: null
      }
    }
  );

  return {
    message: 'Topic removed successfully'
  };
}
