import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaPen, FaTrash } from 'react-icons/fa';
import RoomReactions from './RoomReactions';
import ConfirmDialog from './ConfirmDialog';

/**
 * Fantasy Room Card Component
 * Professional mobile-first design with clean typography and spacing
 */
function FantasyRoomCard({ post, onReaction, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <article
      className="relative mb-6 transition-all duration-200 analog-texture paper-texture overflow-hidden"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 8px 32px rgba(0,0,0,0.5)',
        borderRadius: '24px',
        maxHeight: '520px',
        minHeight: '420px',
      }}
    >
      {/* Header Bar - Compact */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <time className="text-[10px] tracking-wide font-medium accent-text" style={{ 
            fontFamily: 'var(--font-accent)', 
            color: 'rgba(255, 255, 255, 0.35)' 
          }}>
            {formatTimeAgo(post.createdAt)}
          </time>
          {post.category && (
            <span className="px-2 py-0.5 rounded-full text-[8px] uppercase tracking-widest border" style={{
              backgroundColor: 'rgba(249, 115, 22, 0.08)',
              color: '#c9d1d9',
              borderColor: 'rgba(249, 115, 22, 0.15)',
              fontWeight: '300'
            }}>
              {post.category}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {post.isAuthor && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit?.(post)}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                title="Edit post"
                aria-label="Edit post"
              >
                <FaPen className="text-white/50 hover:text-white/80" size={10} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 rounded-full hover:bg-red-500/15 transition-colors"
                title="Delete post"
                aria-label="Delete post"
              >
                <FaTrash className="text-red-400/50 hover:text-red-400/80" size={10} />
              </button>
            </div>
          )}
          {post.commentCount > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-white/35 font-medium">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.commentCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Compact with controlled height */}
      <div className="px-5 pb-4 flex flex-col" style={{ maxHeight: '460px' }}>
        {/* Title - More compact */}
        {post.title && (
          <h2 
            className="text-lg sm:text-xl text-white mb-3 leading-tight heading-text line-clamp-2"
            style={{
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.01em',
              fontWeight: '700',
            }}
          >
            {post.title}
          </h2>
        )}

        {/* Content Text - Truncated with line-clamp */}
        <div 
          className="text-[13px] sm:text-[14px] text-white/75 leading-relaxed mb-4 typewriter-text-light line-clamp-3"
          style={{
            fontFamily: 'var(--font-body)',
            lineHeight: '1.6',
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Image and Circles Container - Compact artistic layout */}
        {post.image?.url && (
          <div className="flex gap-2 mb-3 flex-1">
            {/* Image - More compact with rounded corners */}
            <div className="flex-[0_0_75%] overflow-hidden">
              <div
                className="relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
                  borderRadius: '16px',
                  padding: '8px',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.03), inset 0 0 15px rgba(0,0,0,0.3)',
                  maxHeight: '240px',
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    borderRadius: '12px',
                    boxShadow: 'inset 0 0 12px rgba(0,0,0,0.5)',
                    maxHeight: '224px',
                  }}
                >
                  <img
                    src={post.image.url}
                    alt={post.title || 'Post image'}
                    className="w-full h-full object-contain"
                    style={{
                      display: 'block',
                      maxHeight: '224px',
                    }}
                    loading="lazy"
                  />
                </div>
                {/* Corner frames - Orange for Fantasy Room - Smaller */}
                <div className="absolute top-1.5 left-1.5" style={{ width: '12px', height: '12px', borderTop: '1.5px solid rgba(251, 146, 60, 0.25)', borderLeft: '1.5px solid rgba(251, 146, 60, 0.25)' }} />
                <div className="absolute top-1.5 right-1.5" style={{ width: '12px', height: '12px', borderTop: '1.5px solid rgba(251, 146, 60, 0.25)', borderRight: '1.5px solid rgba(251, 146, 60, 0.25)' }} />
                <div className="absolute bottom-1.5 left-1.5" style={{ width: '12px', height: '12px', borderBottom: '1.5px solid rgba(251, 146, 60, 0.25)', borderLeft: '1.5px solid rgba(251, 146, 60, 0.25)' }} />
                <div className="absolute bottom-1.5 right-1.5" style={{ width: '12px', height: '12px', borderBottom: '1.5px solid rgba(251, 146, 60, 0.25)', borderRight: '1.5px solid rgba(251, 146, 60, 0.25)' }} />
              </div>
            </div>

            {/* Circles - Compact stacked vertically */}
            {post.circles && post.circles.length > 0 && (
              <div className="flex-[0_0_25%] flex flex-col gap-1.5 justify-center items-center overflow-hidden">
                {post.circles.slice(0, 3).map((circle, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const circleIdToUse = circle.circleId || circle.id;
                      if (circleIdToUse) {
                        navigate(`/circles/${circleIdToUse}?from=post&postId=${post.id}`);
                      }
                    }}
                    className="flex items-center justify-center text-[8px] font-extrabold uppercase transition-all duration-200 leading-none"
                    style={{
                      width: '100%',
                      maxWidth: '48px',
                      height: '32px',
                      borderRadius: '50% / 60%',
                      background: 'rgba(251, 146, 60, 0.12)',
                      color: 'rgba(251, 146, 60, 1)',
                      border: '1px solid rgba(251, 146, 60, 0.3)',
                      padding: '3px 5px',
                    }}
                    title={`View in ${circle.fullName || circle.name}`}
                  >
                    <span className="block truncate text-center max-w-full px-0.5" style={{ lineHeight: '1.1', fontSize: '7px' }}>
                      {circle.name.charAt(0).toUpperCase() + circle.name.slice(1, 6).toLowerCase()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Circles without image - Compact horizontal layout */}
        {!post.image?.url && post.circles && post.circles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.circles.slice(0, 4).map((circle, index) => (
              <button
                key={index}
                onClick={() => {
                  const circleIdToUse = circle.circleId || circle.id;
                  if (circleIdToUse) {
                    navigate(`/circles/${circleIdToUse}?from=post&postId=${post.id}`);
                  }
                }}
                className="px-2 py-1 text-[9px] tracking-wider font-medium uppercase transition-all duration-200 rounded-full hover:bg-white/15"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                title={`View in ${circle.fullName || circle.name}`}
              >
                {circle.icon && <span className="mr-1">{circle.icon}</span>}
                {circle.name.slice(0, 8)}
              </button>
            ))}
          </div>
        )}

        {/* Reactions - Compact footer */}
        <div className="pt-3 border-t mt-auto" style={{ borderColor: 'rgba(168, 85, 247, 0.15)' }}>
          <RoomReactions
            room="fantasy"
            reactions={post.reactions || {}}
            userReactions={post.userReactions || []}
            onReact={(reactionType) => onReaction?.(post.id, reactionType)}
            disabled={post.isAuthor}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete?.(post.id);
          setShowDeleteConfirm(false);
        }}
        type="danger"
      />
    </article>
  );
}

FantasyRoomCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    category: PropTypes.string,
    reactions: PropTypes.object,
    isAuthor: PropTypes.bool,
    commentCount: PropTypes.number,
    circles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        circleId: PropTypes.string,
        name: PropTypes.string.isRequired,
        fullName: PropTypes.string,
        icon: PropTypes.string,
      })
    ),
    image: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }),
    userReactions: PropTypes.array,
  }).isRequired,
  onReaction: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default FantasyRoomCard;
