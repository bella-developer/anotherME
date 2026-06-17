import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  sanitizeUser,
  sanitizePost,
  sanitizeCircle,
  sanitizeComment,
  sanitizeArray,
  createPaginatedResponse,
  createSuccessResponse,
  createErrorResponse,
  sanitizeError,
} from './response.utils.js';

describe('Response Sanitization Utilities', () => {
  describe('sanitizeUser', () => {
    it('should sanitize user data and never expose sensitive fields', () => {
      const user = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser123',
        password: '$2b$10$hashedpassword',
        age: 25,
        gender: 'other',
        tokenVersion: 5,
        isBanned: false,
        banExpiresAt: null,
        lastActive: new Date(),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      };

      const sanitized = sanitizeUser(user);

      // Should include safe fields
      assert.ok(sanitized.id);
      assert.strictEqual(sanitized.username, 'testuser123');
      assert.strictEqual(sanitized.age, 25);
      assert.strictEqual(sanitized.gender, 'other');
      assert.ok(sanitized.createdAt);

      // Should never include sensitive fields
      assert.strictEqual(sanitized._id, undefined);
      assert.strictEqual(sanitized.password, undefined);
      assert.strictEqual(sanitized.tokenVersion, undefined);
      assert.strictEqual(sanitized.isBanned, undefined);
      assert.strictEqual(sanitized.banExpiresAt, undefined);
      assert.strictEqual(sanitized.lastActive, undefined);
      assert.strictEqual(sanitized.updatedAt, undefined);
    });

    it('should handle null user', () => {
      const sanitized = sanitizeUser(null);
      assert.strictEqual(sanitized, null);
    });

    it('should handle user with null optional fields', () => {
      const user = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser123',
        password: '$2b$10$hashedpassword',
        age: null,
        gender: null,
        createdAt: new Date(),
      };

      const sanitized = sanitizeUser(user);
      assert.strictEqual(sanitized.age, null);
      assert.strictEqual(sanitized.gender, null);
    });
  });

  describe('sanitizePost', () => {
    it('should sanitize post data and never expose sensitive fields', () => {
      const post = {
        _id: '507f1f77bcf86cd799439012',
        authorId: '507f1f77bcf86cd799439011',
        circleId: '507f1f77bcf86cd799439013',
        category: 'life',
        content: 'Original content',
        contentSanitized: 'Sanitized content',
        reactions: { like: 5, support: 3, insightful: 2 },
        userReactions: [{ userId: '123', type: 'like' }],
        commentCount: 10,
        isHidden: false,
        hiddenBy: null,
        hiddenAt: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      };

      const sanitized = sanitizePost(post);

      // Should include safe fields
      assert.ok(sanitized.id);
      assert.strictEqual(sanitized.content, 'Sanitized content');
      assert.strictEqual(sanitized.category, 'life');
      assert.deepStrictEqual(sanitized.reactions, { like: 5, support: 3, insightful: 2 });
      assert.strictEqual(sanitized.commentCount, 10);
      assert.ok(sanitized.createdAt);
      assert.ok(sanitized.updatedAt);

      // Should never include sensitive fields
      assert.strictEqual(sanitized._id, undefined);
      assert.strictEqual(sanitized.authorId, undefined);
      assert.strictEqual(sanitized.circleId, undefined);
      assert.strictEqual(sanitized.userReactions, undefined);
      assert.strictEqual(sanitized.isHidden, undefined);
      assert.strictEqual(sanitized.hiddenBy, undefined);
      assert.strictEqual(sanitized.hiddenAt, undefined);
    });

    it('should handle null post', () => {
      const sanitized = sanitizePost(null);
      assert.strictEqual(sanitized, null);
    });

    it('should include author username when populated and requested', () => {
      const post = {
        _id: '507f1f77bcf86cd799439012',
        authorId: {
          _id: '507f1f77bcf86cd799439011',
          username: 'testauthor123',
        },
        contentSanitized: 'Content',
        category: 'life',
        reactions: { like: 0, support: 0, insightful: 0 },
        commentCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const sanitized = sanitizePost(post, { includeAuthorUsername: true });
      assert.ok(sanitized.author);
      assert.strictEqual(sanitized.author.username, 'testauthor123');
    });
  });

  describe('sanitizeCircle', () => {
    it('should sanitize circle data and never expose sensitive fields', () => {
      const circle = {
        _id: '507f1f77bcf86cd799439013',
        name: 'Test Circle',
        description: 'A test circle',
        creatorId: '507f1f77bcf86cd799439011',
        visibility: 'public',
        memberCount: 100,
        postCount: 50,
        categories: ['life', 'thoughts'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      };

      const sanitized = sanitizeCircle(circle);

      // Should include safe fields
      assert.ok(sanitized.id);
      assert.strictEqual(sanitized.name, 'Test Circle');
      assert.strictEqual(sanitized.description, 'A test circle');
      assert.strictEqual(sanitized.visibility, 'public');
      assert.strictEqual(sanitized.memberCount, 100);
      assert.strictEqual(sanitized.postCount, 50);
      assert.deepStrictEqual(sanitized.categories, ['life', 'thoughts']);
      assert.ok(sanitized.createdAt);
      assert.ok(sanitized.updatedAt);

      // Should never include sensitive fields
      assert.strictEqual(sanitized._id, undefined);
      assert.strictEqual(sanitized.creatorId, undefined);
    });

    it('should handle null circle', () => {
      const sanitized = sanitizeCircle(null);
      assert.strictEqual(sanitized, null);
    });
  });

  describe('sanitizeComment', () => {
    it('should sanitize comment data and never expose sensitive fields', () => {
      const comment = {
        _id: '507f1f77bcf86cd799439014',
        postId: '507f1f77bcf86cd799439012',
        authorId: '507f1f77bcf86cd799439011',
        parentId: null,
        content: 'Original comment',
        contentSanitized: 'Sanitized comment',
        depth: 0,
        isDeleted: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      };

      const sanitized = sanitizeComment(comment);

      // Should include safe fields
      assert.ok(sanitized.id);
      assert.strictEqual(sanitized.content, 'Sanitized comment');
      assert.strictEqual(sanitized.depth, 0);
      assert.strictEqual(sanitized.isDeleted, false);
      assert.ok(sanitized.createdAt);

      // Should never include sensitive fields
      assert.strictEqual(sanitized._id, undefined);
      assert.strictEqual(sanitized.postId, undefined);
      assert.strictEqual(sanitized.authorId, undefined);
      assert.strictEqual(sanitized.updatedAt, undefined);
    });

    it('should include opaque parentId when present', () => {
      const comment = {
        _id: '507f1f77bcf86cd799439014',
        parentId: '507f1f77bcf86cd799439015',
        contentSanitized: 'Reply comment',
        depth: 1,
        isDeleted: false,
        createdAt: new Date(),
      };

      const sanitized = sanitizeComment(comment);
      assert.ok(sanitized.parentId);
      // parentId should be opaque, not the raw MongoDB ID
      assert.notStrictEqual(sanitized.parentId, '507f1f77bcf86cd799439015');
    });

    it('should handle null comment', () => {
      const sanitized = sanitizeComment(null);
      assert.strictEqual(sanitized, null);
    });
  });

  describe('sanitizeArray', () => {
    it('should sanitize an array of items', () => {
      const users = [
        { _id: '507f1f77bcf86cd799439011', username: 'user1', password: 'hash1', tokenVersion: 1, createdAt: new Date() },
        { _id: '507f1f77bcf86cd799439012', username: 'user2', password: 'hash2', tokenVersion: 2, createdAt: new Date() },
      ];

      const sanitized = sanitizeArray(users, sanitizeUser);
      assert.strictEqual(sanitized.length, 2);
      assert.strictEqual(sanitized[0].username, 'user1');
      assert.strictEqual(sanitized[1].username, 'user2');
      assert.strictEqual(sanitized[0].tokenVersion, undefined);
      assert.strictEqual(sanitized[1].tokenVersion, undefined);
    });

    it('should handle empty array', () => {
      const sanitized = sanitizeArray([], sanitizeUser);
      assert.deepStrictEqual(sanitized, []);
    });

    it('should handle non-array input', () => {
      const sanitized = sanitizeArray(null, sanitizeUser);
      assert.deepStrictEqual(sanitized, []);
    });
  });

  describe('createPaginatedResponse', () => {
    it('should create a paginated response with sanitized data', () => {
      const posts = [
        {
          _id: '507f1f77bcf86cd799439012',
          contentSanitized: 'Post 1',
          category: 'life',
          reactions: { like: 1, support: 0, insightful: 0 },
          commentCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const pagination = {
        cursor: 'opaque_cursor_123',
        hasMore: true,
        total: 100,
      };

      const response = createPaginatedResponse(posts, sanitizePost, pagination);

      assert.ok(response.data);
      assert.strictEqual(response.data.length, 1);
      assert.strictEqual(response.pagination.cursor, 'opaque_cursor_123');
      assert.strictEqual(response.pagination.hasMore, true);
      assert.strictEqual(response.pagination.total, 100);
    });
  });

  describe('createSuccessResponse', () => {
    it('should create a success response', () => {
      const data = { id: '123', name: 'Test' };
      const response = createSuccessResponse(data, 'Operation successful');

      assert.strictEqual(response.status, 'success');
      assert.deepStrictEqual(response.data, data);
      assert.strictEqual(response.message, 'Operation successful');
    });

    it('should create a success response without message', () => {
      const data = { id: '123' };
      const response = createSuccessResponse(data);

      assert.strictEqual(response.status, 'success');
      assert.deepStrictEqual(response.data, data);
      assert.strictEqual(response.message, undefined);
    });
  });

  describe('createErrorResponse', () => {
    it('should create an error response', () => {
      const response = createErrorResponse('Not found', 404, 'NOT_FOUND');

      assert.strictEqual(response.status, 'error');
      assert.strictEqual(response.statusCode, 404);
      assert.strictEqual(response.message, 'Not found');
      assert.strictEqual(response.code, 'NOT_FOUND');
    });

    it('should include details when provided', () => {
      const details = { field: 'email', issue: 'invalid format' };
      const response = createErrorResponse('Validation failed', 400, 'VALIDATION_ERROR', details);

      assert.strictEqual(response.status, 'error');
      assert.deepStrictEqual(response.details, details);
    });
  });

  describe('sanitizeError', () => {
    it('should sanitize error for API response', () => {
      const error = new Error('Database connection failed');
      error.statusCode = 500;
      error.code = 'DB_ERROR';
      error.userMessage = 'An unexpected error occurred';

      const sanitized = sanitizeError(error, 'req_123');

      assert.strictEqual(sanitized.status, 'error');
      assert.strictEqual(sanitized.statusCode, 500);
      assert.strictEqual(sanitized.message, 'An unexpected error occurred');
      assert.strictEqual(sanitized.code, 'DB_ERROR');
      assert.strictEqual(sanitized.requestId, 'req_123');
    });

    it('should include stack trace in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Test error');
      error.statusCode = 500;

      const sanitized = sanitizeError(error, 'req_123');
      assert.ok(sanitized.stack);

      process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack trace in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Test error');
      error.statusCode = 500;

      const sanitized = sanitizeError(error, 'req_123');
      assert.strictEqual(sanitized.stack, undefined);

      process.env.NODE_ENV = originalEnv;
    });

    it('should include retry-after for rate limit errors', () => {
      const error = new Error('Too many requests');
      error.statusCode = 429;
      error.retryAfter = 900;

      const sanitized = sanitizeError(error, 'req_123');
      assert.strictEqual(sanitized.retryAfter, 900);
    });
  });
});
