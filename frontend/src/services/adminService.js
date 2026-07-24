import apiClient from './api';

/**
 * Fetch admin statistics
 * @returns {Promise<Object>} Statistics data
 */
export const fetchStatistics = async () => {
  try {
    const response = await apiClient.get('/admin/stats');
    
    if (!response.data?.data) {
      throw new Error('Invalid response structure from server');
    }

    return response.data.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || 'Failed to fetch statistics',
      code: error.response?.data?.code || error.code || 'FETCH_STATS_ERROR',
      status: error.response?.status || error.status || 0,
    };
  }
};

/**
 * Fetch detailed user list
 * @returns {Promise<Object>} User details
 */
export const fetchDetailedUsers = async () => {
  try {
    const response = await apiClient.get('/admin/users');
    
    if (!response.data?.data) {
      throw new Error('Invalid response structure from server');
    }

    return response.data.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || 'Failed to fetch user details',
      code: error.response?.data?.code || error.code || 'FETCH_USERS_ERROR',
      status: error.response?.status || error.status || 0,
    };
  }
};

/**
 * Fetch detailed post list
 * @returns {Promise<Object>} Post details
 */
export const fetchDetailedPosts = async () => {
  try {
    const response = await apiClient.get('/admin/posts');
    
    if (!response.data?.data) {
      throw new Error('Invalid response structure from server');
    }

    return response.data.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || 'Failed to fetch post details',
      code: error.response?.data?.code || error.code || 'FETCH_POSTS_ERROR',
      status: error.response?.status || error.status || 0,
    };
  }
};

/**
 * Fetch detailed circle list
 * @returns {Promise<Object>} Circle details
 */
export const fetchDetailedCircles = async () => {
  try {
    const response = await apiClient.get('/admin/circles');
    
    if (!response.data?.data) {
      throw new Error('Invalid response structure from server');
    }

    return response.data.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || 'Failed to fetch circle details',
      code: error.response?.data?.code || error.code || 'FETCH_CIRCLES_ERROR',
      status: error.response?.status || error.status || 0,
    };
  }
};
