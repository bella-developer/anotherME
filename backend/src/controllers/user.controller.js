import * as userService from '../services/user.service.js';
import { sanitizeUser } from '../utils/response.utils.js';
import { getUserStats, getLeaderboard } from '../services/gamification.service.js';

/**
 * User Controller
 * Handles HTTP requests for user profile operations
 * Implements Requirement: 1.3
 */

/**
 * GET /api/users/me
 * Get current authenticated user's profile
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function getCurrentUser(req, res, next) {
  try {
    // Get user ID from authenticated request
    const userId = req.user?.id;
    
    if (!userId) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      error.code = 'AUTHENTICATION_REQUIRED';
      error.userMessage = 'You must be logged in to access this resource';
      throw error;
    }
    
    // Get user profile from service
    const user = await userService.getCurrentUser(userId);
    
    // Return sanitized user data
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/users/me
 * Update current authenticated user's profile
 * Only allows updating optional demographics (age, gender)
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function updateCurrentUser(req, res, next) {
  try {
    // Get user ID from authenticated request
    const userId = req.user?.id;
    
    if (!userId) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      error.code = 'AUTHENTICATION_REQUIRED';
      error.userMessage = 'You must be logged in to access this resource';
      throw error;
    }
    
    // Get update data from request body
    const updateData = req.body;
    
    // Update user profile via service
    const user = await userService.updateUser(userId, updateData);
    
    // Return updated user data
    res.status(200).json({
      status: 'success',
      data: {
        user
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/users/me/stats
 * Get current authenticated user's gamification stats
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function getUserStatsController(req, res, next) {
  try {
    // Get user ID from authenticated request
    const userId = req.user?.id;
    
    if (!userId) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      error.code = 'AUTHENTICATION_REQUIRED';
      error.userMessage = 'You must be logged in to access this resource';
      throw error;
    }
    
    // Get user stats from gamification service
    const stats = await getUserStats(userId);
    
    // Return stats
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/users/leaderboard
 * Get leaderboard for a specific room and stat
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function getLeaderboardController(req, res, next) {
  try {
    const { room, stat, limit } = req.query;
    
    // Validate room
    if (!room || !['climb', 'dark', 'philo'].includes(room)) {
      const error = new Error('Invalid room. Must be climb, dark, or philo');
      error.statusCode = 400;
      error.code = 'INVALID_ROOM';
      throw error;
    }
    
    // Validate stat based on room
    const validStats = {
      climb: ['genius', 'hustle', 'legend'],
      dark: ['depth', 'mystery', 'wisdom'],
      philo: ['logic', 'insight', 'impact']
    };
    
    if (!stat || !validStats[room].includes(stat)) {
      const error = new Error(`Invalid stat for ${room} room. Must be one of: ${validStats[room].join(', ')}`);
      error.statusCode = 400;
      error.code = 'INVALID_STAT';
      throw error;
    }
    
    // Get leaderboard from gamification service
    const leaderboard = await getLeaderboard(room, stat, limit ? parseInt(limit, 10) : 10);
    
    // Return leaderboard
    res.status(200).json({
      status: 'success',
      data: {
        room,
        stat,
        leaderboard
      }
    });
  } catch (error) {
    next(error);
  }
}
