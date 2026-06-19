import apiClient from './api';

/**
 * Fetch posts with optional filters
 * @param {Object} params - Query parameters
 * @param {string} params.cursor - Pagination cursor
 * @param {string} params.circleId - Filter by circle ID
 * @param {string} params.category - Filter by category
 * @param {string} params.room - Filter by room (dark, climb, philo)
 * @returns {Promise<Object>} Posts data with pagination
 */
export const fetchPosts = async ({ cursor, circleId, category, room } = {}) => {
  try {
    const params = {};
    if (cursor) params.cursor = cursor;
    if (circleId) params.circleId = circleId;
    if (category) params.category = category;
    if (room) params.room = room;

    const response = await apiClient.get('/posts', { params });
    
    // Validate response structure (API returns nested data structure)
    if (!response.data?.data?.data || !Array.isArray(response.data.data.data)) {
      throw new Error('Invalid response structure from server');
    }

    return {
      posts: response.data.data.data,
      cursor: response.data.data.pagination?.cursor || null,
      hasMore: response.data.data.pagination?.hasMore || false,
    };
  } catch (error) {
    throw {
      message: error.message || 'Failed to fetch posts',
      code: error.code || 'FETCH_POSTS_ERROR',
      status: error.status || 0,
    };
  }
};

/**
 * Fetch single post by ID
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Post data
 */
export const fetchPostById = async (postId) => {
  try {
    if (!postId) {
      throw new Error('Post ID is required');
    }

    const response = await apiClient.get(`/posts/${postId}`);
    
    // Validate response structure (API returns { status: 'success', data: {...} })
    if (!response.data?.data || !response.data.data.id) {
      throw new Error('Invalid response structure from server');
    }

    return response.data.data;
  } catch (error) {
    throw {
      message: error.message || 'Failed to fetch post',
      code: error.code || 'FETCH_POST_ERROR',
      status: error.status || 0,
    };
  }
};

/**
 * Create new post
 * @param {Object} postData - Post data
 * @param {string} postData.content - Post content (10-5000 chars)
 * @param {string} postData.room - Room type (dark, climb, philo)
 * @param {string} postData.title - Optional title (for climb/philo)
 * @param {string} postData.circleId - Circle ID
 * @param {string} postData.category - Category tag
 * @param {File} postData.image - Optional image file
 * @returns {Promise<Object>} Created post data
 */
export const createPost = async (postData) => {
  try {
    // Validate required fields
    if (!postData.content || !postData.circleId || !postData.category || !postData.room) {
      throw new Error('Content, room, circle, and category are required');
    }

    // Validate content length
    if (postData.content.length < 10 || postData.content.length > 5000) {
      throw new Error('Content must be between 10 and 5000 characters');
    }

    // Validate room
    if (!['dark', 'climb', 'philo'].includes(postData.room)) {
      throw new Error('Invalid room type');
    }

    // Create FormData for multipart/form-data submission
    const formData = new FormData();
    formData.append('content', postData.content);
    formData.append('room', postData.room);
    formData.append('circleId', postData.circleId);
    formData.append('category', postData.category);
    
    if (postData.title) {
      formData.append('title', postData.title);
    }
    
    if (postData.image) {
      formData.append('image', postData.image);
    }

    const response = await apiClient.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Validate response structure
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response structure from server');
    }

    return response.data.data;
  } catch (error) {
    throw {
      message: error.message || 'Failed to create post',
      code: error.code || 'CREATE_POST_ERROR',
      status: error.status || 0,
    };
  }
};

/**
 * Update existing post
 * @param {string} postId - Post ID
 * @param {Object} postData - Updated post data
 * @param {string} postData.content - Updated content
 * @returns {Promise<Object>} Updated post data
 */
export const updatePost = async (postId, postData) => {
  try {
    if (!postId) {
      throw new Error('Post ID is required');
    }

    // Validate content length if provided
    if (postData.content && (postData.content.length < 10 || postData.content.length > 5000)) {
      throw new Error('Content must be between 10 and 5000 characters');
    }

    const response = await apiClient.patch(`/posts/${postId}`, postData);
    
    // Validate response structure
    if (!response.data || !response.data.id) {
      throw new Error('Invalid response structure from server');
    }

    return response.data;
  } catch (error) {
    throw {
      message: error.message || 'Failed to update post',
      code: error.code || 'UPDATE_POST_ERROR',
      status: error.status || 0,
    };
  }
};

/**
 * Delete post
 * @param {string} postId - Post ID
 * @returns {Promise<void>}
 */
export const deletePost = async (postId) => {
  try {
    if (!postId) {
      throw new Error('Post ID is required');
    }

    await apiClient.delete(`/posts/${postId}`);
  } catch (error) {
    throw {
      message: error.message || 'Failed to delete post',
      code: error.code || 'DELETE_POST_ERROR',
      status: error.status || 0,
    };
  }
};

/**
 * Add reaction to post
 * @param {string} postId - Post ID
 * @param {string} reactionType - Reaction type
 * @returns {Promise<Object>} Updated reactions
 */
export const addReaction = async (postId, reactionType) => {
  try {
    if (!postId || !reactionType) {
      throw new Error('Post ID and reaction type are required');
    }

    // Validate reaction type - supports all room-specific reactions
    const validReactions = [
      // Dark Room reactions
      'iFeelYou', 'notGood', 'youreNotAlone', 'sendingStrength',
      // Climb Room reactions
      'push', 'pull', 'gear', 'rocket',
      // Philo Room reactions
      'lamp', 'spark', 'clap',
      // Legacy reactions
      'iRelate', 'imListening', 'theAbyss'
    ];
    if (!validReactions.includes(reactionType)) {
      throw new Error('Invalid reaction type');
    }

    const response = await apiClient.post(`/posts/${postId}/reactions`, {
      type: reactionType,
    });
    
    // Validate response structure
    if (!response.data || !response.data.reactions) {
      throw new Error('Invalid response structure from server');
    }

    return {
      reactions: response.data.reactions,
    };
  } catch (error) {
    throw {
      message: error.message || 'Failed to add reaction',
      code: error.code || 'ADD_REACTION_ERROR',
      status: error.status || 0,
    };
  }
};

/**
 * Remove reaction from post
 * @param {string} postId - Post ID
 * @param {string} reactionType - Reaction type
 * @returns {Promise<Object>} Updated reactions
 */
export const removeReaction = async (postId, reactionType) => {
  try {
    if (!postId || !reactionType) {
      throw new Error('Post ID and reaction type are required');
    }

    // Validate reaction type - supports all room-specific reactions
    const validReactions = [
      // Dark Room reactions
      'iFeelYou', 'notGood', 'youreNotAlone', 'sendingStrength',
      // Climb Room reactions
      'push', 'pull', 'gear', 'rocket',
      // Philo Room reactions
      'lamp', 'spark', 'clap',
      // Legacy reactions
      'iRelate', 'imListening', 'theAbyss'
    ];
    if (!validReactions.includes(reactionType)) {
      throw new Error('Invalid reaction type');
    }

    const response = await apiClient.delete(`/posts/${postId}/reactions`, {
      data: { type: reactionType },
    });
    
    // Validate response structure
    if (!response.data || !response.data.reactions) {
      throw new Error('Invalid response structure from server');
    }

    return {
      reactions: response.data.reactions,
    };
  } catch (error) {
    throw {
      message: error.message || 'Failed to remove reaction',
      code: error.code || 'REMOVE_REACTION_ERROR',
      status: error.status || 0,
    };
  }
};
