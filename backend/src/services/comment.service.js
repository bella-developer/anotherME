import Comment from '../models/Comment.model.js';
import Post from '../models/Post.model.js';
import { sanitizeCommentContent } from '../utils/sanitization.utils.js';
import { decodeOpaqueId } from '../utils/id.utils.js';
import mongoose from 'mongoose';

/**
 * Comment Service
 * Business logic for comment creation, retrieval, and deletion
 * Implements Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7
 */

/**
 * Create a new comment on a post
 * @param {string} postId - Opaque post ID
 * @param {Object} commentData - Comment data
 * @param {string} commentData.content - Comment content (1-1000 chars)
 * @param {string} authorId - MongoDB ObjectId of author
 * @returns {Promise<Object>} Created comment document
 * @throws {Error} If validation fails or post doesn't exist
 */
export async function createComment(postId, { content }, authorId) {
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

  // Validate post exists and is not hidden
  const post = await Post.findById(mongoPostId);
  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    err.code = 'POST_NOT_FOUND';
    throw err;
  }

  if (post.isHidden) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    err.code = 'POST_NOT_FOUND';
    throw err;
  }

  // Sanitize content
  const contentSanitized = sanitizeCommentContent(content);

  // Create top-level comment (depth 0, no parent)
  const comment = new Comment({
    postId: mongoPostId,
    authorId,
    parentId: null,
    content,
    contentSanitized,
    depth: 0,
    isDeleted: false
  });

  await comment.save();

  // Populate author data before returning
  await comment.populate('authorId', 'username stats');
  
  // Format author data for response
  const formattedComment = comment.toObject();
  formattedComment.author = {
    username: comment.authorId?.username || 'User'
  };
  delete formattedComment.authorId;

  // Increment post comment count (async, don't wait)
  Post.findByIdAndUpdate(mongoPostId, { $inc: { commentCount: 1 } }).catch(err => {
    console.error('Failed to increment post comment count:', err);
  });

  return formattedComment;
}

/**
 * List comments for a post with cursor-based pagination
 * @param {string} postId - Opaque post ID
 * @param {Object} options - Query options
 * @param {string} options.cursor - Opaque cursor for pagination
 * @param {number} options.limit - Number of comments to return (default: 20, max: 50)
 * @returns {Promise<Object>} Comments and pagination metadata
 */
export async function listComments(postId, options = {}) {
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

  const limit = Math.min(options.limit || 20, 50);
  const query = {
    postId: mongoPostId,
    parentId: null, // Only top-level comments
    isDeleted: false // Exclude deleted comments (Requirement 18.2)
  };

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

  // Fetch comments (limit + 1 to check if more exist)
  const comments = await Comment.find(query)
    .sort({ createdAt: -1 }) // Newest first
    .limit(limit + 1)
    .lean();

  // Check if more results exist
  const hasMore = comments.length > limit;
  if (hasMore) {
    comments.pop(); // Remove extra comment
  }

  // Generate next cursor
  let nextCursor = null;
  if (hasMore && comments.length > 0) {
    const lastComment = comments[comments.length - 1];
    nextCursor = Buffer.from(lastComment.createdAt.toISOString()).toString('base64url');
  }

  return {
    comments,
    pagination: {
      cursor: nextCursor,
      hasMore,
      limit
    }
  };
}

/**
 * Create a reply to a comment
 * @param {string} commentId - Opaque parent comment ID
 * @param {Object} replyData - Reply data
 * @param {string} replyData.content - Reply content (1-1000 chars)
 * @param {string} authorId - MongoDB ObjectId of author
 * @returns {Promise<Object>} Created reply document
 * @throws {Error} If validation fails, parent doesn't exist, or depth limit exceeded
 */
