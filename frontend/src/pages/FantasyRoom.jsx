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
        
        <div className="min-h-screen pt-4 pb-24 px-3 sm:px-4 md:px-6 relative z-10">
          <div className="max-w-full sm:max-w-2xl md:max-w-3xl mx-auto">

            {/* Hero Header - Scrolls away */}
            <div className="mb-8 sm:mb-12">
              <button
                onClick={() => navigate('/home')}
                className="px-4 py-2 text-xs tracking-wide uppercase mb-12 transition-all flex items-center gap-2 rounded"
                style={{
                  color: '#e6edf3',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  backgroundColor: 'rgba(249, 115, 22, 0.05)',
                  fontWeight: '500',
                  transitionDuration: 'var(--duration-slow)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(249, 115, 22, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.5)';
                  e.currentTarget.style.color = '#FF9D1C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(249, 115, 22, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.3)';
                  e.currentTarget.style.color = '#e6edf3';
                }}
              >
                ← ROOMS
              </button>

              <div className="w-12 h-px mb-6 sm:mb-8" style={{ 
                background: 'linear-gradient(to right, rgba(249, 115, 22, 0.4), transparent)' 
              }} />
              
              <h1 className="text-lg sm:text-4xl md:text-5xl uppercase mb-6 sm:mb-8 heading-text" style={{
                color: '#FF9D1C',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.05em',
                lineHeight: 'var(--leading-tight)',
                fontWeight: '700',
              }}>
                THE FANTASY ROOM
              </h1>
              
              <p className="text-base sm:text-lg mb-3 sm:mb-4 max-w-md" style={{
                color: '#e6edf3',
                lineHeight: 'var(--leading-relaxed)',
                fontWeight: '600'
              }}>
                Unleash Your Imagination
              </p>
              
              <p className="text-xs sm:text-[11px] max-w-md" style={{
                color: '#c9d1d9',
                lineHeight: 'var(--leading-relaxed)',
                fontWeight: '300'
              }}>
                Stories, art, and visions from creative minds.
              </p>
            </div>

            {/* Compact Sticky Bar */}
            <div className="sticky top-16 z-20 mb-6 -mx-3 sm:mx-0 px-3 sm:px-4 py-2 flex items-center justify-between gap-3" style={{
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(249, 115, 22, 0.15)',
            }}>
              {/* Left: Room Title */}
              <h2 className="text-[10px] sm:text-sm uppercase tracking-wider whitespace-nowrap flex-shrink-0" style={{
                color: '#FF9D1C',
                fontFamily: 'var(--font-heading)',
                fontWeight: '700',
              }}>
                FANTASY ROOM
              </h2>

              {/* Right: Categories + POST Button */}
              <div className="flex items-center gap-2 ml-auto">
                {/* Category Dropdown - Compact, auto-width */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-2 py-1 text-[9px] tracking-wide uppercase transition-all cursor-pointer"
                  style={{
                    borderRadius: '2px',
                    background: 'rgba(249, 115, 22, 0.15)',
                    border: '1px solid rgba(249, 115, 22, 0.4)',
                    color: 'rgba(249, 115, 22, 1)',
                    fontWeight: '500',
                    width: 'auto',
                    minWidth: 'fit-content',
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value} style={{ background: '#000', color: '#fff' }}>
                      {cat.label}
                    </option>
                  ))}
                </select>

                {/* POST Button */}
                {isAuthenticated && (
                  <button
                    onClick={() => setIsPostFormOpen(true)}
                    className="flex-shrink-0 px-2 sm:px-4 py-1 sm:py-2 text-[9px] sm:text-[10px] tracking-widest uppercase transition-all"
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(249, 115, 22, 0.15)',
                      color: '#c9d1d9',
                      borderRadius: 'var(--radius-soft)',
                      transitionDuration: 'var(--duration-slow)',
                      fontWeight: '400',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.3)';
                      e.currentTarget.style.color = '#FF9D1C';
                      e.currentTarget.style.background = 'rgba(249, 115, 22, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.15)';
                      e.currentTarget.style.color = '#c9d1d9';
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                    }}
                  >
                    Post
                  </button>
                )}
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-16"><LoadingSpinner /></div>
            ) : error ? (
              <div className="text-center py-16">
                <p className={`text-sm mb-4 ${'text-white/30'}`}>{error}</p>
                <button onClick={() => window.location.reload()} className={`text-[10px] tracking-[0.2em] uppercase transition-colors ${'text-white/30 hover:text-white/60'}`}>Try Again</button>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16">
                <p className={`text-sm ${'text-white/25'}`}>The canvas awaits. Share your first fantasy.</p>
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
                <p className={`text-sm ${'text-white/25'}`}>The canvas awaits. Share your first fantasy.</p>
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
