import Post from '../models/Post.model.js';
import Circle from '../models/Circle.model.js';
import { sanitizePostContent } from '../utils/sanitization.utils.js';
import { decodeOpaqueId } from '../utils/id.utils.js';
import { awardXP } from './gamification.service.js';
import { createReactionNotification } from './notification.service.js';
import mongoose from 'mongoose';

/**
 * Helper function to set a post as circle topic
 * Used internally to automatically set new posts as topics
 * Maximum 3 topics per circle - oldest is removed when adding 4th
 * @param {ObjectId} postId - MongoDB ObjectId of the post
 * @param {ObjectId} circleId - MongoDB ObjectId of the circle
 * @param {ObjectId} userId - MongoDB ObjectId of the user
 */
async function setPostAsCircleTopic(postId, circleId, userId) {
  try {
    console.log('[setPostAsCircleTopic] Starting - Post:', postId, 'Circle:', circleId);
    
    // Check if this post is already a topic for this circle
    const existingTopic = await Post.findOne({
      _id: postId,
      $or: [
        { circleId: circleId, isCircleTopic: true },
        { 'circles.circleId': circleId, isCircleTopic: true }
      ]
    });

    if (existingTopic) {
      console.log('[setPostAsCircleTopic] Post already a topic, updating timestamp');
      // Already a topic, just update the timestamp
      await Post.findByIdAndUpdate(postId, {
        $set: {
          circleTopicSetAt: new Date(),
          circleTopicSetBy: userId
        }
      });
      return;
    }

    // Get current topics for this circle (sorted by most recent first)
    const currentTopics = await Post.find({
      $or: [
        { circleId: circleId, isCircleTopic: true },
        { 'circles.circleId': circleId, isCircleTopic: true }
      ]
    })
    .sort({ circleTopicSetAt: -1 })
    .select('_id circleTopicSetAt');

    console.log('[setPostAsCircleTopic] Current topics count:', currentTopics.length);

    // If we already have 3 topics, remove the oldest one
    if (currentTopics.length >= 3) {
      const oldestTopic = currentTopics[currentTopics.length - 1];
      console.log('[setPostAsCircleTopic] Removing oldest topic:', oldestTopic._id);
      await Post.findByIdAndUpdate(oldestTopic._id, {
        $set: {
          isCircleTopic: false,
          circleTopicSetAt: null,
          circleTopicSetBy: null
        }
      });
    }

    // Set this post as a topic
    console.log('[setPostAsCircleTopic] Setting post as topic');
    const result = await Post.findByIdAndUpdate(postId, {
      $set: {
        isCircleTopic: true,
        circleTopicSetAt: new Date(),
        circleTopicSetBy: userId
      }
    }, { new: true });
    
    console.log('[setPostAsCircleTopic] Success! Post is now a topic:', result?.isCircleTopic);
  } catch (error) {
    // Log but don't throw - this is a non-critical operation
    console.error('[setPostAsCircleTopic] Error:', error);
  }
}

/**
 * Post Service
 * Business logic for post creation, retrieval, updates, and reactions
 * Implements Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 6.1, 6.2, 6.3
 */

/**
 * Create a new post
 * @param {Object} postData - Post data
 * @param {string} postData.content - Post content (10-5000 chars)
 * @param {string} postData.room - Room type (dark, climb, philo)
 * @param {string} postData.title - Optional title (for climb/philo)
 * @param {string} postData.circleId - Opaque circle ID
 * @param {string} postData.category - Category tag
 * @param {Object} postData.imageData - Optional image data from Cloudinary
 * @param {string} authorId - MongoDB ObjectId of author
 * @returns {Promise<Object>} Created post document
 * @throws {Error} If validation fails or circle doesn't exist
 */
