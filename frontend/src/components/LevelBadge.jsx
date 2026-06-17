/**
 * LevelBadge Component
 * Displays a colored level badge based on stat and level
 */
function LevelBadge({ stat, level, size = 'sm' }) {
  // Stat colors and labels
  const statConfig = {
    genius: {
      label: 'Genius',
      colors: 'bg-gradient-to-r from-purple-600 to-purple-400',
      textColor: 'text-white',
      borderColor: 'border-purple-500/50'
    },
    hustle: {
      label: 'Hustle',
      colors: 'bg-gradient-to-r from-orange-600 to-orange-400',
      textColor: 'text-white',
      borderColor: 'border-orange-500/50'
    },
    legend: {
      label: 'Legend',
      colors: 'bg-gradient-to-r from-yellow-600 to-yellow-400',
      textColor: 'text-white',
      borderColor: 'border-yellow-500/50'
    },
    depth: {
      label: 'Depth',
      colors: 'bg-gradient-to-r from-indigo-600 to-indigo-400',
      textColor: 'text-white',
      borderColor: 'border-indigo-500/50'
    },
    mystery: {
      label: 'Mystery',
      colors: 'bg-gradient-to-r from-violet-600 to-violet-400',
      textColor: 'text-white',
      borderColor: 'border-violet-500/50'
    },
    wisdom: {
      label: 'Wisdom',
      colors: 'bg-gradient-to-r from-blue-600 to-blue-400',
      textColor: 'text-white',
      borderColor: 'border-blue-500/50'
    },
    logic: {
      label: 'Logic',
      colors: 'bg-gradient-to-r from-cyan-600 to-cyan-400',
      textColor: 'text-white',
      borderColor: 'border-cyan-500/50'
    },
    insight: {
      label: 'Insight',
      colors: 'bg-gradient-to-r from-teal-600 to-teal-400',
      textColor: 'text-white',
      borderColor: 'border-teal-500/50'
    },
    impact: {
      label: 'Impact',
      colors: 'bg-gradient-to-r from-green-600 to-green-400',
      textColor: 'text-white',
      borderColor: 'border-green-500/50'
    }
  };

  const config = statConfig[stat] || statConfig.genius;

  // Size variants
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${config.colors} ${config.textColor} ${sizeClasses[size]}
        border ${config.borderColor}
        shadow-sm
      `}
    >
      <span className="capitalize">{config.label}</span>
      <span className="font-bold">Lv.{level}</span>
    </span>
  );
}

export default LevelBadge;
