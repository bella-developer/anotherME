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