export async function createPost({ content, room, title, circleId, category, imageData }, authorId) {
  // Validate room
  if (!room || !['dark', 'fantasy', 'philo'].includes(room)) {
    const err = new Error('Invalid room type');
    err.statusCode = 400;
    err.code = 'INVALID_ROOM';
    throw err;
  }

  // Decode opaque circle ID
  let mongoCircleId;
  try {
    mongoCircleId = decodeOpaqueId(circleId);
    
    // Validate that the decoded ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(mongoCircleId)) {
      throw new Error('Invalid ObjectId format');
    }
  } catch (error) {
    const err = new Error('Invalid circle ID');
    err.statusCode = 400;
    err.code = 'INVALID_CIRCLE_ID';
    throw err;
  }

  // Validate circle exists
  const circle = await Circle.findById(mongoCircleId);
  if (!circle) {
    const err = new Error('Circle not found');
    err.statusCode = 404;
    err.code = 'CIRCLE_NOT_FOUND';
    throw err;
  }

  // Sanitize content
  const contentSanitized = sanitizePostContent(content);

  // Build circles array for multi-circle support
  const circlesArray = [{
    circleId: mongoCircleId,
    name: circle.name,
    color: '#D97757', // Default color
    icon: '⬢'
  }];

  // Create post
  const post = new Post({
    authorId,
    room,
    title: title || null,
    circleId: mongoCircleId, // Legacy support
    circles: circlesArray,
    category,
    content,
    contentSanitized,
    image: imageData || {}, // Add image data if provided
    climbState: undefined, // No state tracking for any room
    reactions: {
      // Dark Room reactions
      iFeelYou: 0,
      notGood: 0,
      youreNotAlone: 0,
      sendingStrength: 0,
      // Fantasy Room reactions
      vibe: 0,
      dream: 0,
      inspire: 0,
      wild: 0,
      // Philo Room reactions
      lamp: 0,
      spark: 0,
      clap: 0,
      // Legacy reactions
      iRelate: 0,
      imListening: 0,
      theAbyss: 0
    },
    userReactions: [],
    commentCount: 0,
    isHidden: false
  });

  await post.save();
  
  console.log('Post saved:', post._id, 'Circle:', mongoCircleId);

  // Populate author data before returning
  await post.populate('authorId', 'username stats');
  
  // Format author data for response
  const formattedPost = post.toObject();
  if (post.authorId) {
    formattedPost.author = {
      username: post.authorId.username || 'User'
    };
  }
  delete formattedPost.authorId;

  // Increment circle post count (async, don't wait)
  Circle.findByIdAndUpdate(mongoCircleId, { $inc: { postCount: 1 } }).catch(err => {
    console.error('Failed to increment circle post count:', err);
  });

  // Automatically set this post as the circle topic (WAIT for this to complete)
  // This ensures the topic is set before the response is sent
  try {
    console.log('Setting post as circle topic:', post._id, 'Circle:', mongoCircleId);
    await setPostAsCircleTopic(post._id, mongoCircleId, authorId);
    console.log('Successfully set post as circle topic');
  } catch (err) {
    console.error('Failed to set post as circle topic:', err);
    // Continue even if this fails
  }

  return formattedPost;
}

/**
 * List posts with cursor-based pagination
 * @param {Object} options - Query options
 * @param {string} options.cursor - Opaque cursor for pagination
 * @param {number} options.limit - Number of posts to return (default: 20, max: 50)
 * @param {string} options.room - Filter by room (dark, climb, philo)
 * @param {string} options.circleId - Filter by circle (opaque ID)
 * @param {string} options.category - Filter by category
 * @param {string} options.authorId - Filter by author (MongoDB ID)
 * @returns {Promise<Object>} Posts and pagination metadata
 */
export async function listPosts(options = {}) {
  const limit = Math.min(options.limit || 20, 50);
  const query = { isHidden: false }; // Never show hidden posts

  // Apply room filter
  if (options.room) {
    query.room = options.room;
  }

  // Apply filters
  if (options.circleId) {
    try {
      const mongoCircleId = decodeOpaqueId(options.circleId);
      query.circleId = mongoCircleId;
    } catch (error) {
      const err = new Error('Invalid circle ID');
      err.statusCode = 400;
      err.code = 'INVALID_CIRCLE_ID';
      throw err;
    }
  }

  if (options.category) {
    query.category = options.category;
  }

  if (options.authorId) {
    query.authorId = options.authorId;
  }

  // Handle cursor pagination
  if (options.cursor) {
    try {
      const cursorDate = new Date(Buffer.from(options.cursor, 'base64url').toString('utf-8'));
      query.createdAt = { $lt: cursorDate };
    } catch (error) {
      const err = new Error('Invalid cursor');
      err.statusCode = 400;
      err.code = 'INVALID_CURSOR';
      throw err;
    }
  }

  // Fetch posts (limit + 1 to check if more exist)
  const posts = await Post.find(query)
    .sort({ createdAt: -1 }) // Newest first
    .limit(limit + 1)
    .populate('circles.circleId', 'name description') // Populate circle details
    .lean();

  // Check if more results exist
  const hasMore = posts.length > limit;
  if (hasMore) {
    posts.pop(); // Remove extra post
  }

  // Generate next cursor
  let nextCursor = null;
  if (hasMore && posts.length > 0) {
    const lastPost = posts[posts.length - 1];
    nextCursor = Buffer.from(lastPost.createdAt.toISOString()).toString('base64url');
  }

  return {
    posts,
    pagination: {
      cursor: nextCursor,
      hasMore,
      limit
    }
  };
}

