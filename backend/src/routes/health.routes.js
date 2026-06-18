import express from 'express';
import { healthCheck, debugCheck } from '../controllers/health.controller.js';

const router = express.Router();

/**
 * Health check endpoint
 * GET /api/health
 * Returns system health status including database connection
 */
router.get('/', healthCheck);

/**
 * Debug endpoint
 * GET /api/health/debug
 * Returns session and cookie debug information
 */
router.get('/debug', debugCheck);

export default router;
