import apiClient from './api';

/**
 * Fetch comments for a post with optional pagination
 * @param {Object} params - Query parameters
 * @param {string} params.postId - Post ID
 * @param {string} params.cursor - Pagination cursor
 * @returns {Promise<Object>} Comments data with pagination
 */
export const fetchComments = async ({ postId, cursor } = {}) => {
  try {
    if (!postId) {
      throw new Error('Post ID is required');
    }

    const params = {};
    if (cursor) params.cursor = cursor;

    const response = await apiClient.get(`/posts/${postId}/comments`, { params });
    
    // Validate response structure (API returns nested data structure)
    if (!response.data?.data?.data || !Array.isArray(response.data.data.data)) {
      throw new Error('Invalid response structure from server');
    }

    return {
      comments: response.data.data.data,
      cursor: response.data.data.pagination?.cursor || null,
      hasMore: response.data.data.pagination?.hasMore || false,
    };
  } catch (error) {
    throw {
      message: error.message || 'Failed to fetch comments',
      code: error.code || 'FETCH_COMMENTS_ERROR',
      status: error.status || 0,
    };
  }
};

/**
 * Create new comment on a post
 * @param {string} postId - Post ID
 * @param {string} content - Comment content (1-1000 chars)
 * @returns {Promise<Object>} Created comment data
 */
export const createComment = async (postId, content) => {
  try {
    // Validate required fields
    if (!postId) {
      throw new Error('Post ID is required');
    }
    if (!content) {
      throw new Error('Content is required');
    }

    // Validate content length
    if (content.length < 1 || content.length > 1000) {
      throw new Error('Content must be between 1 and 1000 characters');
    }

    const response = await apiClient.post(`/posts/${postId}/comments`, {
      content,
    });
    
    // Validate response structure
    if (!response.data || !response.data.id) {
      throw new Error('Invalid response structure from server');
    }

    return response.data;
  } catch (error) {
    throw {
      message: error.message || 'Failed to create comment',
      code: error.code || 'CREATE_COMMENT_ERROR',
      status: error.status || 0,
    };
  }
};

/**
 * Create reply to a comment
 * @param {string} commentId - Parent comment ID
 * @param {string} content - Reply content (1-1000 chars)
 * @returns {Promise<Object>} Created reply data
 */
export const createReply = async (commentId, content) => {
  try {
    // Validate required fields
    if (!commentId) {
      throw new Error('Comment ID is required');
    }
    if (!content) {
      throw new Error('Content is required');
    }

    // Validate content length
    if (content.length < 1 || content.length > 1000) {
      throw new Error('Content must be between 1 and 1000 characters');
    }

    const response = await apiClient.post(`/comments/${commentId}/replies`, {
      content,
    });
    
    // Validate response structure
    if (!response.data || !response.data.id) {
      throw new Error('Invalid response structure from server');
    }

    return response.data;
  } catch (error) {
    throw {
      message: error.message || 'Failed to create reply',
      code: error.code || 'CREATE_REPLY_ERROR',
      status: error.status || 0,
    };
  }
};

/**
 * Delete comment
 * @param {string} commentId - Comment ID
 * @returns {Promise<void>}
 */
export const deleteComment = async (commentId) => {
  try {
    if (!commentId) {
      throw new Error('Comment ID is required');
    }

    await apiClient.delete(`/comments/${commentId}`);
  } catch (error) {
    throw {
      message: error.message || 'Failed to delete comment',
      code: error.code || 'DELETE_COMMENT_ERROR',
      status: error.status || 0,
    };
  }
};
