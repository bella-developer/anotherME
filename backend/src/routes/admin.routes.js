import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { generalRateLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

/**
 * GET /api/admin/stats
 * Get comprehensive platform statistics
 * Requires: admin authentication
 */
router.get('/stats',
  authenticate,
  generalRateLimiter,
  adminController.getStatistics
);

export default router;
