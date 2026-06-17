import { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * StatDisplay Component
 * Displays user stats with room-specific styling and animations
 */

const STAT_CONFIG = {
  dark: {
    shadow: { label: 'Shadow', color: 'from-gray-700 to-gray-900', icon: '🌑' },
    ghost: { label: 'Ghost', color: 'from-purple-700 to-purple-900', icon: '👻' },
    rogue: { label: 'Rogue', color: 'from-red-700 to-red-900', icon: '🗡️' }
  },
  philo: {
    wise: { label: 'Wise', color: 'from-yellow-600 to-yellow-800', icon: '🦉' },
    soulLevel: { label: 'Soul-Level', color: 'from-blue-600 to-blue-800', icon: '💙' },
    godmode: { label: 'Godmode', color: 'from-purple-600 to-purple-800', icon: '✨' }
  },
  climb: {
    genius: { label: 'Genius', color: 'from-cyan-600 to-cyan-800', icon: '🧠' },
    hustle: { label: 'Hustle', color: 'from-orange-600 to-orange-800', icon: '🔥' },
    legend: { label: 'Legend', color: 'from-purple-600 to-purple-800', icon: '👑' }
  }
};

function StatDisplay({ room, stats, compact = false }) {
  const roomConfig = STAT_CONFIG[room];
  
  if (!roomConfig || !stats) {
    return null;
  }

  const calculateProgress = (xp, level) => {
    const thresholds = [0, 101, 251, 501, 1001, 2001, 4001, 8001, 16001, 32001];
    const currentThreshold = thresholds[level - 1] || 0;
    const nextThreshold = thresholds[level] || thresholds[thresholds.length - 1];
    
    if (level >= 10) return 100; // Max level
    
    const xpInLevel = xp - currentThreshold;
    const xpForLevel = nextThreshold - currentThreshold;
    
    return Math.min(100, (xpInLevel / xpForLevel) * 100);
  };

  const getRoomStyle = () => {
    switch (room) {
      case 'dark':
        return 'bg-black/80 border-gray-800';
      case 'philo':
        return 'bg-gray-900/80 border-gray-700';
      case 'climb':
        return 'bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-700';
      default:
        return 'bg-gray-800/80 border-gray-700';
    }
  };

  if (compact) {
    // Compact view for profile badges
    return (
      <div className="flex gap-2">
        {Object.entries(roomConfig).map(([statKey, config]) => {
          const statData = stats[statKey];
          if (!statData) return null;
          
          return (
            <div
              key={statKey}
              className="flex items-center gap-1 px-2 py-1 bg-black/50 rounded-full text-xs"
              title={`${config.label}: Level ${statData.level}`}
            >
              <span>{config.icon}</span>
              <span className="font-bold text-white">{statData.level}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // Full view for profile page
  return (
    <div className={`p-6 rounded-xl border ${getRoomStyle()}`}>
      <h3 className="text-xl font-bold text-white mb-4 capitalize">
        {room} Room Stats
      </h3>
      
      <div className="space-y-4">
        {Object.entries(roomConfig).map(([statKey, config]) => {
          const statData = stats[statKey];
          if (!statData) return null;
          
          const progress = calculateProgress(statData.xp, statData.level);
          
          return (
            <div key={statKey} className="space-y-2">
              {/* Stat Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{config.icon}</span>
                  <span className="font-semibold text-white">{config.label}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    Level {statData.level}
                  </div>
                  <div className="text-xs text-gray-400">
                    {statData.xp} XP
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-3 bg-black/50 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${config.color} transition-all duration-500 ease-out`}
                  style={{ width: `${progress}%` }}
                >
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
                
                {/* Progress percentage */}
                {progress > 10 && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white/90">
                    {Math.round(progress)}%
                  </div>
                )}
              </div>
              
              {/* Next Level Info */}
              {statData.level < 10 && statData.nextLevelXP && (
                <div className="text-xs text-gray-500 text-right">
                  {statData.nextLevelXP - statData.xp} XP to Level {statData.level + 1}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

StatDisplay.propTypes = {
  room: PropTypes.oneOf(['dark', 'philo', 'climb']).isRequired,
  stats: PropTypes.object.isRequired,
  compact: PropTypes.bool
};

export default StatDisplay;
