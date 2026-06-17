import express from 'express';
import * as circleController from '../controllers/circle.controller.js';
import { 
  validateCreateCircle, 
  validateCircleId, 
  validateSearchCircles,
  validatePagination 
} from '../middlewares/validation.middleware.js';
import { 
  readRateLimiter, 
  circleCreationRateLimiter,
  moderationRateLimiter 
} from '../middlewares/rateLimit.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { cacheStaleWhileRevalidate, noCache } from '../middlewares/cache.middleware.js';

/**
 * Circle Routes
 * Defines circle endpoints with validation, authentication, and rate limiting
 * Implements Requirements: 4.1, 4.2, 4.3, 4.4, 4.6, 15.6
 */

const router = express.Router();

/**
 * POST /api/circles
 * Create a new circle
 * 
 * Middleware chain:
 * 1. Authentication (requires valid access token)
 * 2. Rate limiting (3 circles per day per user)
 * 3. No cache (write operation)
 * 4. Input validation (validate name, description, visibility, categories)
 * 5. Controller handler
 */
router.post(
  '/',
  authenticate,
  circleCreationRateLimiter,
  noCache(),
  validateCreateCircle,
  circleController.createCircle
);

/**
 * GET /api/circles
 * List circles with pagination and optional search
 * 
 * Middleware chain:
 * 1. Rate limiting (100 requests per 15 minutes)
 * 2. Cache (5 min fresh, 10 min stale)
 * 3. Input validation (validate cursor, limit, search query)
 * 4. Controller handler
 */
router.get(
  '/',
  readRateLimiter,
  cacheStaleWhileRevalidate(300, 600), // 5 min fresh, 10 min stale
  validateSearchCircles,
  circleController.listCircles
);

/**
 * GET /api/circles/:id
 * Get circle by ID
 * 
 * Middleware chain:
 * 1. Rate limiting (100 requests per 15 minutes)
 * 2. Cache (5 min fresh, 10 min stale)
 * 3. Input validation (validate circle ID)
 * 4. Controller handler
 */
router.get(
  '/:id',
  readRateLimiter,
  cacheStaleWhileRevalidate(300, 600), // 5 min fresh, 10 min stale
  validateCircleId,
  circleController.getCircleById
);

/**
 * DELETE /api/circles/:id/posts/:postId
 * Remove a post from a circle (moderation action)
 * Only circle creator can perform this action
 * 
 * Middleware chain:
 * 1. Authentication (requires valid access token)
 * 2. Rate limiting (50 moderation actions per hour)
 * 3. No cache (write operation)
 * 4. Input validation (validate circle ID and post ID)
 * 5. Controller handler (includes authorization check)
 */
router.delete(
  '/:id/posts/:postId',
  authenticate,
  moderationRateLimiter,
  noCache(),
  validateCircleId,
  circleController.removePostFromCircle
);

/**
 * DELETE /api/circles/:id/comments/:commentId
 * Remove a comment from a circle (moderation action)
 * Only circle creator can perform this action
 * 
 * Middleware chain:
 * 1. Authentication (requires valid access token)
 * 2. Rate limiting (50 moderation actions per hour)
 * 3. No cache (write operation)
 * 4. Input validation (validate circle ID and comment ID)
 * 5. Controller handler (includes authorization check)
 */
router.delete(
  '/:id/comments/:commentId',
  authenticate,
  moderationRateLimiter,
  noCache(),
  validateCircleId,
  circleController.removeCommentFromCircle
);

/**
 * GET /api/circles/:id/topics
 * Get all topic posts for a circle (up to 3)
 * 
 * Middleware chain:
 * 1. Rate limiting (100 requests per 15 minutes)
 * 2. Cache (5 min fresh, 10 min stale)
 * 3. Input validation (validate circle ID)
 * 4. Controller handler
 */
router.get(
  '/:id/topics',
  readRateLimiter,
  cacheStaleWhileRevalidate(300, 600),
  validateCircleId,
  circleController.getTopicPosts
);

/**
 * GET /api/circles/:id/topic
 * Get the topic post for a circle (legacy - returns most recent)
 * 
 * Middleware chain:
 * 1. Rate limiting (100 requests per 15 minutes)
 * 2. Cache (5 min fresh, 10 min stale)
 * 3. Input validation (validate circle ID)
 * 4. Controller handler
 */
router.get(
  '/:id/topic',
  readRateLimiter,
  cacheStaleWhileRevalidate(300, 600),
  validateCircleId,
  circleController.getTopicPost
);

/**
 * POST /api/circles/:id/topic/:postId
 * Set a post as the topic for a circle
 * Only circle creator or post author can perform this action
 * 
 * Middleware chain:
 * 1. Authentication (requires valid access token)
 * 2. Rate limiting (50 moderation actions per hour)
 * 3. No cache (write operation)
 * 4. Input validation (validate circle ID and post ID)
 * 5. Controller handler (includes authorization check)
 */
router.post(
  '/:id/topic/:postId',
  authenticate,
  moderationRateLimiter,
  noCache(),
  validateCircleId,
  circleController.setTopicPost
);

/**
 * DELETE /api/circles/:id/topic
 * Remove the topic post from a circle
 * Only circle creator can perform this action
 * 
 * Middleware chain:
 * 1. Authentication (requires valid access token)
 * 2. Rate limiting (50 moderation actions per hour)
 * 3. No cache (write operation)
 * 4. Input validation (validate circle ID)
 * 5. Controller handler (includes authorization check)
 */
router.delete(
  '/:id/topic',
  authenticate,
  moderationRateLimiter,
  noCache(),
  validateCircleId,
  circleController.removeTopicPost
);

export default router;
