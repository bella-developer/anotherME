import * as circleService from '../services/circle.service.js';
import { sanitizeCircle, createSuccessResponse, createErrorResponse } from '../utils/response.utils.js';

/**
 * Circle Controller
 * Handles HTTP requests for circle endpoints
 * Implements Requirements: 4.1, 4.2, 4.3, 4.4, 4.6
 */

/**
 * POST /api/circles
 * Create a new circle
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - Circle name
 * @param {string} req.body.description - Circle description
 * @param {string} req.body.visibility - Visibility setting (optional)
 * @param {Array<string>} req.body.categories - Allowed categories (optional)
 * @param {Object} req.user - Authenticated user (from auth middleware)
 * @param {string} req.user.id - User's MongoDB ObjectId
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function createCircle(req, res, next) {
  try {
    // Get user ID from authenticated request
    const userId = req.user?.id;

    if (!userId) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      error.code = 'AUTHENTICATION_REQUIRED';
      error.userMessage = 'You must be logged in to create a circle';
      throw error;
    }

    // Get circle data from request body
    const { name, description, visibility, categories, room } = req.body;

    // Call service layer
    const circle = await circleService.createCircle(userId, {
      name,
      description,
      visibility,
      categories,
      room
    });

    // Sanitize and return response
    const sanitizedCircle = sanitizeCircle(circle);

    res.status(201).json(
      createSuccessResponse(
        { circle: sanitizedCircle },
        'Circle created successfully'
      )
    );
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/circles
 * List circles with pagination
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.cursor - Pagination cursor (optional)
 * @param {number} req.query.limit - Results per page (optional)
 * @param {string} req.query.visibility - Filter by visibility (optional)
 * @param {string} req.query.room - Filter by room type (optional)
 * @param {string} req.query.q - Search query (optional)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function listCircles(req, res, next) {
  try {
    const { cursor, limit, visibility, room, q: searchQuery } = req.query;

    // Parse limit to integer if provided
    const parsedLimit = limit ? parseInt(limit, 10) : 20;

    let result;

    // If search query is provided, use search function
    if (searchQuery) {
      result = await circleService.searchCircles({
        query: searchQuery,
        cursor,
        limit: parsedLimit
      });
    } else {
      // Otherwise, list all circles
      result = await circleService.listCircles({
        cursor,
        limit: parsedLimit,
        visibility,
        room
      });
    }

    // Sanitize circles
    const sanitizedCircles = result.circles.map(circle => sanitizeCircle(circle));

    // Return paginated response
    res.status(200).json({
      status: 'success',
      data: {
        circles: sanitizedCircles,
        pagination: result.pagination
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/circles/:id
 * Get circle by ID
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Circle's opaque ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function getCircleById(req, res, next) {
  try {
    const { id } = req.params;

    // Call service layer
    const circle = await circleService.getCircleById(id);

    // Sanitize and return response
    const sanitizedCircle = sanitizeCircle(circle);

    res.status(200).json(
      createSuccessResponse(
        { circle: sanitizedCircle }
      )
    );
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/circles/:id/posts/:postId
 * Remove a post from a circle (moderation action)
 * Only circle creator can perform this action
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Circle's opaque ID
 * @param {string} req.params.postId - Post's opaque ID
 * @param {Object} req.user - Authenticated user (from auth middleware)
 * @param {string} req.user.id - User's MongoDB ObjectId
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function removePostFromCircle(req, res, next) {
  try {
    // Get user ID from authenticated request
    const userId = req.user?.id;

    if (!userId) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      error.code = 'AUTHENTICATION_REQUIRED';
      error.userMessage = 'You must be logged in to perform this action';
      throw error;
    }

    const { id: circleId, postId } = req.params;

    // Call service layer
    const result = await circleService.removePost(userId, circleId, postId);

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
 * DELETE /api/circles/:id/comments/:commentId
 * Remove a comment from a circle (moderation action)
 * Only circle creator can perform this action
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Circle's opaque ID
 * @param {string} req.params.commentId - Comment's opaque ID
 * @param {Object} req.user - Authenticated user (from auth middleware)
 * @param {string} req.user.id - User's MongoDB ObjectId
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function removeCommentFromCircle(req, res, next) {
  try {
    // Get user ID from authenticated request
    const userId = req.user?.id;

    if (!userId) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      error.code = 'AUTHENTICATION_REQUIRED';
      error.userMessage = 'You must be logged in to perform this action';
      throw error;
    }

    const { id: circleId, commentId } = req.params;

    // Call service layer
    const result = await circleService.removeComment(userId, circleId, commentId);

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
 * Get all circle topic posts (up to 3)
 * GET /api/circles/:id/topics
 */
