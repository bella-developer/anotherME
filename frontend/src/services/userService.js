import apiClient from './api';

/**
 * User Service
 * Handles user profile API calls
 * Implements Requirements: 1.3
 */

/**
 * Fetch current authenticated user's profile
 * @returns {Promise<Object>} User profile data
 */
export const fetchCurrentUser = async () => {
  try {
    const response = await apiClient.get('/users/me');
    
    // Validate response structure
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response structure from server');
    }

    return response.data.data;
  } catch (error) {
    throw {
      message: error.message || 'Failed to fetch user profile',
      code: error.code || 'FETCH_USER_ERROR',
      status: error.status || 0,
    };
  }
};

/**
 * Update current user's optional demographics
 * @param {Object} userData - User data to update
 * @param {number} userData.age - Optional age (18-100)
 * @param {string} userData.gender - Optional gender
 * @returns {Promise<Object>} Updated user data
 */
export const updateUser = async (userData) => {
  try {

    // Validate age if provided
    if (userData.age !== undefined && (userData.age < 18 || userData.age > 100)) {
      throw new Error('Age must be between 18 and 100');
    }

    const response = await apiClient.patch('/users/me', userData);
    
    // Validate response structure
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response structure from server');
    }

    return response.data.data;
  } catch (error) {
    throw {
      message: error.message || 'Failed to update user profile',
      code: error.code || 'UPDATE_USER_ERROR',
      status: error.status || 0,
    };
  }
};

// Convenience aliases for functions
export const getCurrentUser = fetchCurrentUser;
export const updateUserProfile = updateUser;

/**
 * Fetch current user's gamification stats
 * @returns {Promise<Object>} User stats with levels and progress
 */
export const fetchUserStats = async () => {
  try {
    const response = await apiClient.get('/users/me/stats');
    
    // Validate response structure
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response structure from server');
    }

    return response.data.data.stats;
  } catch (error) {
    throw {
      message: error.message || 'Failed to fetch user stats',
      code: error.code || 'FETCH_STATS_ERROR',
      status: error.status || 0,
    };
  }
};
