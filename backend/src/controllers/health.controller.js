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
