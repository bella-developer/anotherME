import { useEffect, useState } from 'prop-types';
import PropTypes from 'prop-types';

/**
 * LevelUpNotification Component
 * Shows room-specific level-up notifications with appropriate styling
 */

const STAT_LABELS = {
  // Dark Room
  shadow: { label: 'Shadow', icon: '🌑', description: 'Depth unlocked' },
  ghost: { label: 'Ghost', icon: '👻', description: 'Vulnerability embraced' },
  rogue: { label: 'Rogue', icon: '🗡️', description: 'Courage earned' },
  
  // Philo Room
  wise: { label: 'Wise', icon: '🦉', description: 'Clarity achieved' },
  soulLevel: { label: 'Soul-Level', icon: '💙', description: 'Truth felt' },
  godmode: { label: 'Godmode', icon: '✨', description: 'Synthesis reached' },
  
  // Climb Room
  genius: { label: 'Genius', icon: '🧠', description: 'Innovation sparked' },
  hustle: { label: 'Hustle', icon: '🔥', description: 'Momentum built' },
  legend: { label: 'Legend', icon: '👑', description: 'Impact made' }
};

function LevelUpNotification({ room, levelUp, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Auto-close after duration (room-specific)
    const duration = room === 'dark' ? 3000 : room === 'philo' ? 4000 : 2500;
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade-out animation
    }, duration);
    
    return () => clearTimeout(timer);
  }, [room, onClose]);

  if (!levelUp) return null;

  const statConfig = STAT_LABELS[levelUp.stat];
  if (!statConfig) return null;

  // Room-specific styling
  const getRoomStyle = () => {
    switch (room) {
      case 'dark':
        return {
          bg: 'bg-gradient-to-r from-gray-900 to-black',
          border: 'border-gray-700',
          glow: 'shadow-lg shadow-gray-900/50',
          animation: 'animate-fade-in'
        };
      case 'philo':
        return {
          bg: 'bg-gradient-to-r from-gray-800 to-gray-900',
          border: 'border-gray-600',
          glow: 'shadow-lg shadow-gray-800/50',
          animation: 'animate-fade-in'
        };
      case 'climb':
        return {
          bg: 'bg-gradient-to-r from-purple-900 to-blue-900',
          border: 'border-purple-600',
          glow: 'shadow-lg shadow-purple-900/50',
          animation: 'animate-scale-in'
        };
      default:
        return {
          bg: 'bg-gray-900',
          border: 'border-gray-700',
          glow: 'shadow-lg',
          animation: 'animate-fade-in'
        };
    }
  };

  const style = getRoomStyle();

  return (
    <div
      className={`fixed top-20 right-4 z-50 ${isVisible ? style.animation : 'animate-fade-out'}`}
    >
      <div className={`${style.bg} ${style.border} ${style.glow} border-2 rounded-xl p-6 max-w-sm`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{statConfig.icon}</span>
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">
                Level Up
              </div>
              <div className="text-xl font-bold text-white">
                {statConfig.label}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Level Progress */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-400">
              {levelUp.oldLevel}
            </div>
          </div>
          <div className="text-2xl text-gray-500">→</div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white animate-pulse-slow">
              {levelUp.newLevel}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="text-center text-sm text-gray-400 italic">
          {statConfig.description}
        </div>

        {/* XP Gained */}
        <div className="mt-4 text-center text-xs text-gray-500">
          +{levelUp.xpGained} XP
        </div>
      </div>
    </div>
  );
}

LevelUpNotification.propTypes = {
  room: PropTypes.oneOf(['dark', 'philo', 'climb']).isRequired,
  levelUp: PropTypes.shape({
    stat: PropTypes.string.isRequired,
    oldLevel: PropTypes.number.isRequired,
    newLevel: PropTypes.number.isRequired,
    xpGained: PropTypes.number.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

export default LevelUpNotification;
