import express from 'express';
import * as commentController from '../controllers/comment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  validateCreateComment,
  validateCreateReply,
  validateCommentId,
  validatePagination,
  validateCreateCircleComment,
  validateCommentReaction
} from '../middlewares/validation.middleware.js';
import {
  readRateLimiter,
  commentCreationRateLimiter,
  writeRateLimiter,
  reactionRateLimiter
} from '../middlewares/rateLimit.middleware.js';
import { cacheStaleWhileRevalidate, noCache } from '../middlewares/cache.middleware.js';

/**
 * Comment Routes
 * Defines API endpoints for comment operations
 * Implements Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 15.6
 */

const router = express.Router();

/**
 * POST /api/posts/:postId/comments
 * Create a new comment on a post
 * Requires: authentication, validation, rate limiting (20 comments per hour)
 */
router.post(
  '/posts/:postId/comments',
  authenticate,
  commentCreationRateLimiter,
  noCache(),
  validateCreateComment,
  commentController.createComment
);

/**
 * GET /api/posts/:postId/comments
 * List comments for a post with pagination
 * Supports cursor-based pagination
 * Cache: 2 min fresh, 4 min stale (comments update frequently)
 */
router.get(
  '/posts/:postId/comments',
  readRateLimiter,
  cacheStaleWhileRevalidate(120, 240), // 2 min fresh, 4 min stale
  validatePagination,
  commentController.listComments
);

/**
 * POST /api/comments/:commentId/replies
 * Create a reply to a comment
 * Requires: authentication, validation, rate limiting (20 comments per hour)
 */
router.post(
  '/comments/:commentId/replies',
  authenticate,
  commentCreationRateLimiter,
  noCache(),
  validateCreateReply,
  commentController.createReply
);

/**
 * DELETE /api/comments/:id
 * Delete a comment (ownership verified in service)
 * Requires: authentication, rate limiting
 */
router.delete(
  '/comments/:id',
  authenticate,
  writeRateLimiter,
  noCache(),
  validateCommentId,
  commentController.deleteComment
);

/**
 * POST /api/circles/:circleId/comments
 * Create a comment directly in a circle
 * Requires: authentication, validation, rate limiting
 */
router.post(
  '/circles/:circleId/comments',
  authenticate,
  commentCreationRateLimiter,
  noCache(),
  validateCreateCircleComment,
  commentController.createCircleComment
);

/**
 * GET /api/circles/:circleId/comments
 * List comments for a circle with pagination
 * Cache: 2 min fresh, 4 min stale
 */
router.get(
  '/circles/:circleId/comments',
  readRateLimiter,
  cacheStaleWhileRevalidate(120, 240),
  validatePagination,
  commentController.listCircleComments
);

/**
 * GET /api/comments/:commentId/replies
 * List replies for a comment
 * Cache: 2 min fresh, 4 min stale
 */
router.get(
  '/comments/:commentId/replies',
  readRateLimiter,
  cacheStaleWhileRevalidate(120, 240),
  commentController.listReplies
);

/**
 * POST /api/comments/:commentId/reactions
 * Add a reaction to a comment
 * Requires: authentication, validation, rate limiting (100 reactions per hour)
 */
router.post(
  '/comments/:commentId/reactions',
  authenticate,
  reactionRateLimiter,
  noCache(),
  validateCommentReaction,
  commentController.addReaction
);

/**
 * DELETE /api/comments/:commentId/reactions
 * Remove a reaction from a comment
 * Requires: authentication, validation, rate limiting
 */
router.delete(
  '/comments/:commentId/reactions',
  authenticate,
  reactionRateLimiter,
  noCache(),
  validateCommentReaction,
  commentController.removeReaction
);

export default router;
