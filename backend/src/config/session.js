import session from 'express-session';
import MongoStore from 'connect-mongo';
import logger from '../utils/logger.utils.js';

/**
 * Session Configuration
 * Server-side session management with MongoDB storage
 * HttpOnly cookies for security
 */

/**
 * Create session middleware
 * @returns {Function} Express session middleware
 */
export function createSessionMiddleware() {
  // Validate environment variables at runtime (not during import)
  const mongoUri = process.env.MONGODB_URI;
  const sessionSecret = process.env.SESSION_SECRET;
  
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is required for session storage');
  }

  if (!sessionSecret) {
    throw new Error('SESSION_SECRET environment variable is required');
  }

  const isProduction = process.env.NODE_ENV === 'production';

  return session({
    name: 'eso.sid', // Custom session cookie name
    secret: sessionSecret,
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    store: MongoStore.create({
      mongoUrl: mongoUri,
      collectionName: 'sessions',
      ttl: 30 * 24 * 60 * 60, // 30 days in seconds
      autoRemove: 'native', // Let MongoDB handle TTL
      touchAfter: 24 * 3600, // Lazy session update (once per 24h)
      crypto: {
        secret: sessionSecret
      }
    }),
    cookie: {
      httpOnly: true, // Prevent JavaScript access
      secure: isProduction, // HTTPS only in production
      sameSite: isProduction ? 'none' : 'lax', // Allow cross-origin in production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
      path: '/', // Cookie available on all paths
    },
    proxy: isProduction // Trust proxy in production (for Render)
  });
}

/**
 * Session regeneration helper
 * Prevents session fixation attacks
 * @param {Object} req - Express request object
 * @returns {Promise<void>}
 */
export function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    const oldSession = req.session;
    req.session.regenerate((err) => {
      if (err) {
        logger.error('Session regeneration failed', { error: err.message });
        return reject(err);
      }
      // Restore session data after regeneration
      Object.assign(req.session, oldSession);
      resolve();
    });
  });
}

/**
 * Session destruction helper
 * @param {Object} req - Express request object
 * @returns {Promise<void>}
 */
export function destroySession(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        logger.error('Session destruction failed', { error: err.message });
        return reject(err);
      }
      resolve();
    });
  });
}
