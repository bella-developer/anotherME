import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validateRegister, validateLogin } from '../middlewares/validation.middleware.js';
import { sensitiveRateLimiter, strictRateLimiter } from '../middlewares/rateLimit.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import passport from '../config/passport.config.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils.js';

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
 * Query param: action=login|register (optional, defaults to login)
 */
router.get(
  '/google',
  (req, res, next) => {
    // Store the action (login or register) in session
    req.session.oauthAction = req.query.action || 'login';
    next();
  },
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
  (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      if (err) {
        console.error('OAuth authentication error:', err);
        const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
        const message = encodeURIComponent('Authentication error. Please try again.');
        return res.redirect(`${frontendURL}/login?error=${message}`);
      }

      // Check if authentication failed with redirect_to_signin action
      if (!user) {
        const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
        const message = info?.message || 'Authentication failed. Please try again.';
        const encodedMessage = encodeURIComponent(message);
        return res.redirect(`${frontendURL}/login?error=${encodedMessage}`);
      }

      // Log the user in (establish session)
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('Login error:', loginErr);
          const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
          const message = encodeURIComponent('Failed to establish session. Please try again.');
          return res.redirect(`${frontendURL}/login?error=${message}`);
        }

        // Store user ID in session for compatibility with existing auth system
        if (user._id) {
          req.session.userId = user._id.toString();

          // Generate JWT tokens for the user
          const accessToken = generateAccessToken({ userId: user._id.toString() });
          const refreshToken = generateRefreshToken({ userId: user._id.toString() });

          // Clear OAuth action from session
          delete req.session.oauthAction;

          req.session.save((saveErr) => {
            if (saveErr) {
              console.error('Session save error:', saveErr);
            }

            // Redirect to frontend home page with tokens in URL
            const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
            const redirectURL = `${frontendURL}/auth/callback?accessToken=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}`;
            res.redirect(redirectURL);
          });
        } else {
          // No user ID found
          const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
          const message = encodeURIComponent('Invalid user data. Please try again.');
          res.redirect(`${frontendURL}/login?error=${message}`);
        }
      });
    })(req, res, next);
  }
);

export default router;