/**
 * Get a single post by ID
 * @param {string} postId - MongoDB ObjectId as string
 * @returns {Promise<Object>} Post document
 * @throws {Error} If post not found or hidden
 */
export async function getPostById(postId) {
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    const err = new Error('Invalid post ID format');
    err.statusCode = 400;
    err.code = 'INVALID_POST_ID';
    throw err;
  }

  const post = await Post.findById(postId)
    .populate('circles.circleId', 'name description');

  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    err.code = 'POST_NOT_FOUND';
    throw err;
  }

  // Don't return hidden posts
  if (post.isHidden) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    err.code = 'POST_NOT_FOUND';
    throw err;
  }

  return post;
}

/**
 * Update a post (ownership verified by controller)
 * @param {string} postId - Opaque post ID
 * @param {Object} updates - Fields to update
 * @param {string} updates.content - New content
 * @param {string} userId - MongoDB ObjectId of user making the update
 * @returns {Promise<Object>} Updated post document
 * @throws {Error} If post not found or user not authorized
 */
export async function updatePost(postId, updates, userId) {
  // Decode opaque post ID
  let mongoPostId;
  try {
    mongoPostId = decodeOpaqueId(postId);
  } catch (error) {
    const err = new Error('Invalid post ID');
    err.statusCode = 400;
    err.code = 'INVALID_POST_ID';
    throw err;
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(mongoPostId)) {
    const err = new Error('Invalid post ID format');
    err.statusCode = 400;
    err.code = 'INVALID_POST_ID';
    throw err;
  }

  const post = await Post.findById(mongoPostId);

  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    err.code = 'POST_NOT_FOUND';
    throw err;
  }

  // Verify ownership
  if (post.authorId.toString() !== userId.toString()) {
    const err = new Error('You do not have permission to update this post');
    err.statusCode = 403;
    err.code = 'FORBIDDEN';
    throw err;
  }

  // Update content if provided
  if (updates.content) {
    post.content = updates.content;
    post.contentSanitized = sanitizePostContent(updates.content);
  }

  await post.save();

  return post;
}

/**
 * Delete a post (ownership verified by controller)
 * @param {string} postId - Opaque post ID
 * @param {string} userId - MongoDB ObjectId of user making the deletion
 * @returns {Promise<void>}
 * @throws {Error} If post not found or user not authorized
 */
export async function deletePost(postId, userId) {
  // Decode opaque post ID
  let mongoPostId;
  try {
    mongoPostId = decodeOpaqueId(postId);
  } catch (error) {
    const err = new Error('Invalid post ID');
    err.statusCode = 400;
    err.code = 'INVALID_POST_ID';
    throw err;
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(mongoPostId)) {
    const err = new Error('Invalid post ID format');
    err.statusCode = 400;
    err.code = 'INVALID_POST_ID';
    throw err;
  }

  const post = await Post.findById(mongoPostId);

  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    err.code = 'POST_NOT_FOUND';
    throw err;
  }

  // Verify ownership
  if (post.authorId.toString() !== userId.toString()) {
    const err = new Error('You do not have permission to delete this post');
    err.statusCode = 403;
    err.code = 'FORBIDDEN';
    throw err;
  }

  // Delete the post
  await Post.findByIdAndDelete(mongoPostId);

  // Decrement circle post count (async, don't wait)
  Circle.findByIdAndUpdate(post.circleId, { $inc: { postCount: -1 } }).catch(err => {
    console.error('Failed to decrement circle post count:', err);
  });
}

/**
 * Add a reaction to a post (atomic operation)
 * @param {string} postId - MongoDB ObjectId as string
 * @param {string} reactionType - Type of reaction (like, support, insightful)
 * @param {string} userId - MongoDB ObjectId of user adding reaction
 * @returns {Promise<Object>} Updated post document
 * @throws {Error} If post not found or reaction already exists
 */
export async function addReaction(postId, reactionType, userId) {
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    const err = new Error('Invalid post ID format');
    err.statusCode = 400;
    err.code = 'INVALID_POST_ID';
    throw err;
  }

  const post = await Post.findById(postId);

  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    err.code = 'POST_NOT_FOUND';
    throw err;
  }

  // Don't allow reactions on hidden posts
  if (post.isHidden) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    err.code = 'POST_NOT_FOUND';
    throw err;
  }

  // Don't allow users to react to their own posts
  if (post.authorId.toString() === userId.toString()) {
    const err = new Error('Cannot react to your own post');
    err.statusCode = 403;
    err.code = 'SELF_REACTION_FORBIDDEN';
    throw err;
  }

  // Add reaction atomically (idempotent)
  await post.addReaction(userId, reactionType);

  // Create reaction notification for post author (async, don't block)
  createReactionNotification(
    post.authorId.toString(),
    reactionType,
    post.title,
    post.room
  ).catch(err => console.error('Failed to create reaction notification:', err));

  // Award XP to post author (async, don't block response)
  awardXP(post.authorId.toString(), post.room, post.reactions)
    .catch(err => console.error('Failed to award XP:', err));

  return post;
}