export async function getTopicPosts(req, res, next) {
  try {
    const { id: circleId } = req.params;

    // Call service layer
    const topicPosts = await circleService.getCircleTopicPosts(circleId);

    if (!topicPosts || topicPosts.length === 0) {
      return res.status(200).json(
        createSuccessResponse(
          [],
          'No topic posts found for this circle'
        )
      );
    }

    // Format response (include user reactions if authenticated)
    const userId = req.user?.id;
    const formattedPosts = topicPosts.map(topicPost => {
      const userReactions = userId
        ? topicPost.userReactions
            .filter(r => r.userId.toString() === userId.toString())
            .map(r => r.type)
        : [];

      return {
        id: topicPost._id.toString(),
        room: topicPost.room,
        circles: topicPost.circles || [],
        category: topicPost.category,
        title: topicPost.title,
        content: topicPost.contentSanitized || topicPost.content,
        reactions: topicPost.reactions,
        userReactions,
        commentCount: topicPost.commentCount,
        climbState: topicPost.climbState,
        isCircleTopic: topicPost.isCircleTopic,
        circleTopicSetAt: topicPost.circleTopicSetAt,
        createdAt: topicPost.createdAt,
        updatedAt: topicPost.updatedAt
      };
    });

    res.status(200).json(
      createSuccessResponse(
        formattedPosts,
        'Topic posts retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Get circle topic post (legacy - returns most recent)
 * GET /api/circles/:id/topic
 */
export async function getTopicPost(req, res, next) {
  try {
    const { id: circleId } = req.params;

    // Call service layer
    const topicPost = await circleService.getCircleTopicPost(circleId);

    if (!topicPost) {
      return res.status(404).json(
        createErrorResponse(
          'No topic post found for this circle',
          404,
          'NO_TOPIC_POST'
        )
      );
    }

    // Format response (include user reactions if authenticated)
    const userId = req.user?.id;
    const userReactions = userId
      ? topicPost.userReactions
          .filter(r => r.userId.toString() === userId.toString())
          .map(r => r.type)
      : [];

    const formattedPost = {
      id: topicPost._id.toString(),
      room: topicPost.room,
      circles: topicPost.circles || [],
      category: topicPost.category,
      title: topicPost.title,
      content: topicPost.contentSanitized || topicPost.content,
      reactions: topicPost.reactions,
      userReactions,
      commentCount: topicPost.commentCount,
      climbState: topicPost.climbState,
      isCircleTopic: topicPost.isCircleTopic,
      circleTopicSetAt: topicPost.circleTopicSetAt,
      createdAt: topicPost.createdAt,
      updatedAt: topicPost.updatedAt
    };

    res.status(200).json(
      createSuccessResponse(
        formattedPost,
        'Topic post retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Set a post as circle topic
 * POST /api/circles/:id/topic/:postId
 */
export async function setTopicPost(req, res, next) {
  try {
    const { id: circleId, postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json(
        createErrorResponse(
          'Authentication required',
          401,
          'AUTHENTICATION_REQUIRED'
        )
      );
    }

    // Call service layer
    const updatedPost = await circleService.setCircleTopicPost(userId, circleId, postId);

    res.status(200).json(
      createSuccessResponse(
        { postId: updatedPost._id.toString() },
        'Topic post set successfully'
      )
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Remove circle topic post
 * DELETE /api/circles/:id/topic
 */
export async function removeTopicPost(req, res, next) {
  try {
    const { id: circleId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json(
        createErrorResponse(
          'Authentication required',
          401,
          'AUTHENTICATION_REQUIRED'
        )
      );
    }

    // Call service layer
    const result = await circleService.removeCircleTopicPost(userId, circleId);

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
