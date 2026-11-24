import PropTypes from 'prop-types';

/**
 * TopicPost Component
 * Displays a post as a circle's conversation topic with distinctive styling
 * Shows only the content/body - no circles, no reactions
 * Features: Reddish border, "TOPIC" badge, room origin label
 */
function TopicPost({ post }) {
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getRoomLabel = () => {
    switch (post.room) {
      case 'dark': return 'Dark Room';
      case 'fantasy': return 'Fantasy Room';
      case 'philo': return 'Philo Room';
      default: return 'Sanctuary';
    }
  };

  const roomColor = post.room === 'fantasy' 
    ? '#DB762E' 
    : post.room === 'philo' 
    ? '#7771D9' 
    : '#B44A4A';

  return (
    <article 
      className="relative rounded-xl p-5 sm:p-6 mb-2 font-mono transition-all duration-300"
      style={{
        backgroundColor: 'rgba(25, 24, 32, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderLeft: `3px solid ${roomColor}`,
        boxShadow: `0 4px 24px rgba(0, 0, 0, 0.45), 0 0 20px ${roomColor}15`,
      }}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span 
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white"
            style={{
              backgroundColor: roomColor,
              boxShadow: `0 0 10px ${roomColor}40`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>TOPIC</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: roomColor }}>
            From {getRoomLabel()}
          </span>
        </div>

        <span className="text-[10px] text-[#928B91] tracking-wide">
          {formatTimeAgo(post.createdAt)}
        </span>
      </div>

      {/* Content */}
      <div className="mb-4">
        {post.title && (
          <div className="mb-3">
            <h2 className="text-base sm:text-lg font-bold text-[#E7DED5] leading-snug tracking-tight">
              {post.title}
            </h2>
          </div>
        )}
        <div 
          className="text-sm leading-relaxed text-[#E7DED5]/90 space-y-2 font-sans"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Image Display */}
        {post.image?.url && (
          <div className="mt-4">
            <div
              className="relative overflow-hidden rounded-lg p-2"
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
              }}
            >
              <img
                src={post.image.url}
                alt="Post attachment"
                className="w-full h-auto rounded"
                style={{
                  display: 'block',
                  maxHeight: '480px',
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Topic Info Footer */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] text-center">
        <p className="text-[10px] text-[#928B91] italic tracking-wide">
          This post serves as the conversation starter for this circle. Share your thoughts below.
        </p>
      </div>
    </article>
  );
}

TopicPost.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    room: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
  }).isRequired
};

export default TopicPost;
