import apiClient from './api';

/**
 * Fetch circles with optional pagination
 * @param {Object} params - Query parameters
 * @param {string} params.cursor - Pagination cursor
 * @param {string} params.room - Filter by room (dark, fantasy, philo)
 * @param {boolean} params.bustCache - Force fresh data bypassing browser cache
 * @returns {Promise<Object>} Circles data with pagination
 */
export const fetchCircles = async ({ cursor, room, bustCache = false } = {}) => {
  try {
    const params = {};
    if (cursor) params.cursor = cursor;
    if (room) params.room = room;

    // Configure request to bypass cache if needed
    const config = { params };
    if (bustCache) {
      // Add timestamp to URL to bypass browser cache
      params._t = Date.now();
      // Also set headers to force revalidation
      config.headers = {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      };
    }

    const response = await apiClient.get('/circles', config);
    
    // Response format: { status: 'success', data: { circles: [...], pagination: {...} } }
    if (!response.data?.data?.circles || !Array.isArray(response.data.data.circles)) {
      throw new Error('Invalid response structure from server');
    }

    return {
      circles: response.data.data.circles,
      cursor: response.data.data.pagination?.cursor || null,
      hasMore: response.data.data.pagination?.hasMore || false,
    };
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || 'Failed to fetch circles',
      code: error.response?.data?.code || error.code || 'FETCH_CIRCLES_ERROR',
      status: error.response?.status || error.status || 0,
    };
  }
};

/**
 * Search circles by name
 * @param {Object} params - Query parameters
 * @param {string} params.query - Search query
 * @param {string} params.cursor - Pagination cursor
 * @returns {Promise<Object>} Circles data with pagination
 */
export const searchCircles = async ({ query, cursor } = {}) => {
  try {
    const params = {};
    if (query) params.query = query;
    if (cursor) params.cursor = cursor;

    const response = await apiClient.get('/circles', { params });
    
    // Validate response structure
    if (!response.data || !Array.isArray(response.data.circles)) {
      throw new Error('Invalid response structure from server');
    }

    return {
      circles: response.data.circles,
      cursor: response.data.cursor || null,
      hasMore: response.data.hasMore || false,
    };
  } catch (error) {
    throw {
      message: error.message || 'Failed to search circles',
      code: error.code || 'SEARCH_CIRCLES_ERROR',
      status: error.status || 0,
    };
  }
};

/**
 * Fetch single circle by ID
 * @param {string} circleId - Circle ID
 * @returns {Promise<Object>} Circle data
 */
export const fetchCircleById = async (circleId) => {
  try {
    if (!circleId) {
      throw new Error('Circle ID is required');
    }

    const response = await apiClient.get(`/circles/${circleId}`);
    
    // Response format: { status: 'success', data: { circle: {...} } }
    const responseData = response.data?.data || response.data;
    
    if (!responseData || !responseData.circle) {
      throw new Error('Invalid response structure from server');
    }

    return responseData.circle;
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || 'Failed to fetch circle',
      code: error.response?.data?.code || error.code || 'FETCH_CIRCLE_ERROR',
      status: error.response?.status || error.status || 0,
    };
  }
};

/**
 * Create new circle
 * @param {Object} circleData - Circle data
 * @param {string} circleData.name - Circle name
 * @param {string} circleData.description - Circle description (max 500 chars)
 * @param {string} circleData.visibility - Visibility ('public' or 'restricted')
 * @param {Array<string>} circleData.categories - Allowed categories
 * @returns {Promise<Object>} Created circle data
 */
export const createCircle = async (circleData) => {
  try {
    // Validate required fields
    if (!circleData.name || !circleData.description) {
      throw new Error('Name and description are required');
    }

    // Validate description length
    if (circleData.description.length > 500) {
      throw new Error('Description must be 500 characters or less');
    }

    const response = await apiClient.post('/circles', circleData);
    
    // Response format: { status: 'success', data: { circle: {...} } }
    if (!response.data?.data?.circle) {
      throw new Error('Invalid response structure from server');
    }

    return response.data.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || 'Failed to create circle',
      code: error.response?.data?.code || error.code || 'CREATE_CIRCLE_ERROR',
      status: error.response?.status || error.status || 0,
    };
  }
};

