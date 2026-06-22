import * as authService from '../services/auth.service.js';
import { createSuccessResponse } from '../utils/response.utils.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils.js';
import { regenerateSession, destroySession } from '../config/session.js';

/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 * Uses JWT tokens for authentication (secure for cross-origin)
 * Implements Requirements: 1.1, 2.3, 2.4
 */

/**
 * Register a new anonymous user
 * POST /api/auth/register
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.username - Optional username (auto-generated if not provided)
 * @param {string} req.body.password - Required password
 * @param {string} req.body.email - Optional email for account recovery
 * @param {number} req.body.age - Optional age (18-100)
 * @param {string} req.body.gender - Optional gender
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function register(req, res, next) {
  try {
    const { username, password, email, age, gender } = req.body;
    
    // Call service layer
    const result = await authService.register({ username, password, email, age, gender });
    
    // Generate JWT tokens
    const accessToken = generateAccessToken({ userId: result.user.id });
    const refreshToken = generateRefreshToken({ userId: result.user.id });
    
    // Also set session for backwards compatibility
    await regenerateSession(req);
    req.session.userId = result.user.id;
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Return success response with tokens and user data
    res.status(201).json(
      createSuccessResponse(
        {
          user: result.user,
          accessToken,
          refreshToken,
        },
        'Registration successful'
      )
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Login user with username and password
 * POST /api/auth/login
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.username - Username
 * @param {string} req.body.password - Password
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    
    // Call service layer
    const result = await authService.login({ username, password });
    
    // Generate JWT tokens
    const accessToken = generateAccessToken({ userId: result.user.id });
    const refreshToken = generateRefreshToken({ userId: result.user.id });
    
    // Also set session for backwards compatibility
    await regenerateSession(req);
    req.session.userId = result.user.id;
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Return success response with tokens and user data
    res.status(200).json(
      createSuccessResponse(
        {
          user: result.user,
          accessToken,
          refreshToken,
        },
        'Login successful'
      )
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Get current session user
 * GET /api/auth/session
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user (from auth middleware)
 * @param {string} req.user.id - User's MongoDB ObjectId
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function getSession(req, res, next) {
  try {
    // User ID comes from authentication middleware
    const userId = req.user.id;
    
    // Call service layer
    const result = await authService.getSessionUser(userId);
    
    // Return success response with user data
    res.status(200).json(
      createSuccessResponse(
        {
          user: result.user
        },
        'Session retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Logout user by destroying session
 * POST /api/auth/logout
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user (from auth middleware)
 * @param {string} req.user.id - User's MongoDB ObjectId
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function logout(req, res, next) {
  try {
    // User ID comes from authentication middleware
    const userId = req.user.id;
    
    // Call service layer (validates user exists)
    const result = await authService.logout(userId);
    
    // Destroy session
    await destroySession(req);
    
    // Clear session cookie
    res.clearCookie('anotherme.sid');
    
    // Return success response
    res.status(200).json(
      createSuccessResponse(
        null,
        result.message
      )
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Request password reset
 * POST /api/auth/forgot-password
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email address
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function requestPasswordReset(req, res, next) {
  try {
    const { email } = req.body;
    
    // Call service layer
    const result = await authService.requestPasswordReset(email);
    
    // NOTE: In production, send the resetToken via email
    // For now, we return it in response (REMOVE IN PRODUCTION)
    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    
    // Return success response (intentionally vague for security)
    res.status(200).json(
      createSuccessResponse(
        {
          message: result.message,
          // REMOVE IN PRODUCTION - only for testing
          ...(process.env.NODE_ENV !== 'production' && { 
            resetToken: result.resetToken,
            email: result.email,
            username: result.username
          })
        },
        'Password reset request processed'
      )
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Reset password using token
 * POST /api/auth/reset-password
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.token - Reset token from email
 * @param {string} req.body.newPassword - New password
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    
    // Call service layer
    const result = await authService.resetPassword(token, newPassword);
    
    // Return success response
    res.status(200).json(
      createSuccessResponse(
        {
          message: result.message
        },
        'Password reset successful'
      )
    );
  } catch (error) {
    next(error);
  }
}
