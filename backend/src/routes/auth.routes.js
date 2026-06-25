import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validateRegister, validateLogin } from '../middlewares/validation.middleware.js';
import { sensitiveRateLimiter, strictRateLimiter } from '../middlewares/rateLimit.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import passport from '../config/passport.config.js';

/**
 * Authentication Routes
 * Defines authentication endpoints with validation and rate limiting
 * Implements Requirements: 1.1, 2.3, 2.4
 * Now includes Google OAuth authentication
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
 * Login with username and password
 * 
 * Middleware chain:
 * 1. Strict rate limiting (5 requests per 15 minutes)
 * 2. Input validation
 * 3. Controller handler (handles account lockout)
 */
router.post(
  '/login',
  strictRateLimiter,
  validateLogin,
  authController.login
);

/**
 * POST /api/auth/logout
 * Logout current user (destroys session)
 * 
 * Middleware chain:
 * 1. Authentication check
 * 2. Controller handler
 */
router.post(
  '/logout',
  authenticate,
  authController.logout
);

/**
 * GET /api/auth/session
 * Check if user is logged in and get session data
 * 
 * Middleware chain:
 * 1. Authentication check
 * 2. Controller handler
 */
router.get(
  '/session',
  authenticate,
  authController.getSession
);

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 */
router.post(
  '/forgot-password',
  sensitiveRateLimiter,
  authController.requestPasswordReset
);

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post(
  '/reset-password',
  sensitiveRateLimiter,
  authController.resetPassword
);

/**
 * Google OAuth Routes
 */

/**
 * GET /api/auth/google
 * Initiates Google OAuth flow
 * Redirects user to Google for authentication
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

/**
 * GET /api/auth/google/callback
 * Google OAuth callback handler
 * Processes the OAuth response from Google
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to frontend
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendURL}/home`);
  }
);

export default router;
