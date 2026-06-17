import express from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { validatePagination } from '../middlewares/validation.middleware.js';
import { readRateLimiter } from '../middlewares/rateLimit.middleware.js';
import { cachePublicRead, cacheStaleWhileRevalidate } from '../middlewares/cache.middleware.js';

/**
 * Category Routes
 * Defines API endpoints for category operations
 * Implements Requirements: 7.1, 7.2, 7.3, 7.5, 7.6, 15.6
 */

const router = express.Router();

/**
 * GET /api/categories
 * List all available categories with post counts
 * Public endpoint with read rate limiting and aggressive caching
 * Cache: 10 minutes (categories change infrequently)
 */
router.get(
  '/',
  readRateLimiter,
  cachePublicRead(600), // Cache for 10 minutes
  categoryController.listCategories
);

/**
 * GET /api/categories/:name/posts
 * Get posts by category with cursor-based pagination
 * Public endpoint with read rate limiting and stale-while-revalidate caching
 * Supports pagination via cursor and limit query params
 * Cache: 5 minutes fresh, 10 minutes stale (feeds update frequently)
 */
router.get(
  '/:name/posts',
  readRateLimiter,
  validatePagination,
  cacheStaleWhileRevalidate(300, 600), // 5 min fresh, 10 min stale
  categoryController.getPostsByCategory
);

export default router;

