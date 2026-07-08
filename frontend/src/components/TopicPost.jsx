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
      default: return '';
    }
  };

  return (
    <div 
      className="bg-[#1A1412] rounded-lg p-5 mb-6 relative"
      style={{
        border: '2px solid #D97757',
        boxShadow: '0 0 15px rgba(217, 119, 87, 0.2)'
      }}
    >
      {/* Topic Badge */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <span className="px-2 py-0.5 bg-[#D97757] text-black text-[10px] font-bold uppercase tracking-wider rounded">
          Topic
        </span>
        <span className="text-[10px] text-[#6B5E59] tracking-wider">
          {formatTimeAgo(post.createdAt)}
        </span>
      </div>

      {/* Room Origin Badge */}
      <div className="mb-3">
        <span className="text-[10px] text-[#D97757] uppercase tracking-wider">
          From {getRoomLabel()}
        </span>
      </div>

      {/* Content - Only the post body */}
      <div className="mb-4">
        {post.title && (
          <h2 className="text-lg text-[#F5E6D3] mb-2 font-light leading-relaxed">
            {post.title}
          </h2>
        )}
        <div 
          className="text-[#F5E6D3] space-y-2 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Image Display */}
        {post.image?.url && (
          <div className="mt-4">
            <div
              className="relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                borderRadius: '3px',
                padding: '12px',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.1), inset 0 0 20px rgba(0,0,0,0.3)',
              }}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  borderRadius: '2px',
                  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)',
                }}
              >
                <img
                  src={post.image.url}
                  alt="Post attachment"
                  className="w-full h-auto"
                  style={{
                    display: 'block',
                    maxHeight: '500px',
                    objectFit: 'contain',
                  }}
                />
              </div>

              {/* Decorative corner accents */}
              <div
                className="absolute top-2 left-2"
                style={{
                  width: '16px',
                  height: '16px',
                  borderTop: '2px solid rgba(255,255,255,0.2)',
                  borderLeft: '2px solid rgba(255,255,255,0.2)',
                }}
              />
              <div
                className="absolute top-2 right-2"
                style={{
                  width: '16px',
                  height: '16px',
                  borderTop: '2px solid rgba(255,255,255,0.2)',
                  borderRight: '2px solid rgba(255,255,255,0.2)',
                }}
              />
              <div
                className="absolute bottom-2 left-2"
                style={{
                  width: '16px',
                  height: '16px',
                  borderBottom: '2px solid rgba(255,255,255,0.2)',
                  borderLeft: '2px solid rgba(255,255,255,0.2)',
                }}
              />
              <div
                className="absolute bottom-2 right-2"
                style={{
                  width: '16px',
                  height: '16px',
                  borderBottom: '2px solid rgba(255,255,255,0.2)',
                  borderRight: '2px solid rgba(255,255,255,0.2)',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Topic Info Footer */}
      <div className="mt-4 pt-3 text-center">
        <p className="text-[10px] text-[#6B5E59] italic">
          This post serves as the conversation starter for this circle. Share your thoughts below.
        </p>
      </div>
    </div>
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
