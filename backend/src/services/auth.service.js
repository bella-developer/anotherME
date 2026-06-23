import User from '../models/User.model.js';
import { hashPassword, verifyPassword, validatePasswordStrength, generateUsername } from '../utils/password.utils.js';
import { sendPasswordResetEmail, sendWelcomeEmail } from './email.service.js';

/**
 * Authentication Service
 * Handles user registration, login, and session management
 */

/**
 * Register a new user
 * Creates user with username, password, optional email, and optional demographics
 * 
 * @param {Object} registrationData - Registration data
 * @param {string} registrationData.username - Username for login (optional, auto-generated if not provided)
 * @param {string} registrationData.password - Password (required)
 * @param {string} registrationData.email - Email for recovery (optional)
 * @param {number} registrationData.age - Optional age (18-100)
 * @param {string} registrationData.gender - Optional gender
 * @returns {Promise<Object>} User data
 * @throws {Error} If registration fails
 */
export async function register(registrationData = {}) {
  const { username, password, email, age, gender } = registrationData;
  
  // Validate password is provided
  if (!password) {
    const error = new Error('Password is required');
    error.statusCode = 400;
    error.code = 'PASSWORD_REQUIRED';
    error.userMessage = 'Password is required for registration';
    throw error;
  }
  
  // Validate username is provided
  if (!username) {
    const error = new Error('Username is required');
    error.statusCode = 400;
    error.code = 'USERNAME_REQUIRED';
    error.userMessage = 'Username is required for registration';
    throw error;
  }
  
  // Validate email is provided
  if (!email) {
    const error = new Error('Email is required');
    error.statusCode = 400;
    error.code = 'EMAIL_REQUIRED';
    error.userMessage = 'Email is required for registration';
    throw error;
  }
  
  // Validate password strength
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.isValid) {
    const error = new Error('Password does not meet requirements');
    error.statusCode = 400;
    error.code = 'WEAK_PASSWORD';
    error.userMessage = passwordValidation.errors.join(', ');
    error.details = passwordValidation.errors;
    throw error;
  }
  
  // Validate and normalize username
  let finalUsername = username;
  if (typeof finalUsername !== 'string' || finalUsername.length < 3 || finalUsername.length > 30) {
    const error = new Error('Username must be between 3 and 30 characters');
    error.statusCode = 400;
    error.code = 'INVALID_USERNAME';
    error.userMessage = 'Username must be between 3 and 30 characters';
    throw error;
  }
  
  // Normalize username
  finalUsername = finalUsername.toLowerCase().trim();
  
  // Validate username format
  if (!/^[a-z0-9_-]+$/.test(finalUsername)) {
    const error = new Error('Username can only contain lowercase letters, numbers, underscores, and hyphens');
    error.statusCode = 400;
    error.code = 'INVALID_USERNAME_FORMAT';
    error.userMessage = 'Username can only contain lowercase letters, numbers, underscores, and hyphens';
    throw error;
  }
  
  // Check if username already exists
  const existingUser = await User.findOne({ username: finalUsername });
  if (existingUser) {
    const error = new Error('Username already taken');
    error.statusCode = 409;
    error.code = 'USERNAME_TAKEN';
    error.userMessage = 'This username is already taken. Please choose another.';
    throw error;
  }
  
  // Validate that no PII fields (except email) are present
  const piiFields = ['phone', 'name', 'realName', 'firstName', 'lastName'];
  const hasPII = piiFields.some(field => registrationData[field] !== undefined);
  
  if (hasPII) {
    const error = new Error('PII fields are not allowed');
    error.statusCode = 400;
    error.code = 'PII_NOT_ALLOWED';
    error.userMessage = 'Personal information is not allowed during registration';
    throw error;
  }

  // Validate and normalize email
  const normalizedEmail = email.toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    const error = new Error('Invalid email format');
    error.statusCode = 400;
    error.code = 'INVALID_EMAIL';
    error.userMessage = 'Please provide a valid email address';
    throw error;
  }

  // Check if email already exists
  const existingEmailUser = await User.findOne({ email: normalizedEmail });
  if (existingEmailUser) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    error.code = 'EMAIL_TAKEN';
    error.userMessage = 'This email is already registered';
    throw error;
  }

  const finalEmail = normalizedEmail;
  
  // Hash password
  const hashedPassword = await hashPassword(password);
  
  // Create user document
  const user = new User({
    username: finalUsername,
    password: hashedPassword,
    email: finalEmail,
    age: age || null,
    gender: gender || null,
    lastActive: new Date(),
    isBanned: false,
    banExpiresAt: null,
    failedLoginAttempts: 0,
    lastFailedLogin: null,
    accountLockedUntil: null
  });
  
  try {
    // Save user to database
    await user.save();
    
    // Send welcome email (non-blocking)
    console.log(`[AUTH] Sending welcome email to: ${finalEmail}`);
    sendWelcomeEmail(finalEmail, finalUsername)
      .then(result => {
        console.log('[AUTH] Welcome email sent successfully:', result);
      })
      .catch(err => {
        console.error('[AUTH] Failed to send welcome email:', err.message);
      });
    
    // Return user data (without password)
    return {
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        age: user.age,
        gender: user.gender,
        createdAt: user.createdAt
      }
    };
  } catch (error) {
    // Handle duplicate username
    if (error.code === 11000 && error.keyPattern?.username) {
      const err = new Error('Username already taken');
      err.statusCode = 409;
      err.code = 'USERNAME_TAKEN';
      err.userMessage = 'This username is already taken. Please choose another.';
      throw err;
    }
    // Handle duplicate email
    if (error.code === 11000 && error.keyPattern?.email) {
      const err = new Error('Email already registered');
      err.statusCode = 409;
      err.code = 'EMAIL_TAKEN';
      err.userMessage = 'This email is already registered';
      throw err;
    }
    throw error;
  }
}

