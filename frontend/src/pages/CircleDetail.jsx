import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';
import { ChevronsRight, ArrowUp } from 'lucide-react';
import { selectAuth } from '../features/authSlice';
import PageTransition from '../components/PageTransition';
import LoadingSpinner from '../components/LoadingSpinner';
import TopicPost from '../components/TopicPost';
import LevelBadge from '../components/LevelBadge';
import Layout from '../components/Layout';
import { usePageTitle } from '../hooks/usePageTitle';
import { fetchCircleById, fetchCircleComments, createCircleComment, fetchCircleTopicPosts } from '../services/circleService';

const roomAccent = {
  dark:  '#B44A4A',
  fantasy: '#DB762E',
  philo: '#7771D9',
};

function CircleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const hasSetInitialTopic = useRef(false);

  const [circle, setCircle] = useState(null);
  const [topicPosts, setTopicPosts] = useState([]);
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [topicsLoaded, setTopicsLoaded] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cursor, setCursor] = useState(null);

  // Dynamic title based on circle name
  usePageTitle(circle ? circle.name : 'Circle');

  const loadCircle = useCallback(async () => {
    try {
      const data = await fetchCircleById(id);
      setCircle(data);
    } catch (err) {
      setError(err.message || 'Failed to load circle');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadTopicPosts = useCallback(async () => {
    if (topicsLoaded) return;
    try {
      const params = new URLSearchParams(window.location.search);
      const postIdFromUrl = params.get('postId');
      const { fetchCircleTopicPosts } = await import('../services/circleService');
      const data = await fetchCircleTopicPosts(id);
      setTopicPosts(data || []);
      if (!hasSetInitialTopic.current && data && data.length > 0) {
        if (postIdFromUrl) {
          const match = data.find(t => t.id === postIdFromUrl);
          setActiveTopicId(match ? match.id : data[0].id);
          window.history.replaceState({}, '', `/circles/${id}`);
        } else {
          setActiveTopicId(data[0].id);
        }
        hasSetInitialTopic.current = true;
      }
    } catch (err) {
      setTopicPosts([]);
    } finally {
      setTopicsLoaded(true);
    }
  }, [id, topicsLoaded]);

  useEffect(() => {
    if (id) { setTopicsLoaded(false); hasSetInitialTopic.current = false; }
  }, [id]);

  useEffect(() => { if (id && !topicsLoaded) loadTopicPosts(); }, [id, topicsLoaded, loadTopicPosts]);
  useEffect(() => { if (id) loadCircle(); }, [id, loadCircle]);

  // Load comments with polling for real-time updates
  const loadComments = useCallback(async (reset = false, silent = false) => {
    try {
      if (!silent) setLoadingComments(true);
      
      // Always fetch from beginning (no pagination cursor) to get all comments with nested replies
      const data = await fetchCircleComments({ circleId: id, cursor: null, postId: activeTopicId });
      
      // Replace all comments to ensure nested replies are updated
      setComments(prevComments => {
        const newComments = data.comments;
        
        // If it's a reset (initial load), just use new data
        if (reset && !silent) {
          return newComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
        
        // For background updates: completely replace to get updated nested structure
        // This ensures replies show up in real-time
        return newComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      });
      
      setCursor(data.cursor);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      if (!silent) setLoadingComments(false);
    }
  }, [id, activeTopicId]);

  useEffect(() => { if (id && activeTopicId) loadComments(true, false); }, [id, activeTopicId]);

  // Poll for new comments every 3 seconds for real-time updates (silent background refresh)
  // Uses Page Visibility API to pause polling when tab is not visible
  // Stays under rate limit: 20 req/min when active
  useEffect(() => {
    if (!id || !activeTopicId) return;
    
    let interval = null;
    
    const startPolling = () => {
      if (interval) return; // Already polling
      interval = setInterval(() => loadComments(true, true), 3000);
    };
    
    const stopPolling = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
    
    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        // Refresh immediately when tab becomes visible
        loadComments(true, true);
        startPolling();
      }
    };
    
    // Start polling if page is visible
    if (!document.hidden) {
      startPolling();
    }
    
    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [id, activeTopicId, loadComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim() || submitting) return;
    try {
      setSubmitting(true);
      const newComment = await createCircleComment(id, commentContent, activeTopicId);
      // Immediately add to UI - optimistic update
      setComments(prev => {
        // Check if comment already exists (shouldn't, but be safe)
        const exists = prev.some(c => c.id === newComment.id);
        if (exists) return prev;
        // Add new comment at the end (chronological order)
        return [...prev, newComment].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      });
      setCommentContent('');
      
      // Trigger immediate refresh to get server state
      setTimeout(() => loadComments(true, true), 50);
    } catch (err) {
      console.error('Failed to create comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }
  };

  const buildCommentTree = (comments) => {
    const map = new Map();
    const roots = [];
    comments.forEach(c => map.set(c.id, { ...c, replies: [] }));
    comments.forEach(c => {
      if (c.parentId) { const p = map.get(c.parentId); if (p) p.replies.push(map.get(c.id)); }
      else roots.push(map.get(c.id));
    });
    return roots;
  };

  const stripHtml = (html) => { if (!html) return ''; const d = document.createElement('div'); d.innerHTML = html; return d.textContent || ''; };
  const firstSentence = (content) => {
    if (!content) return '';
    const text = stripHtml(content);
    const parts = text.split(/[.!?](?:\s|$)/);
    return parts[0]?.trim() + (parts.length > 1 ? '...' : '') || text;
  };

  const activeTopicPost = topicPosts.find(t => t.id === activeTopicId);
  const commentTree = buildCommentTree(comments);
  const accent = circle?.room ? (roomAccent[circle.room] || 'rgba(255,255,255,0.5)') : 'rgba(255,255,255,0.5)';

  if (loading) {
    return (
      <PageTransition>
        <Layout>
          <div className="flex items-center justify-center min-h-screen"><LoadingSpinner /></div>
        </Layout>
      </PageTransition>
    );
  }

  if (error || !circle) {
    return (
      <PageTransition>
        <Layout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-white/30 mb-4 text-sm">{error || 'Circle not found'}</p>
              <button onClick={() => navigate('/circles')} className="text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-white/60 transition-colors">← Back to Circles</button>
            </div>
          </div>
        </Layout>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Layout leftSidebar={null} rightSidebar={null}>
        <div className="relative z-10 max-w-2xl mx-auto px-4 pb-44 pt-2">

          {/* Circle header */}
          <div className="mb-10 font-mono">
            <button 
              onClick={() => navigate('/circles')} 
              className="text-[10px] tracking-[0.18em] uppercase transition-all mb-7 inline-flex items-center gap-2 px-3 py-1 rounded border border-white/10 bg-white/[0.03] text-[#928B91] hover:text-[#E7DED5] hover:border-white/20 hover:bg-white/[0.06]"
            >
              ← Circles
            </button>

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="w-8 h-px mb-5" style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />
                <h1 className="text-xl sm:text-2xl font-bold tracking-[0.18em] text-[#E7DED5] uppercase mb-1.5">{circle.name}</h1>
                {circle.room && (
                  <p className="text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ color: accent }}>{circle.room} room</p>
                )}
                {circle.description && (
                  <p className="text-xs text-[#928B91] leading-relaxed mt-2.5 max-w-md font-sans">{circle.description}</p>
                )}
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-[9px] tracking-[0.2em] text-[#928B91] uppercase mb-0.5">Souls</div>
                <div className="text-xl font-bold tabular-nums" style={{ color: accent }}>{circle.activeUserCount || 0}</div>
              </div>
            </div>

            {/* nav links */}
            <div className="flex gap-5 mt-6 text-[10px] tracking-[0.18em] uppercase">
              <button onClick={() => navigate('/rules')} className="text-[#928B91] hover:text-[#E7DED5] transition-colors">Rules</button>
              <button onClick={() => navigate('/circles')} className="text-[#928B91] hover:text-[#E7DED5] transition-colors">Other Circles</button>
            </div>
          </div>

          {/* Topic selector */}
          {topicPosts.length > 0 && (
            <div className="mb-8 font-mono">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                <p className="text-[9px] tracking-[0.25em] text-[#928B91] uppercase font-bold">Circle Topics</p>
              </div>
              <div className={`grid gap-2.5 ${topicPosts.length === 1 ? 'grid-cols-1' : topicPosts.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
                {topicPosts.map((topic) => {
                  const active = activeTopicId === topic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setActiveTopicId(topic.id)}
                      className="text-left p-3.5 transition-all duration-300 rounded-xl relative group overflow-hidden"
                      style={{
                        backgroundColor: active ? 'rgba(25, 24, 32, 0.75)' : 'rgba(255, 255, 255, 0.02)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: active ? `1px solid ${accent}` : '1px solid rgba(255, 255, 255, 0.06)',
                        boxShadow: active ? `0 4px 18px rgba(0,0,0,0.4), 0 0 16px ${accent}25` : 'none',
                      }}
                    >
                      {active && (
                        <div 
                          className="absolute top-0 left-0 right-0 h-[2px]" 
                          style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }} 
                        />
                      )}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span 
                          className="text-[8px] tracking-[0.2em] uppercase px-1.5 py-0.5 font-bold rounded"
                          style={{ 
                            color: active ? '#ffffff' : accent, 
                            backgroundColor: active ? accent : `${accent}18`,
                          }}
                        >
                          Topic
                        </span>
                        <span className="text-[9px] text-[#928B91] tabular-nums font-medium">
                          {topic.commentCount || 0} {(topic.commentCount === 1) ? 'thought' : 'thoughts'}
                        </span>
                      </div>
                      <p 
                        className="text-xs font-sans leading-relaxed line-clamp-2 transition-colors"
                        style={{ color: active ? '#E7DED5' : '#928B91' }}
                      >
                        {firstSentence(topic.content)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active topic post */}
          {activeTopicPost && (
            <div className="mb-8 font-mono">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                <p className="text-[9px] tracking-[0.25em] text-[#928B91] uppercase font-bold">Active Topic</p>
              </div>
              <TopicPost post={activeTopicPost} />
            </div>
          )}

          {/* Discussion */}
          <div className="mb-4 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <p className="text-[9px] tracking-[0.25em] text-[#928B91] uppercase font-bold">
                {comments.length > 0 ? `${comments.length} response${comments.length !== 1 ? 's' : ''}` : 'Discussion'}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            {commentTree.length === 0 && !loadingComments ? (
              <div className="py-14 text-center border border-white/[0.04] rounded-xl bg-white/[0.01]">
                <p className="text-white/30 text-sm font-mono">No responses yet. Be the first to share your soul.</p>
              </div>
            ) : (
              commentTree.map(comment => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  depth={0} 
                  circleId={id} 
                  accent={accent}
                  topicAuthorUsername={activeTopicPost?.author?.username}
                />
              ))
            )}
          </div>

        </div>

        {/* Floating Centered Obsidian Conversation Dock */}
        <div className="fixed bottom-3 sm:bottom-5 left-0 right-0 z-50 px-3 sm:px-4 pointer-events-none">
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <form 
              onSubmit={handleSubmit}
              className="relative rounded-2xl transition-all duration-300 font-mono shadow-[0_12px_44px_rgba(0,0,0,0.85)] border border-white/10"
              style={{
                backgroundColor: 'rgba(15, 14, 20, 0.88)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: `0 12px 40px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08), 0 0 24px ${accent}15`,
              }}
            >
              {/* Inner Well */}
              <div className="p-2 sm:p-2.5">
                <div className="flex items-start gap-2.5">
                  {/* Current User Soul Indicator */}
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5 border shadow-sm"
                    style={{
                      backgroundColor: `${accent}18`,
                      color: accent,
                      borderColor: `${accent}40`,
                    }}
                    title={circle?.name || 'You'}
                  >
                    ✦
                  </div>

                  {/* Textarea */}
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="whisper into the circle..."
                    className="flex-1 text-[#E7DED5] text-xs sm:text-sm resize-none focus:outline-none placeholder-white/25 bg-transparent pt-1 leading-relaxed tracking-wide"
                    rows={1}
                    maxLength={2000}
                    style={{ minHeight: '38px', maxHeight: '120px' }}
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!commentContent.trim() || submitting}
                    className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-20 hover:scale-105 active:scale-95 shadow-sm"
                    style={{
                      backgroundColor: commentContent.trim() ? accent : 'rgba(255, 255, 255, 0.06)',
                      color: commentContent.trim() ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                      boxShadow: commentContent.trim() ? `0 0 14px ${accent}50` : 'none',
                    }}
                    title="Send message (Enter)"
                  >
                    {submitting ? (
                      <span className="text-[10px] animate-pulse">···</span>
                    ) : (
                      <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </button>
                </div>

                {/* Micro Toolbar: Shortcut hint & Character count */}
                <div className="flex items-center justify-between pt-1.5 px-1 border-t border-white/[0.05] mt-1 text-[9px] tracking-wider text-[#928B91]">
                  <span className="hidden sm:inline text-white/25">
                    press <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-white/50 text-[8px]">↵</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-white/50 text-[8px]">shift + ↵</kbd> line break
                  </span>
                  <span className="sm:hidden text-white/20">
                    max 2000 chars
                  </span>

                  <div className="flex items-center gap-2 ml-auto">
                    <div className="w-12 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-200"
                        style={{
                          width: `${(commentContent.length / 2000) * 100}%`,
                          backgroundColor: commentContent.length > 1800 ? '#B44A4A' : accent,
                        }}
                      />
                    </div>
                    <span 
                      className="tabular-nums"
                      style={{
                        color: commentContent.length > 1800 ? '#B44A4A' : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {commentContent.length}/2000
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </PageTransition>
  );
}

function getEngagementStars(count) {
  if (count > 11) return { count: 3, color: '#5FB878' };
  if (count >= 6) return { count: 2, color: '#c47a3a' };
  if (count >= 3) return { count: 1, color: 'rgba(255,255,255,0.6)' };
  return { count: 0, color: '' };
}

// Generate consistent color from username for user identification
function getUserColor(username) {
  if (!username) return '#928B91';
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Sophisticated organic tones matching our palette
  const colors = [
    '#DB762E', // burnt orange
    '#7771D9', // philo violet
    '#42B89A', // sage teal
    '#D6A45F', // warm amber
    '#B44A4A', // crimson
    '#58A6FF', // celestial slate
    '#E58DF6', // dusk orchid
    '#F59E0B', // honey
    '#38BDF8', // ice cyan
    '#A3E635', // lime moss
  ];
  
  return colors[Math.abs(hash) % colors.length];
}

function CommentItem({ comment, depth, circleId, accent, topicAuthorUsername }) {
  const { user } = useSelector(selectAuth);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [replyCount, setReplyCount] = useState(comment.replyCount || 0);
  const [reactions, setReactions] = useState(comment.reactions || { resonate: 0, echo: 0 });
  const [userReactions, setUserReactions] = useState(comment.userReactions || []);
  const [reacting, setReacting] = useState(false);

  const maxDepth = 2;
  const isMaxDepth = depth >= maxDepth;
  const isOwnComment = comment.isOwnComment || Boolean(user?.username && comment.author?.username === user.username);
  const isTopicAuthor = Boolean(topicAuthorUsername && comment.author?.username === topicAuthorUsername);
  const stars = getEngagementStars(replyCount);
  const hasReacted = (type) => userReactions.includes(type);
  
  // Get user-specific color for visual differentiation
  const userColor = getUserColor(comment.author?.username);

  // Sync replies from server data (critical for real-time updates from other users)
  useEffect(() => { setReplies(comment.replies || []); }, [comment.replies]);
  useEffect(() => { setReplyCount(comment.replyCount || 0); }, [comment.replyCount]);
  useEffect(() => { setReactions(comment.reactions || { resonate: 0, echo: 0 }); setUserReactions(comment.userReactions || []); }, [comment.reactions, comment.userReactions]);

  const formatTime = (ts) => {
    const d = Math.floor((new Date() - new Date(ts)) / 1000);
    if (d < 60) return 'just now';
    if (d < 3600) return `${Math.floor(d / 60)}m`;
    if (d < 86400) return `${Math.floor(d / 3600)}h`;
    return `${Math.floor(d / 86400)}d`;
  };

  const handleReaction = async (type) => {
    if (reacting || isOwnComment) return;
    try {
      setReacting(true);
      const { addCommentReaction, removeCommentReaction } = await import('../services/circleService');
      const result = hasReacted(type)
        ? await removeCommentReaction(comment.id, type)
        : await addCommentReaction(comment.id, type);
      setReactions(result.reactions);
      setUserReactions(result.userReactions);
    } catch (err) {
      if (err.code !== 'CANNOT_REACT_OWN_COMMENT') console.error(err);
    } finally {
      setReacting(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || submitting) return;
    try {
      setSubmitting(true);
      const { createCommentReply } = await import('../services/circleService');
      const newReply = await createCommentReply(comment.id, replyContent);
      
      // Optimistically update UI immediately
      setReplyCount(p => p + 1);
      setReplies(p => {
        const exists = p.some(r => r.id === newReply.id);
        if (exists) return p;
        // Add new reply at the end (chronological order)
        return [...p, { ...newReply, replies: [] }];
      });
      
      setReplyContent('');
      setShowReplyForm(false);
    } catch (err) {
      setReplyCount(p => Math.max(0, p - 1));
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplyKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReplySubmit(e); } };

  return (
    <div style={{ marginLeft: depth > 0 ? `${depth * 18}px` : '0' }}>
      {/* Comment card with premium visual differentiation */}
      <div
        className="mb-2.5 p-3.5 sm:p-4 transition-all duration-300 font-mono rounded-xl group relative"
        style={{
          backgroundColor: isOwnComment ? 'rgba(255, 255, 255, 0.04)' : 'rgba(25, 24, 32, 0.55)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isOwnComment ? `1px solid ${accent}45` : '1px solid rgba(255, 255, 255, 0.06)',
          borderLeft: `3px solid ${userColor}`,
          boxShadow: isOwnComment ? `0 4px 20px rgba(0, 0, 0, 0.35), 0 0 16px ${accent}12` : '0 4px 18px rgba(0, 0, 0, 0.3)',
          position: 'relative',
        }}
      >
        {/* Subtle connecting line for threaded replies */}
        {depth > 0 && (
          <div 
            style={{
              position: 'absolute',
              left: '-19px',
              top: '20px',
              width: '18px',
              height: '1px',
              background: `linear-gradient(to right, ${userColor}30, ${userColor}60)`,
            }}
          />
        )}
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-2.5">
          {/* User avatar with color-coded border */}
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold border transition-transform duration-200 group-hover:scale-105"
            style={{ 
              backgroundColor: `${userColor}18`, 
              color: userColor,
              borderColor: `${userColor}45`,
              boxShadow: `0 0 8px ${userColor}20`,
            }}
          >
            {comment.author?.username ? comment.author.username.charAt(0).toUpperCase() : '?'}
          </div>
          
          {/* Username with indicators */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span 
              className="w-1.5 h-1.5 rounded-full flex-shrink-0" 
              style={{ 
                backgroundColor: userColor,
                boxShadow: `0 0 4px ${userColor}60`,
              }}
            />
            <span className="text-[#E7DED5] text-xs font-semibold tracking-wide">
              {comment.author?.username || 'User'}
            </span>

            {isTopicAuthor && (
              <span 
                className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider"
                style={{ 
                  backgroundColor: `${accent}20`, 
                  color: accent, 
                  border: `1px solid ${accent}45` 
                }}
              >
                Topic Author
              </span>
            )}

            {isOwnComment && !isTopicAuthor && (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase tracking-wider text-white/50 bg-white/[0.06] border border-white/10">
                You
              </span>
            )}
          </div>
          
          {comment.author?.levelBadge && (
            <LevelBadge stat={comment.author.levelBadge.stat} level={comment.author.levelBadge.level} size="xs" />
          )}

          <span className="text-[#928B91] text-[10px] ml-auto tabular-nums">
            {formatTime(comment.createdAt)}
          </span>

          {stars.count > 0 && (
            <div className="flex gap-0.5 ml-1">
              {[...Array(stars.count)].map((_, i) => <FaStar key={i} style={{ color: stars.color, width: 8, height: 8 }} />)}
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className="text-[#E7DED5]/90 text-xs sm:text-sm leading-relaxed mb-3 pl-8 font-sans"
          dangerouslySetInnerHTML={{ __html: comment.isDeleted ? '<em style="color:rgba(255,255,255,0.25)">[deleted]</em>' : comment.content }}
        />

        {/* Actions Bar */}
        {!comment.isDeleted && (
          <div className="flex items-center gap-3.5 pl-8 text-[11px] font-mono">
            {/* Resonate */}
            <button
              onClick={() => handleReaction('resonate')}
              disabled={reacting || isOwnComment}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded transition-all border"
              style={{ 
                color: hasReacted('resonate') ? accent : '#928B91', 
                backgroundColor: hasReacted('resonate') ? `${accent}15` : 'transparent',
                borderColor: hasReacted('resonate') ? `${accent}40` : 'transparent',
                cursor: isOwnComment ? 'not-allowed' : 'pointer' 
              }}
              title={isOwnComment ? 'Cannot react to your own message' : 'Resonate'}
            >
              <span className="text-[10px]">▲</span>
              <span className="tabular-nums font-semibold">{reactions.resonate || 0}</span>
            </button>

            {/* Echo */}
            <button
              onClick={() => handleReaction('echo')}
              disabled={reacting || isOwnComment}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded transition-all border"
              style={{ 
                color: hasReacted('echo') ? accent : '#928B91', 
                backgroundColor: hasReacted('echo') ? `${accent}15` : 'transparent',
                borderColor: hasReacted('echo') ? `${accent}40` : 'transparent',
                cursor: isOwnComment ? 'not-allowed' : 'pointer' 
              }}
              title={isOwnComment ? 'Cannot react to your own message' : 'Echo'}
            >
              <span className="text-[10px]">▼</span>
              <span className="tabular-nums font-semibold">{reactions.echo || 0}</span>
            </button>

            {/* Replies toggle */}
            {replyCount > 0 && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="inline-flex items-center gap-1.5 text-[#928B91] hover:text-[#E7DED5] transition-colors"
              >
                <span>{replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
                <span className="transition-transform duration-200 text-[9px]" style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                  ▼
                </span>
              </button>
            )}

            {/* Reply toggle */}
            {!isMaxDepth && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-[#928B91] hover:text-[#E7DED5] transition-colors uppercase tracking-wider text-[10px] font-semibold"
              >
                {showReplyForm ? 'Cancel' : 'Reply'}
              </button>
            )}
          </div>
        )}

        {/* Reply form */}
        {showReplyForm && (
          <div className="mt-3.5 pl-8">
            <div 
              className="p-2 rounded-lg border border-white/10"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
              }}
            >
              <div className="flex items-center gap-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyDown={handleReplyKey}
                  placeholder="add your thought..."
                  className="flex-1 text-[#E7DED5] text-xs resize-none focus:outline-none placeholder-white/20 bg-transparent leading-relaxed"
                  rows={1}
                  maxLength={2000}
                  style={{ minHeight: '30px', maxHeight: '80px' }}
                />
                <button
                  type="submit"
                  onClick={handleReplySubmit}
                  disabled={!replyContent.trim() || submitting}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-25 hover:scale-105 active:scale-95 flex-shrink-0"
                  style={{ 
                    backgroundColor: replyContent.trim() ? accent : 'rgba(255, 255, 255, 0.05)', 
                    color: replyContent.trim() ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                  }}
                  title="Reply"
                >
                  {submitting ? (
                    <span className="text-[10px]">···</span>
                  ) : (
                    <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between text-[9px] text-[#928B91] pt-1 mt-1 border-t border-white/[0.04]">
                <span>press ↵ to reply</span>
                <span>{replyContent.length}/2000</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nested replies */}
      {!isCollapsed && replies.length > 0 && (
        <div className="mb-2">
          {replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              depth={depth + 1} 
              circleId={circleId} 
              accent={accent} 
              topicAuthorUsername={topicAuthorUsername}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CircleDetail;
