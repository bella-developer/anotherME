import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth } from '../features/authSlice';
import { deletePost } from '../features/postsSlice';
import * as postService from '../services/postService';
import * as circleService from '../services/circleService';
import Layout from '../components/Layout';
import PageTransition from '../components/PageTransition';
import FantasyRoomCard from '../components/FantasyRoomCard';
import FantasyRoomPostForm from '../components/FantasyRoomPostForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePageTitle } from '../hooks/usePageTitle';

function FantasyRoom() {
  usePageTitle('Fantasy Room');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(selectAuth);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [circles, setCircles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    { value: 'ALL', label: 'All' },
    { value: 'CREATIVE', label: 'Creative' },
    { value: 'DAYDREAM', label: 'Daydream' },
    { value: 'FUNNY', label: 'Funny' },
    { value: 'FUTURISTIC', label: 'Futuristic' },
  ];

  const fetchData = async (bustCache = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch posts using service (includes JWT token via interceptor)
      const postsData = await postService.fetchPosts({
        room: 'fantasy',
        category: selectedCategory === 'ALL' ? undefined : selectedCategory
      });
      setPosts(postsData.posts || []);
      
      // Fetch circles using service (includes JWT token via interceptor)
      const circlesData = await circleService.fetchCircles({ 
        room: 'fantasy',
        bustCache // Pass cache buster when refetching after creation
      });
      setCircles(circlesData.circles || []);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      if (err.code === 'UNAUTHORIZED') navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [navigate, selectedCategory]);

  const handlePostCreated = (newPost) => setPosts(prev => [newPost, ...prev]);

  const handleCircleCreated = () => {
    // Refetch circles to update dropdown with cache bust
    fetchData(true); // Pass true to bust cache
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setIsPostFormOpen(true);
  };

  const handleDelete = async (postId) => {
    try {
      await dispatch(deletePost(postId)).unwrap();
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (error) {
      alert('Failed to delete post');
    }
  };

  const handleReaction = async (postId, reactionKey) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const post = posts.find(p => p.id === postId);
    if (post?.isAuthor) return;
    const currentReaction = post?.userReactions?.[0];
    const hasThisReaction = currentReaction === reactionKey;
    
    // Optimistic UI update
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const newReactions = { ...p.reactions };
      if (hasThisReaction) {
        newReactions[reactionKey] = Math.max(0, (newReactions[reactionKey] || 0) - 1);
        return { ...p, reactions: newReactions, userReactions: [] };
      }
      if (currentReaction) newReactions[currentReaction] = Math.max(0, (newReactions[currentReaction] || 0) - 1);
      newReactions[reactionKey] = (newReactions[reactionKey] || 0) + 1;
      return { ...p, reactions: newReactions, userReactions: [reactionKey] };
    }));
    
    try {
      // Use postService which has JWT interceptor
      if (hasThisReaction) {
        await postService.removeReaction(postId, reactionKey);
      } else {
        await postService.addReaction(postId, reactionKey);
      }
    } catch (error) {
      console.error('Reaction failed:', error);
      if (error.code === 'UNAUTHORIZED') navigate('/login');
      // Revert optimistic update on error
      setPosts(prev => prev.map(p => p.id === postId ? post : p));
    }
  };

  return (
    <PageTransition>
      <Layout leftSidebar={null} rightSidebar={null}>
        {/* Atmospheric Background - Warm amber glow */}
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(249, 115, 22, 0.05) 0%, transparent 60%)',
            zIndex: 1,
          }}
        />
        
        <div className="min-h-screen pt-16 pb-24 px-6 relative z-10">
          <div className="max-w-3xl mx-auto">

            {/* Room header - Illustrated Observatory */}
            <div className="mb-20">
              <button
                onClick={() => navigate('/home')}
                className="text-xs tracking-ultra uppercase mb-12 transition-all flex items-center gap-2"
                style={{
                  color: 'var(--text-ghost)',
                  transitionDuration: 'var(--duration-slow)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-ghost)'}
              >
                ← Rooms
              </button>

              <div className="flex items-start justify-between gap-8">
                <div className="flex-1">
                  {/* Precious orange accent - used sparingly */}
                  <div className="w-12 h-px mb-8" style={{ 
                    background: 'linear-gradient(to right, rgba(249, 115, 22, 0.4), transparent)' 
                  }} />
                  
                  <p className="text-xs tracking-ultra uppercase mb-6" style={{ color: 'var(--text-ghost)' }}>
                    The Fantasy Room
                  </p>
                  
                  <h1 className="text-5xl md:text-6xl font-light mb-8 whitespace-nowrap" style={{
                    color: 'var(--text-primary)',
                    letterSpacing: 'var(--tracking-tight)',
                    lineHeight: 'var(--leading-tight)',
                  }}>
                    Dream Without Limits
                  </h1>
                  
                  <p className="text-base mb-4 max-w-md" style={{
                    color: 'var(--text-tertiary)',
                    lineHeight: 'var(--leading-relaxed)'
                  }}>
                    Where imagination becomes tangible
                  </p>
                  
                  <p className="text-[10px] max-w-md" style={{
                    color: 'rgba(255, 255, 255, 0.15)',
                    lineHeight: 'var(--leading-relaxed)'
                  }}>
                    Stories, art, and dreams from creative minds.
                  </p>
                </div>
                {isAuthenticated && (
                  <button
                    onClick={() => setIsPostFormOpen(true)}
                    className="flex-shrink-0 px-6 py-3 text-xs tracking-widest uppercase transition-all"
                    style={{
                      background: 'var(--surface-1)',
                      border: '1px solid var(--border-whisper)',
                      color: 'var(--text-tertiary)',
                      borderRadius: 'var(--radius-soft)',
                      transitionDuration: 'var(--duration-slow)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.3)';
                      e.currentTarget.style.color = 'rgba(249, 115, 22, 0.9)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-whisper)';
                      e.currentTarget.style.color = 'var(--text-tertiary)';
                    }}
                  >
                    Create Dream
                  </button>
                )}
              </div>

              {/* Category filters - Ultra compact, minimal design */}
              <div className="flex gap-2 flex-wrap mt-12">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className="px-3 py-1 text-[9px] tracking-wide uppercase transition-all"
                    style={{
                      borderRadius: '2px',
                      background: selectedCategory === cat.value ? 'rgba(249, 115, 22, 0.15)' : 'transparent',
                      border: selectedCategory === cat.value ? '1px solid rgba(249, 115, 22, 0.4)' : '1px solid rgba(255, 255, 255, 0.04)',
                      color: selectedCategory === cat.value ? 'rgba(249, 115, 22, 1)' : 'rgba(255, 255, 255, 0.2)',
                      transitionDuration: 'var(--duration-slow)',
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feed */}
            {loading ? (
              <div className="flex justify-center py-16"><LoadingSpinner /></div>
            ) : error ? (
              <div className="text-center py-16">
                <p className={`text-sm mb-4 ${'text-white/30'}`}>{error}</p>
                <button onClick={() => window.location.reload()} className={`text-[10px] tracking-[0.2em] uppercase transition-colors ${'text-white/30 hover:text-white/60'}`}>Try Again</button>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16">
                <p className={`text-sm ${'text-white/25'}`}>No dreams yet. Be the first to imagine.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <FantasyRoomCard 
                    key={post.id} 
                    post={post} 
                    onReaction={handleReaction}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <FantasyRoomPostForm
          isOpen={isPostFormOpen}
          onClose={() => {
            setIsPostFormOpen(false);
            setEditingPost(null);
          }}
          onPostCreated={handlePostCreated}
          onCircleCreated={handleCircleCreated}
          circles={circles}
          editingPost={editingPost}
        />
      </Layout>
    </PageTransition>
  );
}

export default FantasyRoom;