/**
 * Login user with username and password
 * Creates session on successful authentication
 * Implements account locking after 5 failed attempts within 24 hours
 * 
 * @param {Object} loginData - Login credentials
 * @param {string} loginData.username - Username
 * @param {string} loginData.password - Password
 * @returns {Promise<Object>} User data
 * @throws {Error} If authentication fails
 */
export async function login(loginData) {
  const { username, password } = loginData;
  
  // Validate input
  if (!username || !password) {
    const error = new Error('Username and password are required');
    error.statusCode = 400;
    error.code = 'MISSING_CREDENTIALS';
    error.userMessage = 'Username and password are required';
    throw error;
  }
  
  // Normalize username
  const normalizedUsername = username.toLowerCase().trim();
  
  console.log('[DEBUG] Login attempt:', { username: normalizedUsername, passwordLength: password?.length });
  
  // Find user by username
  const user = await User.findOne({ username: normalizedUsername });
  
  console.log('[DEBUG] User found:', { found: !!user, username: user?.username });
  
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    error.userMessage = 'Invalid username or password';
    throw error;
  }
  
  // Check if account is locked
  if (user.isAccountLocked()) {
    const error = new Error('Account is locked');
    error.statusCode = 403;
    error.code = 'ACCOUNT_LOCKED';
    error.userMessage = 'Account is locked due to too many failed login attempts. Please try again later.';
    error.lockedUntil = user.accountLockedUntil;
    throw error;
  }
  
  // Check if user is banned
  if (user.isCurrentlyBanned()) {
    const error = new Error('Account is banned');
    error.statusCode = 403;
    error.code = 'ACCOUNT_BANNED';
    error.userMessage = 'Your account has been banned';
    
    if (user.banExpiresAt) {
      error.banExpiresAt = user.banExpiresAt;
    }
    
    throw error;
  }
  
  // Verify password
  const isPasswordValid = await verifyPassword(password, user.password);
  
  console.log('[DEBUG] Password verification:', { isValid: isPasswordValid, hashedPasswordLength: user.password?.length });
  
  if (!isPasswordValid) {
    // Increment failed login attempts
    await user.incrementFailedLogins();
    
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    error.userMessage = 'Invalid username or password';
    
    // Add warning if account is now locked
    if (user.isAccountLocked()) {
      error.userMessage = 'Too many failed login attempts. Account is locked for 24 hours.';
      error.code = 'ACCOUNT_LOCKED';
      error.statusCode = 403;
    }
    
    throw error;
  }
  
  // Reset failed login attempts on successful login
  await user.resetFailedLogins();
  
  // Update last active timestamp
  await user.updateLastActive();
  
  // Return user data (session is created by controller)
  return {
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      age: user.age,
      gender: user.gender,
      createdAt: user.createdAt
    }
  };
}

