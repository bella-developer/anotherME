import { asyncHandler } from '../middlewares/errorHandler.middleware.js';
import { checkHealth } from '../services/health.service.js';

/**
 * Health check controller
 * Returns system health status including database connection
 */
export const healthCheck = asyncHandler(async (req, res) => {
  const healthStatus = await checkHealth();
  
  // Return 503 if database is not connected
  const statusCode = healthStatus.database.connected ? 200 : 503;
  
  res.status(statusCode).json(healthStatus);
});

/**
 * Debug endpoint to check session and cookie configuration
 * GET /api/health/debug
 */
export const debugCheck = asyncHandler(async (req, res) => {
  const debug = {
    session: {
      exists: !!req.session,
      id: req.session?.id || null,
      userId: req.session?.userId || null,
      cookie: req.session?.cookie || null,
    },
    headers: {
      origin: req.headers.origin || null,
      referer: req.headers.referer || null,
      cookie: req.headers.cookie ? 'Present' : 'Missing',
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      corsOrigin: process.env.CORS_ORIGIN,
    }
  };
  
  res.json(debug);
});