export async function createReply(commentId, { content }, authorId) {
  // For circle comments, commentId is already a MongoDB ObjectId (not opaque)
  // Validate ObjectId format directly
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    const err = new Error('Invalid comment ID format');
    err.statusCode = 400;
    err.code = 'INVALID_COMMENT_ID';
    throw err;
  }

  const mongoCommentId = commentId;

  // Validate parent comment exists
  const parentComment = await Comment.findById(mongoCommentId);
  if (!parentComment) {
    const err = new Error('Parent comment not found');
    err.statusCode = 404;
    err.code = 'COMMENT_NOT_FOUND';
    throw err;
  }

  // Check if parent is deleted
  if (parentComment.isDeleted) {
    const err = new Error('Cannot reply to deleted comment');
    err.statusCode = 400;
    err.code = 'PARENT_COMMENT_DELETED';
    throw err;
  }

  // Check depth limit (max depth is 3)
  if (!parentComment.canHaveReplies()) {
    const err = new Error('Maximum comment depth reached');
    err.statusCode = 400;
    err.code = 'MAX_DEPTH_EXCEEDED';
    throw err;
  }

  // Sanitize content
  const contentSanitized = sanitizeCommentContent(content);

  // Create reply with incremented depth
  // For circle comments, include circleId; for post comments, include postId
  const reply = new Comment({
    postId: parentComment.postId,
    circleId: parentComment.circleId, // Include circleId for circle comments
    authorId,
    parentId: mongoCommentId,
    content,
    contentSanitized,
    depth: parentComment.getReplyDepth(),
    isDeleted: false
  });

  await reply.save();

  // Populate author data before returning
  await reply.populate('authorId', 'username stats');
  
  // Format author data for response
  const formattedReply = reply.toObject();
  formattedReply.author = {
    username: reply.authorId?.username || 'User'
  };
  delete formattedReply.authorId;

  // Increment reply count for ALL ancestor comments (not just immediate parent)
  // This ensures the root comment shows the total count of all descendants
  let currentParentId = mongoCommentId;
  while (currentParentId) {
    const updated = await Comment.findByIdAndUpdate(
      currentParentId,
      { $inc: { replyCount: 1 } },
      { new: true }
    );
    
    // Move up to the next parent
    currentParentId = updated?.parentId;
  }

  // Increment post comment count (async, don't wait)
  // For both post comments and circle comments linked to topics
  if (parentComment.postId || reply.postId) {
    const postIdToUpdate = parentComment.postId || reply.postId;
    Post.findByIdAndUpdate(postIdToUpdate, { $inc: { commentCount: 1 } }).catch(err => {
      console.error('Failed to increment post comment count:', err);
    });
  }

  return formattedReply;
}

/**
 * Delete a comment (ownership verified)
 * Uses soft delete to preserve thread structure
 * @param {string} commentId - Opaque comment ID
 * @param {string} userId - MongoDB ObjectId of user making the deletion
 * @returns {Promise<void>}
 * @throws {Error} If comment not found or user not authorized
 */
export async function deleteComment(commentId, userId) {
  // Decode opaque comment ID
  let mongoCommentId;
  try {
    mongoCommentId = decodeOpaqueId(commentId);
  } catch (error) {
    const err = new Error('Invalid comment ID');
    err.statusCode = 400;
    err.code = 'INVALID_COMMENT_ID';
    throw err;
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(mongoCommentId)) {
    const err = new Error('Invalid comment ID format');
    err.statusCode = 400;
    err.code = 'INVALID_COMMENT_ID';
    throw err;
  }

  const comment = await Comment.findById(mongoCommentId);

  if (!comment) {
    const err = new Error('Comment not found');
    err.statusCode = 404;
    err.code = 'COMMENT_NOT_FOUND';
    throw err;
  }

  // Check if already deleted
  if (comment.isDeleted) {
    const err = new Error('Comment already deleted');
    err.statusCode = 400;
    err.code = 'COMMENT_ALREADY_DELETED';
    throw err;
  }

  // Verify ownership
  if (comment.authorId.toString() !== userId.toString()) {
    const err = new Error('You do not have permission to delete this comment');
    err.statusCode = 403;
    err.code = 'FORBIDDEN';
    throw err;
  }

  // Soft delete (preserves thread structure)
  await comment.softDelete();

  // Decrement post comment count (async, don't wait)
  Post.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -1 } }).catch(err => {
    console.error('Failed to decrement post comment count:', err);
  });
}

/**
 * Hide a comment (moderation action)
 * Uses soft delete to mark comment as deleted
 * @param {string} commentId - Opaque comment ID
 * @param {string} moderatorId - MongoDB ObjectId of moderator (must be circle creator)
 * @returns {Promise<void>}
 * @throws {Error} If comment not found or moderator not authorized
 */
