import Post from '../models/Post.model.js';

/**
 * Category Service
 * Business logic for category-based content feeds
 * Implements Requirements: 7.1, 7.2, 7.3, 7.5, 7.6
 */

// Define available categories
const CATEGORIES = [
  { name: 'life', description: 'Life experiences and daily moments' },
  { name: 'thoughts', description: 'Deep thoughts and reflections' },
  { name: 'questions', description: 'Questions and seeking advice' },
  { name: 'stories', description: 'Personal stories and narratives' },
  { name: 'advice', description: 'Advice and guidance for others' },
  { name: 'other', description: 'Other topics and discussions' }
];

/**
 * List all available categories
 * @returns {Promise<Array>} Array of category objects
 */
export async function listCategories() {
  // Return static list of categories with post counts
  const categoriesWithCounts = await Promise.all(
    CATEGORIES.map(async (category) => {
      const count = await Post.countDocuments({
        category: category.name,
        isHidden: false
      });
      
      return {
        name: category.name,
        description: category.description,
        postCount: count
      };
    })
  );

  return categoriesWithCounts;
}

/**
 * Get posts by category with cursor-based pagination
 * @param {string} categoryName - Category name to filter by
 * @param {Object} options - Query options
 * @param {string} options.cursor - Opaque cursor for pagination
 * @param {number} options.limit - Number of posts to return (default: 20, max: 20)
 * @returns {Promise<Object>} Posts and pagination metadata
 * @throws {Error} If category is invalid
 */
export async function getPostsByCategory(categoryName, options = {}) {
  // Validate category exists
  const validCategory = CATEGORIES.find(c => c.name === categoryName);
  if (!validCategory) {
    const err = new Error('Invalid category');
    err.statusCode = 400;
    err.code = 'INVALID_CATEGORY';
    throw err;
  }

  // Enforce maximum limit of 20 posts per page (Requirement 7.6)
  const limit = Math.min(options.limit || 20, 20);
  
  const query = {
    category: categoryName,
    isHidden: false // Never show hidden posts
  };

  // Handle cursor pagination
  if (options.cursor) {
    try {
      const cursorDate = new Date(Buffer.from(options.cursor, 'base64url').toString('utf-8'));
      query.createdAt = { $lt: cursorDate };
    } catch (error) {
      const err = new Error('Invalid cursor');
      err.statusCode = 400;
      err.code = 'INVALID_CURSOR';
      throw err;
    }
  }

  // Fetch posts ordered by creation timestamp (newest first) - Requirement 7.3
  // Use indexed query (category + createdAt compound index) - Requirement 7.4
  const posts = await Post.find(query)
    .sort({ createdAt: -1 }) // Newest first
    .limit(limit + 1) // Fetch one extra to check if more exist
    .lean();

  // Check if more results exist
  const hasMore = posts.length > limit;
  if (hasMore) {
    posts.pop(); // Remove extra post
  }

  // Generate next cursor
  let nextCursor = null;
  if (hasMore && posts.length > 0) {
    const lastPost = posts[posts.length - 1];
    nextCursor = Buffer.from(lastPost.createdAt.toISOString()).toString('base64url');
  }

  return {
    posts,
    category: validCategory,
    pagination: {
      cursor: nextCursor,
      hasMore,
      limit
    }
  };
}

/**
 * Get category by name
 * @param {string} categoryName - Category name
 * @returns {Object|null} Category object or null if not found
 */
export function getCategoryByName(categoryName) {
  return CATEGORIES.find(c => c.name === categoryName) || null;
}

