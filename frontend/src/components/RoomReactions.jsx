import { useState } from 'react';
import PropTypes from 'prop-types';
// Room-specific premium Lucide icons
import { 
  Frown,
  HeartCrack, 
  HeartOff,
  Smile,
  ThumbsUp,
  ThumbsDown,
  Lightbulb
} from 'lucide-react';

/**
 * RoomReactions Component
 * Room-specific 3-button reaction system with premium icons
 * Dark Room: sad, heartCrack, heartOff
 * Fantasy Room: laugh, like, dislike
 * Philo Room: lightbulb, like, dislike
 */

const ROOM_REACTIONS = {
  dark: [
    { type: 'sad', icon: Frown, label: 'Sad' },
    { type: 'heartCrack', icon: HeartCrack, label: 'Heart Break' },
    { type: 'heartOff', icon: HeartOff, label: 'Hurt' }
  ],
  fantasy: [
    { type: 'laugh', icon: Smile, label: 'Laugh' },
    { type: 'like', icon: ThumbsUp, label: 'Like' },
    { type: 'dislike', icon: ThumbsDown, label: 'Dislike' }
  ],
  philo: [
    { type: 'lightbulb', icon: Lightbulb, label: 'Insight' },
    { type: 'like', icon: ThumbsUp, label: 'Like' },
    { type: 'dislike', icon: ThumbsDown, label: 'Dislike' }
  ]
};

function RoomReactions({ room, reactions, userReactions = [], onReact, disabled = false }) {
  const [animatingReaction, setAnimatingReaction] = useState(null);

  // Get room-specific reactions
  const roomReactions = ROOM_REACTIONS[room] || ROOM_REACTIONS.dark;

  const roomColors = {
    dark: '#B44A4A',
    fantasy: '#DB762E',
    philo: '#7771D9'
  };
  const activeColor = roomColors[room] || '#B44A4A';

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
      setTimeout(() => setAnimatingReaction(null), 250);
    }
  };

  return (
    <div className="relative">
      {/* Smaller, borderless reaction buttons */}
      <div className="flex gap-4 justify-center items-center">
        {roomReactions.map(({ type, icon: Icon, label }) => {
          const count = reactions[type] || 0;
          const hasReacted = userReactions.includes(type);
          const isAnimating = animatingReaction === type;

          return (
            <button
              key={type}
              onClick={() => handleReactionClick(type)}
              disabled={disabled}
              className="group relative px-2.5 py-1 rounded flex items-center justify-center gap-1.5 cursor-pointer outline-none transition-all duration-200 hover:bg-white/[0.04]"
              style={{
                border: 'none',
                background: 'transparent',
                transform: isAnimating ? 'scale(0.92)' : hasReacted ? 'scale(1.02)' : 'scale(1)',
              }}
              title={label}
              aria-label={label}
            >
              <Icon 
                size={15}
                strokeWidth={1.8}
                className="flex-shrink-0 transition-all duration-200"
                style={{
                  color: hasReacted ? activeColor : 'rgba(255, 255, 255, 0.6)',
                  filter: hasReacted ? `drop-shadow(0 0 6px ${activeColor})` : 'none',
                }}
              />
              
              {/* Count - small, clean, borderless */}
              <span
                className="text-[11px] font-mono tracking-tight transition-colors duration-200"
                style={{
                  color: hasReacted ? activeColor : 'rgba(255, 255, 255, 0.45)',
                  fontWeight: hasReacted ? '600' : '400',
                }}
              >
                {count > 0 ? count : ''}
              </span>
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
