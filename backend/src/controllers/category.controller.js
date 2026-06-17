import * as categoryService from '../services/category.service.js';
import { sanitizePost, createPaginatedResponse, createSuccessResponse } from '../utils/response.utils.js';

/**
 * Category Controller
 * HTTP request/response handling for category endpoints
 * Implements Requirements: 7.1, 7.2, 7.3, 7.6
 */

/**
 * List all available categories
 * GET /api/categories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export async function listCategories(req, res, next) {
  try {
    // Get categories via service
    const categories = await categoryService.listCategories();

    res.status(200).json(createSuccessResponse({ categories }));
  } catch (error) {
    next(error);
  }
}

/**
 * Get posts by category with pagination
 * GET /api/categories/:name/posts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export async function getPostsByCategory(req, res, next) {
  try {
    const { name } = req.params;
    const { cursor, limit } = req.query;

    // Build options
    const options = {
      cursor,
      limit: limit ? parseInt(limit, 10) : 20
    };

    // Get posts via service
    const result = await categoryService.getPostsByCategory(name, options);

    // Create paginated response with sanitized posts
    const response = createPaginatedResponse(
      result.posts,
      sanitizePost,
      result.pagination
    );

    // Add category metadata
    response.category = result.category;

    res.status(200).json(createSuccessResponse(response));
  } catch (error) {
    next(error);
  }
}

