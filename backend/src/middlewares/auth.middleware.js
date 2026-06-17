import User from '../models/User.model.js';
import { logAuthEvent, logSecurityEvent } from '../utils/logger.utils.js';

/**
 * Authentication Middleware
 * Validates server-side sessions and attaches user to request
 * Checks user ban status
 */

/**
 * Create authentication error response
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @returns {Object} Error response object
 */
function createAuthError(message, code = 'AUTHENTICATION_FAILED') {
  const error = new Error(message);
  error.statusCode = 401;
  error.code = code;
  error.userMessage = message;
  return error;
}

/**
 * Authentication middleware
 * Validates session and attaches user to request
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function authenticate(req, res, next) {
  try {
    // Check if session exists and has userId
    if (!req.session || !req.session.userId) {
      throw createAuthError('Authentication required', 'MISSING_SESSION');
    }
    
    const userId = req.session.userId;
    
    // Fetch user from database
    const user = await User.findById(userId);
    
    if (!user) {
      // User not found, destroy invalid session
      req.session.destroy(() => {});
      throw createAuthError('User not found', 'USER_NOT_FOUND');
    }
    
    // Check if user is banned
    if (user.isCurrentlyBanned()) {
      logSecurityEvent('banned_user_access_attempt', { 
        requestId: req.id, 
        userId: user._id.toString(),
        banExpiresAt: user.banExpiresAt 
      });
      const error = createAuthError('Account is banned', 'ACCOUNT_BANNED');
      error.statusCode = 403;
      
      // Include ban expiration if temporary
      if (user.banExpiresAt) {
        error.banExpiresAt = user.banExpiresAt;
      }
      
      throw error;
    }
    
    // Log successful authentication
    logAuthEvent('authentication_success', { 
      requestId: req.id, 
      userId: user._id.toString() 
    });
    
    // Attach user to request object
    req.user = {
      id: user._id.toString(),
      username: user.username,
      createdAt: user.createdAt
    };
    
    // Update last active timestamp (async, don't wait)
    user.updateLastActive().catch(err => {
      console.error('Failed to update last active:', err);
    });
    
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication middleware
 * Attaches user to request if session is present and valid
 * Does not fail if session is missing or invalid
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function optionalAuthenticate(req, res, next) {
  try {
    // Check if session exists and has userId
    if (!req.session || !req.session.userId) {
      // No session, continue without authentication
      return next();
    }
    
    const userId = req.session.userId;
    
    // Fetch user from database
    const user = await User.findById(userId);
    
    if (!user) {
      // User not found, continue without authentication
      return next();
    }
    
    // Check if user is banned
    if (user.isCurrentlyBanned()) {
      // User banned, continue without authentication
      return next();
    }
    
    // Attach user to request object
    req.user = {
      id: user._id.toString(),
      username: user.username,
      createdAt: user.createdAt
    };
    
    // Update last active timestamp (async, don't wait)
    user.updateLastActive().catch(err => {
      console.error('Failed to update last active:', err);
    });
    
    next();
  } catch (error) {
    // On any error, continue without authentication
    next();
  }
}

/**
 * Require authentication middleware
 * Alias for authenticate() middleware for clarity in route definitions
 */
export const requireAuth = authenticate;

/**
 * Check if request is authenticated
 * Utility function for use in controllers
 * @param {Object} req - Express request object
 * @returns {boolean} True if user is authenticated
 */
export function isAuthenticated(req) {
  return req.user !== undefined && req.user !== null;
}

/**
 * Get authenticated user ID
 * Utility function for use in controllers
 * @param {Object} req - Express request object
 * @returns {string|null} User ID or null if not authenticated
 */
export function getAuthenticatedUserId(req) {
  return req.user?.id || null;
}

/**
 * Get authenticated username
 * Utility function for use in controllers
 * @param {Object} req - Express request object
 * @returns {string|null} Username or null if not authenticated
 */
export function getAuthenticatedUsername(req) {
  return req.user?.username || null;
}
