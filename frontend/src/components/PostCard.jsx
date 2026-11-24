import { memo } from 'react';
import RoomReactions from './RoomReactions';

/**
 * PostCard Component
 * Displays a post card with Obsidian theme and room-specific reactions
 */
const PostCard = memo(({ post, onPostClick, onReaction }) => {
  // Format timestamp to relative time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const plainContent = post.content ? stripHtml(post.content) : '';
  const paragraphs = plainContent ? plainContent.split('\n').filter(p => p.trim()) : [];

  const room = post.room || post.circle?.room || 'dark';
  const roomColor = room === 'fantasy' ? '#DB762E' : room === 'philo' ? '#7771D9' : '#B44A4A';

  return (
    <article 
      onClick={() => onPostClick && onPostClick(post.id)}
      className="group relative rounded-xl p-4 sm:p-5 mb-4 transition-all duration-200 cursor-pointer overflow-hidden font-mono"
      style={{
        backgroundColor: '#191820',
        border: '1px solid #292630',
      }}
      role="article"
    >
      {/* Header: Room Section and Timestamp */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#292630]/60">
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: roomColor }}>
            {room.toUpperCase()}
          </span>
          {post.circle && (
            <span className="text-[10px] text-[#928B91]">
              &bull; {post.circle.name}
            </span>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-[#928B91]">
          <time dateTime={post.createdAt}>
            {formatTimestamp(post.createdAt)}
          </time>
        </span>
      </div>

      {/* Title */}
      {post.title && (
        <h3 className="text-sm sm:text-base font-semibold text-[#E7DED5] mb-2 leading-snug">
          {post.title}
        </h3>
      )}

      {/* Content */}
      <div className="mb-4 space-y-2">
        {paragraphs.slice(0, 3).map((paragraph, index) => (
          <p 
            key={index} 
            className="leading-relaxed text-xs text-[#E7DED5]"
          >
            {paragraph}
          </p>
        ))}
        {paragraphs.length > 3 && (
          <p className="text-[10px] text-[#928B91] italic">...click to read full post</p>
        )}
      </div>

      {/* Footer: Reaction Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-[#292630]" onClick={(e) => e.stopPropagation()}>
        <RoomReactions
          room={room}
          reactions={post.reactions || {}}
          userReactions={post.userReactions || []}
          onReact={(reactionType) => onReaction?.(post.id, reactionType)}
          disabled={post.isAuthor}
        />

        {post.commentCount > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-[#928B91]">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{post.commentCount}</span>
          </div>
        )}
      </div>
    </article>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;
