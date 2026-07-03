import User from '../models/User.model.js';

/**
 * User Service
 * Handles user profile retrieval and updates
 * Implements Requirement: 1.3
 */

/**
 * Get current user profile
 * Returns user data without sensitive fields
 * 
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {Promise<Object>} User profile data
 * @throws {Error} If user not found
 */
export async function getCurrentUser(userId) {
  if (!userId) {
    const error = new Error('User ID is required');
    error.statusCode = 401;
    error.code = 'MISSING_USER_ID';
    error.userMessage = 'Authentication required';
    throw error;
  }
  
  // Fetch user from database
  const user = await User.findById(userId);
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    error.userMessage = 'User account not found';
    throw error;
  }
  
  // Return sanitized user data
  return {
    username: user.username,
    fullName: user.fullName,
    age: user.age,
    gender: user.gender,
    createdAt: user.createdAt
  };
}

/**
 * Update user profile (optional demographics only)
 * Validates that no PII fields are provided
 * Only allows updating fullName, age and gender
 * 
 * @param {string} userId - User's MongoDB ObjectId
 * @param {Object} updateData - Update data
 * @param {string} updateData.fullName - Optional display name
 * @param {number} updateData.age - Optional age (18-100)
 * @param {string} updateData.gender - Optional gender
 * @returns {Promise<Object>} Updated user profile data
 * @throws {Error} If user not found or PII fields provided
 */
export async function updateUser(userId, updateData = {}) {
  if (!userId) {
    const error = new Error('User ID is required');
    error.statusCode = 401;
    error.code = 'MISSING_USER_ID';
    error.userMessage = 'Authentication required';
    throw error;
  }
  
  // Validate that no PII fields are present
  const piiFields = ['email', 'phone', 'realName', 'firstName', 'lastName'];
  const hasPII = piiFields.some(field => updateData[field] !== undefined);
  
  if (hasPII) {
    const error = new Error('PII fields are not allowed');
    error.statusCode = 400;
    error.code = 'PII_NOT_ALLOWED';
    error.userMessage = 'Personal information cannot be stored';
    throw error;
  }
  
  // Fetch user from database
  const user = await User.findById(userId);
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    error.userMessage = 'User account not found';
    throw error;
  }
  
  // Only update allowed fields (fullName, age, and gender)
  const allowedFields = ['fullName', 'age', 'gender'];
  const updates = {};
  
  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      updates[field] = updateData[field];
    }
  });
  
  // If no valid updates, return current user data
  if (Object.keys(updates).length === 0) {
    return {
      username: user.username,
      fullName: user.fullName,
      age: user.age,
      gender: user.gender,
      createdAt: user.createdAt
    };
  }
  
  // Apply updates
  Object.assign(user, updates);
  
  // Save updated user
  try {
    await user.save();
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const err = new Error('Validation failed');
      err.statusCode = 400;
      err.code = 'VALIDATION_ERROR';
      err.userMessage = 'Invalid user data provided';
      err.validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      throw err;
    }
    throw error;
  }
  
  // Return updated user data
  return {
    username: user.username,
    fullName: user.fullName,
    age: user.age,
    gender: user.gender,
    createdAt: user.createdAt
  };
}
