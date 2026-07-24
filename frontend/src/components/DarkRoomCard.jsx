import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaPen, FaTrash } from 'react-icons/fa';
import RoomReactions from './RoomReactions';
import ConfirmDialog from './ConfirmDialog';

/**
 * Dark Room Card Component
 * Mobile-first responsive design with vintage aesthetic
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
      className="relative mb-4 sm:mb-6 transition-all duration-200 analog-texture paper-texture overflow-hidden"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 8px 32px rgba(0,0,0,0.5)',
        borderRadius: '16px',
        minHeight: post.image?.url ? '420px' : 'auto',
      }}
    >
      {/* Header Bar - Responsive */}
      <div className="flex items-center justify-between px-3 sm:px-5 pt-3 sm:pt-4 pb-2">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <time className="text-[9px] sm:text-[10px] tracking-wide font-medium accent-text" style={{ 
            fontFamily: 'var(--font-accent)', 
            color: 'rgba(255, 255, 255, 0.35)' 
          }}>
            {formatTimeAgo(post.createdAt)}
          </time>
          {post.category && (
            <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[7px] sm:text-[8px] uppercase tracking-widest border" style={{
              backgroundColor: 'rgba(46, 230, 255, 0.08)',
              color: '#c9d1d9',
              borderColor: 'rgba(46, 230, 255, 0.15)',
              fontWeight: '300'
            }}>
              {post.category}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {post.isAuthor && (
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                onClick={() => onEdit?.(post)}
                className="p-1 sm:p-1.5 rounded-full hover:bg-white/10 transition-colors"
                title="Edit post"
                aria-label="Edit post"
              >
                <FaPen className="text-white/50 hover:text-white/80" size={9} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1 sm:p-1.5 rounded-full hover:bg-red-500/15 transition-colors"
                title="Delete post"
                aria-label="Delete post"
              >
                <FaTrash className="text-red-400/50 hover:text-red-400/80" size={9} />
              </button>
            </div>
          )}
          {post.commentCount > 0 && (
            <div className="flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] text-white/35 font-medium">
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.commentCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Responsive padding */}
      <div className="px-3 sm:px-5 pb-3 sm:pb-5 flex flex-col">
        {/* Title - Smaller, more compact */}
        {post.title && (
          <h2 
            className="text-sm sm:text-lg md:text-xl text-white mb-2 sm:mb-3 leading-tight heading-text line-clamp-2"
            style={{
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.01em',
              fontWeight: '700',
            }}
          >
            {post.title}
          </h2>
        )}

        {/* Content Text - Show full text for posts without images */}
        <div 
          className={`text-[11px] sm:text-xs md:text-sm text-white/75 leading-relaxed mb-2 sm:mb-3 typewriter-text-light ${post.image?.url ? 'line-clamp-2 sm:line-clamp-3' : ''}`}
          style={{
            fontFamily: 'var(--font-body)',
            lineHeight: '1.5',
            ...(post.image?.url && {
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            })
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Image and Circles Container - Always horizontal: 85% image, 15% circles */}
        {post.image?.url && (
          <div className="flex flex-row gap-2 mb-3 flex-1">
            {/* Image - 85% width */}
            <div className="flex-[0_0_85%] overflow-hidden">
              <div
                className="relative overflow-hidden w-full"
                style={{
                  background: 'linear-gradient(145deg, rgba(250, 248, 245, 0.03) 0%, rgba(240, 238, 235, 0.02) 100%)',
                  borderRadius: '4px',
                  padding: '10px 10px 16px 10px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5), 0 0 0 1px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255,255,255,0.03)',
                }}
              >
                {/* Vintage photo container - Responsive height */}
                <div
                  className="relative overflow-hidden w-full"
                  style={{
                    borderRadius: '2px',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)',
                    background: 'rgba(0, 0, 0, 0.8)',
                    minHeight: '200px',
                    maxHeight: '380px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={post.image.url}
                    alt={post.title || 'Post image'}
                    className="max-w-full max-h-full object-contain"
                    style={{
                      display: 'block',
                      maxHeight: '380px',
                      filter: 'contrast(1.05) brightness(0.98)',
                    }}
                    loading="lazy"
                  />
                  {/* Vintage vignette overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)',
                      mixBlendMode: 'multiply',
                    }}
                  />
                  {/* Film grain texture */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-[0.02]"
                    style={{
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' /%3E%3C/svg%3E")',
                      backgroundRepeat: 'repeat',
                      backgroundSize: '128px',
                    }}
                  />
                </div>
                
                {/* Vintage corner brackets - Responsive sizing */}
                <div className="absolute top-1.5 left-1.5 pointer-events-none" style={{ width: '16px', height: '16px', borderTop: '2px solid rgba(239, 68, 68, 0.25)', borderLeft: '2px solid rgba(239, 68, 68, 0.25)', opacity: 0.6 }} />
                <div className="absolute top-1.5 right-1.5 pointer-events-none" style={{ width: '16px', height: '16px', borderTop: '2px solid rgba(239, 68, 68, 0.25)', borderRight: '2px solid rgba(239, 68, 68, 0.25)', opacity: 0.6 }} />
                <div className="absolute bottom-1.5 left-1.5 pointer-events-none" style={{ width: '16px', height: '16px', borderBottom: '2px solid rgba(239, 68, 68, 0.25)', borderLeft: '2px solid rgba(239, 68, 68, 0.25)', opacity: 0.6 }} />
                <div className="absolute bottom-1.5 right-1.5 pointer-events-none" style={{ width: '16px', height: '16px', borderBottom: '2px solid rgba(239, 68, 68, 0.25)', borderRight: '2px solid rgba(239, 68, 68, 0.25)', opacity: 0.6 }} />
              </div>
            </div>

            {/* Circles - 15% width, always vertical */}
            {post.circles && post.circles.length > 0 && (
              <div className="flex-[0_0_15%] flex flex-col gap-1.5 justify-center items-center overflow-hidden">
                {post.circles.slice(0, 3).map((circle, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const circleIdToUse = circle.circleId || circle.id;
                      if (circleIdToUse) {
                        navigate(`/circles/${circleIdToUse}?from=post&postId=${post.id}`);
                      }
                    }}
                    className="flex items-center justify-center text-[7px] sm:text-[8px] font-extrabold uppercase transition-all duration-200 leading-none hover:bg-opacity-20"
                    style={{
                      width: '100%',
                      maxWidth: '48px',
                      height: '28px',
                      borderRadius: '50% / 60%',
                      background: 'rgba(239, 68, 68, 0.12)',
                      color: 'rgba(239, 68, 68, 1)',
                      border: '1.5px solid rgba(239, 68, 68, 0.35)',
                      padding: '3px 4px',
                    }}
                    title={`View in ${circle.fullName || circle.name}`}
                  >
                    <span className="block truncate text-center max-w-full px-0.5" style={{ lineHeight: '1.1' }}>
                      {circle.name.charAt(0).toUpperCase() + circle.name.slice(1, 5).toLowerCase()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Circles without image - Vertical layout like posts with images */}
        {!post.image?.url && post.circles && post.circles.length > 0 && (
          <div className="flex flex-row gap-2 mb-3">
            {/* Spacer to match 85% layout */}
            <div className="flex-[0_0_85%]"></div>
            
            {/* Circles - 15% width, vertical */}
            <div className="flex-[0_0_15%] flex flex-col gap-1.5 justify-start items-center">
              {post.circles.slice(0, 3).map((circle, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const circleIdToUse = circle.circleId || circle.id;
                    if (circleIdToUse) {
                      navigate(`/circles/${circleIdToUse}?from=post&postId=${post.id}`);
                    }
                  }}
                  className="flex items-center justify-center text-[7px] sm:text-[8px] font-extrabold uppercase transition-all duration-200 leading-none hover:bg-opacity-20"
                  style={{
                    width: '100%',
                    maxWidth: '48px',
                    height: '28px',
                    borderRadius: '50% / 60%',
                    background: 'rgba(239, 68, 68, 0.12)',
                    color: 'rgba(239, 68, 68, 1)',
                    border: '1.5px solid rgba(239, 68, 68, 0.35)',
                    padding: '3px 4px',
                  }}
                  title={`View in ${circle.fullName || circle.name}`}
                >
                  <span className="block truncate text-center max-w-full px-0.5" style={{ lineHeight: '1.1' }}>
                    {circle.name.charAt(0).toUpperCase() + circle.name.slice(1, 5).toLowerCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reactions - Responsive spacing */}
        <div className="pt-3 sm:pt-4 border-t mt-auto" style={{ borderColor: 'rgba(46, 230, 255, 0.15)' }}>
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
