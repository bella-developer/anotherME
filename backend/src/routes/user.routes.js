import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { validateUpdateUser } from '../middlewares/validation.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { readRateLimiter } from '../middlewares/rateLimit.middleware.js';

/**
 * User Routes
 * Defines user profile endpoints with authentication and validation
 * Implements Requirement: 1.3
 */

const router = express.Router();

/**
 * GET /api/users/me
 * Get current authenticated user's profile
 * 
 * Middleware chain:
 * 1. Authentication (requires valid access token)
 * 2. Controller handler
 */
router.get(
  '/me',
  authenticate,
  userController.getCurrentUser
);

/**
 * GET /api/users/me/stats
 * Get current authenticated user's gamification stats
 * 
 * Middleware chain:
 * 1. Authentication (requires valid access token)
 * 2. Rate limiting
 * 3. Controller handler
 */
router.get(
  '/me/stats',
  authenticate,
  readRateLimiter,
  userController.getUserStatsController
);

/**
 * GET /api/users/leaderboard
 * Get leaderboard for a specific room and stat
 * Query params: room (climb/dark/philo), stat (genius/hustle/legend/etc), limit (default 10)
 * 
 * Middleware chain:
 * 1. Rate limiting
 * 2. Controller handler
 */
router.get(
  '/leaderboard',
  readRateLimiter,
  userController.getLeaderboardController
);

/**
 * PATCH /api/users/me
 * Update current authenticated user's profile
 * Only allows updating optional demographics (age, gender)
 * 
 * Middleware chain:
 * 1. Authentication (requires valid access token)
 * 2. Input validation (reject PII, validate demographics)
 * 3. Controller handler
 */
router.patch(
  '/me',
  authenticate,
  validateUpdateUser,
  userController.updateCurrentUser
);

export default router;
