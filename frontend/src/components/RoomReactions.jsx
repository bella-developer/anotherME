import { useState } from 'react';
import PropTypes from 'prop-types';
// Lucide icons for humanistic, relatable reactions
import { 
  Heart, Waves, Users, Flame, // Dark Room - solidarity & support
  Lightbulb, Sparkles, HelpCircle, Target, // Philo Room - thinking & wonder
  Sparkle, PartyPopper, ThumbsUp, Palette // Fantasy Room - joy & creativity
} from 'lucide-react';

/**
 * RoomReactions Component
 * Displays room-specific reaction buttons with humanistic, daily-life language
 * Uses Lucide icons with room-themed colors and subtle glow effects
 */

const ROOM_REACTIONS = {
  dark: [
    { type: 'same', label: 'Same', icon: Heart, color: '#2EE6FF', colorRGB: '46, 230, 255' },
    { type: 'thatsTough', label: "That's tough", icon: Waves, color: '#2EE6FF', colorRGB: '46, 230, 255' },
    { type: 'notAlone', label: 'Not alone', icon: Users, color: '#2EE6FF', colorRGB: '46, 230, 255' },
    { type: 'felt', label: 'Felt', icon: Flame, color: '#2EE6FF', colorRGB: '46, 230, 255' }
  ],
  philo: [
    { type: 'deep', label: 'Deep', icon: Lightbulb, color: '#B56DFF', colorRGB: '181, 109, 255' },
    { type: 'wow', label: 'Wow', icon: Sparkles, color: '#B56DFF', colorRGB: '181, 109, 255' },
    { type: 'sameQuestion', label: 'Same question', icon: HelpCircle, color: '#B56DFF', colorRGB: '181, 109, 255' },
    { type: 'this', label: 'This', icon: Target, color: '#B56DFF', colorRGB: '181, 109, 255' }
  ],
  fantasy: [
    { type: 'loveIt', label: 'Love it', icon: Sparkle, color: '#FF9D1C', colorRGB: '255, 157, 28' },
    { type: 'cheers', label: 'Cheers', icon: PartyPopper, color: '#FF9D1C', colorRGB: '255, 157, 28' },
    { type: 'yes', label: 'Yes', icon: ThumbsUp, color: '#FF9D1C', colorRGB: '255, 157, 28' },
    { type: 'beautiful', label: 'Beautiful', icon: Palette, color: '#FF9D1C', colorRGB: '255, 157, 28' }
  ]
};

function RoomReactions({ room, reactions, userReactions = [], onReact, disabled = false }) {
  const [animatingReaction, setAnimatingReaction] = useState(null);

  const roomReactions = ROOM_REACTIONS[room] || [];

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

  const getButtonStyle = (reactionType, hasReacted, color, colorRGB) => {
    const isAnimating = animatingReaction === reactionType;
    
    if (hasReacted) {
      return {
        background: `rgba(${colorRGB}, 0.12)`,
        border: `1px solid rgba(${colorRGB}, 0.35)`,
        boxShadow: `0 0 12px rgba(${colorRGB}, 0.2), inset 0 0 16px rgba(${colorRGB}, 0.08)`,
        transform: 'scale(1.05)',
        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
      };
    }
    
    if (isAnimating) {
      return {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        transform: 'scale(0.95)',
        transition: 'all 0.15s ease',
      };
    }
    
    return {
      background: 'rgba(255, 255, 255, 0.04)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    };
  };

  return (
    <div className="relative">
      {/* Reaction Buttons - Small, responsive, artistic dark design */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center items-center">
        {roomReactions.map(({ type, label, icon: Icon, color, colorRGB }) => {
          const count = reactions[type] || 0;
          const hasReacted = userReactions.includes(type);
          
          return (
            <button
              key={type}
              onClick={() => handleReactionClick(type)}
              disabled={disabled}
              className="group relative px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-md flex items-center gap-2 cursor-pointer outline-none min-h-[36px]"
              style={getButtonStyle(type, hasReacted, color, colorRGB)}
              title={label}
              onMouseEnter={(e) => {
                if (!hasReacted) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 4px 12px rgba(${colorRGB}, 0.15)`;
                }
                // Make label brighter on hover
                const label = e.currentTarget.querySelector('span:last-child');
                if (label) {
                  label.style.color = color;
                  label.style.textShadow = `0 0 6px rgba(${colorRGB}, 0.4)`;
                }
              }}
              onMouseLeave={(e) => {
                if (!hasReacted) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }
                // Reset label color when not hovered
                const label = e.currentTarget.querySelector('span:last-child');
                if (label && !hasReacted) {
                  label.style.color = 'rgba(255, 255, 255, 0.7)';
                  label.style.textShadow = 'none';
                }
              }}
            >
              {/* Icon with subtle glow effect - Premium sizing */}
              <Icon 
                size={16}
                strokeWidth={1.8}
                className="flex-shrink-0"
                style={{
                  color: hasReacted ? color : 'rgba(255, 255, 255, 0.55)',
                  filter: hasReacted ? `drop-shadow(0 0 3px rgba(${colorRGB}, 0.5))` : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
              
              {/* Count - Premium visibility */}
              {count > 0 && (
                <span
                  className="text-[11px] sm:text-xs font-medium tracking-wide"
                  style={{
                    color: hasReacted ? color : 'rgba(255, 255, 255, 0.65)',
                    textShadow: hasReacted ? `0 0 6px rgba(${colorRGB}, 0.4)` : 'none',
                    transition: 'all 0.3s ease',
                    fontWeight: '500',
                  }}
                >
                  {count}
                </span>
              )}
              
              {/* Label - always visible with better contrast, more prominent on hover */}
              <span
                className="text-[9px] sm:text-[10px] tracking-wide uppercase whitespace-nowrap transition-all duration-300"
                style={{
                  color: hasReacted ? color : 'rgba(255, 255, 255, 0.7)',
                  letterSpacing: '0.1em',
                  fontWeight: '500',
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

RoomReactions.propTypes = {
  room: PropTypes.oneOf(['dark', 'philo', 'fantasy']).isRequired,
  reactions: PropTypes.object.isRequired,
  userReactions: PropTypes.arrayOf(PropTypes.string),
  onReact: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default RoomReactions;
