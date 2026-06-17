import express from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { noCache } from '../middlewares/cache.middleware.js';

const router = express.Router();

/**
 * GET /api/notifications
 * Get user's notifications
 * Requires: authentication
 */
router.get(
  '/',
  authenticate,
  noCache(),
  notificationController.getNotifications
);

/**
 * GET /api/notifications/unread-count
 * Get unread notification count
 * Requires: authentication
 */
router.get(
  '/unread-count',
  authenticate,
  noCache(),
  notificationController.getUnreadCount
);

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read
 * Requires: authentication
 */
router.patch(
  '/read-all',
  authenticate,
  noCache(),
  notificationController.markAllAsRead
);

/**
 * PATCH /api/notifications/:id/read
 * Mark notification as read
 * Requires: authentication
 */
router.patch(
  '/:id/read',
  authenticate,
  noCache(),
  notificationController.markAsRead
);

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 * Requires: authentication
 */
router.delete(
  '/:id',
  authenticate,
  noCache(),
  notificationController.deleteNotification
);

export default router;
