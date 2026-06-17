import { useState } from 'react';
import PropTypes from 'prop-types';
// Dark Room Icons - Emotional support and empathy
import { FaHandHoldingHeart, FaHandsHelping, FaFistRaised } from 'react-icons/fa';
import { MdOutlineDangerous } from 'react-icons/md';
// Philo Room Icons - Wisdom and contemplation
import { HiLightBulb } from 'react-icons/hi';
import { IoSparkles } from 'react-icons/io5';
import { GiMeditation } from 'react-icons/gi';
// Climb Room Icons - Progress and innovation
import { BiSolidUpArrow, BiSolidDownArrow } from 'react-icons/bi';
import { IoSettings } from 'react-icons/io5';
import { RiRocketFill } from 'react-icons/ri';

/**
 * RoomReactions Component
 * Displays room-specific reaction buttons with appropriate styling and feedback
 */

const ROOM_REACTIONS = {
  dark: [
    { type: 'iFeelYou', label: 'I feel you', icon: FaHandHoldingHeart, color: 'text-purple-400' },
    { type: 'notGood', label: 'Not good', icon: MdOutlineDangerous, color: 'text-gray-500' },
    { type: 'youreNotAlone', label: "You're not alone", icon: FaHandsHelping, color: 'text-blue-400' },
    { type: 'sendingStrength', label: 'Sending strength', icon: FaFistRaised, color: 'text-orange-400' }
  ],
  philo: [
    { type: 'lamp', label: 'Insight', icon: HiLightBulb, color: 'text-yellow-400' },
    { type: 'spark', label: 'Curiosity', icon: IoSparkles, color: 'text-cyan-400' },
    { type: 'clap', label: 'Resonance', icon: GiMeditation, color: 'text-green-400' }
  ],
  climb: [
    { type: 'push', label: 'Push', icon: BiSolidUpArrow, color: 'text-green-500' },
    { type: 'pull', label: 'Pull', icon: BiSolidDownArrow, color: 'text-red-500' },
    { type: 'gear', label: 'Gear', icon: IoSettings, color: 'text-blue-500' },
    { type: 'rocket', label: 'Rocket', icon: RiRocketFill, color: 'text-purple-500' }
  ]
};

const FEEDBACK_MESSAGES = {
  dark: {
    iFeelYou: 'Someone felt this.',
    notGood: 'This was heavy.',
    youreNotAlone: 'You were witnessed.',
    sendingStrength: 'You endured.'
  },
  philo: {
    lamp: 'That clarified something.',
    spark: 'This opened a question.',
    clap: 'This felt true.'
  },
  climb: {
    push: 'Keep climbing!',
    pull: 'Refine and iterate.',
    gear: "That's practical genius.",
    rocket: "You're onto something big!"
  }
};

function RoomReactions({ room, reactions, userReactions = [], onReact, disabled = false }) {
  const [showFeedback, setShowFeedback] = useState(null);
  const [animatingReaction, setAnimatingReaction] = useState(null);

  const roomReactions = ROOM_REACTIONS[room] || [];

  const handleReactionClick = async (reactionType) => {
    if (disabled) return;

    const hasReacted = userReactions.includes(reactionType);
    
    // Optimistic UI update
    setAnimatingReaction(reactionType);
    
    try {
      await onReact(reactionType, hasReacted);
      
      // Show feedback message only on successful reaction
      if (!hasReacted) {
        const message = FEEDBACK_MESSAGES[room]?.[reactionType] || 'Reaction added.';
        setShowFeedback({ type: reactionType, message });
        
        // Hide feedback after delay (room-specific timing)
        const delay = room === 'climb' ? 2000 : room === 'philo' ? 3000 : 2500;
        setTimeout(() => setShowFeedback(null), delay);
      }
    } catch (error) {
      console.error('Failed to react:', error);
      // Don't show feedback on error - the error is already handled by parent
    } finally {
      setTimeout(() => setAnimatingReaction(null), 300);
    }
  };

  // Room-specific styling
  const getRoomStyle = () => {
    switch (room) {
      case 'dark':
        return 'bg-black/50 backdrop-blur-sm';
      case 'philo':
        return 'bg-gray-900/50 backdrop-blur-sm';
      case 'climb':
        return 'bg-black/10 backdrop-blur-sm';
      default:
        return 'bg-gray-800/50';
    }
  };

  const getButtonStyle = (reactionType, hasReacted) => {
    const base = 'px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm';
    const isAnimating = animatingReaction === reactionType;
    
    if (hasReacted) {
      return `${base} bg-white/10 border border-white/20 scale-105`;
    }
    
    if (isAnimating) {
      return `${base} bg-white/5 border border-white/10 scale-95`;
    }
    
    return `${base} bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105`;
  };

  return (
    <div className={`relative p-4 rounded-lg ${getRoomStyle()}`}>
      {/* Feedback Toast */}
      {showFeedback && (
        <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-sm text-white/90 whitespace-nowrap animate-fade-in-out ${
          room === 'dark' ? 'bg-black/80' : 
          room === 'philo' ? 'bg-gray-800/80' : 
          'bg-purple-900/80'
        }`}>
          {showFeedback.message}
        </div>
      )}

      {/* Reaction Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {roomReactions.map(({ type, label, icon: Icon, color }) => {
          const count = reactions[type] || 0;
          const hasReacted = userReactions.includes(type);
          
          return (
            <button
              key={type}
              onClick={() => handleReactionClick(type)}
              disabled={disabled}
              className={getButtonStyle(type, hasReacted)}
              title={label}
            >
              <Icon className={`text-lg ${hasReacted ? color : 'text-gray-400'} transition-colors duration-200`} />
              {count > 0 && (
                <span className={`font-medium ${hasReacted ? 'text-white' : 'text-gray-400'}`}>
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
  room: PropTypes.oneOf(['dark', 'philo', 'climb']).isRequired,
  reactions: PropTypes.object.isRequired,
  userReactions: PropTypes.arrayOf(PropTypes.string),
  onReact: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default RoomReactions;