/**
 * Remove a reaction from a post (atomic operation)
 * @param {string} postId - MongoDB ObjectId as string
 * @param {string} reactionType - Type of reaction to remove
 * @param {string} userId - MongoDB ObjectId of user removing reaction
 * @returns {Promise<Object>} Updated post document
 * @throws {Error} If post not found or reaction doesn't exist
 */
export async function removeReaction(postId, reactionType, userId) {
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    const err = new Error('Invalid post ID format');
    err.statusCode = 400;
    err.code = 'INVALID_POST_ID';
    throw err;
  }

  const post = await Post.findById(postId);

  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    err.code = 'POST_NOT_FOUND';
    throw err;
  }

  // Remove reaction atomically (idempotent)
  await post.removeReaction(userId, reactionType);

  // Recalculate XP for post author (async, don't block response)
  awardXP(post.authorId.toString(), post.room, post.reactions)
    .catch(err => console.error('Failed to recalculate XP:', err));

  return post;
}

/**
 * Hide a post (moderation action)
 * Marks post as hidden so it won't appear in feeds
 * @param {string} postId - Opaque post ID
 * @param {string} moderatorId - MongoDB ObjectId of moderator (must be circle creator)
 * @returns {Promise<void>}
 * @throws {Error} If post not found or moderator not authorized
 */
export async function hidePost(postId, moderatorId) {
  // Decode opaque post ID
  let mongoPostId;
  try {
    mongoPostId = decodeOpaqueId(postId);
  } catch (error) {
    const err = new Error('Invalid post ID');
    err.statusCode = 400;
    err.code = 'INVALID_POST_ID';
    throw err;
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(mongoPostId)) {
    const err = new Error('Invalid post ID format');
    err.statusCode = 400;
    err.code = 'INVALID_POST_ID';
    throw err;
  }

  const post = await Post.findById(mongoPostId);

  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    err.code = 'POST_NOT_FOUND';
    throw err;
  }

  // Check if already hidden
  if (post.isHidden) {
    const err = new Error('Post is already hidden');
    err.statusCode = 400;
    err.code = 'POST_ALREADY_HIDDEN';
    throw err;
  }

  // Verify moderator is circle creator
  const circle = await Circle.findById(post.circleId);
  if (!circle) {
    const err = new Error('Circle not found');
    err.statusCode = 404;
    err.code = 'CIRCLE_NOT_FOUND';
    throw err;
  }

  if (!circle.isCreator(moderatorId)) {
    const err = new Error('You do not have permission to moderate this circle');
    err.statusCode = 403;
    err.code = 'FORBIDDEN';
    throw err;
  }

  // Hide the post
  await post.hide(moderatorId);
}

/**
 * Remove a post (moderation action)
 * Permanently deletes the post from the database
 * @param {string} postId - Opaque post ID
 * @param {string} moderatorId - MongoDB ObjectId of moderator (must be circle creator)
 * @returns {Promise<void>}
 * @throws {Error} If post not found or moderator not authorized
 */
export async function removePost(postId, moderatorId) {
  // Decode opaque post ID
  let mongoPostId;
  try {
    mongoPostId = decodeOpaqueId(postId);
  } catch (error) {
    const err = new Error('Invalid post ID');
    err.statusCode = 400;
    err.code = 'INVALID_POST_ID';
    throw err;
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(mongoPostId)) {
    const err = new Error('Invalid post ID format');
    err.statusCode = 400;
    err.code = 'INVALID_POST_ID';
    throw err;
  }

  const post = await Post.findById(mongoPostId);

  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    err.code = 'POST_NOT_FOUND';
    throw err;
  }

  // Verify moderator is circle creator
  const circle = await Circle.findById(post.circleId);
  if (!circle) {
    const err = new Error('Circle not found');
    err.statusCode = 404;
    err.code = 'CIRCLE_NOT_FOUND';
    throw err;
  }

  if (!circle.isCreator(moderatorId)) {
    const err = new Error('You do not have permission to moderate this circle');
    err.statusCode = 403;
    err.code = 'FORBIDDEN';
    throw err;
  }

  // Delete the post permanently
  await Post.findByIdAndDelete(mongoPostId);

  // Decrement circle post count (async, don't wait)
  Circle.findByIdAndUpdate(post.circleId, { $inc: { postCount: -1 } }).catch(err => {
    console.error('Failed to decrement circle post count:', err);
  });
}
