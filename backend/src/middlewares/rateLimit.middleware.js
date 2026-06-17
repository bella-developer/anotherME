import rateLimit from 'express-rate-limit';
import { logRateLimitViolation } from '../utils/logger.utils.js';

/**
 * Rate limiter configuration for different endpoint types
 * Uses in-memory store (resets on server restart)
 */

/**
 * Create rate limit handler with logging
 * @param {string} limitType - Type of rate limit
 * @returns {Function} Handler function
 */
function createRateLimitHandler(limitType) {
  return (req, res, next, options) => {
    logRateLimitViolation(req, limitType);
    const retryAfter = Math.ceil(options.windowMs / 1000);
    res.status(429).json({
      ...options.message,
      retryAfter,
      requestId: req.id,
    });
  };
}

/**
 * Standard rate limiter for read endpoints (GET)
 * 100 requests per 15 minutes per IP/token
 */
export const readRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many requests, please try again later',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  handler: createRateLimitHandler('read'),
  // Use IP address for unauthenticated requests, userId for authenticated
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
  skip: (req) => {
    // Skip rate limiting in test environment
    return process.env.NODE_ENV === 'test';
  },
});

/**
 * Stricter rate limiter for write endpoints (POST, PATCH, DELETE)
 * 30 requests per 15 minutes per IP/token
 */
export const writeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many write requests, please try again later',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  handler: createRateLimitHandler('write'),
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
  skip: (req) => {
    return process.env.NODE_ENV === 'test';
  },
});

/**
 * Very strict rate limiter for sensitive endpoints (auth, moderation)
 * 10 requests per 15 minutes per IP/token
 */
export const sensitiveRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many authentication attempts, please try again later',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  handler: createRateLimitHandler('sensitive'),
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
  skip: (req) => {
    return process.env.NODE_ENV === 'test';
  },
});

/**
 * Extremely strict rate limiter for login endpoint
 * 5 requests per 15 minutes per IP
 * Prevents brute force attacks
 */
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many login attempts, please try again later',
    code: 'LOGIN_RATE_LIMIT_EXCEEDED',
  },
  handler: createRateLimitHandler('strict_login'),
  keyGenerator: (req) => {
    // Use IP address for login attempts
    return req.ip;
  },
  skip: (req) => {
    return process.env.NODE_ENV === 'test';
  },
});

/**
 * Per-resource rate limiters for specific operations
 */

/**
 * Post creation rate limiter
 * 5 posts per hour per user
 */
export const postCreationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 posts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many posts created, please try again later',
    code: 'POST_RATE_LIMIT_EXCEEDED',
  },
  handler: createRateLimitHandler('post_creation'),
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
  skip: (req) => {
    return process.env.NODE_ENV === 'test';
  },
});

/**
 * Comment creation rate limiter
 * Development: 100 comments per hour
 * Production: 20 comments per hour per user
 */
export const commentCreationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'production' ? 20 : 100, // Higher limit for development
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many comments created, please try again later',
    code: 'COMMENT_RATE_LIMIT_EXCEEDED',
  },
  handler: createRateLimitHandler('comment_creation'),
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
  skip: (req) => {
    return process.env.NODE_ENV === 'test';
  },
});

/**
 * Reaction rate limiter
 * 100 reactions per hour per user
 */
export const reactionRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 reactions per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many reactions, please try again later',
    code: 'REACTION_RATE_LIMIT_EXCEEDED',
  },
  handler: createRateLimitHandler('reaction'),
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
  skip: (req) => {
    return process.env.NODE_ENV === 'test';
  },
});

/**
 * Circle creation rate limiter
 * 3 circles per day per user
 */
export const circleCreationRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // 3 circles per day
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many circles created, please try again tomorrow',
    code: 'CIRCLE_RATE_LIMIT_EXCEEDED',
  },
  handler: createRateLimitHandler('circle_creation'),
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
  skip: (req) => {
    return process.env.NODE_ENV === 'test';
  },
});

/**
 * Moderation action rate limiter
 * 50 moderation actions per hour per user
 */
export const moderationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 moderation actions per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many moderation actions, please try again later',
    code: 'MODERATION_RATE_LIMIT_EXCEEDED',
  },
  handler: createRateLimitHandler('moderation'),
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
  skip: (req) => {
    return process.env.NODE_ENV === 'test';
  },
});
