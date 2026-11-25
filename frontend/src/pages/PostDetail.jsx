import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../features/authSlice';
import * as postService from '../services/postService';
import * as commentService from '../services/commentService';
import LoadingSpinner from '../components/LoadingSpinner';
import RoomReactions from '../components/RoomReactions';
import CommentThread from '../components/CommentThread';
import CommentForm from '../components/CommentForm';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * Post Detail Page
 * Displays full post content with room-specific reactions and comments
 * Matches ESO Obsidian Theme: Deep charcoal surfaces, warm ivory text, monospace hierarchy
 */
function PostDetail() {
  usePageTitle('Post');
  const { postId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(selectAuth);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPost();
    loadComments();
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await postService.fetchPostById(postId);
      setPost(data);
    } catch (err) {
      setError(err.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await commentService.fetchComments({ postId });
      setComments(data.comments || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  const handleReaction = async (type) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const hasReacted = post.userReactions?.includes(type);
    
    // Optimistic UI update
    const currentReactions = { ...post.reactions };
    let nextUserReactions = [...(post.userReactions || [])];
    
    if (hasReacted) {
      currentReactions[type] = Math.max(0, (currentReactions[type] || 0) - 1);
      nextUserReactions = nextUserReactions.filter(r => r !== type);
    } else {
      currentReactions[type] = (currentReactions[type] || 0) + 1;
      nextUserReactions.push(type);
    }
    
    setPost({
      ...post,
      reactions: currentReactions,
      userReactions: nextUserReactions
    });

    try {
      if (hasReacted) {
        await postService.removeReaction(postId, type);
      } else {
        await postService.addReaction(postId, type);
      }
      await loadPost();
    } catch (err) {
      console.error('Reaction failed:', err);
      // Revert on error
      loadPost();
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center font-mono">
          <p className="text-[#928B91] mb-4">{error || 'Post not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-[#E7DED5] hover:text-[#D77A35] transition-colors text-xs uppercase tracking-wider"
          >
            ← Return
          </button>
        </div>
      </div>
    );
  }

  const room = post.room || post.circle?.room || 'dark';
  const roomColor = room === 'fantasy' ? '#DB762E' : room === 'philo' ? '#7771D9' : '#B44A4A';
  const roomBg = room === 'fantasy' ? 'rgba(219, 118, 46, 0.12)' : room === 'philo' ? 'rgba(119, 113, 217, 0.12)' : 'rgba(180, 74, 74, 0.12)';
  const roomBorder = room === 'fantasy' ? 'rgba(219, 118, 46, 0.3)' : room === 'philo' ? 'rgba(119, 113, 217, 0.3)' : 'rgba(180, 74, 74, 0.3)';

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8 font-mono">
        {/* Navigation & Breadcrumb */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col gap-2">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#928B91]">
              ROOMS
            </div>
            <h2 className="text-xl sm:text-2xl uppercase tracking-[0.12em] font-bold" style={{ color: roomColor }}>
              THE {room.toUpperCase()} ROOM
            </h2>
            {post.circle && (
              <Link 
                to={`/circles/${post.circle.id}`} 
                className="transition-colors text-xs text-[#928B91] hover:text-[#E7DED5] inline-flex items-center gap-1.5"
              >
                <span>Circle:</span>
                <span className="text-[#E7DED5] font-semibold">{post.circle.name}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Post Container Card */}
        <article 
          className="rounded-xl border p-5 sm:p-7 mb-8 transition-all"
          style={{
            backgroundColor: 'rgba(25, 24, 32, 0.5)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.35)',
          }}
        >
          {/* Post Meta */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              {post.category && (
                <span 
                  className="px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-semibold rounded"
                  style={{
                    backgroundColor: roomBg,
                    border: `1px solid ${roomBorder}`,
                    color: roomColor,
                  }}
                >
                  {post.category}
                </span>
              )}
              <time className="text-[10px] text-[#928B91]">
                {formatTimeAgo(post.createdAt)}
              </time>
            </div>
          </div>

          {/* Post Title with Brush Gritty Background */}
          {post.title && (
            <div className="mb-5">
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
                    boxShadow: `0 0 18px ${roomColor}66`,
                  }}
                />
                <h1 className="relative z-10 px-3 py-1 text-base sm:text-xl md:text-2xl font-bold text-white tracking-wide leading-snug">
                  {post.title}
                </h1>
              </div>
            </div>
          )}

          {/* Post Image */}
          {(() => {
            const imageUrl = post.image_url || post.image?.url || (typeof post.image === 'string' ? post.image : null) || post.imageData?.url;
            if (!imageUrl) return null;
            return (
              <div className="mb-6 w-full max-w-2xl mx-auto">
                <div 
                  className="relative overflow-hidden rounded-lg border border-white/[0.04] bg-black/40"
                >
                  <div className="relative w-full max-h-[500px] flex items-center justify-center overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={post.title || 'Post image'}
                      className="w-full max-h-[500px] object-contain rounded"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Post Content */}
          <div className="space-y-4 mb-6">
            {post.content ? (
              post.content.split('\n').filter(line => line.trim()).map((paragraph, index) => (
                <p 
                  key={index} 
                  className="leading-relaxed text-sm sm:text-[15px] text-[#E7DED5]"
                  style={{ lineHeight: '1.8' }}
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-[#928B91] italic text-sm">No content available</p>
            )}
          </div>

          {/* Reactions Section */}
          <div className="pt-2">
            <div className="text-[10px] uppercase tracking-[0.2em] mb-3 text-[#928B91]">
              Reactions
            </div>
            <div className="inline-block">
              <RoomReactions
                room={room}
                reactions={post.reactions || {}}
                userReactions={post.userReactions || []}
                onReact={handleReaction}
                disabled={post.isAuthor}
              />
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#292630]">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#E7DED5] font-semibold">
              Comments ({comments.length})
            </h3>
          </div>

          {isAuthenticated ? (
            <div className="mb-6">
              <CommentForm
                postId={postId}
                onSuccess={() => {
                  loadComments();
                  loadPost();
                }}
              />
            </div>
          ) : (
            <div className="mb-6 p-4 rounded-lg border border-[#292630] bg-[#191820] text-center">
              <p className="text-xs text-[#928B91] mb-2">Sign in to participate in discussion</p>
              <button
                onClick={() => navigate('/login')}
                className="text-xs uppercase tracking-wider text-[#D77A35] hover:underline"
              >
                Sign in →
              </button>
            </div>
          )}

          <CommentThread
            comments={comments}
            postId={postId}
            currentUserId={user?.id}
          />
        </section>

        {/* Back Link */}
        <div className="mt-8 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-[#928B91] hover:text-[#E7DED5] transition-colors text-xs uppercase tracking-[0.15em] inline-flex items-center gap-2"
          >
            <span>← Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
