import PropTypes from 'prop-types';

/**
 * NotificationItem Component
 * Displays a single notification with actions
 */
function NotificationItem({ notification, onMarkAsRead, onDelete, formatTimeAgo }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'level_up':
        return (
          <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">{notification.data.room === 'dark' ? '🌑' : notification.data.room === 'philo' ? '🦉' : '🚀'}</span>
          </div>
        );
      case 'reaction':
        return (
          <div className="w-10 h-10 rounded-full bg-orange-900/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        );
      case 'comment':
        return (
          <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div
      className={`p-4 hover:bg-[#222] transition-colors ${
        !notification.read ? 'bg-[#1f1f1f]' : ''
      }`}
    >
      <div className="flex gap-3">
        {getIcon()}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-white text-sm font-medium">{notification.title}</h4>
            {!notification.read && (
              <span className="w-2 h-2 bg-[#ff6b35] rounded-full flex-shrink-0 mt-1"></span>
            )}
          </div>
          
          <p className="text-gray-400 text-sm mb-2 line-clamp-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">
              {formatTimeAgo(notification.createdAt)}
            </span>
            
            <div className="flex items-center gap-2">
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification._id)}
                  className="text-xs text-[#ff6b35] hover:text-[#ff8555] transition-colors"
                >
                  Mark read
                </button>
              )}
              <button
                onClick={() => onDelete(notification._id)}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    data: PropTypes.object,
    read: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired
  }).isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  formatTimeAgo: PropTypes.func.isRequired
};

export default NotificationItem;
