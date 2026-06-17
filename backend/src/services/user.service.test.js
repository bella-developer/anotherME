import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as userService from './user.service.js';
import * as authService from './auth.service.js';
import User from '../models/User.model.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';

// Load environment variables for tests
dotenv.config();

/**
 * User Service Tests
 * Tests user profile retrieval and update functionality
 * Implements Requirement: 1.3
 */

describe('User Service', () => {
  let testUserId;
  let testUser;

  before(async () => {
    // Connect to test database
    await connectDatabase();
    
    // Clean up any existing test data
    await User.deleteMany({});
    
    // Wait a bit to ensure database is clean
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Create test user with retry logic
    let attempts = 0;
    const maxAttempts = 5;
    while (attempts < maxAttempts) {
      try {
        const registerResult = await authService.register({
          username: 'userservicetest123',
          password: 'Test123!@#',
          age: 25,
          gender: 'male'
        });
        
        testUser = await User.findOne({ username: registerResult.user.username });
        testUserId = testUser._id.toString();
        break; // Success, exit loop
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw error; // Give up after max attempts
        }
        console.log(`User Service test setup: Retrying user creation (attempt ${attempts}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait before retry
      }
    }
  });

  after(async () => {
    // Clean up test data
    await User.deleteMany({});
    // Close database connection
    await disconnectDatabase();
  });

  describe('getCurrentUser', () => {
    it('should get current user profile', async () => {
      const result = await userService.getCurrentUser(testUserId);
      
      assert.ok(result);
      assert.ok(result.username);
      assert.strictEqual(result.age, 25);
      assert.strictEqual(result.gender, 'male');
      assert.ok(result.createdAt);
      
      // Should not expose sensitive fields
      assert.strictEqual(result._id, undefined);
      assert.strictEqual(result.password, undefined);
      assert.strictEqual(result.tokenVersion, undefined);
      assert.strictEqual(result.isBanned, undefined);
      assert.strictEqual(result.banExpiresAt, undefined);
    });

    it('should reject with missing user ID', async () => {
      await assert.rejects(
        async () => {
          await userService.getCurrentUser(null);
        },
        {
          message: 'User ID is required'
        }
      );
    });

    it('should reject with invalid user ID', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await assert.rejects(
        async () => {
          await userService.getCurrentUser(fakeId);
        },
        {
          message: 'User not found'
        }
      );
    });
  });

  describe('updateUser', () => {
    it('should update user age', async () => {
      const result = await userService.updateUser(testUserId, {
        age: 30
      });
      
      assert.strictEqual(result.age, 30);
      assert.strictEqual(result.gender, 'male'); // Should remain unchanged
      
      // Verify in database
      const updatedUser = await User.findById(testUserId);
      assert.strictEqual(updatedUser.age, 30);
    });

    it('should update user gender', async () => {
      const result = await userService.updateUser(testUserId, {
        gender: 'female'
      });
      
      assert.strictEqual(result.gender, 'female');
      
      // Verify in database
      const updatedUser = await User.findById(testUserId);
      assert.strictEqual(updatedUser.gender, 'female');
    });

    it('should update both age and gender', async () => {
      const result = await userService.updateUser(testUserId, {
        age: 35,
        gender: 'other'
      });
      
      assert.strictEqual(result.age, 35);
      assert.strictEqual(result.gender, 'other');
    });

    it('should reject PII fields - email', async () => {
      await assert.rejects(
        async () => {
          await userService.updateUser(testUserId, {
            email: 'test@example.com'
          });
        },
        {
          message: 'PII fields are not allowed'
        }
      );
    });

    it('should reject PII fields - phone', async () => {
      await assert.rejects(
        async () => {
          await userService.updateUser(testUserId, {
            phone: '1234567890'
          });
        },
        {
          message: 'PII fields are not allowed'
        }
      );
    });

    it('should reject PII fields - name', async () => {
      await assert.rejects(
        async () => {
          await userService.updateUser(testUserId, {
            name: 'John Doe'
          });
        },
        {
          message: 'PII fields are not allowed'
        }
      );
    });

    it('should reject alias modification', async () => {
      await assert.rejects(
        async () => {
          await userService.updateUser(testUserId, {
            username: 'newusername123'
          });
        },
        {
          message: 'Username cannot be modified'
        }
      );
    });

    it('should return current data when no valid updates provided', async () => {
      const result = await userService.updateUser(testUserId, {});
      
      assert.ok(result);
      assert.ok(result.username);
      assert.ok(result.createdAt);
    });

    it('should reject with missing user ID', async () => {
      await assert.rejects(
        async () => {
          await userService.updateUser(null, { age: 25 });
        },
        {
          message: 'User ID is required'
        }
      );
    });

    it('should reject with invalid user ID', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await assert.rejects(
        async () => {
          await userService.updateUser(fakeId, { age: 25 });
        },
        {
          message: 'User not found'
        }
      );
    });

    it('should handle validation errors for invalid age', async () => {
      await assert.rejects(
        async () => {
          await userService.updateUser(testUserId, {
            age: 150 // Invalid age
          });
        },
        {
          message: 'Validation failed'
        }
      );
    });

    it('should handle validation errors for invalid gender', async () => {
      await assert.rejects(
        async () => {
          await userService.updateUser(testUserId, {
            gender: 'invalid-gender'
          });
        },
        {
          message: 'Validation failed'
        }
      );
    });
  });
});