export async function hideComment(commentId, moderatorId) {
  // Decode opaque comment ID
  let mongoCommentId;
  try {
    mongoCommentId = decodeOpaqueId(commentId);
  } catch (error) {
    const err = new Error('Invalid comment ID');
    err.statusCode = 400;
    err.code = 'INVALID_COMMENT_ID';
    throw err;
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(mongoCommentId)) {
    const err = new Error('Invalid comment ID format');
    err.statusCode = 400;
    err.code = 'INVALID_COMMENT_ID';
    throw err;
  }

  const comment = await Comment.findById(mongoCommentId);

  if (!comment) {
    const err = new Error('Comment not found');
    err.statusCode = 404;
    err.code = 'COMMENT_NOT_FOUND';
    throw err;
  }

  // Check if already deleted
  if (comment.isDeleted) {
    const err = new Error('Comment already deleted');
    err.statusCode = 400;
    err.code = 'COMMENT_ALREADY_DELETED';
    throw err;
  }

  // Get the post to find the circle
  const post = await Post.findById(comment.postId);
  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    err.code = 'POST_NOT_FOUND';
    throw err;
  }

  // Verify moderator is circle creator
  const Circle = mongoose.model('Circle');
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

  // Soft delete the comment (same as hiding)
  await comment.softDelete();

  // Decrement post comment count (async, don't wait)
  Post.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -1 } }).catch(err => {
    console.error('Failed to decrement post comment count:', err);
  });
}

/**
 * Remove a comment (moderation action)
 * Permanently deletes the comment from the database
 * @param {string} commentId - Opaque comment ID
 * @param {string} moderatorId - MongoDB ObjectId of moderator (must be circle creator)
 * @returns {Promise<void>}
 * @throws {Error} If comment not found or moderator not authorized
 */
export async function removeComment(commentId, moderatorId) {
  // Decode opaque comment ID
  let mongoCommentId;
  try {
    mongoCommentId = decodeOpaqueId(commentId);
  } catch (error) {
    const err = new Error('Invalid comment ID');
    err.statusCode = 400;
    err.code = 'INVALID_COMMENT_ID';
    throw err;
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(mongoCommentId)) {
    const err = new Error('Invalid comment ID format');
    err.statusCode = 400;
    err.code = 'INVALID_COMMENT_ID';
    throw err;
  }

  const comment = await Comment.findById(mongoCommentId);

  if (!comment) {
    const err = new Error('Comment not found');
    err.statusCode = 404;
    err.code = 'COMMENT_NOT_FOUND';
    throw err;
  }

  // Get the post to find the circle
  const post = await Post.findById(comment.postId);
  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    err.code = 'POST_NOT_FOUND';
    throw err;
  }

  // Verify moderator is circle creator
  const Circle = mongoose.model('Circle');
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

  // Delete the comment permanently
  await Comment.findByIdAndDelete(mongoCommentId);

  // Decrement post comment count (async, don't wait)
  Post.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -1 } }).catch(err => {
    console.error('Failed to decrement post comment count:', err);
  });
}

/**
 * Create a comment directly in a circle (optionally linked to a topic post)
 * @param {string} circleId - Opaque circle ID
 * @param {Object} commentData - Comment data
 * @param {string} commentData.content - Comment content (1-2000 chars)
 * @param {string} commentData.postId - Optional post ID (topic post) to link comment to
 * @param {string} authorId - MongoDB ObjectId of author
 * @returns {Promise<Object>} Created comment document
 */
