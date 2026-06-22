import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validateRegister, validateLogin } from '../middlewares/validation.middleware.js';
import { sensitiveRateLimiter, strictRateLimiter } from '../middlewares/rateLimit.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';

/**
 * Authentication Routes
 * Defines authentication endpoints with validation and rate limiting
 * Implements Requirements: 1.1, 2.3, 2.4
 */

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new anonymous user
 * 
 * Middleware chain:
 * 1. Rate limiting (10 requests per 15 minutes)
 * 2. Input validation (reject PII, validate optional demographics)
 * 3. Controller handler
 */
router.post(
  '/register',
  sensitiveRateLimiter,
  validateRegister,
  authController.register
);

/**
 * POST /api/auth/login
 * Login user with username and password
 * 
 * Middleware chain:
 * 1. Strict rate limiting (5 requests per 15 minutes)
 * 2. Input validation (username and password required)
 * 3. Controller handler
 */
router.post(
  '/login',
  strictRateLimiter,
  validateLogin,
  authController.login
);

/**
 * GET /api/auth/session
 * Get current session user data
 * 
 * Middleware chain:
 * 1. Authentication (requires valid session)
 * 2. Controller handler
 */
router.get(
  '/session',
  authenticate,
  authController.getSession
);

/**
 * POST /api/auth/logout
 * Logout user by destroying session
 * 
 * Middleware chain:
 * 1. Authentication (requires valid session)
 * 2. Controller handler
 */
router.post(
  '/logout',
  authenticate,
  authController.logout
);

/**
 * POST /api/auth/forgot-password
 * Request password reset token
 * 
 * Middleware chain:
 * 1. Strict rate limiting (5 requests per 15 minutes)
 * 2. Controller handler
 */
router.post(
  '/forgot-password',
  strictRateLimiter,
  authController.requestPasswordReset
);

/**
 * POST /api/auth/reset-password
 * Reset password using token
 * 
 * Middleware chain:
 * 1. Sensitive rate limiting (10 requests per 15 minutes)
 * 2. Controller handler
 */
router.post(
  '/reset-password',
  sensitiveRateLimiter,
  authController.resetPassword
);

export default router;
