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
        background: 'transparent',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.035)',
        boxShadow: 'none',
      }}
      role="article"
    >
      {/* Header: Room Section and Timestamp */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.03]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: roomColor }}>
            {room.toUpperCase()}
          </span>
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-[#928B91]">
          <time dateTime={post.createdAt}>
            {formatTimestamp(post.createdAt)}
          </time>
        </span>
      </div>

      {/* Title with Brush Gritty Background */}
      {post.title && (
        <div className="mb-3">
          <div className="relative inline-block">
            <span 
              className="absolute inset-0 -skew-x-2 pointer-events-none rounded-[2px]"
              style={{
                backgroundColor: roomColor === '#DB762E' 
                  ? 'rgba(219, 118, 46, 0.88)' 
                  : roomColor === '#7771D9' 
                  ? 'rgba(119, 113, 217, 0.88)' 
                  : 'rgba(180, 74, 74, 0.88)',
                clipPath: 'polygon(0% 10%, 4% 3%, 16% 7%, 34% 1%, 56% 6%, 76% 1%, 94% 6%, 100% 14%, 99% 86%, 95% 97%, 74% 93%, 52% 98%, 28% 94%, 7% 98%, 0% 86%)',
                boxShadow: `0 0 16px ${roomColor}66`,
              }}
            />
            <h3 className="relative z-10 px-2.5 py-0.5 text-xs sm:text-sm md:text-base font-bold text-white tracking-wide leading-snug">
              {post.title}
            </h3>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mb-3 space-y-2">
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

      {/* Attached Circle: right half with smaller space consumption, thinner premium look */}
      {(post.circle || (post.circles && post.circles.length > 0)) && (() => {
        const circleObj = post.circle || post.circles[0];
        const circleName = circleObj?.name || circleObj?.fullName;
        if (!circleName) return null;
        return (
          <div className="flex justify-end mb-3">
            <span 
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] tracking-wider uppercase border"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                borderColor: `${roomColor}55`,
                color: roomColor,
                boxShadow: `0 0 8px ${roomColor}22`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: roomColor }} />
              <span className="font-semibold">{circleName}</span>
            </span>
          </div>
        );
      })()}

      {/* Footer: Reaction Buttons */}
      <div className="flex items-center justify-between pt-2" onClick={(e) => e.stopPropagation()}>
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
