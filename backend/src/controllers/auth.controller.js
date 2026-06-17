import * as authService from '../services/auth.service.js';
import { createSuccessResponse } from '../utils/response.utils.js';
import { regenerateSession, destroySession } from '../config/session.js';

/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 * Manages server-side sessions
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
 * @param {number} req.body.age - Optional age (18-100)
 * @param {string} req.body.gender - Optional gender
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function register(req, res, next) {
  try {
    const { username, password, age, gender } = req.body;
    
    // Call service layer
    const result = await authService.register({ username, password, age, gender });
    
    // Regenerate session to prevent fixation attacks
    await regenerateSession(req);
    
    // Store user ID in session
    req.session.userId = result.user.id;
    
    // Return success response with user data
    res.status(201).json(
      createSuccessResponse(
        {
          user: result.user
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
    
    // Regenerate session to prevent fixation attacks
    await regenerateSession(req);
    
    // Store user ID in session
    req.session.userId = result.user.id;
    
    // Return success response with user data
    res.status(200).json(
      createSuccessResponse(
        {
          user: result.user
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
