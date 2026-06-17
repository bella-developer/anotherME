import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as authService from './auth.service.js';
import User from '../models/User.model.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';

// Load environment variables for tests
dotenv.config();

/**
 * Authentication Service Tests
 * Tests core authentication functionality
 */

describe('Authentication Service', () => {
  before(async () => {
    // Connect to test database
    await connectDatabase();
    
    // Clean up any existing test data
    await User.deleteMany({});
  });

  after(async () => {
    // Clean up test data
    await User.deleteMany({});
    // Close database connection
    await disconnectDatabase();
  });

  describe('register', () => {
    it('should register a new user with username', async () => {
      const result = await authService.register({ username: 'testuser123', password: 'Test123!@#' });
      
      assert.ok(result.user);
      assert.ok(result.accessToken);
      assert.ok(result.refreshToken);
      
      assert.ok(result.user.username);
      assert.strictEqual(result.user.username, 'testuser123');
      assert.ok(result.user.createdAt);
      
      assert.strictEqual(typeof result.accessToken, 'string');
      assert.strictEqual(typeof result.refreshToken, 'string');
    });

    it('should register a user with optional demographics', async () => {
      const result = await authService.register({
        username: 'demouser123',
        password: 'Test123!@#',
        age: 25,
        gender: 'male'
      });
      
      assert.strictEqual(result.user.age, 25);
      assert.strictEqual(result.user.gender, 'male');
    });

    it('should reject registration with PII fields', async () => {
      await assert.rejects(
        async () => {
          await authService.register({
            username: 'piitest123',
            password: 'Test123!@#',
            email: 'test@example.com'
          });
        },
        {
          message: 'PII fields are not allowed'
        }
      );
    });

    it('should reject registration with name fields', async () => {
      await assert.rejects(
        async () => {
          await authService.register({
            username: 'nametest123',
            password: 'Test123!@#',
            name: 'John Doe'
          });
        },
        {
          message: 'PII fields are not allowed'
        }
      );
    });
  });

  describe('refresh', () => {
    it('should refresh tokens with valid refresh token', async () => {
      // First register a user
      const registerResult = await authService.register({ username: 'refreshtest123', password: 'Test123!@#' });
      const { refreshToken } = registerResult;
      
      // Then refresh the token
      const refreshResult = await authService.refresh(refreshToken);
      
      assert.ok(refreshResult.accessToken);
      assert.ok(refreshResult.refreshToken);
      assert.strictEqual(typeof refreshResult.accessToken, 'string');
      assert.strictEqual(typeof refreshResult.refreshToken, 'string');
      
      // New tokens should be different from original
      assert.notStrictEqual(refreshResult.refreshToken, refreshToken);
    });

    it('should reject refresh with invalid token', async () => {
      await assert.rejects(
        async () => {
          await authService.refresh('invalid-token');
        }
      );
    });

    it('should reject refresh with missing token', async () => {
      await assert.rejects(
        async () => {
          await authService.refresh(null);
        },
        {
          message: 'Refresh token is required'
        }
      );
    });

    it('should reject reuse of old refresh token (rotation)', async () => {
      // Register a user
      const registerResult = await authService.register({ username: 'rotatetest123', password: 'Test123!@#' });
      const { refreshToken } = registerResult;
      
      // Refresh once (this rotates the token)
      await authService.refresh(refreshToken);
      
      // Try to use the old token again - should fail
      await assert.rejects(
        async () => {
          await authService.refresh(refreshToken);
        },
        {
          message: 'Token has been invalidated'
        }
      );
    });
  });

  describe('logout', () => {
    it('should logout user and invalidate tokens', async () => {
      // Register a user
      const registerResult = await authService.register({ username: 'logouttest123', password: 'Test123!@#' });
      const { refreshToken } = registerResult;
      
      // Get user ID from database
      const user = await User.findOne({ username: registerResult.user.username });
      const userId = user._id.toString();
      const oldTokenVersion = user.tokenVersion;
      
      // Logout
      const logoutResult = await authService.logout(userId);
      assert.strictEqual(logoutResult.message, 'Logged out successfully');
      
      // Verify token version was incremented
      const updatedUser = await User.findById(userId);
      assert.strictEqual(updatedUser.tokenVersion, oldTokenVersion + 1);
      
      // Try to use old refresh token - should fail
      await assert.rejects(
        async () => {
          await authService.refresh(refreshToken);
        },
        {
          message: 'Token has been invalidated'
        }
      );
    });

    it('should reject logout with missing user ID', async () => {
      await assert.rejects(
        async () => {
          await authService.logout(null);
        },
        {
          message: 'User ID is required'
        }
      );
    });

    it('should reject logout with invalid user ID', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await assert.rejects(
        async () => {
          await authService.logout(fakeId);
        },
        {
          message: 'User not found'
        }
      );
    });
  });

  describe('invalidateTokensOnAccountChange', () => {
    it('should invalidate all tokens on account change', async () => {
      // Register a user
      const registerResult = await authService.register({ username: 'invalidatetest123', password: 'Test123!@#' });
      const { refreshToken } = registerResult;
      
      // Get user ID
      const user = await User.findOne({ username: registerResult.user.username });
      const userId = user._id.toString();
      const oldTokenVersion = user.tokenVersion;
      
      // Invalidate tokens
      await authService.invalidateTokensOnAccountChange(userId);
      
      // Verify token version was incremented
      const updatedUser = await User.findById(userId);
      assert.strictEqual(updatedUser.tokenVersion, oldTokenVersion + 1);
      
      // Try to use old refresh token - should fail
      await assert.rejects(
        async () => {
          await authService.refresh(refreshToken);
        },
        {
          message: 'Token has been invalidated'
        }
      );
    });
  });
});
