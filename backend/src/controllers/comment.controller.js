import * as commentService from '../services/comment.service.js';
import { sanitizeComment, sanitizeCircleComment, createPaginatedResponse, createSuccessResponse } from '../utils/response.utils.js';

/**
 * Comment Controller
 * HTTP request/response handling for comment endpoints
 * Implements Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7
 */

/**
 * Create a new comment on a post
 * POST /api/posts/:postId/comments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export async function createComment(req, res, next) {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const authorId = req.user.id;

    // Create comment via service
    const comment = await commentService.createComment(
      postId,
      { content },
      authorId
    );

    // Sanitize response
    const sanitized = sanitizeComment(comment);

    res.status(201).json(createSuccessResponse(sanitized, 'Comment created successfully'));
  } catch (error) {
    next(error);
  }
}

/**
 * List comments for a post with pagination
 * GET /api/posts/:postId/comments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export async function listComments(req, res, next) {
  try {
    const { postId } = req.params;
    const { cursor, limit } = req.query;

    // Build options
    const options = {
      cursor,
      limit: limit ? parseInt(limit, 10) : 20
    };

    // Get comments via service
    const result = await commentService.listComments(postId, options);

    // Create paginated response
    const response = createPaginatedResponse(
      result.comments,
      sanitizeComment,
      result.pagination
    );

    res.status(200).json(createSuccessResponse(response));
  } catch (error) {
    next(error);
  }
}

/**
 * Create a reply to a comment
 * POST /api/comments/:commentId/replies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export async function createReply(req, res, next) {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const authorId = req.user.id;

    // Create reply via service
    const reply = await commentService.createReply(
      commentId,
      { content },
      authorId
    );

    // Sanitize response - use circle comment sanitization for real IDs
    const sanitized = sanitizeCircleComment(reply);

    res.status(201).json(createSuccessResponse(sanitized, 'Reply created successfully'));
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a comment
 * DELETE /api/comments/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export async function deleteComment(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Delete comment via service (ownership verified in service)
    await commentService.deleteComment(id, userId);

    res.status(200).json(createSuccessResponse(null, 'Comment deleted successfully'));
  } catch (error) {
    next(error);
  }
}

/**
 * Create a comment directly in a circle (optionally linked to a topic post)
 * POST /api/circles/:circleId/comments
 */
export async function createCircleComment(req, res, next) {
  try {
    const { circleId } = req.params;
    const { content, postId } = req.body; // Added postId
    const authorId = req.user.id;

    const comment = await commentService.createCircleComment(
      circleId,
      { content, postId }, // Pass postId
      authorId
    );

    const sanitized = sanitizeCircleComment(comment);
    res.status(201).json(createSuccessResponse(sanitized, 'Comment created successfully'));
  } catch (error) {
    next(error);
  }
}

/**
 * List comments for a circle (optionally filtered by topic post)
 * GET /api/circles/:circleId/comments
 */
export async function listCircleComments(req, res, next) {
  try {
    const { circleId } = req.params;
    const { cursor, limit, postId } = req.query; // Added postId
    const userId = req.user?.id; // Optional - may be unauthenticated

    const options = {
      cursor,
      limit: limit ? parseInt(limit, 10) : 20,
      userId, // Pass userId to include user reactions
      postId // Pass postId to filter by topic
    };

    const result = await commentService.listCircleComments(circleId, options);

    const response = createPaginatedResponse(
      result.comments,
      sanitizeCircleComment,
      result.pagination
    );

    res.status(200).json(createSuccessResponse(response));
  } catch (error) {
    next(error);
  }
}

/**
 * List replies for a comment
 * GET /api/comments/:commentId/replies
 */
export async function listReplies(req, res, next) {
  try {
    const { commentId } = req.params;
    const { limit } = req.query;

    const options = {
      limit: limit ? parseInt(limit, 10) : 50
    };

    const replies = await commentService.listReplies(commentId, options);

    const sanitized = replies.map(sanitizeComment);
    res.status(200).json(createSuccessResponse({ replies: sanitized }));
  } catch (error) {
    next(error);
  }
}

/**
 * Add a reaction to a comment
 * POST /api/comments/:commentId/reactions
 */
export async function addReaction(req, res, next) {
  try {
    const { commentId } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    const result = await commentService.addCommentReaction(commentId, type, userId);

    res.status(200).json(createSuccessResponse(result, 'Reaction added successfully'));
  } catch (error) {
    next(error);
  }
}

/**
 * Remove a reaction from a comment
 * DELETE /api/comments/:commentId/reactions
 */
export async function removeReaction(req, res, next) {
  try {
    const { commentId } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    const result = await commentService.removeCommentReaction(commentId, type, userId);

    res.status(200).json(createSuccessResponse(result, 'Reaction removed successfully'));
  } catch (error) {
    next(error);
  }
}
