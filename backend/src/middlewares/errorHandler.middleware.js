import crypto from 'crypto';
import logger, { logRequest, logResponse, logError } from '../utils/logger.utils.js';

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(message, statusCode, code, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Request ID middleware
 * Generates a unique request ID for each request for log correlation
 */
export const requestIdMiddleware = (req, res, next) => {
  req.id = crypto.randomBytes(16).toString('hex');
  res.setHeader('X-Request-Id', req.id);
  next();
};

/**
 * Request logger middleware
 * Logs incoming requests with structured data using Winston
 */
export const requestLoggerMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Log request
  logRequest(req, 'Incoming request');

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logResponse(req, res, duration);
  });

  next();
};

/**
 * Not found handler
 * Handles requests to undefined routes
 */
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Route ${req.method} ${req.path} not found`,
    404,
    'NOT_FOUND'
  );
  next(error);
};

/**
 * Global error handler middleware
 * Handles all errors and returns consistent error responses
 */
export const errorHandler = (err, req, res, next) => {
  // Default to 500 server error
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_ERROR';
  let message = err.message || 'An unexpected error occurred';
  let details = err.details || null;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));
  } else if (err.name === 'CastError') {
    // Mongoose cast error (invalid ObjectId)
    statusCode = 400;
    code = 'INVALID_ID';
    message = 'Invalid ID format';
  } else if (err.name === 'MongoServerError' && err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    code = 'DUPLICATE_ERROR';
    message = 'Resource already exists';
    const field = Object.keys(err.keyPattern)[0];
    details = { field, message: `${field} already exists` };
  }

  // Log error with full context using Winston
  logError(req, err, {
    details: details,
    name: err.name,
  });

  // Build error response
  const errorResponse = {
    status: 'error',
    statusCode,
    message,
    code,
    requestId: req.id,
  };

  // Add details if present
  if (details) {
    errorResponse.details = details;
  }

  // Add retry-after for rate limit errors
  if (statusCode === 429 && err.retryAfter) {
    errorResponse.retryAfter = err.retryAfter;
    res.setHeader('Retry-After', err.retryAfter);
  }

  // Include stack trace only in development
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * Async handler wrapper
 * Wraps async route handlers to catch errors and pass to error handler
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Helper functions for creating common errors
 */
export const createValidationError = (message, details = null) => {
  return new AppError(message, 400, 'VALIDATION_ERROR', details);
};

export const createAuthenticationError = (
  message = 'Authentication required'
) => {
  return new AppError(message, 401, 'AUTHENTICATION_ERROR');
};

export const createAuthorizationError = (
  message = 'You do not have permission to perform this action'
) => {
  return new AppError(message, 403, 'FORBIDDEN');
};

export const createNotFoundError = (message = 'Resource not found') => {
  return new AppError(message, 404, 'NOT_FOUND');
};

export const createConflictError = (message = 'Resource already exists') => {
  return new AppError(message, 409, 'CONFLICT');
};

export const createRateLimitError = (
  message = 'Too many requests',
  retryAfter = 900
) => {
  const error = new AppError(message, 429, 'RATE_LIMIT_EXCEEDED');
  error.retryAfter = retryAfter;
  return error;
};

export const createInternalError = (
  message = 'An unexpected error occurred'
) => {
  return new AppError(message, 500, 'INTERNAL_ERROR');
};
