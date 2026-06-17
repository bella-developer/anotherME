import { memo } from 'react';

/**
 * CircleCard Component
 * Displays a circle with name, description, member count, and join button
 * Requirements: 26.3, 26.4, 26.5, 30.5
 */
const CircleCard = memo(({ circle, onJoinClick, onCircleClick }) => {
  // Truncate description to 2 lines (approximately 100 characters)
  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Handle join button click
  const handleJoinClick = (e) => {
    e.stopPropagation();
    if (onJoinClick) {
      onJoinClick(circle.id);
    }
  };

  // Handle circle card click
  const handleCircleClick = () => {
    if (onCircleClick) {
      onCircleClick(circle.id);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCircleClick();
    }
  };

  return (
    <article
      onClick={handleCircleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${circle.name} circle, ${circle.memberCount || 0} members. ${circle.description || ''}`}
      className="bg-[#1a1a1a] rounded-xl p-5 md:p-6 transition-all duration-200 hover:scale-[1.02] hover:border-2 hover:border-[#8b5cf6] border-2 border-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-primary-bg"
    >
      {/* Circle Name */}
      <h3 className="text-white text-lg md:text-xl font-bold mb-2 line-clamp-1">
        {circle.name}
      </h3>

      {/* Circle Description (2 lines max) */}
      <p className="text-[#a3a3a3] text-sm mb-4 line-clamp-2" style={{ minHeight: '2.5rem' }}>
        {truncateDescription(circle.description, 100)}
      </p>

      {/* Member Count */}
      <div className="flex items-center gap-2 mb-4 text-[#a3a3a3] text-sm" aria-label={`${circle.memberCount || 0} members`}>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span>
          {circle.memberCount || 0} {circle.memberCount === 1 ? 'member' : 'members'}
        </span>
      </div>

      {/* Join Button - Increased touch target on mobile */}
      <button
        onClick={handleJoinClick}
        className="w-full bg-[#8b5cf6] text-white font-medium py-2.5 md:py-2.5 min-h-touch md:min-h-0 rounded-lg transition-all duration-200 hover:bg-[#9d6fff] hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
        aria-label={`Join ${circle.name} circle`}
      >
        Join
      </button>
    </article>
  );
});

CircleCard.displayName = 'CircleCard';

export default CircleCard;
