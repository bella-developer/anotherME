import apiClient from './api';

/**
 * Notification Service
 * Handles all notification-related API calls
 */

/**
 * Fetch user's notifications
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Notifications and unread count
 */
export async function fetchNotifications(options = {}) {
  const { unreadOnly = false, limit = 50, skip = 0 } = options;
  
  const params = new URLSearchParams();
  if (unreadOnly) params.append('unreadOnly', 'true');
  params.append('limit', limit.toString());
  params.append('skip', skip.toString());

  const response = await apiClient.get(`/notifications?${params.toString()}`);
  return response.data.data; // Unwrap the data object
}

/**
 * Get unread notification count
 * @returns {Promise<number>} Unread count
 */
export async function getUnreadCount() {
  const response = await apiClient.get('/notifications/unread-count');
  return response.data.data.count; // Unwrap the data object
}

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export async function markAsRead(notificationId) {
  const response = await apiClient.patch(`/notifications/${notificationId}/read`);
  return response.data.data; // Unwrap the data object
}

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Update result
 */
export async function markAllAsRead() {
  const response = await apiClient.patch('/notifications/read-all');
  return response.data.data; // Unwrap the data object
}

/**
 * Delete a notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise<void>}
 */
export async function deleteNotification(notificationId) {
  await apiClient.delete(`/notifications/${notificationId}`);
}