export async function createCircleComment(circleId, { content, postId }, authorId) {
  // Circle IDs are regular MongoDB ObjectIds (not opaque)
  if (!mongoose.Types.ObjectId.isValid(circleId)) {
    const err = new Error('Invalid circle ID format');
    err.statusCode = 400;
    err.code = 'INVALID_CIRCLE_ID';
    throw err;
  }

  const mongoCircleId = circleId;

  // Validate circle exists
  const Circle = mongoose.model('Circle');
  const circle = await Circle.findById(mongoCircleId);
  if (!circle) {
    const err = new Error('Circle not found');
    err.statusCode = 404;
    err.code = 'CIRCLE_NOT_FOUND';
    throw err;
  }

  // Validate post ID if provided
  let mongoPostId = null;
  if (postId) {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      const err = new Error('Invalid post ID format');
      err.statusCode = 400;
      err.code = 'INVALID_POST_ID';
      throw err;
    }
    mongoPostId = postId;

    // Verify post exists and belongs to this circle
    const Post = mongoose.model('Post');
    const post = await Post.findById(mongoPostId);
    if (!post) {
      const err = new Error('Post not found');
      err.statusCode = 404;
      err.code = 'POST_NOT_FOUND';
      throw err;
    }

    // Verify post is linked to this circle
    const isLinkedToCircle = post.circleId?.toString() === mongoCircleId.toString() ||
      post.circles?.some(c => c.circleId?.toString() === mongoCircleId.toString());
    
    if (!isLinkedToCircle) {
      const err = new Error('Post does not belong to this circle');
      err.statusCode = 400;
      err.code = 'POST_NOT_IN_CIRCLE';
      throw err;
    }
  }

  // Sanitize content
  const contentSanitized = sanitizeCommentContent(content);

  // Create top-level circle comment
  const comment = new Comment({
    circleId: mongoCircleId,
    postId: mongoPostId,
    authorId,
    parentId: null,
    content,
    contentSanitized,
    depth: 0,
    isDeleted: false
  });

  await comment.save();

  // Populate author data before returning
  await comment.populate('authorId', 'username stats');
  
  // Format author data for response
  const formattedComment = comment.toObject();
  formattedComment.author = {
    username: comment.authorId?.username || 'User'
  };
  delete formattedComment.authorId;

  // Increment post comment count if linked to a topic (async, don't wait)
  if (mongoPostId) {
    const Post = mongoose.model('Post');
    Post.findByIdAndUpdate(mongoPostId, { $inc: { commentCount: 1 } }).catch(err => {
      console.error('Failed to increment post comment count:', err);
    });
  }

  return formattedComment;
}

/**
 * List comments for a circle with cursor-based pagination
 * Returns ALL comments (including replies) for client-side tree building
 * Optionally filters by postId to show only comments for a specific topic
 * @param {string} circleId - Opaque circle ID
 * @param {Object} options - Query options
 * @param {string} options.cursor - Opaque cursor for pagination
 * @param {number} options.limit - Number of TOP-LEVEL comments to return (default: 20, max: 50)
 * @param {string} options.userId - Optional user ID to include user reactions
 * @param {string} options.postId - Optional post ID to filter comments by topic
 * @returns {Promise<Object>} Comments and pagination metadata
 */
