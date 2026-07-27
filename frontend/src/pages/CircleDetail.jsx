import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';
import { ChevronsRight } from 'lucide-react';
import { selectAuth } from '../features/authSlice';
import PageTransition from '../components/PageTransition';
import LoadingSpinner from '../components/LoadingSpinner';
import TopicPost from '../components/TopicPost';
import LevelBadge from '../components/LevelBadge';
import Layout from '../components/Layout';
import { usePageTitle } from '../hooks/usePageTitle';
import { fetchCircleById, fetchCircleComments, createCircleComment, fetchCircleTopicPosts } from '../services/circleService';

const roomAccent = {
  dark:  '#c4a882',
  fantasy: '#FF9D1C',
  philo: '#b8a8d4',
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
  useEffect(() => {
    const interval = setInterval(loadCircle, 5000);
    return () => clearInterval(interval);
  }, [loadCircle]);

  // Load comments with polling for real-time updates
  const loadComments = useCallback(async (reset = false, silent = false) => {
    try {
      if (!silent) setLoadingComments(true);
      const data = await fetchCircleComments({ circleId: id, cursor: reset ? null : cursor, postId: activeTopicId });
      // Sort chronologically: oldest first (like Discord, Slack)
      setComments(data.comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
      setCursor(data.cursor);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      if (!silent) setLoadingComments(false);
    }
  }, [id, cursor, activeTopicId]);

  useEffect(() => { if (id && activeTopicId) loadComments(true, false); }, [id, activeTopicId]);

  // Poll for new comments every 3 seconds for real-time updates (silent background refresh)
  useEffect(() => {
    if (!id || !activeTopicId) return;
    const interval = setInterval(() => loadComments(true, true), 3000);
    return () => clearInterval(interval);
  }, [id, activeTopicId, loadComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim() || submitting) return;
    try {
      setSubmitting(true);
      const newComment = await createCircleComment(id, commentContent, activeTopicId);
      // Add new comment at the end (bottom) for chronological order
      setComments(prev => [...prev, newComment]);
      setCommentContent('');
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
        <div className="relative z-10 max-w-2xl mx-auto px-4 pb-32 pt-2">

          {/* Circle header */}
          <div className="mb-10">
            <button onClick={() => navigate('/circles')} className="text-[10px] tracking-[0.2em] text-white/25 hover:text-white/60 uppercase transition-colors mb-7 flex items-center gap-2">
              ← Circles
            </button>

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="w-8 h-px mb-5" style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />
                <h1 className="text-2xl font-light tracking-[0.2em] text-white uppercase mb-2">{circle.name}</h1>
                {circle.room && (
                  <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: accent + '99' }}>{circle.room} room</p>
                )}
                {circle.description && (
                  <p className="text-[11px] text-white/25 leading-relaxed mt-3 max-w-sm">{circle.description}</p>
                )}
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-[10px] tracking-[0.15em] text-white/20 uppercase mb-1">Souls</div>
                <div className="text-xl font-light" style={{ color: accent }}>{circle.activeUserCount || 0}</div>
              </div>
            </div>

            {/* nav links */}
            <div className="flex gap-5 mt-6">
              <button onClick={() => navigate('/rules')} className="text-[10px] tracking-[0.18em] uppercase text-white/25 hover:text-white/55 transition-colors">Rules</button>
              <button onClick={() => navigate('/circles')} className="text-[10px] tracking-[0.18em] uppercase text-white/25 hover:text-white/55 transition-colors">Other Circles</button>
            </div>
          </div>

          {/* Topic selector */}
          {topicPosts.length > 0 && (
            <div className="mb-8">
              <p className="text-[9px] tracking-[0.25em] text-white/20 uppercase mb-3">Topics</p>
              <div className={`grid gap-3 ${topicPosts.length === 1 ? 'grid-cols-1' : topicPosts.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {topicPosts.map((topic) => {
                  const active = activeTopicId === topic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setActiveTopicId(topic.id)}
                      className="text-left p-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        borderRadius: '4px',
                        background: active ? `${accent}15` : 'rgba(255,255,255,0.03)',
                        boxShadow: active ? `0 0 0 2px ${accent}66, 0 2px 8px rgba(0,0,0,0.3)` : '0 0 0 1px rgba(255,255,255,0.08)',
                        cursor: 'pointer',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span 
                          className="text-[8px] tracking-[0.2em] uppercase px-1.5 py-0.5 font-medium" 
                          style={{ 
                            color: active ? accent : 'rgba(255,255,255,0.5)', 
                            background: active ? `${accent}25` : 'rgba(255,255,255,0.08)', 
                            borderRadius: '2px' 
                          }}
                        >
                          Topic
                        </span>
                        <span className="text-[9px] text-white/25">{topic.commentCount || 0} responses</span>
                      </div>
                      <p 
                        className="text-[11px] leading-relaxed line-clamp-2"
                        style={{ color: active ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.5)' }}
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
            <div className="mb-8 p-5" style={{ background: 'rgba(255,255,255,0.025)', boxShadow: `0 0 0 1px rgba(255,255,255,0.07)`, borderRadius: '3px' }}>
              <p className="text-[9px] tracking-[0.25em] text-white/20 uppercase mb-3">Active Topic</p>
              <TopicPost post={activeTopicPost} />
            </div>
          )}

          {/* Discussion */}
          <div className="mb-6">
            <p className="text-[9px] tracking-[0.25em] text-white/20 uppercase">
              {comments.length > 0 ? `${comments.length} response${comments.length !== 1 ? 's' : ''}` : 'Discussion'}
            </p>
          </div>

          <div className="space-y-1">
            {commentTree.length === 0 && !loadingComments ? (
              <div className="py-12 text-center">
                <p className="text-white/20 text-sm">No responses yet. Be the first.</p>
              </div>
            ) : (
              commentTree.map(comment => (
                <CommentItem key={comment.id} comment={comment} depth={0} circleId={id} accent={accent} />
              ))
            )}
            {loadingComments && <div className="flex justify-center py-6"><LoadingSpinner /></div>}
          </div>

        </div>

        {/* Fixed comment input */}
        <div
          className="fixed bottom-0 left-0 right-0 z-50 py-4 px-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex items-start gap-3">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="share your vibe"
                  className="flex-1 text-white/70 text-sm resize-none focus:outline-none placeholder-white/20 bg-transparent"
                  rows={1}
                  maxLength={2000}
                  style={{ minHeight: '36px', maxHeight: '36px' }}
                />
                <button
                  type="submit"
                  disabled={!commentContent.trim() || submitting}
                  className="flex-shrink-0 p-2 transition-all disabled:opacity-30 hover:scale-110 active:scale-95"
                  style={{ 
                    background: `${accent}25`, 
                    color: accent, 
                    borderRadius: '4px', 
                    border: `1px solid ${accent}55` 
                  }}
                  title="Send message"
                >
                  {submitting ? (
                    <span className="text-xs">...</span>
                  ) : (
                    <ChevronsRight className="w-5 h-5" />
                  )}
                </button>
              </div>
              {/* Character counter with progress indicator */}
              <div className="flex items-center gap-2 px-1">
                <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-200"
                    style={{
                      width: `${(commentContent.length / 2000) * 100}%`,
                      background: commentContent.length > 1800 ? accent : commentContent.length > 1500 ? `${accent}88` : `${accent}44`,
                    }}
                  />
                </div>
                <span 
                  className="text-[10px] tabular-nums whitespace-nowrap transition-colors"
                  style={{ 
                    color: commentContent.length > 1800 ? accent : 'rgba(255,255,255,0.15)'
                  }}
                >
                  {commentContent.length}/2000
                </span>
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

function CommentItem({ comment, depth, circleId, accent }) {
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
  const isOwnComment = comment.isOwnComment || false;
  const stars = getEngagementStars(replyCount);
  const hasReacted = (type) => userReactions.includes(type);

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
      setReplyCount(p => p + 1);
      const { createCommentReply } = await import('../services/circleService');
      const newReply = await createCommentReply(comment.id, replyContent);
      // Add new reply at the end (chronological order)
      setReplies(p => [...p, { ...newReply, replies: [] }]);
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
    <div style={{ marginLeft: depth > 0 ? `${depth * 20}px` : '0' }}>
      {/* Comment card */}
      <div
        className="mb-2 p-4 transition-all duration-200"
        style={{
          background: depth === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.02)',
          boxShadow: depth === 0 ? '0 0 0 1px rgba(255,255,255,0.055)' : 'none',
          borderRadius: '3px',
          borderLeft: depth > 0 ? `1px solid rgba(255,255,255,0.08)` : 'none',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-light"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}
          >
            {comment.author?.username ? comment.author.username.charAt(0).toUpperCase() : '?'}
          </div>
          <span className="text-white/60 text-[11px] font-light tracking-wide">
            {comment.author?.username || 'User'}
          </span>
          {comment.author?.levelBadge && (
            <LevelBadge stat={comment.author.levelBadge.stat} level={comment.author.levelBadge.level} size="xs" />
          )}
          <span className="text-white/20 text-[10px]">{formatTime(comment.createdAt)}</span>
          {stars.count > 0 && (
            <div className="flex gap-0.5 ml-1">
              {[...Array(stars.count)].map((_, i) => <FaStar key={i} style={{ color: stars.color, width: 9, height: 9 }} />)}
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className="text-white/75 text-sm leading-relaxed mb-3 pl-8"
          dangerouslySetInnerHTML={{ __html: comment.isDeleted ? '<em style="color:rgba(255,255,255,0.2)">[deleted]</em>' : comment.content }}
        />

        {/* Actions */}
        {!comment.isDeleted && (
          <div className="flex items-center gap-5 pl-8">
            <button
              onClick={() => handleReaction('resonate')}
              disabled={reacting || isOwnComment}
              className="flex items-center gap-1 transition-colors text-[11px]"
              style={{ color: hasReacted('resonate') ? (accent || '#c4a882') : 'rgba(255,255,255,0.25)', cursor: isOwnComment ? 'not-allowed' : 'pointer' }}
            >
              <span>▲</span>
              <span>{reactions.resonate || 0}</span>
            </button>

            <button
              onClick={() => handleReaction('echo')}
              disabled={reacting || isOwnComment}
              className="flex items-center gap-1 transition-colors text-[11px]"
              style={{ color: hasReacted('echo') ? (accent || '#c4a882') : 'rgba(255,255,255,0.25)', cursor: isOwnComment ? 'not-allowed' : 'pointer' }}
            >
              <span>▼</span>
              <span>{reactions.echo || 0}</span>
            </button>

            {replyCount > 0 && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="flex items-center gap-1 text-[11px] transition-colors"
                style={{ color: 'rgba(255,255,255,0.25)' }}
              >
                <span>{replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
                <span style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)', display: 'inline-block', transition: 'transform 0.2s' }}>∨</span>
              </button>
            )}

            {!isMaxDepth && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-[11px] transition-colors"
                style={{ color: showReplyForm ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)' }}
              >
                {showReplyForm ? 'cancel' : 'reply'}
              </button>
            )}
          </div>
        )}

        {/* Reply form */}
        {showReplyForm && (
          <div className="mt-3 pl-8 space-y-1">
            <div className="flex items-center gap-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={handleReplyKey}
                placeholder="add your thoughts..."
                className="flex-1 text-white/65 text-[12px] resize-none focus:outline-none placeholder-white/20 bg-transparent border-b border-white/10 py-1"
                rows={1}
                maxLength={2000}
                style={{ minHeight: '28px', maxHeight: '28px' }}
              />
              <button
                type="submit"
                onClick={handleReplySubmit}
                disabled={!replyContent.trim() || submitting}
                className="transition-all disabled:opacity-30 hover:scale-110 active:scale-95 p-1.5"
                style={{ color: accent || '#c4a882', background: (accent || '#c4a882') + '20', borderRadius: '3px', border: `1px solid ${accent || '#c4a882'}40` }}
                title="Reply"
              >
                {submitting ? (
                  <span className="text-[10px]">...</span>
                ) : (
                  <ChevronsRight className="w-4 h-4" />
                )}
              </button>
            </div>
            {/* Character counter with progress */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-200"
                  style={{
                    width: `${(replyContent.length / 2000) * 100}%`,
                    background: replyContent.length > 1800 ? (accent || '#c4a882') : `${accent || '#c4a882'}44`,
                  }}
                />
              </div>
              <span 
                className="text-[9px] tabular-nums"
                style={{ color: replyContent.length > 1800 ? (accent || '#c4a882') : 'rgba(255,255,255,0.15)' }}
              >
                {replyContent.length}/2000
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Nested replies */}
      {!isCollapsed && replies.length > 0 && (
        <div className="mb-2">
          {replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} circleId={circleId} accent={accent} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CircleDetail;