/**
 * Fetch comments for a circle with optional pagination and topic filtering
 * @param {Object} params - Query parameters
 * @param {string} params.circleId - Circle ID
 * @param {string} params.cursor - Pagination cursor
 * @param {string} params.postId - Optional post ID to filter comments by topic
 * @returns {Promise<Object>} Comments data with pagination
 */
export const fetchCircleComments = async ({ circleId, cursor, postId } = {}) => {
  try {
    if (!circleId) {
      throw new Error('Circle ID is required');
    }

    const params = {};
    if (cursor) params.cursor = cursor;
    if (postId) params.postId = postId; // Add postId filter

    const response = await apiClient.get(`/circles/${circleId}/comments`, { params });
    
    // Response format: { status: 'success', data: { data: [...], pagination: {...} } }
    const responseData = response.data?.data || response.data;
    
    if (!responseData) {
      throw new Error('Invalid response structure from server');
    }

    return {
      comments: responseData.data || [],
      cursor: responseData.pagination?.cursor || null,
      hasMore: responseData.pagination?.hasMore || false,
    };
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || 'Failed to fetch circle comments',
      code: error.response?.data?.code || error.code || 'FETCH_CIRCLE_COMMENTS_ERROR',
      status: error.response?.status || error.status || 0,
    };
  }
};

/**
 * Create new comment in a circle (optionally linked to a topic post)
 * @param {string} circleId - Circle ID
 * @param {string} content - Comment content (1-2000 chars)
 * @param {string} postId - Optional post ID to link comment to topic
 * @returns {Promise<Object>} Created comment data
 */
export const createCircleComment = async (circleId, content, postId = null) => {
  try {
    if (!circleId) {
      throw new Error('Circle ID is required');
    }
    if (!content) {
      throw new Error('Content is required');
    }

    if (content.length < 1 || content.length > 2000) {
      throw new Error('Content must be between 1 and 2000 characters');
    }

    const payload = { content };
    if (postId) payload.postId = postId; // Add postId if provided

    const response = await apiClient.post(`/circles/${circleId}/comments`, payload);
    
    // Response format: { status: 'success', data: {...} }
    const responseData = response.data?.data || response.data;
    
    if (!responseData) {
      throw new Error('Invalid response structure from server');
    }

    return responseData;
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || 'Failed to create circle comment',
      code: error.response?.data?.code || error.code || 'CREATE_CIRCLE_COMMENT_ERROR',
      status: error.response?.status || error.status || 0,
    };
  }
};

/**
 * Create reply to a comment
 * @param {string} commentId - Parent comment ID
 * @param {string} content - Reply content (1-2000 chars)
 * @returns {Promise<Object>} Created reply data
 */
export const createCommentReply = async (commentId, content) => {
  try {
    if (!commentId) {
      throw new Error('Comment ID is required');
    }
    if (!content) {
      throw new Error('Content is required');
    }

    if (content.length < 1 || content.length > 2000) {
      throw new Error('Content must be between 1 and 2000 characters');
    }

    const response = await apiClient.post(`/comments/${commentId}/replies`, {
      content,
    });
    
    // Response format: { status: 'success', data: {...} }
    const responseData = response.data?.data || response.data;
    
    if (!responseData) {
      throw new Error('Invalid response structure from server');
    }

    return responseData;
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || 'Failed to create reply',
      code: error.response?.data?.code || error.code || 'CREATE_REPLY_ERROR',
      status: error.response?.status || error.status || 0,
    };
  }
};

/**
 * Fetch all topic posts for a circle (up to 3)
 * @param {string} circleId - Circle ID
 * @returns {Promise<Array>} Array of topic posts (max 3)
 */
