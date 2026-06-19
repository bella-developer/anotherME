/**
 * Cache Middleware
 * Implements HTTP caching headers for API responses
 * Implements Requirements: 7.5, 15.6
 */

/**
 * Cache middleware for public read endpoints
 * Sets Cache-Control headers for aggressive caching
 * @param {number} maxAge - Cache duration in seconds (default: 300 = 5 minutes)
 * @returns {Function} Express middleware
 */
export function cachePublicRead(maxAge = 300) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Set Cache-Control header for public caching
    res.set('Cache-Control', `public, max-age=${maxAge}, must-revalidate`);
    
    // Set ETag support for conditional requests
    res.set('Vary', 'Accept-Encoding');

    next();
  };
}

/**
 * Cache middleware for authenticated read endpoints
 * Sets Cache-Control headers for private caching
 * @param {number} maxAge - Cache duration in seconds (default: 60 = 1 minute)
 * @returns {Function} Express middleware
 */
export function cachePrivateRead(maxAge = 60) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Set Cache-Control header for private caching (browser only)
    res.set('Cache-Control', `private, max-age=${maxAge}, must-revalidate`);
    
    // Set ETag support for conditional requests
    res.set('Vary', 'Accept-Encoding, Authorization');

    next();
  };
}

/**
 * No-cache middleware for write endpoints and sensitive data
 * Prevents caching of responses
 * @returns {Function} Express middleware
 */
export function noCache() {
  return (req, res, next) => {
    // Prevent caching
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');

    next();
  };
}

/**
 * Conditional cache middleware based on authentication
 * Uses public cache for unauthenticated requests, private cache for authenticated
 * @param {number} publicMaxAge - Cache duration for public requests (default: 300 = 5 minutes)
 * @param {number} privateMaxAge - Cache duration for private requests (default: 60 = 1 minute)
 * @returns {Function} Express middleware
 */
export function cacheConditional(publicMaxAge = 300, privateMaxAge = 60) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Check if user is authenticated
    if (req.user) {
      // Private cache for authenticated users
      res.set('Cache-Control', `private, max-age=${privateMaxAge}, must-revalidate`);
      res.set('Vary', 'Accept-Encoding, Authorization');
    } else {
      // Public cache for unauthenticated users
      res.set('Cache-Control', `public, max-age=${publicMaxAge}, must-revalidate`);
      res.set('Vary', 'Accept-Encoding');
    }

    next();
  };
}

/**
 * Stale-while-revalidate cache middleware
 * Allows serving stale content while revalidating in background
 * @param {number} maxAge - Fresh cache duration in seconds (default: 300 = 5 minutes)
 * @param {number} staleAge - Stale cache duration in seconds (default: 600 = 10 minutes)
 * @returns {Function} Express middleware
 */
export function cacheStaleWhileRevalidate(maxAge = 300, staleAge = 600) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Set Cache-Control with stale-while-revalidate
    res.set('Cache-Control', `public, max-age=${maxAge}, stale-while-revalidate=${staleAge}`);
    // Vary by Authorization to cache authenticated and unauthenticated responses separately
    res.set('Vary', 'Accept-Encoding, Authorization');

    next();
  };
}
