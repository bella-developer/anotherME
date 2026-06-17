import express from 'express';
import { healthCheck } from '../controllers/health.controller.js';

const router = express.Router();

/**
 * Health check endpoint
 * GET /api/health
 * Returns system health status including database connection
 */
router.get('/', healthCheck);

export default router;
