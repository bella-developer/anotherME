import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as notificationService from '../services/notificationService';
import NotificationItem from './NotificationItem';

/**
 * NotificationPanel Component
 * Displays dropdown panel with user's notifications
 */
function NotificationPanel({ onClose, onCountChange }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const panelRef = useRef(null);

  // Fetch notifications
  useEffect(() => {
    loadNotifications();
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.fetchNotifications({ limit: 20 });
      // Defensive: ensure notifications is always an array
      setNotifications(data?.notifications || []);
      onCountChange(data?.unreadCount || 0);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setError('Failed to load notifications');
      setNotifications([]); // Ensure it's an array even on error
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      const unreadCount = notifications.filter(n => !n.read && n._id !== notificationId).length;
      onCountChange(unreadCount);
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      onCountChange(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      const notification = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      if (!notification.read) {
        const unreadCount = notifications.filter(n => !n.read && n._id !== notificationId).length;
        onCountChange(unreadCount);
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-md shadow-2xl z-50 max-h-[70vh] flex flex-col"
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
        <h3 className="text-white text-xs font-medium tracking-wider uppercase">Notifications</h3>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-[9px] text-[#6b7280] hover:text-[#9ca3af] transition-colors uppercase tracking-wider"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-6 h-6 border-2 border-[#2a2a2a] border-t-[#6b7280] rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-400 text-[10px]">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-[#4a4a4a] text-[10px]">
            <svg className="w-8 h-8 mx-auto mb-2 text-[#2a2a2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p>No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(255,255,255,0.03)]">
            {notifications.map(notification => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                formatTimeAgo={formatTimeAgo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

NotificationPanel.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCountChange: PropTypes.func.isRequired
};

export default NotificationPanel;
