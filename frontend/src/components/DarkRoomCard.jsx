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
 * Obsidian Theme: Deep charcoal surface, muted burgundy accent, warm ivory text, monospace hierarchy
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
      className="group relative mb-4 sm:mb-6 transition-all duration-300 rounded-xl overflow-hidden font-mono"
      style={{
        background: 'transparent',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: 'none',
        minHeight: imageUrl ? '420px' : 'auto',
      }}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 sm:px-5 pt-3 sm:pt-4 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <time className="text-[9px] sm:text-[10px] tracking-wide text-[#928B91]">
            {formatTimeAgo(post.createdAt)}
          </time>
          {post.category && (
            <span 
              className="px-1.5 sm:px-2 py-0.5 rounded text-[8px] uppercase tracking-widest font-semibold border"
              style={{
                backgroundColor: 'rgba(180, 74, 74, 0.12)',
                color: '#B44A4A',
                borderColor: 'rgba(180, 74, 74, 0.3)',
              }}
            >
              {post.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Save to Sanctuary Vault Button */}
          <button
            onClick={handleToggleBookmark}
            className={`p-1 sm:p-1.5 rounded transition-colors ${
              isBookmarked
                ? 'text-[#B44A4A] bg-[#B44A4A]/15'
                : 'text-[#928B91] hover:text-[#E7DED5] hover:bg-[#292630]'
            }`}
            title={isBookmarked ? 'Remove' : 'Save'}
            aria-label={isBookmarked ? 'Remove' : 'Save'}
          >
            <Bookmark size={13} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>

          {post.isAuthor && (
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                onClick={() => onEdit?.(post)}
                className="p-1 sm:p-1.5 rounded hover:bg-[#292630] transition-colors"
                title="Edit post"
                aria-label="Edit post"
              >
                <FaPen className="text-[#928B91] hover:text-[#E7DED5]" size={10} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1 sm:p-1.5 rounded hover:bg-red-500/15 transition-colors"
                title="Delete post"
                aria-label="Delete post"
              >
                <FaTrash className="text-red-400/60 hover:text-red-400" size={10} />
              </button>
            </div>
          )}

          {/* Comment Count / Link */}
          <button
            onClick={() => navigate(`/posts/${post.id}`)}
            className="flex items-center gap-1 text-[10px] text-[#928B91] hover:text-[#E7DED5] transition-colors ml-1"
            title="View discussion"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{post.commentCount || 0}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 sm:px-5 py-3 sm:py-4 flex flex-col">
        {/* Title with Red Gritty Paint Brush Background */}
        {(() => {
          let displayTitle = post.title;
          if (!displayTitle && post.content) {
            const plainText = post.content.replace(/<[^>]*>/g, '').trim();
            const firstLine = plainText.split('\n')[0];
            displayTitle = firstLine.length > 45 
              ? firstLine.substring(0, 45).trim() + '...'
              : firstLine.length >= 35
              ? firstLine.substring(0, firstLine.length).trim()
              : firstLine.substring(0, 35).trim() + (firstLine.length > 35 ? '...' : '');
          }
          
          return displayTitle ? (
            <div className="mb-2 sm:mb-3">
              <div 
                onClick={() => navigate(`/posts/${post.id}`)}
                className="relative inline-block cursor-pointer group"
              >
                <span 
                  className="absolute inset-0 -skew-x-2 pointer-events-none rounded-[2px] transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{
                    backgroundColor: 'rgba(180, 74, 74, 0.88)',
                    clipPath: 'polygon(0% 10%, 4% 3%, 16% 7%, 34% 1%, 56% 6%, 76% 1%, 94% 6%, 100% 14%, 99% 86%, 95% 97%, 74% 93%, 52% 98%, 28% 94%, 7% 98%, 0% 86%)',
                    boxShadow: '0 0 16px rgba(180, 74, 74, 0.45)',
                  }}
                />
                <h2 className="relative z-10 px-2.5 py-0.5 text-xs sm:text-sm md:text-base font-bold text-white tracking-wide leading-snug">
                  {displayTitle}
                </h2>
              </div>
            </div>
          ) : null;
        })()}

        {/* Content Text */}
        <div 
          className="text-xs sm:text-sm leading-relaxed mb-3 text-[#E7DED5]"
          style={{ lineHeight: '1.75' }}
        >
          {post.content && (() => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            const plainText = tempDiv.textContent || tempDiv.innerText || '';
            
            const paragraphs = plainText.includes('\n\n') 
              ? plainText.split('\n\n').filter(p => p.trim())
              : plainText.split('\n').filter(p => p.trim());
            
            return paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="mb-3 last:mb-0"
              >
                {paragraph}
              </p>
            ));
          })()}
        </div>

        {/* Attached Circle: right half with smaller space consumption, thinner premium look */}
        {(() => {
          const circleObj = (post.circles && post.circles.length > 0) ? post.circles[0] : (post.circle || null);
          if (!circleObj) return null;
          const circleName = (circleObj.name || circleObj.fullName || '').replace(/darker thoughta/gi, 'Darker Thoughts');
          const circleId = circleObj.circleId || circleObj.id;
          if (!circleName) return null;

          return (
            <div className="flex justify-end mb-2.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (circleId) navigate(`/circles/${circleId}?from=post&postId=${post.id}`);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] tracking-wider uppercase transition-all border hover:border-[#B44A4A] hover:bg-[#B44A4A]/10"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.45)',
                  borderColor: 'rgba(180, 74, 74, 0.35)',
                  color: '#B44A4A',
                  boxShadow: '0 0 8px rgba(180, 74, 74, 0.15)',
                }}
                title={`View in ${circleName}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#B44A4A]" />
                <span className="font-semibold">{circleName.length > 16 ? circleName.slice(0, 16) + '...' : circleName}</span>
              </button>
            </div>
          );
        })()}
        
        {/* Attached Image */}
        {imageUrl && (
          <div className="mb-3 flex-1">
            <div className="w-full overflow-hidden rounded border border-[#292630] p-1.5 bg-[#111117]">
              <div
                className="relative overflow-hidden w-full rounded bg-black/60 flex items-center justify-center"
                style={{
                  minHeight: '200px',
                  maxHeight: '380px',
                }}
              >
                <img
                  src={imageUrl}
                  alt={post.title || 'Post image'}
                  className="max-w-full max-h-full object-contain"
                  style={{ maxHeight: '380px' }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        )}

        {/* Reactions */}
        <div className="pt-3 border-t border-[#292630] mt-auto">
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
