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
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-6 md:py-8">
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
                color: post.circle.room === 'dark' ? '#2EE6FF' :
                       post.circle.room === 'fantasy' ? '#FF9D1C' :
                       post.circle.room === 'philo' ? '#B56DFF' :
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
        <div className="mb-4 md:mb-6 flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.15em]" style={{ color: '#484f58', fontWeight: '300' }}>
            Observer {formatTimeAgo(post.createdAt)}
          </div>
          <button className="px-4 py-1.5 text-xs uppercase tracking-wider transition-all" style={{
            border: '1px solid #ff6b35',
            color: '#ff6b35',
            background: 'transparent'
          }}>
            Resonate
          </button>
        </div>

        {/* Post Title */}
        {post.title && (
          <h1 className="leading-relaxed mb-4 md:mb-6" style={{ 
            color: '#e6edf3',
            fontWeight: '600',
            fontSize: '1.5rem',
            letterSpacing: '0'
          }}>
            {post.title}
          </h1>
        )}

        {/* Post Image - if exists */}
        {post.image?.url && (
          <div className="mb-8 md:mb-10">
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '600px',
              margin: '0 auto',
              padding: '20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px'
            }}>
              {/* Polaroid-style mat with thicker bottom */}
              <div style={{
                padding: '16px 16px 48px',
                background: 'linear-gradient(180deg, rgba(240,240,240,0.95) 0%, rgba(230,230,230,0.93) 100%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: `${post.image.width || 4} / ${post.image.height || 3}`,
                  overflow: 'hidden',
                  background: '#000000'
                }}>
                  <img
                    src={post.image.url}
                    alt={post.title || 'Post image'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                    loading="lazy"
                  />
                  {/* Vintage vignette overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.15) 100%)',
                    pointerEvents: 'none',
                    mixBlendMode: 'multiply'
                  }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Post Content */}
        {post.content && (
          <div className="space-y-4 mb-8 md:mb-10">
            {post.content.split('\n\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="leading-relaxed" style={{ 
                  color: '#c9d1d9',
                  lineHeight: '1.8',
                  fontWeight: '400',
                  fontSize: '1rem'
                }}>
                  {paragraph}
                </p>
              )
            ))}
          </div>
        )}

        {/* Linked Reference Section */}
        {post.circle && (
          <div className="mb-8 md:mb-10">
            <div className="text-[0.65rem] uppercase tracking-[0.2em] mb-3" style={{ color: '#484f58', fontWeight: '300' }}>
              Linked Reference
            </div>
            <Link
              to={`/circles/${post.circle.id}`}
              className="block border transition-colors p-4 group"
              style={{
                background: '#161b22',
                borderColor: '#21262d'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#21262d' }}>
                    <svg className="w-5 h-5 text-[#ff6b35]" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="8" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm mb-1" style={{ 
                      color: '#ffffff',
                      fontWeight: '500'
                    }}>
                      Circle: {post.circle.name}
                      {post.circle.room && (
                        <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded ${
                          post.circle.room === 'dark' ? 'bg-[#2a1a1a] text-[#D97757]' :
                          post.circle.room === 'climb' ? 'bg-[#1a2a1a] text-[#7BC96F]' :
                          post.circle.room === 'philo' ? 'bg-[#1a1a2a] text-[#8B9DC3]' :
                          'bg-[#2a2a2a] text-[#918A87]'
                        }`}>
                          {post.circle.room.toUpperCase()}
                        </span>
                      )}
                    </div>
                    {post.circle.description && (
                      <div className="text-xs" style={{ color: '#6e7681', fontWeight: '300' }}>{post.circle.description}</div>
                    )}
                  </div>
                </div>
                <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#484f58' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          </div>
        )}

        {/* Reactions Section */}
        <div className="mb-10 md:mb-12">
          <div className="text-[0.65rem] uppercase tracking-[0.2em] text-[#484f58] mb-3" style={{ fontWeight: '300' }}>
            Reactions
          </div>
          <div className="flex items-center space-x-3">
            {/* iRelate */}
            <button
              onClick={() => handleReaction('iRelate')}
              disabled={reactionLoading.iRelate}
              className={`flex items-center space-x-2 px-4 py-2 border transition-all ${
                post.userReactions?.includes('iRelate')
                  ? 'border-[#58a6ff] bg-[#58a6ff]/10 text-[#58a6ff]'
                  : 'border-[#30363d] text-[#8b949e] hover:border-[#484f58]'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm">{post.reactions?.iRelate || 0}</span>
            </button>

            {/* youreNotAlone */}
            <button
              onClick={() => handleReaction('youreNotAlone')}
              disabled={reactionLoading.youreNotAlone}
              className={`flex items-center space-x-2 px-4 py-2 border transition-all ${
                post.userReactions?.includes('youreNotAlone')
                  ? 'border-[#8b949e] bg-[#8b949e]/10 text-[#8b949e]'
                  : 'border-[#30363d] text-[#8b949e] hover:border-[#484f58]'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{post.reactions?.youreNotAlone || 0}</span>
            </button>

            {/* imListening */}
            <button
              onClick={() => handleReaction('imListening')}
              disabled={reactionLoading.imListening}
              className={`flex items-center space-x-2 px-4 py-2 border transition-all ${
                post.userReactions?.includes('imListening')
                  ? 'border-[#ff6b35] bg-[#ff6b35]/10 text-[#ff6b35]'
                  : 'border-[#30363d] text-[#8b949e] hover:border-[#484f58]'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{post.reactions?.imListening || 0}</span>
            </button>

            {/* theAbyss */}
            <button
              onClick={() => handleReaction('theAbyss')}
              disabled={reactionLoading.theAbyss}
              className={`flex items-center space-x-2 px-4 py-2 border transition-all ${
                post.userReactions?.includes('theAbyss')
                  ? 'border-[#6e7681] bg-[#6e7681]/10 text-[#6e7681]'
                  : 'border-[#30363d] text-[#8b949e] hover:border-[#484f58]'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{post.reactions?.theAbyss || 0}</span>
            </button>
          </div>
        </div>

        {/* Return Button */}
        <div className="text-center mb-16">
          <button
            onClick={() => navigate(-1)}
            className="text-[#484f58] hover:text-[#8b949e] transition-colors text-xs uppercase tracking-[0.2em] inline-flex items-center"
          >
            <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Void
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-[0.65rem] uppercase tracking-[0.2em] text-[#21262d] space-x-4">
          <span>Encrypted & Active</span>
          <span>•</span>
          <span>No Logs Saved</span>
          <span>•</span>
          <span>The Void Endures</span>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
