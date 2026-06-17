import { useState, memo } from 'react';
import { useDispatch } from 'react-redux';
import { addReaction, removeReaction } from '../features/postsSlice';

/**
 * PostCard Component
 * Displays a post with exact layout matching the design
 */
const PostCard = memo(({ post, onPostClick }) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [userReactions, setUserReactions] = useState(new Set());

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

  // Strip HTML tags from content
  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Get plain text content
  const plainContent = post.content ? stripHtml(post.content) : '';

  // Truncate content if too long
  const shouldTruncate = plainContent && plainContent.length > 400;
  const displayContent = shouldTruncate && !isExpanded 
    ? plainContent.substring(0, 400) + '...' 
    : plainContent;

  // Split content into paragraphs
  const paragraphs = displayContent ? displayContent.split('\n').filter(p => p.trim()) : [];

  // Handle reaction toggle
  const handleReactionToggle = async (reactionType) => {
    const hasReacted = userReactions.has(reactionType);

    // Optimistic update
    const newReactions = new Set(userReactions);
    if (hasReacted) {
      newReactions.delete(reactionType);
    } else {
      newReactions.add(reactionType);
    }
    setUserReactions(newReactions);

    try {
      if (hasReacted) {
        await dispatch(removeReaction({ postId: post.id, reactionType })).unwrap();
      } else {
        await dispatch(addReaction({ postId: post.id, reactionType })).unwrap();
      }
    } catch (error) {
      // Revert on error
      setUserReactions(userReactions);
      console.error('Failed to toggle reaction:', error);
    }
  };

  return (
    <article 
      onClick={() => onPostClick && onPostClick(post.id)}
      className="bg-[#1A1414] rounded-lg p-6 mb-4 transition-all duration-200 hover:bg-[#251E1D] cursor-pointer"
      role="article"
    >
      {/* Header: Category Badge and Timestamp */}
      <div className="flex items-center justify-between mb-4">
        {/* Category Badge */}
        {post.category && (
          <span className="bg-[#8B4A1D] text-[#E6D1BE] text-xs px-2.5 py-1 rounded font-medium uppercase">
            {post.category}
          </span>
        )}

        {/* Timestamp */}
        <span className="text-[#575455] text-xs">
          <time dateTime={post.createdAt}>
            {formatTimestamp(post.createdAt)}
          </time>
        </span>
      </div>

      {/* Content with paragraph breaks */}
      <div className="mb-4">
        {paragraphs.map((paragraph, index) => (
          <p 
            key={index} 
            className="text-[#E6D1BE] text-sm leading-relaxed mb-3 last:mb-0"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Footer: Reaction Buttons and Circle Badge */}
      <div className="flex items-center justify-between pt-3 border-t border-[#251E1D]">
        {/* Reaction Buttons */}
        <div className="flex items-center gap-4">
          {/* I relate */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReactionToggle('iRelate');
            }}
            className="flex items-center gap-1.5 text-[#918A87] hover:text-[#A05A2C] transition-colors text-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
            </svg>
            <span>I relate</span>
          </button>

          {/* You're not alone */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReactionToggle('youreNotAlone');
            }}
            className="flex items-center gap-1.5 text-[#918A87] hover:text-[#A05A2C] transition-colors text-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
            </svg>
            <span>You're not alone</span>
          </button>

          {/* I'm listening */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReactionToggle('imListening');
            }}
            className="flex items-center gap-1.5 text-[#918A87] hover:text-[#A05A2C] transition-colors text-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <span>I'm listening</span>
          </button>
        </div>

        {/* Circle Badge */}
        {post.circle && (
          <div className="flex items-center gap-1.5 text-[#918A87] text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{post.circle.name}</span>
            {post.circle.room && (
              <span className={`ml-1 px-1.5 py-0.5 text-[10px] font-medium rounded ${
                post.circle.room === 'dark' ? 'bg-[#2a1a1a] text-[#D97757]' :
                post.circle.room === 'climb' ? 'bg-[#1a2a1a] text-[#7BC96F]' :
                post.circle.room === 'philo' ? 'bg-[#1a1a2a] text-[#8B9DC3]' :
                'bg-[#2a2a2a] text-[#918A87]'
              }`}>
                {post.circle.room.toUpperCase()}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;
