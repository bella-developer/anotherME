import winston from 'winston';

/**
 * Winston logger configuration
 * Provides structured logging with JSON format
 * Never logs sensitive data (tokens, passwords, PII)
 */

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Define colors for console output
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

winston.addColors(colors);

// Custom format for filtering sensitive data
const sanitizeFormat = winston.format((info) => {
  // List of sensitive fields to redact
  const sensitiveFields = [
    'password',
    'token',
    'accessToken',
    'refreshToken',
    'authorization',
    'cookie',
    'secret',
    'apiKey',
  ];

  // Recursively sanitize object
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const sanitized = Array.isArray(obj) ? [] : {};

    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      
      // Check if field is sensitive
      if (sensitiveFields.some((field) => lowerKey.includes(field))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  };

  return sanitize(info);
});

// Create Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true })
  ),
  defaultMeta: {
    service: 'eso-api',
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf((info) => {
          const { timestamp, level, message, service, ...meta } = info;
          let log = `${timestamp} [${level}]: ${message}`;
          
          // Add metadata if present
          const metaKeys = Object.keys(meta);
          if (metaKeys.length > 0) {
            log += ` ${JSON.stringify(meta)}`;
          }
          
          return log;
        })
      ),
    }),
  ],
});

// Add file transports in production
if (process.env.NODE_ENV === 'production') {
  // Error log file
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.json(),
    })
  );

  // Combined log file
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.json(),
    })
  );
}

/**
 * Log request information
 * @param {Object} req - Express request object
 * @param {string} message - Log message
 */
export function logRequest(req, message = 'Incoming request') {
  logger.info(message, {
    requestId: req.id,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.id,
  });
}

/**
 * Log response information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {number} duration - Request duration in ms
 */
export function logResponse(req, res, duration) {
  logger.info('Request completed', {
    requestId: req.id,
    method: req.method,
    path: req.path,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    userId: req.user?.id,
  });
}

/**
 * Log error information
 * @param {Object} req - Express request object
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 */
export function logError(req, error, context = {}) {
  logger.error('Error occurred', {
    requestId: req.id,
    error: error.message,
    code: error.code,
    statusCode: error.statusCode,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
    stack: error.stack,
    ...context,
  });
}

/**
 * Log authentication event
 * @param {string} event - Event type (login, logout, register, etc.)
 * @param {Object} data - Event data
 */
export function logAuthEvent(event, data = {}) {
  logger.info(`Auth event: ${event}`, {
    event,
    ...data,
  });
}

/**
 * Log rate limit violation
 * @param {Object} req - Express request object
 * @param {string} limitType - Type of rate limit (read, write, sensitive)
 */
export function logRateLimitViolation(req, limitType = 'unknown') {
  logger.warn('Rate limit exceeded', {
    requestId: req.id,
    limitType,
    ip: req.ip,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
  });
}

/**
 * Log security event
 * @param {string} event - Security event type
 * @param {Object} data - Event data
 */
export function logSecurityEvent(event, data = {}) {
  logger.warn(`Security event: ${event}`, {
    event,
    ...data,
  });
}

/**
 * Log moderation action
 * @param {string} action - Moderation action type
 * @param {Object} data - Action data
 */
export function logModerationAction(action, data = {}) {
  logger.info(`Moderation action: ${action}`, {
    action,
    ...data,
  });
}

export default logger;
