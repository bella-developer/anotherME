import jwt from 'jsonwebtoken';

/**
 * JWT Token Utilities
 * Secure token generation and verification for authentication
 */

/**
 * Generate access token (short-lived)
 * @param {Object} payload - User data to encode
 * @param {string} payload.userId - User's MongoDB ObjectId
 * @returns {string} JWT access token
 */
export function generateAccessToken(payload) {
  const secret = process.env.JWT_ACCESS_SECRET;
  const expiry = process.env.JWT_ACCESS_EXPIRY || '15m';
  
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is not configured');
  }
  
  return jwt.sign(payload, secret, {
    expiresIn: expiry,
    issuer: 'anotherme-api',
    audience: 'anotherme-app',
  });
}

/**
 * Generate refresh token (long-lived)
 * @param {Object} payload - User data to encode
 * @param {string} payload.userId - User's MongoDB ObjectId
 * @returns {string} JWT refresh token
 */
export function generateRefreshToken(payload) {
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiry = process.env.JWT_REFRESH_EXPIRY || '7d';
  
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not configured');
  }
  
  return jwt.sign(payload, secret, {
    expiresIn: expiry,
    issuer: 'anotherme-api',
    audience: 'anotherme-app',
  });
}

/**
 * Verify access token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export function verifyAccessToken(token) {
  const secret = process.env.JWT_ACCESS_SECRET;
  
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is not configured');
  }
  
  try {
    return jwt.verify(token, secret, {
      issuer: 'anotherme-api',
      audience: 'anotherme-app',
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const err = new Error('Access token expired');
      err.statusCode = 401;
      err.code = 'TOKEN_EXPIRED';
      throw err;
    }
    
    if (error.name === 'JsonWebTokenError') {
      const err = new Error('Invalid access token');
      err.statusCode = 401;
      err.code = 'INVALID_TOKEN';
      throw err;
    }
    
    throw error;
  }
}

/**
 * Verify refresh token
 * @param {string} token - JWT refresh token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export function verifyRefreshToken(token) {
  const secret = process.env.JWT_REFRESH_SECRET;
  
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not configured');
  }
  
  try {
    return jwt.verify(token, secret, {
      issuer: 'anotherme-api',
      audience: 'anotherme-app',
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const err = new Error('Refresh token expired');
      err.statusCode = 401;
      err.code = 'REFRESH_TOKEN_EXPIRED';
      throw err;
    }
    
    if (error.name === 'JsonWebTokenError') {
      const err = new Error('Invalid refresh token');
      err.statusCode = 401;
      err.code = 'INVALID_REFRESH_TOKEN';
      throw err;
    }
    
    throw error;
  }
}