export async function listCircleComments(circleId, options = {}) {
  // Circle IDs are regular MongoDB ObjectIds (not opaque)
  if (!mongoose.Types.ObjectId.isValid(circleId)) {
    const err = new Error('Invalid circle ID format');
    err.statusCode = 400;
    err.code = 'INVALID_CIRCLE_ID';
    throw err;
  }

  const mongoCircleId = circleId;

  const limit = Math.min(options.limit || 20, 50);
  
  // Build query for top-level comments
  const topLevelQuery = {
    circleId: mongoCircleId,
    parentId: null,
    isDeleted: false
  };

  // Filter by postId if provided (for topic-specific comments)
  if (options.postId) {
    if (!mongoose.Types.ObjectId.isValid(options.postId)) {
      const err = new Error('Invalid post ID format');
      err.statusCode = 400;
      err.code = 'INVALID_POST_ID';
      throw err;
    }
    topLevelQuery.postId = options.postId;
  } else {
    // If no postId specified, only show comments without a postId (general circle comments)
    // This prevents showing topic-specific comments in the general feed
    topLevelQuery.postId = null;
  }

  // Handle cursor pagination for top-level comments
  if (options.cursor) {
    try {
      const cursorDate = new Date(Buffer.from(options.cursor, 'base64url').toString('utf-8'));
      topLevelQuery.createdAt = { $lt: cursorDate };
    } catch (error) {
      const err = new Error('Invalid cursor');
      err.statusCode = 400;
      err.code = 'INVALID_CURSOR';
      throw err;
    }
  }

  // Fetch top-level comments with pagination (without populate for now to debug)
  const topLevelComments = await Comment.find(topLevelQuery)
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .maxTimeMS(5000) // 5 second timeout for the query
    .lean();

  // Check if more results exist
  const hasMore = topLevelComments.length > limit;
  if (hasMore) {
    topLevelComments.pop();
  }

  // Get IDs of top-level comments
  const topLevelIds = topLevelComments.map(c => c._id);

  // Fetch ALL replies for these top-level comments (no depth limit)
  // We'll recursively find all descendants
  let allCommentIds = [...topLevelIds];
  let allComments = [...topLevelComments];
  
  // Keep fetching replies until no new ones are found
  // Add safety limit to prevent infinite loops
  let currentLevelIds = topLevelIds;
  let depth = 0;
  const MAX_DEPTH = 20; // Safety limit
  
  while (currentLevelIds.length > 0 && depth < MAX_DEPTH) {
    depth++;
    
    const replies = await Comment.find({
      circleId: mongoCircleId,
      parentId: { $in: currentLevelIds },
      isDeleted: false
    })
      .sort({ createdAt: 1 }) // Oldest first for replies
      .maxTimeMS(5000) // 5 second timeout
      .lean();

    if (replies.length === 0) break;

    allComments.push(...replies);
    currentLevelIds = replies.map(r => r._id);
    allCommentIds.push(...currentLevelIds);
  }

  // Generate next cursor
  let nextCursor = null;
  if (hasMore && topLevelComments.length > 0) {
    const lastComment = topLevelComments[topLevelComments.length - 1];
    nextCursor = Buffer.from(lastComment.createdAt.toISOString()).toString('base64url');
  }

  // Manually populate author data for all comments
  // Get unique author IDs
  const authorIds = [...new Set(allComments.map(c => c.authorId).filter(Boolean))];
  
  // Fetch authors in a single query
  const User = mongoose.model('User');
  const authors = await User.find({ _id: { $in: authorIds } })
    .select('username stats')
    .lean();
  
  // Create author lookup map
  const authorMap = new Map(authors.map(a => [a._id.toString(), a]));
  
  // Attach author data and user reactions to comments
  allComments.forEach(comment => {
    if (comment.authorId) {
      const author = authorMap.get(comment.authorId.toString());
      if (author) {
        // Get the highest level badge from stats
        let levelBadge = null;
        if (author.stats) {
          // Find the highest level across all stats
          const stats = author.stats;
          let highestLevel = 0;
          let highestStat = null;
          
          ['genius', 'empathy', 'resilience'].forEach(statName => {
            const statValue = stats[statName];
            if (statValue && statValue.level > highestLevel) {
              highestLevel = statValue.level;
              highestStat = statName;
            }
          });
          
          if (highestStat && highestLevel > 0) {
            const statData = stats[highestStat];
            levelBadge = {
              stat: highestStat,
              level: highestLevel,
              room: statData.room || 'dark'
            };
          }
        }
        
        comment.author = {
          username: author.username,
          levelBadge
        };
      }
    }

    // Add user reactions if userId provided
    if (options.userId && comment.userReactions) {
      comment.userReactions = comment.userReactions
        .filter(r => r.userId.toString() === options.userId.toString())
        .map(r => r.type);
    } else {
      // Don't expose all user reactions, only the current user's
      delete comment.userReactions;
    }

    // Add isOwnComment flag
    if (options.userId) {
      comment.isOwnComment = comment.authorId.toString() === options.userId.toString();
    }
  });

  return {
    comments: allComments,
    pagination: {
      cursor: nextCursor,
      hasMore,
      limit
    }
  };
}

/**
 * List replies for a comment
 * @param {string} commentId - Opaque comment ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Array of reply comments
 */
export async function listReplies(commentId, options = {}) {
  // Decode opaque comment ID
  let mongoCommentId;
  try {
    mongoCommentId = decodeOpaqueId(commentId);
  } catch (error) {
    const err = new Error('Invalid comment ID');
    err.statusCode = 400;
    err.code = 'INVALID_COMMENT_ID';
    throw err;
  }

  if (!mongoose.Types.ObjectId.isValid(mongoCommentId)) {
    const err = new Error('Invalid comment ID format');
    err.statusCode = 400;
    err.code = 'INVALID_COMMENT_ID';
    throw err;
  }

  const limit = Math.min(options.limit || 50, 100);

  // Fetch replies
  const replies = await Comment.find({
    parentId: mongoCommentId,
    isDeleted: false
  })
    .sort({ createdAt: 1 }) // Oldest first for replies
    .limit(limit)
    .lean();

  return replies;
}

