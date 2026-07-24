import { useState } from 'react';
import PropTypes from 'prop-types';
// Lucide icons for dark artistic aesthetic
import { 
  Heart, Flame, Wind, Droplet, // Dark Room - elemental emotions
  Sparkles, Eye, Feather, // Philo Room - contemplation
  Zap, Moon, Stars, Cloud // Fantasy Room - creative imagination
} from 'lucide-react';

/**
 * RoomReactions Component
 * Displays room-specific reaction buttons with artistic dark aesthetic
 * Uses Lucide icons with room-themed colors and subtle glow effects
 */

const ROOM_REACTIONS = {
  dark: [
    { type: 'iFeelYou', label: 'I feel you', icon: Heart, color: '#2EE6FF', colorRGB: '46, 230, 255' },
    { type: 'notGood', label: 'Heavy', icon: Droplet, color: '#2EE6FF', colorRGB: '46, 230, 255' },
    { type: 'youreNotAlone', label: "You're not alone", icon: Wind, color: '#2EE6FF', colorRGB: '46, 230, 255' },
    { type: 'sendingStrength', label: 'Sending strength', icon: Flame, color: '#2EE6FF', colorRGB: '46, 230, 255' }
  ],
  philo: [
    { type: 'lamp', label: 'Insight', icon: Sparkles, color: '#B56DFF', colorRGB: '181, 109, 255' },
    { type: 'spark', label: 'Curiosity', icon: Eye, color: '#B56DFF', colorRGB: '181, 109, 255' },
    { type: 'clap', label: 'Resonance', icon: Feather, color: '#B56DFF', colorRGB: '181, 109, 255' }
  ],
  fantasy: [
    { type: 'vibe', label: 'Vibe', icon: Zap, color: '#FF9D1C', colorRGB: '255, 157, 28' },
    { type: 'dream', label: 'Dream', icon: Moon, color: '#FF9D1C', colorRGB: '255, 157, 28' },
    { type: 'inspire', label: 'Inspire', icon: Stars, color: '#FF9D1C', colorRGB: '255, 157, 28' },
    { type: 'wild', label: 'Wild', icon: Cloud, color: '#FF9D1C', colorRGB: '255, 157, 28' }
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
              }}
              onMouseLeave={(e) => {
                if (!hasReacted) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
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
              
              {/* Label on hover - hidden on small screens */}
              <span
                className="hidden sm:block text-[8px] tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
                style={{
                  color: document.body.classList.contains('light-mode') ? 'rgba(0, 0, 0, 0.55)' : 'rgba(255, 255, 255, 0.5)',
                  letterSpacing: '0.1em',
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
