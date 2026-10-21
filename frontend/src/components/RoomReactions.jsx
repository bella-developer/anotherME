import { useState } from 'react';
import PropTypes from 'prop-types';
// Premium icons - simple and catchy
import { Heart, ThumbsUp, ThumbsDown } from 'lucide-react';

/**
 * RoomReactions Component
 * Simple 3-button reaction system with premium icons only
 * Heart (love), ThumbsUp (like), ThumbsDown (dislike)
 */

const REACTIONS = [
  { type: 'heart', icon: Heart, color: '#ffffff', activeColor: '#a9363d', activeRGB: '169, 54, 61' },
  { type: 'like', icon: ThumbsUp, color: '#ffffff', activeColor: '#a9363d', activeRGB: '169, 54, 61' },
  { type: 'dislike', icon: ThumbsDown, color: '#ffffff', activeColor: '#a9363d', activeRGB: '169, 54, 61' }
];

function RoomReactions({ room, reactions, userReactions = [], onReact, disabled = false }) {
  const [animatingReaction, setAnimatingReaction] = useState(null);

  // Get room-specific reactions
  const roomReactions = ROOM_REACTIONS[room] || ROOM_REACTIONS.dark;

  const handleReactionClick = async (reactionType) => {
    if (disabled) return;

    const hasReacted = userReactions.includes(reactionType);
    
    // Optimistic UI update
    setAnimatingReaction(reactionType);
    
    try {
      await onReact(reactionType, hasReacted);
    } catch (error) {
      console.error('Failed to react:', error);
    } finally {
      setTimeout(() => setAnimatingReaction(null), 300);
    }
  };

  const getButtonStyle = (reactionType, hasReacted) => {
    const isAnimating = animatingReaction === reactionType;
    const activeRGB = '169, 54, 61'; // ESO blood-red
    
    if (hasReacted) {
      return {
        background: `rgba(${activeRGB}, 0.15)`,
        border: `1px solid rgba(${activeRGB}, 0.4)`,
        boxShadow: `0 0 16px rgba(${activeRGB}, 0.25), inset 0 0 20px rgba(${activeRGB}, 0.1)`,
        transform: 'scale(1.05)',
        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
      };
    }
    
    if (isAnimating) {
      return {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        transform: 'scale(0.95)',
        transition: 'all 0.15s ease',
      };
    }
    
    return {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    };
  };

  return (
    <div className="relative">
      {/* Premium room-specific 3-button reaction system - bold white icons */}
      <div className="flex gap-2 justify-center items-center">
        {roomReactions.map(({ type, icon: Icon, label }) => {
          const count = reactions[type] || 0;
          const hasReacted = userReactions.includes(type);
          const activeColor = '#a9363d'; // ESO blood-red
          const activeRGB = '169, 54, 61';
          
          return (
            <button
              key={type}
              onClick={() => handleReactionClick(type)}
              disabled={disabled}
              className="group relative p-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer outline-none min-w-[48px] min-h-[48px]"
              style={getButtonStyle(type, hasReacted)}
              title={label}
              onMouseEnter={(e) => {
                if (!hasReacted) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.18)';
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 4px 16px rgba(${activeRGB}, 0.2)`;
                }
              }}
              onMouseLeave={(e) => {
                if (!hasReacted) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {/* Premium bold white icon with glow effect */}
              <Icon 
                size={20}
                strokeWidth={2.5}
                className="flex-shrink-0"
                style={{
                  color: hasReacted ? activeColor : '#ffffff',
                  opacity: hasReacted ? 1 : 0.7,
                  filter: hasReacted ? `drop-shadow(0 0 4px rgba(${activeRGB}, 0.6))` : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
              
              {/* Count badge - only show when > 0 */}
              {count > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-[10px] font-mono font-medium tracking-wider px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                  style={{
                    background: hasReacted ? `rgba(${activeRGB}, 0.9)` : 'rgba(255, 255, 255, 0.15)',
                    color: hasReacted ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                    border: hasReacted ? `1px solid rgba(${activeRGB}, 1)` : '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: hasReacted ? `0 0 8px rgba(${activeRGB}, 0.5)` : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

RoomReactions.propTypes = {
  room: PropTypes.oneOf(['dark', 'fantasy', 'philo']).isRequired,
  reactions: PropTypes.object.isRequired,
  userReactions: PropTypes.arrayOf(PropTypes.string),
  onReact: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default RoomReactions;