export const fetchCircleTopicPosts = async (circleId) => {
  try {
    if (!circleId) {
      throw new Error('Circle ID is required');
    }

    const response = await apiClient.get(`/circles/${circleId}/topics`, {
      validateStatus: (status) => status === 200 || status === 404,
    });
    
    // If 404 or empty, return empty array
    if (response.status === 404) {
      return [];
    }
    
    // Response format: { status: 'success', data: [...] }
    const responseData = response.data?.data || response.data;
    
    return Array.isArray(responseData) ? responseData : [];
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || 'Failed to fetch topic posts',
      code: error.response?.data?.code || error.code || 'FETCH_TOPIC_POSTS_ERROR',
      status: error.response?.status || 0,
    };
  }
};

/**
 * Fetch single topic post for a circle (legacy - returns most recent)
 * @param {string} circleId - Circle ID
 * @returns {Promise<Object|null>} Topic post data or null if none exists
 */
export const fetchCircleTopicPost = async (circleId) => {
  try {
    if (!circleId) {
      throw new Error('Circle ID is required');
    }

    // Use validateStatus to treat 404 as a valid response (not an error)
    // This prevents Axios from logging it as an error in the console
    const response = await apiClient.get(`/circles/${circleId}/topic`, {
      validateStatus: (status) => status === 200 || status === 404,
    });
    
    // If 404, return null (no topic post exists - this is expected)
    if (response.status === 404) {
      return null;
    }
    
    // Response format: { status: 'success', data: {...} }
    const responseData = response.data?.data || response.data;
    
    return responseData;
  } catch (error) {
    // This will only catch network errors or other unexpected issues
    throw {
      message: error.response?.data?.message || error.message || 'Failed to fetch topic post',
      code: error.response?.data?.code || error.code || 'FETCH_TOPIC_POST_ERROR',
      status: error.response?.status || 0,
    };
  }
};

/**
 * Set a post as the topic for a circle
 * @param {string} circleId - Circle ID
 * @param {string} postId - Post ID to set as topic
 * @returns {Promise<Object>} Success response
 */
export const setCircleTopicPost = async (circleId, postId) => {
  try {
    if (!circleId || !postId) {
      throw new Error('Circle ID and Post ID are required');
    }

    const response = await apiClient.post(`/circles/${circleId}/topic/${postId}`);
    
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || 'Failed to set topic post',
      code: error.response?.data?.code || error.code || 'SET_TOPIC_POST_ERROR',
      status: error.response?.status || error.status || 0,
    };
  }
};

/**
 * Add a reaction to a comment
 * @param {string} commentId - Comment ID
 * @param {string} type - Reaction type ('resonate' or 'echo')
 * @returns {Promise<Object>} Updated reaction data
 */
export const addCommentReaction = async (commentId, type) => {
  try {
    if (!commentId) {
      throw new Error('Comment ID is required');
    }
    if (!type || !['resonate', 'echo'].includes(type)) {
      throw new Error('Invalid reaction type. Must be "resonate" or "echo"');
    }

    const response = await apiClient.post(`/comments/${commentId}/reactions`, {
      type,
    });
    
    const responseData = response.data?.data || response.data;
    
    return responseData;
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || 'Failed to add reaction',
      code: error.response?.data?.code || error.code || 'ADD_REACTION_ERROR',
      status: error.response?.status || error.status || 0,
    };
  }
};

/**
 * Remove a reaction from a comment
 * @param {string} commentId - Comment ID
 * @param {string} type - Reaction type ('resonate' or 'echo')
 * @returns {Promise<Object>} Updated reaction data
 */
export const removeCommentReaction = async (commentId, type) => {
  try {
    if (!commentId) {
      throw new Error('Comment ID is required');
    }
    if (!type || !['resonate', 'echo'].includes(type)) {
      throw new Error('Invalid reaction type. Must be "resonate" or "echo"');
    }

    const response = await apiClient.delete(`/comments/${commentId}/reactions`, {
      data: { type },
    });
    
    const responseData = response.data?.data || response.data;
    
    return responseData;
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || 'Failed to remove reaction',
      code: error.response?.data?.code || error.code || 'REMOVE_REACTION_ERROR',
      status: error.response?.status || error.status || 0,
    };
  }
};
