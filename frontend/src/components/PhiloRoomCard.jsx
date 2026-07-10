import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaPen, FaTrash } from 'react-icons/fa';
import RoomReactions from './RoomReactions';
import ConfirmDialog from './ConfirmDialog';

/**
 * Philo Room Post Card Component
 * For philosophical reflection and contemplation
 * Feedback: Icon-based with Lamp/Spark/Clap system
 */
function PhiloRoomCard({ post, onReaction, onEdit, onDelete }) {
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
    <div
      className="relative p-7 mb-4 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: 'rgba(0, 0, 0, 0.3)', // 70% transparent
        backdropFilter: 'blur(10px)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
        borderRadius: '4px',
      }}
    >
      {/* Metadata */}
      <div className="flex items-center justify-between mb-6 text-xs text-[#6B5E59]">
        <div className="flex items-center gap-3">
          <span className="tracking-wider">{formatTimeAgo(post.createdAt)}</span>
          {/* Category Badge */}
          {post.category && (
            <span className="px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wider bg-purple-900/20 text-purple-400 border border-purple-900/30">
              {post.category}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {/* Edit/Delete buttons - only for author */}
          {post.isAuthor && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit?.(post)}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                title="Edit post"
              >
                <FaPen className="text-white/40 hover:text-white/70" size={10} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 rounded hover:bg-red-900/20 transition-colors"
                title="Delete post"
              >
                <FaTrash className="text-red-400/40 hover:text-red-400/70" size={10} />
              </button>
            </div>
          )}
          {post.commentCount > 0 && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="tracking-wider">{post.commentCount} {post.commentCount === 1 ? 'response' : 'responses'}</span>
            </div>
          )}
          {post.stateLabel && (
            <span className="uppercase tracking-wider">{post.stateLabel}</span>
          )}
        </div>
      </div>

      {/* Content and Circles Container */}
      <div className="flex gap-6 mb-8">
        {/* Content */}
        <div className="flex-1 min-w-0">
          {post.title && (
            <h3 
              className="text-[22px] text-[#F5E6D3] mb-4 font-bold tracking-tight leading-snug"
              style={{
                fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                letterSpacing: '-0.02em'
              }}
            >
              {post.title}
            </h3>
          )}
          <div 
            className="text-[#F5E6D3] space-y-5 prose prose-invert max-w-none"
            style={{
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Image Display */}
          {post.image?.url && (
            <div className="mt-6">
              <div
                className="relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  borderRadius: '3px',
                  padding: '8px',
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
                      maxHeight: '400px',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div className="absolute top-2 left-2" style={{ width: '12px', height: '12px', borderTop: '1px solid rgba(255,255,255,0.2)', borderLeft: '1px solid rgba(255,255,255,0.2)' }} />
                <div className="absolute top-2 right-2" style={{ width: '12px', height: '12px', borderTop: '1px solid rgba(255,255,255,0.2)', borderRight: '1px solid rgba(255,255,255,0.2)' }} />
                <div className="absolute bottom-2 left-2" style={{ width: '12px', height: '12px', borderBottom: '1px solid rgba(255,255,255,0.2)', borderLeft: '1px solid rgba(255,255,255,0.2)' }} />
                <div className="absolute bottom-2 right-2" style={{ width: '12px', height: '12px', borderBottom: '1px solid rgba(255,255,255,0.2)', borderRight: '1px solid rgba(255,255,255,0.2)' }} />
              </div>
            </div>
          )}
        </div>

        {/* Circles - Right-end mid-card */}
        {post.circles && post.circles.length > 0 && (
          <div className="flex flex-col gap-3 justify-center items-end flex-shrink-0">
            {post.circles.map((circle, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div
                  onClick={async () => {
                    const circleIdToUse = circle.circleId || circle.id;
                    if (circleIdToUse) {
                      navigate(`/circles/${circleIdToUse}?from=post&postId=${post.id}`);
                    }
                  }}
                  className="px-3 py-1 text-[10px] tracking-[0.12em] font-light whitespace-nowrap cursor-pointer transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.5)',
                    borderRadius: '2px',
                  }}
                  title={`View in ${circle.fullName || circle.name}`}
                >
                  {circle.icon && <span className="mr-1.5">{circle.icon}</span>}
                  {circle.name}
                </div>
                {/* Tooltip on hover */}
                {circle.fullName && circle.fullName !== circle.name && (
                  <div className="absolute right-0 top-full mt-1 px-2 py-1 bg-black/80 border border-white/10 rounded text-xs text-[#F5E6D3] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    {circle.fullName}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reactions */}
      <div className="pt-6 border-t border-[#2d2420]">
        <RoomReactions
          room="philo"
          reactions={post.reactions || {}}
          userReactions={post.userReactions || []}
          onReact={(reactionType) => onReaction?.(post.id, reactionType)}
          disabled={post.isAuthor}
        />
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
    </div>
  );
}

PhiloRoomCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    stateLabel: PropTypes.string,
    reactions: PropTypes.object,
    circles: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        fullName: PropTypes.string,
        color: PropTypes.string,
        icon: PropTypes.string
      })
    )
  }).isRequired,
  onReaction: PropTypes.func
};

export default PhiloRoomCard;
