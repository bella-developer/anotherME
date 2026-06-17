import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as postService from './post.service.js';
import Post from '../models/Post.model.js';
import Circle from '../models/Circle.model.js';
import User from '../models/User.model.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { generateOpaqueId } from '../utils/id.utils.js';

// Load environment variables for tests
dotenv.config();

/**
 * Post Service Tests
 * Tests core post functionality
 */

describe('Post Service', () => {
  let testUser;
  let testCircle;
  let testCircleOpaqueId;

  before(async () => {
    // Connect to test database
    await connectDatabase();
  });

  after(async () => {
    // Disconnect from test database
    await disconnectDatabase();
  });

  beforeEach(async () => {
    // Clear collections before each test
    await Post.deleteMany({});
    await Circle.deleteMany({});
    await User.deleteMany({});

    // Create test user
    testUser = await User.create({
      username: 'postservicetest123',
      password: '$2b$10$test.hash.here',
      tokenVersion: 0
    });

    // Create test circle
    testCircle = await Circle.create({
      name: 'Test Circle',
      description: 'A test circle for testing',
      creatorId: testUser._id,
      visibility: 'public',
      categories: ['life', 'thoughts']
    });

    testCircleOpaqueId = generateOpaqueId(testCircle._id.toString());
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      const postData = {
        content: 'This is a test post with enough content to pass validation.',
        circleId: testCircleOpaqueId,
        category: 'life'
      };

      const post = await postService.createPost(postData, testUser._id);

      assert.ok(post);
      assert.strictEqual(post.content, postData.content);
      assert.strictEqual(post.category, 'life');
      assert.strictEqual(post.authorId.toString(), testUser._id.toString());
      assert.strictEqual(post.circleId.toString(), testCircle._id.toString());
      assert.ok(post.contentSanitized);
    });

    it('should reject post with invalid circle ID', async () => {
      const postData = {
        content: 'This is a test post with enough content.',
        circleId: 'invalid-opaque-id',
        category: 'life'
      };

      await assert.rejects(
        async () => await postService.createPost(postData, testUser._id),
        {
          code: 'INVALID_CIRCLE_ID'
        }
      );
    });

    it('should reject post with non-existent circle', async () => {
      const fakeCircleId = generateOpaqueId(new mongoose.Types.ObjectId().toString());
      const postData = {
        content: 'This is a test post with enough content.',
        circleId: fakeCircleId,
        category: 'life'
      };

      await assert.rejects(
        async () => await postService.createPost(postData, testUser._id),
        (error) => {
          assert.strictEqual(error.statusCode, 404);
          assert.strictEqual(error.code, 'CIRCLE_NOT_FOUND');
          return true;
        }
      );
    });
  });

  describe('listPosts', () => {
    it('should list posts with pagination', async () => {
      // Create multiple posts
      for (let i = 0; i < 5; i++) {
        await Post.create({
          authorId: testUser._id,
          circleId: testCircle._id,
          category: 'life',
          content: `Test post ${i}`,
          contentSanitized: `Test post ${i}`,
          reactions: { like: 0, support: 0, insightful: 0 },
          userReactions: [],
          commentCount: 0,
          isHidden: false
        });
      }

      const result = await postService.listPosts({ limit: 3 });

      assert.strictEqual(result.posts.length, 3);
      assert.strictEqual(result.pagination.hasMore, true);
      assert.ok(result.pagination.cursor);
    });

    it('should filter posts by category', async () => {
      await Post.create({
        authorId: testUser._id,
        circleId: testCircle._id,
        category: 'life',
        content: 'Life post content',
        contentSanitized: 'Life post content',
        reactions: { like: 0, support: 0, insightful: 0 },
        userReactions: [],
        commentCount: 0,
        isHidden: false
      });

      await Post.create({
        authorId: testUser._id,
        circleId: testCircle._id,
        category: 'thoughts',
        content: 'Thoughts post',
        contentSanitized: 'Thoughts post',
        reactions: { like: 0, support: 0, insightful: 0 },
        userReactions: [],
        commentCount: 0,
        isHidden: false
      });

      const result = await postService.listPosts({ category: 'life' });

      assert.strictEqual(result.posts.length, 1);
      assert.strictEqual(result.posts[0].category, 'life');
    });

    it('should not return hidden posts', async () => {
      await Post.create({
        authorId: testUser._id,
        circleId: testCircle._id,
        category: 'life',
        content: 'Visible post',
        contentSanitized: 'Visible post',
        reactions: { like: 0, support: 0, insightful: 0 },
        userReactions: [],
        commentCount: 0,
        isHidden: false
      });

      await Post.create({
        authorId: testUser._id,
        circleId: testCircle._id,
        category: 'life',
        content: 'Hidden post',
        contentSanitized: 'Hidden post',
        reactions: { like: 0, support: 0, insightful: 0 },
        userReactions: [],
        commentCount: 0,
        isHidden: true
      });

      const result = await postService.listPosts({});

      assert.strictEqual(result.posts.length, 1);
      assert.strictEqual(result.posts[0].content, 'Visible post');
    });
  });

  describe('getPostById', () => {
    it('should get a post by ID', async () => {
      const createdPost = await Post.create({
        authorId: testUser._id,
        circleId: testCircle._id,
        category: 'life',
        content: 'Test post content',
        contentSanitized: 'Test post content',
        reactions: { like: 0, support: 0, insightful: 0 },
        userReactions: [],
        commentCount: 0,
        isHidden: false
      });

      const opaqueId = generateOpaqueId(createdPost._id.toString());
      const post = await postService.getPostById(opaqueId);

      assert.ok(post);
      assert.strictEqual(post._id.toString(), createdPost._id.toString());
    });

    it('should reject invalid post ID', async () => {
      await assert.rejects(
        async () => await postService.getPostById('invalid-id'),
        (error) => {
          assert.strictEqual(error.statusCode, 400);
          return true;
        }
      );
    });

    it('should not return hidden posts', async () => {
      const createdPost = await Post.create({
        authorId: testUser._id,
        circleId: testCircle._id,
        category: 'life',
        content: 'Hidden post',
        contentSanitized: 'Hidden post',
        reactions: { like: 0, support: 0, insightful: 0 },
        userReactions: [],
        commentCount: 0,
        isHidden: true
      });

      const opaqueId = generateOpaqueId(createdPost._id.toString());

      await assert.rejects(
        async () => await postService.getPostById(opaqueId),
        (error) => {
          assert.strictEqual(error.statusCode, 404);
          return true;
        }
      );
    });
  });

  describe('updatePost', () => {
    it('should update post content', async () => {
      const createdPost = await Post.create({
        authorId: testUser._id,
        circleId: testCircle._id,
        category: 'life',
        content: 'Original content',
        contentSanitized: 'Original content',
        reactions: { like: 0, support: 0, insightful: 0 },
        userReactions: [],
        commentCount: 0,
        isHidden: false
      });

      const opaqueId = generateOpaqueId(createdPost._id.toString());
      const updatedPost = await postService.updatePost(
        opaqueId,
        { content: 'Updated content with enough characters' },
        testUser._id
      );

      assert.strictEqual(updatedPost.content, 'Updated content with enough characters');
      assert.ok(updatedPost.contentSanitized);
    });

    it('should reject update from non-owner', async () => {
      const otherUser = await User.create({
        username: 'otheruserpost456',
        password: '$2b$10$test.hash.here',
        tokenVersion: 0
      });

      const createdPost = await Post.create({
        authorId: testUser._id,
        circleId: testCircle._id,
        category: 'life',
        content: 'Original content',
        contentSanitized: 'Original content',
        reactions: { like: 0, support: 0, insightful: 0 },
        userReactions: [],
        commentCount: 0,
        isHidden: false
      });

      const opaqueId = generateOpaqueId(createdPost._id.toString());

      await assert.rejects(
        async () => await postService.updatePost(
          opaqueId,
          { content: 'Unauthorized update' },
          otherUser._id
        ),
        (error) => {
          assert.strictEqual(error.statusCode, 403);
          return true;
        }
      );
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      const createdPost = await Post.create({
        authorId: testUser._id,
        circleId: testCircle._id,
        category: 'life',
        content: 'Post to delete',
        contentSanitized: 'Post to delete',
        reactions: { like: 0, support: 0, insightful: 0 },
        userReactions: [],
        commentCount: 0,
        isHidden: false
      });

      const opaqueId = generateOpaqueId(createdPost._id.toString());
      await postService.deletePost(opaqueId, testUser._id);

      const deletedPost = await Post.findById(createdPost._id);
      assert.strictEqual(deletedPost, null);
    });

    it('should reject delete from non-owner', async () => {
      const otherUser = await User.create({
        username: 'otheruserdelete789',
        password: '$2b$10$test.hash.here',
        tokenVersion: 0
      });

      const createdPost = await Post.create({
        authorId: testUser._id,
        circleId: testCircle._id,
        category: 'life',
        content: 'Post to delete',
        contentSanitized: 'Post to delete',
        reactions: { like: 0, support: 0, insightful: 0 },
        userReactions: [],
        commentCount: 0,
        isHidden: false
      });

      const opaqueId = generateOpaqueId(createdPost._id.toString());

      await assert.rejects(
        async () => await postService.deletePost(opaqueId, otherUser._id),
        (error) => {
          assert.strictEqual(error.statusCode, 403);
          return true;
        }
      );
    });
  });

  describe('addReaction', () => {
    it('should add a reaction to a post', async () => {
      const createdPost = await Post.create({
        authorId: testUser._id,
        circleId: testCircle._id,
        category: 'life',
        content: 'Post for reactions',
        contentSanitized: 'Post for reactions',
        reactions: { like: 0, support: 0, insightful: 0 },
        userReactions: [],
        commentCount: 0,
        isHidden: false
      });

      const opaqueId = generateOpaqueId(createdPost._id.toString());
      const updatedPost = await postService.addReaction(opaqueId, 'like', testUser._id);

      assert.strictEqual(updatedPost.reactions.like, 1);
      assert.strictEqual(updatedPost.userReactions.length, 1);
    });

    it('should reject duplicate reactions', async () => {
      const createdPost = await Post.create({
        authorId: testUser._id,
        circleId: testCircle._id,
        category: 'life',
        content: 'Post for reactions',
        contentSanitized: 'Post for reactions',
        reactions: { like: 1, support: 0, insightful: 0 },
        userReactions: [{ userId: testUser._id, type: 'like' }],
        commentCount: 0,
        isHidden: false
      });

      const opaqueId = generateOpaqueId(createdPost._id.toString());

      await assert.rejects(
        async () => await postService.addReaction(opaqueId, 'like', testUser._id),
        (error) => {
          assert.strictEqual(error.statusCode, 400);
          assert.strictEqual(error.code, 'REACTION_ALREADY_EXISTS');
          return true;
        }
      );
    });
  });

  describe('removeReaction', () => {
    it('should remove a reaction from a post', async () => {
      const createdPost = await Post.create({
        authorId: testUser._id,
        circleId: testCircle._id,
        category: 'life',
        content: 'Post for reactions',
        contentSanitized: 'Post for reactions',
        reactions: { like: 1, support: 0, insightful: 0 },
        userReactions: [{ userId: testUser._id, type: 'like' }],
        commentCount: 0,
        isHidden: false
      });

      const opaqueId = generateOpaqueId(createdPost._id.toString());
      const updatedPost = await postService.removeReaction(opaqueId, 'like', testUser._id);

      assert.strictEqual(updatedPost.reactions.like, 0);
      assert.strictEqual(updatedPost.userReactions.length, 0);
    });

    it('should reject removing non-existent reaction', async () => {
      const createdPost = await Post.create({
        authorId: testUser._id,
        circleId: testCircle._id,
        category: 'life',
        content: 'Post for reactions',
        contentSanitized: 'Post for reactions',
        reactions: { like: 0, support: 0, insightful: 0 },
        userReactions: [],
        commentCount: 0,
        isHidden: false
      });

      const opaqueId = generateOpaqueId(createdPost._id.toString());

      await assert.rejects(
        async () => await postService.removeReaction(opaqueId, 'like', testUser._id),
        (error) => {
          assert.strictEqual(error.statusCode, 400);
          assert.strictEqual(error.code, 'REACTION_NOT_FOUND');
          return true;
        }
      );
    });
  });
});
