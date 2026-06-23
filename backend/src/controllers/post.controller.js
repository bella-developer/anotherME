import * as postService from '../services/post.service.js';
import { sanitizePost, createPaginatedResponse, createSuccessResponse } from '../utils/response.utils.js';
import { uploadImage } from '../services/cloudinary.service.js';

/**
 * Post Controller
 * HTTP request/response handling for post endpoints
 * Implements Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 6.1, 6.2, 6.3
 */

/**
 * Create a new post
 * POST /api/posts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export async function createPost(req, res, next) {
  try {
    const { content, room, title, circleId, category } = req.body;
    const authorId = req.user.id;

    // Handle image upload if present
    let imageData = null;
    if (req.file) {
      try {
        imageData = await uploadImage(req.file.buffer, 'eso/posts');
      } catch (uploadError) {
        console.error('[Upload Error]', uploadError);
        const err = new Error('Failed to upload image');
        err.statusCode = 500;
        err.code = 'IMAGE_UPLOAD_FAILED';
        throw err;
      }
    }

    // Create post via service
    const post = await postService.createPost(
      { content, room, title, circleId, category, imageData },
      authorId
    );

    // Sanitize response
    const sanitized = sanitizePost(post);

    res.status(201).json(createSuccessResponse(sanitized, 'Post created successfully'));
  } catch (error) {
    next(error);
  }
}

/**
 * List posts with pagination and filters
 * GET /api/posts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export async function listPosts(req, res, next) {
  try {
    const { cursor, limit, room, circleId, category } = req.query;

    // Build options
    const options = {
      cursor,
      limit: limit ? parseInt(limit, 10) : 20,
      room,
      circleId,
      category
    };

    // Get posts via service
    const result = await postService.listPosts(options);

    // Get current user ID if authenticated
    const userId = req.user?.id;

    // Create paginated response
    const response = createPaginatedResponse(
      result.posts,
      (post) => sanitizePost(post, { includeCircleName: true, userId }),
      result.pagination
    );

    res.status(200).json(createSuccessResponse(response));
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single post by ID
 * GET /api/posts/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export async function getPostById(req, res, next) {
  try {
    const { id } = req.params;

    // Get post via service
    const post = await postService.getPostById(id);

    // Get current user ID if authenticated
    const userId = req.user?.id;

    // Sanitize response with circle name included
    const sanitized = sanitizePost(post, { includeCircleName: true, userId });

    res.status(200).json(createSuccessResponse(sanitized));
  } catch (error) {
    next(error);
  }
}

/**
 * Update a post
 * PATCH /api/posts/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export async function updatePost(req, res, next) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Update post via service (ownership verified in service)
    const post = await postService.updatePost(id, { content }, userId);

    // Sanitize response
    const sanitized = sanitizePost(post);

    res.status(200).json(createSuccessResponse(sanitized, 'Post updated successfully'));
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a post
 * DELETE /api/posts/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export async function deletePost(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Delete post via service (ownership verified in service)
    await postService.deletePost(id, userId);

    res.status(200).json(createSuccessResponse(null, 'Post deleted successfully'));
  } catch (error) {
    next(error);
  }
}

/**
 * Add a reaction to a post
 * POST /api/posts/:id/reactions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export async function addReaction(req, res, next) {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    // Add reaction via service (atomic operation)
    const post = await postService.addReaction(id, type, userId);

    // Sanitize response with userId to include userReactions
    const sanitized = sanitizePost(post, { userId });

    res.status(200).json(createSuccessResponse(sanitized, 'Reaction added successfully'));
  } catch (error) {
    next(error);
  }
}

/**
 * Remove a reaction from a post
 * DELETE /api/posts/:id/reactions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export async function removeReaction(req, res, next) {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    // Remove reaction via service (atomic operation)
    const post = await postService.removeReaction(id, type, userId);

    // Sanitize response with userId to include userReactions
    const sanitized = sanitizePost(post, { userId });

    res.status(200).json(createSuccessResponse(sanitized, 'Reaction removed successfully'));
  } catch (error) {
    next(error);
  }
}
