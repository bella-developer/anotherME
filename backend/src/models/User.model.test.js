import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User from './User.model.js';

/**
 * Property-Based Tests for User Model
 * Feature: anonymous-social-platform, Property 34: Demographic Storage Without PII
 * Validates: Requirements 1.3
 */

let mongoServer;

before(async () => {
  // Start in-memory MongoDB server with increased timeout
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}, { timeout: 120000 }); // 120 second timeout for MongoDB startup

after(async () => {
  // Cleanup
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('User Model - Property 34: Demographic Storage Without PII', () => {
  /**
   * Property: For any user with optional demographic information (age, gender),
   * the database should store this data without any PII fields (email, phone, real name)
   * in the same document.
   */
  it('should store demographic data without PII fields', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          username: fc.string({ minLength: 3, maxLength: 30 })
            .filter(s => /^[a-zA-Z0-9_-]+$/.test(s) && s.trim().length >= 3),
          password: fc.string({ minLength: 8, maxLength: 100 }),
          age: fc.option(fc.integer({ min: 18, max: 100 }), { nil: null }),
          gender: fc.option(
            fc.constantFrom('male', 'female', 'other', 'prefer-not-to-say'),
            { nil: null }
          )
        }),
        async (userData) => {
          // Create user with demographic data
          const user = new User({
            username: userData.username,
            password: userData.password,
            age: userData.age,
            gender: userData.gender,
            tokenVersion: 0
          });

          await user.save();

          // Retrieve user from database
          const savedUser = await User.findOne({ username: userData.username }).lean();

          // Assert: User document should NOT contain PII fields
          assert.strictEqual(savedUser.email, undefined, 'User document should not have email field');
          assert.strictEqual(savedUser.phone, undefined, 'User document should not have phone field');
          assert.strictEqual(savedUser.realName, undefined, 'User document should not have realName field');
          assert.strictEqual(savedUser.firstName, undefined, 'User document should not have firstName field');
          assert.strictEqual(savedUser.lastName, undefined, 'User document should not have lastName field');
          assert.strictEqual(savedUser.address, undefined, 'User document should not have address field');

          // Assert: User document SHOULD contain demographic fields
          assert.strictEqual(savedUser.username, userData.username);
          assert.strictEqual(savedUser.age, userData.age);
          assert.strictEqual(savedUser.gender, userData.gender);

          // Assert: User document should have required security fields
          assert.strictEqual(typeof savedUser.tokenVersion, 'number');
          assert.strictEqual(typeof savedUser.isBanned, 'boolean');
          assert.ok(savedUser.createdAt instanceof Date);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject attempts to add PII fields to user schema', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          username: fc.string({ minLength: 3, maxLength: 30 })
            .filter(s => /^[a-zA-Z0-9_-]+$/.test(s) && s.trim().length >= 3),
          password: fc.string({ minLength: 8, maxLength: 100 }),
          email: fc.emailAddress(),
          phone: fc.string({ minLength: 10, maxLength: 15 }).map(s => 
            s.split('').map(c => '0123456789'[c.charCodeAt(0) % 10]).join('')
          ),
          realName: fc.string({ minLength: 3, maxLength: 50 }).filter(s => s.trim().length > 0)
        }),
        async (userData) => {
          // Attempt to create user with PII fields
          const user = new User({
            username: userData.username,
            password: userData.password,
            email: userData.email,
            phone: userData.phone,
            realName: userData.realName,
            tokenVersion: 0
          });

          await user.save();

          // Retrieve user from database
          const savedUser = await User.findOne({ username: userData.username }).lean();

          // Assert: PII fields should NOT be saved (Mongoose ignores unknown fields)
          assert.strictEqual(savedUser.email, undefined, 'Email should not be saved');
          assert.strictEqual(savedUser.phone, undefined, 'Phone should not be saved');
          assert.strictEqual(savedUser.realName, undefined, 'Real name should not be saved');

          // Assert: Only schema-defined fields should be present
          assert.strictEqual(savedUser.username, userData.username);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should allow users with only username and no demographics', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          username: fc.string({ minLength: 3, maxLength: 30 })
            .filter(s => /^[a-zA-Z0-9_-]+$/.test(s) && s.trim().length >= 3),
          password: fc.string({ minLength: 8, maxLength: 100 })
        }),
        async (userData) => {
          // Create user without demographic data
          const user = new User({
            username: userData.username,
            password: userData.password,
            tokenVersion: 0
          });

          await user.save();

          // Retrieve user from database
          const savedUser = await User.findOne({ username: userData.username }).lean();

          // Assert: User should be created successfully without demographics
          assert.strictEqual(savedUser.username, userData.username);
          assert.strictEqual(savedUser.age, null);
          assert.strictEqual(savedUser.gender, null);

          // Assert: No PII fields present
          assert.strictEqual(savedUser.email, undefined);
          assert.strictEqual(savedUser.phone, undefined);
          assert.strictEqual(savedUser.realName, undefined);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should sanitize user data in toSafeObject method', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          username: fc.string({ minLength: 3, maxLength: 30 })
            .filter(s => /^[a-zA-Z0-9_-]+$/.test(s) && s.trim().length >= 3),
          password: fc.string({ minLength: 8, maxLength: 100 }),
          age: fc.option(fc.integer({ min: 18, max: 100 }), { nil: null }),
          gender: fc.option(
            fc.constantFrom('male', 'female', 'other', 'prefer-not-to-say'),
            { nil: null }
          )
        }),
        async (userData) => {
          // Create user
          const user = new User({
            username: userData.username,
            password: userData.password,
            age: userData.age,
            gender: userData.gender,
            tokenVersion: 5,
            isBanned: true
          });

          await user.save();

          // Get safe object representation
          const safeUser = user.toSafeObject();

          // Assert: Safe object should only contain non-sensitive fields
          assert.strictEqual(safeUser.username, userData.username);
          assert.strictEqual(safeUser.age, userData.age);
          assert.strictEqual(safeUser.gender, userData.gender);
          assert.ok(safeUser.createdAt instanceof Date);

          // Assert: Safe object should NOT contain sensitive fields
          assert.strictEqual(safeUser._id, undefined);
          assert.strictEqual(safeUser.password, undefined);
          assert.strictEqual(safeUser.tokenVersion, undefined);
          assert.strictEqual(safeUser.isBanned, undefined);
          assert.strictEqual(safeUser.banExpiresAt, undefined);
        }
      ),
      { numRuns: 100 }
    );
  });
});
