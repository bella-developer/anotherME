import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FaPen, FaTrash } from 'react-icons/fa';
import { Bookmark } from 'lucide-react';
import RoomReactions from './RoomReactions';
import ConfirmDialog from './ConfirmDialog';
import { toggleBookmark } from '../features/sanctuarySlice';
import { useToast } from '../contexts/ToastContext';

/**
 * Dark Room Card Component
 * Mobile-first responsive design with vintage aesthetic
 */
function DarkRoomCard({ post, onReaction, onEdit, onDelete }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { vaultBookmarks } = useSelector((state) => state.sanctuary);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isBookmarked = vaultBookmarks?.some((b) => b.id === post.id);

  const handleToggleBookmark = (e) => {
    e.stopPropagation();
    dispatch(toggleBookmark(post));
    addToast(isBookmarked ? 'Removed from saved.' : 'Saved.', isBookmarked ? 'info' : 'success');
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const imageUrl = post.image_url || post.image?.url || (typeof post.image === 'string' ? post.image : null);

  return (
    <article
      className="group relative mb-4 sm:mb-6 transition-all duration-300 rounded-xl overflow-hidden"
      style={{
        background: 'transparent',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
        minHeight: imageUrl ? '420px' : 'auto',
      }}
    >
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.05)' }} 
      />
      {/* Header Bar - Responsive */}
      <div className="flex items-center justify-between px-3 sm:px-5 pt-3 sm:pt-4 pb-2">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <time className="text-[9px] sm:text-[10px] tracking-wide font-mono text-white/40">
            {formatTimeAgo(post.createdAt)}
          </time>
          {post.category && (
            <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[7px] sm:text-[8px] uppercase tracking-widest font-mono border" style={{
              backgroundColor: 'rgba(220, 38, 38, 0.12)',
              color: '#DC2626',
              borderColor: 'rgba(220, 38, 38, 0.3)',
              fontWeight: '500'
            }}>
              {post.category}
            </span>
          )}
          {post.circles && post.circles.length > 0 && post.circles.slice(0, 2).map((circle, index) => {
            const circleIdToUse = circle.circleId || circle.id;
            const circleName = (circle.name || '').replace(/darker thoughta/gi, 'Darker Thoughts');
            return (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (circleIdToUse) {
                    navigate(`/circles/${circleIdToUse}?from=post&postId=${post.id}`);
                  }
                }}
                className="px-1.5 sm:px-2 py-0.5 rounded-full text-[7px] sm:text-[8px] font-mono uppercase tracking-wider transition-all border hover:border-red-500/50"
                style={{
                  background: 'rgba(220, 38, 38, 0.08)',
                  color: '#DC2626',
                  borderColor: 'rgba(220, 38, 38, 0.25)',
                }}
                title={`View in ${circle.fullName || circle.name}`}
              >
                {circleName.length > 8 ? circleName.slice(0, 8).toUpperCase() : circleName.toUpperCase()}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Save to Sanctuary Vault Button */}
          <button
            onClick={handleToggleBookmark}
            className={`p-1 sm:p-1.5 rounded-full transition-colors ${
              isBookmarked
                ? 'text-[#DC2626] bg-[#DC2626]/15'
                : 'text-white/40 hover:text-white/80 hover:bg-white/10'
            }`}
            title={isBookmarked ? 'Remove' : 'Save'}
            aria-label={isBookmarked ? 'Remove' : 'Save'}
          >
            <Bookmark size={12} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>

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
        {/* Title - Red brush effect - Extract from content if no title */}
        {(() => {
          // Extract title: use post.title or extract from first line of content (35-45 chars)
          let displayTitle = post.title;
          if (!displayTitle && post.content) {
            // Strip HTML tags and get plain text
            const plainText = post.content.replace(/<[^>]*>/g, '').trim();
            // Get first line
            const firstLine = plainText.split('\n')[0];
            // Extract 35-45 characters
            displayTitle = firstLine.length > 45 
              ? firstLine.substring(0, 45).trim() + '...'
              : firstLine.length >= 35
              ? firstLine.substring(0, firstLine.length).trim()
              : firstLine.substring(0, 35).trim() + (firstLine.length > 35 ? '...' : '');
          }
          
          return displayTitle ? (
            <div className="mb-2 sm:mb-3">
              <h2 
                className="text-sm sm:text-lg md:text-xl font-sans font-semibold text-white leading-tight"
                style={{
                  color: '#FFFFFF',
                  letterSpacing: '0.01em',
                }}
              >
                {displayTitle}
              </h2>
            </div>
          ) : null;
        })()}

        {/* Content Text - Artistic formatting with comfortable reading */}
        <div 
          className="text-[11px] sm:text-xs md:text-sm leading-relaxed mb-2 sm:mb-3 font-sans"
          style={{
            fontFamily: 'var(--font-body)',
            lineHeight: '1.7',
            color: '#E6EDF3',
          }}
        >
          {/* Parse and format content with paragraph breaks */}
          {post.content && (() => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            const plainText = tempDiv.textContent || tempDiv.innerText || '';
            
            // Split by double line breaks for paragraphs, or single if no doubles exist
            const paragraphs = plainText.includes('\n\n') 
              ? plainText.split('\n\n').filter(p => p.trim())
              : plainText.split('\n').filter(p => p.trim());
            
            return paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="mb-4 last:mb-0"
                style={{
                  textIndent: '1.5em',
                  fontSize: index === 0 ? '13px' : '12px',
                  opacity: index === 0 ? 0.95 : 0.9,
                }}
              >
                {paragraph}
              </p>
            ));
          })()}
        </div>
        
        {/* Attached Image */}
        {imageUrl && (
          <div className="mb-3 flex-1">
            <div className="w-full overflow-hidden">
              <div
                className="relative overflow-hidden w-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '4px',
                  padding: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div
                  className="relative overflow-hidden w-full"
                  style={{
                    borderRadius: '2px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    minHeight: '200px',
                    maxHeight: '380px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={post.title || 'Post image'}
                    className="max-w-full max-h-full object-contain"
                    style={{
                      display: 'block',
                      maxHeight: '380px',
                    }}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reactions - Responsive spacing */}
        <div className="pt-3 sm:pt-4 border-t mt-auto" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
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