/**
 * Add a reaction to a comment
 * @param {string} commentId - MongoDB ObjectId of comment
 * @param {string} reactionType - Type of reaction ('resonate' or 'echo')
 * @param {string} userId - MongoDB ObjectId of user
 * @returns {Promise<Object>} Updated comment with reaction counts
 * @throws {Error} If comment not found or user is the author
 */
export async function addCommentReaction(commentId, reactionType, userId) {
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    const err = new Error('Invalid comment ID format');
    err.statusCode = 400;
    err.code = 'INVALID_COMMENT_ID';
    throw err;
  }

  // Validate reaction type
  if (!['resonate', 'echo'].includes(reactionType)) {
    const err = new Error('Invalid reaction type');
    err.statusCode = 400;
    err.code = 'INVALID_REACTION_TYPE';
    throw err;
  }

  // Find comment
  const comment = await Comment.findById(commentId);
  if (!comment) {
    const err = new Error('Comment not found');
    err.statusCode = 404;
    err.code = 'COMMENT_NOT_FOUND';
    throw err;
  }

  // Check if user is the author (can't react to own comment)
  if (comment.authorId.toString() === userId.toString()) {
    const err = new Error('Cannot react to your own comment');
    err.statusCode = 400;
    err.code = 'CANNOT_REACT_OWN_COMMENT';
    throw err;
  }

  // Check if user already reacted with this type
  const existingReaction = comment.userReactions.find(
    r => r.userId.toString() === userId.toString() && r.type === reactionType
  );

  if (existingReaction) {
    const err = new Error('You have already reacted with this type');
    err.statusCode = 400;
    err.code = 'ALREADY_REACTED';
    throw err;
  }

  // Remove opposite reaction if exists
  const oppositeType = reactionType === 'resonate' ? 'echo' : 'resonate';
  const oppositeReaction = comment.userReactions.find(
    r => r.userId.toString() === userId.toString() && r.type === oppositeType
  );

  if (oppositeReaction) {
    await comment.removeReaction(userId, oppositeType);
  }

  // Add reaction
  await comment.addReaction(userId, reactionType);

  // Return updated comment with user reactions
  const updatedComment = await Comment.findById(commentId).lean();
  const userReactions = updatedComment.userReactions
    .filter(r => r.userId.toString() === userId.toString())
    .map(r => r.type);

  return {
    id: updatedComment._id.toString(),
    reactions: updatedComment.reactions,
    userReactions
  };
}

/**
 * Remove a reaction from a comment
 * @param {string} commentId - MongoDB ObjectId of comment
 * @param {string} reactionType - Type of reaction ('resonate' or 'echo')
 * @param {string} userId - MongoDB ObjectId of user
 * @returns {Promise<Object>} Updated comment with reaction counts
 * @throws {Error} If comment not found or reaction doesn't exist
 */
export async function removeCommentReaction(commentId, reactionType, userId) {
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    const err = new Error('Invalid comment ID format');
    err.statusCode = 400;
    err.code = 'INVALID_COMMENT_ID';
    throw err;
  }

  // Validate reaction type
  if (!['resonate', 'echo'].includes(reactionType)) {
    const err = new Error('Invalid reaction type');
    err.statusCode = 400;
    err.code = 'INVALID_REACTION_TYPE';
    throw err;
  }

  // Find comment
  const comment = await Comment.findById(commentId);
  if (!comment) {
    const err = new Error('Comment not found');
    err.statusCode = 404;
    err.code = 'COMMENT_NOT_FOUND';
    throw err;
  }

  // Check if user has this reaction
  const existingReaction = comment.userReactions.find(
    r => r.userId.toString() === userId.toString() && r.type === reactionType
  );

  if (!existingReaction) {
    const err = new Error('Reaction not found');
    err.statusCode = 400;
    err.code = 'REACTION_NOT_FOUND';
    throw err;
  }

  // Remove reaction
  await comment.removeReaction(userId, reactionType);

  // Return updated comment with user reactions
  const updatedComment = await Comment.findById(commentId).lean();
  const userReactions = updatedComment.userReactions
    .filter(r => r.userId.toString() === userId.toString())
    .map(r => r.type);

  return {
    id: updatedComment._id.toString(),
    reactions: updatedComment.reactions,
    userReactions
  };
}
