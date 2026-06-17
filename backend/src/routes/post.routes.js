import express from 'express';
import * as postController from '../controllers/post.controller.js';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware.js';
import {
  validateCreatePost,
  validateUpdatePost,
  validatePostId,
  validateReaction,
  validatePagination
} from '../middlewares/validation.middleware.js';
import {
  readRateLimiter,
  postCreationRateLimiter,
  writeRateLimiter,
  reactionRateLimiter
} from '../middlewares/rateLimit.middleware.js';
import { cacheStaleWhileRevalidate, noCache } from '../middlewares/cache.middleware.js';
import upload from '../middlewares/upload.middleware.js';

/**
 * Post Routes
 * Defines API endpoints for post operations
 * Implements Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 6.1, 6.2, 6.3, 15.6
 */

const router = express.Router();

/**
 * POST /api/posts
 * Create a new post
 * Requires: authentication, validation, rate limiting (5 posts per hour)
 */
router.post(
  '/',
  authenticate,
  postCreationRateLimiter,
  noCache(),
  upload.single('image'), // Add multer middleware for image upload
  validateCreatePost,
  postController.createPost
);

/**
 * GET /api/posts
 * List posts with pagination and filters
 * Optional filters: circleId, category
 * Supports cursor-based pagination
 * Cache: 3 min fresh, 6 min stale (feeds update frequently)
 * Optional authentication: includes isAuthor flag if authenticated
 */
router.get(
  '/',
  optionalAuthenticate,
  readRateLimiter,
  cacheStaleWhileRevalidate(180, 360), // 3 min fresh, 6 min stale
  validatePagination,
  postController.listPosts
);

/**
 * GET /api/posts/:id
 * Get a single post by ID
 * Cache: 5 min fresh, 10 min stale
 */
router.get(
  '/:id',
  readRateLimiter,
  cacheStaleWhileRevalidate(300, 600), // 5 min fresh, 10 min stale
  validatePostId,
  postController.getPostById
);

/**
 * PATCH /api/posts/:id
 * Update a post (ownership verified in service)
 * Requires: authentication, validation, rate limiting
 */
router.patch(
  '/:id',
  authenticate,
  writeRateLimiter,
  noCache(),
  validateUpdatePost,
  postController.updatePost
);

/**
 * DELETE /api/posts/:id
 * Delete a post (ownership verified in service)
 * Requires: authentication, rate limiting
 */
router.delete(
  '/:id',
  authenticate,
  writeRateLimiter,
  noCache(),
  validatePostId,
  postController.deletePost
);

/**
 * POST /api/posts/:id/reactions
 * Add a reaction to a post
 * Requires: authentication, validation, rate limiting (100 reactions per hour)
 */
router.post(
  '/:id/reactions',
  authenticate,
  reactionRateLimiter,
  noCache(),
  validateReaction,
  postController.addReaction
);

/**
 * DELETE /api/posts/:id/reactions
 * Remove a reaction from a post
 * Requires: authentication, validation, rate limiting
 */
router.delete(
  '/:id/reactions',
  authenticate,
  reactionRateLimiter,
  noCache(),
  validateReaction,
  postController.removeReaction
);

export default router;
