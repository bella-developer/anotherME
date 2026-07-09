import { useState } from 'react';
import PropTypes from 'prop-types';
import { Circle, CircleDot, X } from 'lucide-react';

/**
 * NotificationItem Component
 * Ultra-minimalistic notification display with expandable details
 */
function NotificationItem({ notification, onMarkAsRead, onDelete, formatTimeAgo }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getReactionIcon = () => {
    if (notification.type === 'reaction' && notification.data?.reaction) {
      return notification.data.reaction;
    }
    return null;
  };

  const getRoomName = () => {
    const room = notification.data?.room;
    if (room === 'dark') return 'Dark';
    if (room === 'fantasy') return 'Fantasy';
    if (room === 'philo') return 'Philo';
    return '';
  };

  // Simplified message for reactions
  const getMessage = () => {
    if (notification.type === 'reaction') {
      const reaction = getReactionIcon();
      const room = getRoomName();
      return (
        <span className="flex items-center gap-1">
          {reaction && <span className="text-xs">{reaction}</span>}
          {room && <span className="text-[#6b7280]">in {room} Room</span>}
        </span>
      );
    }
    return notification.message;
  };

  const handleClick = () => {
    if (!isExpanded && !notification.read) {
      // Mark as read when expanding for the first time
      onMarkAsRead(notification._id);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`transition-colors ${
        !notification.read ? 'bg-[#0a0a0a]' : ''
      }`}
    >
      <div 
        className="px-3 py-2 hover:bg-[#0f0f0f] cursor-pointer flex items-center gap-2"
        onClick={handleClick}
      >
        {/* Read/Unread indicator */}
        <div className="flex-shrink-0">
          {!notification.read ? (
            <CircleDot className="w-3 h-3 text-[#6b7280]" strokeWidth={2.5} />
          ) : (
            <Circle className="w-3 h-3 text-[#3a3a3a]" strokeWidth={2} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-[#e5e5e5] text-[10px] leading-tight">
            {getMessage()}
          </p>
          <span className="text-[9px] text-[#4a4a4a] mt-0.5 block">
            {formatTimeAgo(notification.createdAt)}
          </span>
        </div>
        
        {/* Hide button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification._id);
          }}
          className="text-[#4a4a4a] hover:text-[#6b7280] transition-colors flex-shrink-0"
          title="Hide"
        >
          <X className="w-3 h-3" strokeWidth={2} />
        </button>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div 
          className="px-3 pb-2 pl-8"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderTop: '1px solid rgba(255, 255, 255, 0.03)'
          }}
        >
          <p className="text-[#9ca3af] text-[9px] leading-relaxed">
            {notification.message}
          </p>
          {notification.data?.postTitle && (
            <p className="text-[#6b7280] text-[9px] mt-1 italic">
              "{notification.data.postTitle}"
            </p>
          )}
        </div>
      )}
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