/**
 * Logout user by destroying session
 * Session destruction is handled by controller
 * 
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {Promise<Object>} Success message
 * @throws {Error} If user not found
 */
export async function logout(userId) {
  if (!userId) {
    const error = new Error('User ID is required');
    error.statusCode = 401;
    error.code = 'MISSING_USER_ID';
    error.userMessage = 'Authentication required';
    throw error;
  }
  
  // Fetch user from database to verify existence
  const user = await User.findById(userId);
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    error.userMessage = 'User account not found';
    throw error;
  }
  
  return {
    message: 'Logged out successfully'
  };
}

/**
 * Get user session data
 * Used to restore session state on page reload
 * 
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {Promise<Object>} User data
 * @throws {Error} If user not found
 */
export async function getSessionUser(userId) {
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
  
  // Check if user is banned
  if (user.isCurrentlyBanned()) {
    const error = new Error('Account is banned');
    error.statusCode = 403;
    error.code = 'ACCOUNT_BANNED';
    error.userMessage = 'Your account has been banned';
    
    if (user.banExpiresAt) {
      error.banExpiresAt = user.banExpiresAt;
    }
    
    throw error;
  }
  
  return {
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      age: user.age,
      gender: user.gender,
      createdAt: user.createdAt
    }
  };
}

/**
 * Request password reset
 * Generates a reset token and stores it with expiry
 * 
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Reset token and user info
 * @throws {Error} If email not found or invalid
 */
export async function requestPasswordReset(email) {
  if (!email) {
    const error = new Error('Email is required');
    error.statusCode = 400;
    error.code = 'EMAIL_REQUIRED';
    error.userMessage = 'Email address is required';
    throw error;
  }

  // Normalize email
  const normalizedEmail = email.toLowerCase().trim();

  // Find user by email
  const user = await User.findOne({ email: normalizedEmail });

  // For security, don't reveal if email exists
  if (!user) {
    // Still return success to prevent email enumeration
    return {
      message: 'If an account exists with that email, a reset link has been sent'
    };
  }

  // Generate reset token (random 32-byte hex string)
  const crypto = await import('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash the token before storing
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set token and expiry (1 hour)
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  // Send password reset email
  try {
    await sendPasswordResetEmail(user.email, resetToken, user.username);
  } catch (emailError) {
    console.error('Failed to send password reset email:', emailError);
    // Don't throw - we still want to return success to prevent email enumeration
  }

  // Return the plain token (to be sent via email) and user info
  return {
    message: 'If an account exists with that email, a reset link has been sent',
    resetToken, // This should be sent via email, not in API response
    email: user.email,
    username: user.username
  };
}

/**
 * Reset password using token
 * Validates token and updates password
 * 
 * @param {string} token - Reset token from email
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Success message
 * @throws {Error} If token invalid or expired
 */
export async function resetPassword(token, newPassword) {
  if (!token || !newPassword) {
    const error = new Error('Token and new password are required');
    error.statusCode = 400;
    error.code = 'MISSING_FIELDS';
    error.userMessage = 'Reset token and new password are required';
    throw error;
  }

  // Validate new password strength
  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.isValid) {
    const error = new Error('Password does not meet requirements');
    error.statusCode = 400;
    error.code = 'WEAK_PASSWORD';
    error.userMessage = passwordValidation.errors.join(', ');
    error.details = passwordValidation.errors;
    throw error;
  }

  // Hash the provided token to compare with stored hash
  const crypto = await import('crypto');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user with valid token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() } // Token not expired
  });

  if (!user) {
    const error = new Error('Invalid or expired reset token');
    error.statusCode = 400;
    error.code = 'INVALID_TOKEN';
    error.userMessage = 'Password reset token is invalid or has expired';
    throw error;
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password and clear reset token
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  user.failedLoginAttempts = 0; // Reset failed attempts
  user.accountLockedUntil = null; // Unlock account if locked
  await user.save();

  return {
    message: 'Password has been reset successfully'
  };
}
