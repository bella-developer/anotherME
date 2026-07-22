import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaPen, FaTrash } from 'react-icons/fa';
import RoomReactions from './RoomReactions';
import ConfirmDialog from './ConfirmDialog';

/**
 * Dark Room Card Component
 * Professional mobile-first design with clean typography and spacing
 */
function DarkRoomCard({ post, onReaction, onEdit, onDelete }) {
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
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-5 pt-4 sm:pt-5 pb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <time className="text-[11px] tracking-wide font-medium accent-text" style={{ 
            fontFamily: 'var(--font-accent)', 
            color: 'rgba(255, 255, 255, 0.4)' 
          }}>
            {formatTimeAgo(post.createdAt)}
          </time>
          {post.category && (
            <span className="px-2.5 py-1 rounded-full text-[9px] uppercase tracking-widest border" style={{
              backgroundColor: 'rgba(46, 230, 255, 0.08)',
              color: '#c9d1d9',
              borderColor: 'rgba(46, 230, 255, 0.15)',
              fontWeight: '300'
            }}>
              {post.category}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {post.isAuthor && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onEdit?.(post)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                title="Edit post"
                aria-label="Edit post"
              >
                <FaPen className="text-white/50 hover:text-white/80" size={11} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-full hover:bg-red-500/15 transition-colors"
                title="Delete post"
                aria-label="Delete post"
              >
                <FaTrash className="text-red-400/50 hover:text-red-400/80" size={11} />
              </button>
            </div>
          )}
          {post.commentCount > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] text-white/40 font-medium">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.commentCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
        {/* Title */}
        {post.title && (
          <h2 
            className="text-2xl sm:text-3xl text-white mb-4 sm:mb-5 leading-tight heading-text"
            style={{
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.02em',
              fontWeight: '700',
            }}
          >
            {post.title}
          </h2>
        )}

        {/* Content Text */}
        <div 
          className="text-[15px] sm:text-base text-white/85 leading-relaxed mb-5 typewriter-text-light"
          style={{
            fontFamily: 'var(--font-body)',
            lineHeight: '1.8',
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Image and Circles Container */}
        {post.image?.url && (
          <div className="flex gap-3 mb-5">
            {/* Image - 80% width */}
            <div className="flex-[0_0_80%] overflow-hidden">
              <div
                className="relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                  borderRadius: '3px',
                  padding: '12px',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.04), inset 0 0 20px rgba(0,0,0,0.3)',
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
                    alt={post.title || 'Post image'}
                    className="w-full h-auto object-contain"
                    style={{
                      display: 'block',
                    }}
                    loading="lazy"
                  />
                </div>
                {/* Corner frames - Red for Dark Room */}
                <div className="absolute top-2 left-2" style={{ width: '16px', height: '16px', borderTop: '2px solid rgba(239, 68, 68, 0.25)', borderLeft: '2px solid rgba(239, 68, 68, 0.25)' }} />
                <div className="absolute top-2 right-2" style={{ width: '16px', height: '16px', borderTop: '2px solid rgba(239, 68, 68, 0.25)', borderRight: '2px solid rgba(239, 68, 68, 0.25)' }} />
                <div className="absolute bottom-2 left-2" style={{ width: '16px', height: '16px', borderBottom: '2px solid rgba(239, 68, 68, 0.25)', borderLeft: '2px solid rgba(239, 68, 68, 0.25)' }} />
                <div className="absolute bottom-2 right-2" style={{ width: '16px', height: '16px', borderBottom: '2px solid rgba(239, 68, 68, 0.25)', borderRight: '2px solid rgba(239, 68, 68, 0.25)' }} />
              </div>
            </div>

            {/* Circles - 20% width */}
            {post.circles && post.circles.length > 0 && (
              <div className="flex-[0_0_20%] flex flex-col gap-2 justify-center items-center overflow-hidden">
                {post.circles.map((circle, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const circleIdToUse = circle.circleId || circle.id;
                      if (circleIdToUse) {
                        navigate(`/circles/${circleIdToUse}?from=post&postId=${post.id}`);
                      }
                    }}
                    className="flex items-center justify-center text-[9px] font-extrabold uppercase transition-all duration-200 leading-none"
                    style={{
                      width: 'min(100%, 55px)',
                      height: 'min(100%, 40px)',
                      borderRadius: '50% / 60%',
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: 'rgba(239, 68, 68, 1)',
                      border: '1.5px solid rgba(239, 68, 68, 0.4)',
                      padding: '4px 6px',
                    }}
                    title={`View in ${circle.fullName || circle.name}`}
                  >
                    <span className="block truncate text-center max-w-full px-0.5" style={{ lineHeight: '1.1' }}>
                      {circle.name.charAt(0).toUpperCase() + circle.name.slice(1).toLowerCase()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Circles without image */}
        {!post.image?.url && post.circles && post.circles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {post.circles.map((circle, index) => (
              <button
                key={index}
                onClick={() => {
                  const circleIdToUse = circle.circleId || circle.id;
                  if (circleIdToUse) {
                    navigate(`/circles/${circleIdToUse}?from=post&postId=${post.id}`);
                  }
                }}
                className="px-3 py-1.5 text-[10px] tracking-wider font-medium uppercase transition-all duration-200 rounded-full hover:bg-white/15"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                title={`View in ${circle.fullName || circle.name}`}
              >
                {circle.icon && <span className="mr-1.5">{circle.icon}</span>}
                {circle.name}
              </button>
            ))}
          </div>
        )}

        {/* Reactions */}
        <div className="pt-5 border-t" style={{ borderColor: 'rgba(46, 230, 255, 0.2)' }}>
          <RoomReactions
            room="dark"
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

DarkRoomCard.propTypes = {
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

export default DarkRoomCard;
