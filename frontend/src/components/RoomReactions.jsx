import { useState } from 'react';
import PropTypes from 'prop-types';
// Lucide icons for dark artistic aesthetic
import { 
  Heart, Flame, Wind, Droplet, // Dark Room - elemental emotions
  Sparkles, Eye, Feather, // Philo Room - contemplation
  Zap, Moon, Stars, Butterfly // Fantasy Room - creative imagination
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
    { type: 'wild', label: 'Wild', icon: Butterfly, color: '#FF9D1C', colorRGB: '255, 157, 28' }
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
        background: `rgba(${colorRGB}, 0.08)`,
        border: `1px solid rgba(${colorRGB}, 0.25)`,
        boxShadow: `0 0 8px rgba(${colorRGB}, 0.15), inset 0 0 12px rgba(${colorRGB}, 0.05)`,
        transform: 'scale(1.05)',
        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
      };
    }
    
    if (isAnimating) {
      return {
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transform: 'scale(0.95)',
        transition: 'all 0.15s ease',
      };
    }
    
    return {
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
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
              className="group relative px-2 sm:px-2.5 py-1.5 sm:py-2 rounded flex items-center gap-1.5 cursor-pointer outline-none"
              style={getButtonStyle(type, hasReacted, color, colorRGB)}
              title={label}
              onMouseEnter={(e) => {
                if (!hasReacted) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 0 8px rgba(${colorRGB}, 0.1)`;
                }
              }}
              onMouseLeave={(e) => {
                if (!hasReacted) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {/* Icon with subtle glow effect - responsive sizing */}
              <Icon 
                size={14}
                strokeWidth={1.5}
                className="flex-shrink-0"
                style={{
                  color: hasReacted ? color : 'rgba(255, 255, 255, 0.4)',
                  filter: hasReacted ? `drop-shadow(0 0 2px rgba(${colorRGB}, 0.4))` : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
              
              {/* Count - only show if > 0 */}
              {count > 0 && (
                <span
                  className="text-[10px] sm:text-[11px] font-light tracking-wide"
                  style={{
                    color: hasReacted ? color : 'rgba(255, 255, 255, 0.4)',
                    textShadow: hasReacted ? `0 0 4px rgba(${colorRGB}, 0.3)` : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {count}
                </span>
              )}
              
              {/* Label on hover - hidden on small screens */}
              <span
                className="hidden sm:block text-[8px] tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
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
