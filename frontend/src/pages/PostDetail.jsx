import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../features/authSlice';
import * as postService from '../services/postService';
import * as commentService from '../services/commentService';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * Post Detail Page
 * Displays full post content with reactions and comments
 * Matches exact design: dark theme, monospace elements, specific layout
 */
function PostDetail() {
  usePageTitle('Post');
  const { postId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reactionLoading, setReactionLoading] = useState({});

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

    setReactionLoading({ ...reactionLoading, [type]: true });
    try {
      const hasReacted = post.userReactions?.includes(type);
      
      if (hasReacted) {
        await postService.removeReaction(postId, type);
      } else {
        await postService.addReaction(postId, type);
      }
      
      await loadPost();
    } catch (err) {
      console.error('Reaction failed:', err);
    } finally {
      setReactionLoading({ ...reactionLoading, [type]: false });
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
        <div className="text-center">
          <p className="text-[#8b949e] mb-4">{error || 'Post not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-[#8b949e] hover:text-white transition-colors text-sm uppercase tracking-wider"
          >
            ← Return
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-3xl mx-auto px-6 py-6 md:py-8 min-h-[calc(100vh-4rem)]">
        {/* Breadcrumb */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col gap-3">
            {/* ROOMS label - strong white bold and larger */}
            <div className="text-xs uppercase tracking-[0.25em]" style={{ color: '#e6edf3', fontWeight: '700' }}>
              ROOMS
            </div>
            {/* Room name as main heading - strongest, boldest, and largest */}
            {post.circle?.room && (
              <h2 className="text-2xl uppercase tracking-[0.12em]" style={{ 
                color: post.circle.room === 'dark' ? '#DC2626' :
                       post.circle.room === 'fantasy' ? '#F97316' :
                       post.circle.room === 'philo' ? '#6366F1' :
                       '#ffffff',
                fontWeight: '800'
              }}>
                THE {post.circle.room.toUpperCase()} ROOM
              </h2>
            )}
            {/* Circle name as weak white */}
            {post.circle && (
              <Link to={`/circles/${post.circle.id}`} className="transition-colors text-[11px]" style={{ color: '#6e7681', fontWeight: '300' }}>
                Circle: {post.circle.name}
              </Link>
            )}
          </div>
        </div>

        {/* Post Header */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Category and timestamp */}
          <div className="flex items-center gap-4">
            {post.category && (
              <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-semibold rounded font-mono" style={{
                background: post.circle?.room === 'fantasy' ? 'rgba(249, 115, 22, 0.1)' :
                            post.circle?.room === 'philo' ? 'rgba(99, 102, 241, 0.1)' :
                            'rgba(220, 38, 38, 0.1)',
                border: post.circle?.room === 'fantasy' ? '1px solid rgba(249, 115, 22, 0.3)' :
                        post.circle?.room === 'philo' ? '1px solid rgba(99, 102, 241, 0.3)' :
                        '1px solid rgba(220, 38, 38, 0.3)',
                color: post.circle?.room === 'fantasy' ? '#F97316' :
                       post.circle?.room === 'philo' ? '#6366F1' :
                       '#DC2626'
              }}>
                {post.category}
              </span>
            )}
            <div className="text-xs uppercase tracking-[0.15em] font-mono" style={{ color: '#8b949e', fontWeight: '400' }}>
              {formatTimeAgo(post.createdAt)}
            </div>
          </div>
        </div>

        {/* Post Title */}
        {post.title && (
          <h1 className="leading-relaxed mb-6 md:mb-8 font-sans" style={{ 
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '1.75rem',
            letterSpacing: '-0.01em',
          }}>
            {post.title}
          </h1>
        )}

        {/* Post Image - if exists */}
        {(() => {
          const imageUrl = post.image_url || post.image?.url || (typeof post.image === 'string' ? post.image : null) || post.imageData?.url;
          if (!imageUrl) return null;
          return (
            <div className="mb-8 md:mb-10 w-full max-w-2xl mx-auto">
              <div 
                className="relative overflow-hidden rounded-xl border border-white/10 p-2.5 sm:p-3"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 8px 30px rgba(0,0,0,0.6)',
                }}
              >
                <div className="relative w-full max-h-[520px] flex items-center justify-center overflow-hidden rounded-lg bg-black/60">
                  <img
                    src={imageUrl}
                    alt={post.title || 'Post image'}
                    className="w-full max-h-[520px] object-contain rounded-lg"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          );
        })()}

        {/* Post Content */}
        <div className={`space-y-5 ${(post.image_url || post.image?.url || post.image) ? 'mb-10 md:mb-12' : 'mb-6'}`}>
          {post.content ? (
            post.content.split('\n').filter(line => line.trim()).map((paragraph, index) => (
              <p key={index} className="leading-relaxed font-sans" style={{ 
                color: '#e6edf3',
                lineHeight: '1.9',
                fontWeight: '400',
                fontSize: '1.05rem',
              }}>
                {paragraph}
              </p>
            ))
          ) : (
            <p className="font-sans" style={{ color: '#8b949e', fontStyle: 'italic' }}>No content available</p>
          )}
        </div>

        {/* Linked Reference Section */}
        {post.circle && (
          <div className={(post.image_url || post.image?.url || post.image) ? 'mb-6' : 'mb-4'}>
            <div className="text-[0.65rem] uppercase tracking-[0.2em] mb-2" style={{ color: '#6e7681', fontWeight: '400' }}>
              Circle
            </div>
            <Link
              to={`/circles/${post.circle.id}`}
              className="block border transition-colors p-3 group hover:border-[#30363d]"
              style={{
                background: 'rgba(255,255,255,0.02)',
                borderColor: '#21262d',
                borderRadius: '4px'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ 
                    background: post.circle.room === 'dark' ? 'rgba(220, 38, 38, 0.1)' :
                               post.circle.room === 'fantasy' ? 'rgba(249, 115, 22, 0.1)' :
                               post.circle.room === 'philo' ? 'rgba(99, 102, 241, 0.1)' :
                               'rgba(255,255,255,0.05)'
                  }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{
                      color: post.circle.room === 'dark' ? '#DC2626' :
                             post.circle.room === 'fantasy' ? '#F97316' :
                             post.circle.room === 'philo' ? '#6366F1' :
                             '#8b949e'
                    }}>
                      <circle cx="10" cy="10" r="8" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm" style={{ 
                      color: '#e6edf3',
                      fontWeight: '500'
                    }}>
                      {post.circle.name}
                    </div>
                  </div>
                </div>
                <svg className="w-4 h-4 transition-colors opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#8b949e' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        )}

        {/* Reactions Section */}
        <div className={post.image_url || post.image?.url || post.image ? 'mb-8' : 'mb-6'}>
          <div className="text-[0.65rem] uppercase tracking-[0.2em] mb-3" style={{ color: '#6e7681', fontWeight: '400' }}>
            Reactions
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* iRelate */}
            <button
              onClick={() => handleReaction('iRelate')}
              disabled={reactionLoading.iRelate}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition-all text-[11px] ${
                post.userReactions?.includes('iRelate')
                  ? 'text-[#58a6ff] font-medium'
                  : 'text-[#8b949e] hover:text-[#e6edf3]'
              }`}
              style={{ background: 'transparent', border: 'none' }}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>I relate</span>
              <span className="font-mono text-[10px]">{post.reactions?.iRelate || 0}</span>
            </button>

            {/* youreNotAlone */}
            <button
              onClick={() => handleReaction('youreNotAlone')}
              disabled={reactionLoading.youreNotAlone}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition-all text-[11px] ${
                post.userReactions?.includes('youreNotAlone')
                  ? 'text-[#e6edf3] font-medium'
                  : 'text-[#8b949e] hover:text-[#e6edf3]'
              }`}
              style={{ background: 'transparent', border: 'none' }}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>You're not alone</span>
              <span className="font-mono text-[10px]">{post.reactions?.youreNotAlone || 0}</span>
            </button>

            {/* imListening */}
            <button
              onClick={() => handleReaction('imListening')}
              disabled={reactionLoading.imListening}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition-all text-[11px] ${
                post.userReactions?.includes('imListening')
                  ? 'text-[#ff6b35] font-medium'
                  : 'text-[#8b949e] hover:text-[#ff6b35]'
              }`}
              style={{ background: 'transparent', border: 'none' }}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>I'm listening</span>
              <span className="font-mono text-[10px]">{post.reactions?.imListening || 0}</span>
            </button>

            {/* theAbyss */}
            <button
              onClick={() => handleReaction('theAbyss')}
              disabled={reactionLoading.theAbyss}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition-all text-[11px] ${
                post.userReactions?.includes('theAbyss')
                  ? 'text-[#c9d1d9] font-medium'
                  : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
              style={{ background: 'transparent', border: 'none' }}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
              </svg>
              <span>The abyss</span>
              <span className="font-mono text-[10px]">{post.reactions?.theAbyss || 0}</span>
            </button>
          </div>
        </div>

        {/* Return Button */}
        <div className="mt-6 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-[#6e7681] hover:text-[#8b949e] transition-colors text-xs uppercase tracking-[0.15em] inline-flex items-center"
          >
            <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
