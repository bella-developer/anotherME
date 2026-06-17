import { useEffect } from 'react';

/**
 * Level Up Modal Component
 * Displays celebration modal when user levels up
 */
function LevelUpModal({ stat, fromLevel, toLevel, onClose }) {
  useEffect(() => {
    // Auto-close after 3 seconds
    const timer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const statColors = {
    genius: 'from-purple-600 to-purple-400',
    hustle: 'from-orange-600 to-orange-400',
    legend: 'from-yellow-600 to-yellow-400',
    depth: 'from-indigo-600 to-indigo-400',
    mystery: 'from-violet-600 to-violet-400',
    wisdom: 'from-blue-600 to-blue-400',
    logic: 'from-cyan-600 to-cyan-400',
    insight: 'from-teal-600 to-teal-400',
    impact: 'from-green-600 to-green-400'
  };

  const statEmojis = {
    genius: '🧠',
    hustle: '💪',
    legend: '⭐',
    depth: '🌊',
    mystery: '🔮',
    wisdom: '📚',
    logic: '🧩',
    insight: '💡',
    impact: '🎯'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0A0A0A] border-2 border-[#333] rounded-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
        {/* Celebration Icon */}
        <div className="text-center mb-6">
          <div className="inline-block animate-bounce">
            <span className="text-6xl">{statEmojis[stat] || '🎉'}</span>
          </div>
        </div>

        {/* Level Up Message */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Level Up!</h2>
          <p className="text-[#918A87] mb-4">
            Your <span className="capitalize text-white">{stat}</span> stat increased
          </p>
          
          {/* Level Display */}
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#666]">{fromLevel}</div>
              <div className="text-xs text-[#666]">Previous</div>
            </div>
            
            <div className={`text-3xl bg-gradient-to-r ${statColors[stat] || 'from-gray-600 to-gray-400'} bg-clip-text text-transparent`}>
              →
            </div>
            
            <div className="text-center">
              <div className={`text-4xl font-bold bg-gradient-to-r ${statColors[stat] || 'from-gray-600 to-gray-400'} bg-clip-text text-transparent`}>
                {toLevel}
              </div>
              <div className="text-xs text-[#918A87]">New Level</div>
            </div>
          </div>
        </div>

        {/* Celebration Message */}
        <div className="text-center">
          <p className="text-[#918A87] text-sm">
            Keep posting quality content to level up even more!
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-[#D97757] text-black font-medium rounded-lg hover:bg-[#E68868] transition-colors"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}

export default LevelUpModal;
