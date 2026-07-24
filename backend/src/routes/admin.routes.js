import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { readRateLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

/**
 * GET /api/admin/stats
 * Get comprehensive platform statistics
 * Requires: admin authentication
 */
router.get('/stats',
  authenticate,
  readRateLimiter,
  adminController.getStatistics
);

/**
 * GET /api/admin/users
 * Get detailed list of all users
 * Requires: admin authentication
 */
router.get('/users',
  authenticate,
  readRateLimiter,
  adminController.getDetailedUsers
);

/**
 * GET /api/admin/posts
 * Get detailed list of all posts
 * Requires: admin authentication
 */
router.get('/posts',
  authenticate,
  readRateLimiter,
  adminController.getDetailedPosts
);

/**
 * GET /api/admin/circles
 * Get detailed list of all circles
 * Requires: admin authentication
 */
router.get('/circles',
  authenticate,
  readRateLimiter,
  adminController.getDetailedCircles
);

export default router;
