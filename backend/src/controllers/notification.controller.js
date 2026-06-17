import * as notificationService from '../services/notification.service.js';

/**
 * Get user's notifications
 * GET /api/notifications
 */
export async function getNotifications(req, res) {
  try {
    const userId = req.user.id;
    const { unreadOnly, limit = 50, skip = 0 } = req.query;

    const notifications = await notificationService.getUserNotifications(userId, {
      unreadOnly: unreadOnly === 'true',
      limit: parseInt(limit, 10),
      skip: parseInt(skip, 10)
    });

    const unreadCount = await notificationService.getUnreadCount(userId);

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch notifications',
        code: 'FETCH_NOTIFICATIONS_FAILED'
      }
    });
  }
}

/**
 * Get unread notification count
 * GET /api/notifications/unread-count
 */
export async function getUnreadCount(req, res) {
  try {
    const userId = req.user.id;
    const count = await notificationService.getUnreadCount(userId);

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch unread count',
        code: 'FETCH_COUNT_FAILED'
      }
    });
  }
}

/**
 * Mark notification as read
 * PATCH /api/notifications/:id/read
 */
export async function markAsRead(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await notificationService.markAsRead(id, userId);

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || 'Failed to mark notification as read',
        code: error.code || 'MARK_READ_FAILED'
      }
    });
  }
}

/**
 * Mark all notifications as read
 * PATCH /api/notifications/read-all
 */
export async function markAllAsRead(req, res) {
  try {
    const userId = req.user.id;
    const result = await notificationService.markAllAsRead(userId);

    res.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to mark all notifications as read',
        code: 'MARK_ALL_READ_FAILED'
      }
    });
  }
}

/**
 * Delete a notification
 * DELETE /api/notifications/:id
 */
export async function deleteNotification(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await notificationService.deleteNotification(id, userId);

    res.json({
      success: true,
      data: { message: 'Notification deleted' }
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || 'Failed to delete notification',
        code: error.code || 'DELETE_NOTIFICATION_FAILED'
      }
    });
  }
}
