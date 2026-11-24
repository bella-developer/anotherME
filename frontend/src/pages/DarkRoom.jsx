import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth } from '../features/authSlice';
import { deletePost } from '../features/postsSlice';
import * as postService from '../services/postService';
import * as circleService from '../services/circleService';
import Layout from '../components/Layout';
import PageTransition from '../components/PageTransition';
import DarkRoomCard from '../components/DarkRoomCard';
import DarkRoomPostForm from '../components/DarkRoomPostForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePageTitle } from '../hooks/usePageTitle';

function DarkRoom() {
  usePageTitle('Dark Room');
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
    { value: 'CONFESSION', label: 'Confession' },
    { value: 'REGRET', label: 'Regret' },
    { value: 'DARK', label: 'Dark' },
  ];

  const fetchData = async (bustCache = false, isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      setError(null);
      
      // Fetch posts using service (includes JWT token via interceptor)
      const postsData = await postService.fetchPosts({
        room: 'dark',
        category: selectedCategory === 'ALL' ? undefined : selectedCategory,
        bustCache
      });
      setPosts(postsData.posts || []);
      
      // Fetch circles using service (includes JWT token via interceptor)
      const circlesData = await circleService.fetchCircles({ 
        room: 'dark',
        bustCache // Pass cache buster when refetching after creation
      });
      setCircles(circlesData.circles || []);
    } catch (err) {
      console.error('Failed to load room data:', err);
      setError(err.message || 'Failed to load data');
      if (err.code === 'UNAUTHORIZED') navigate('/login');
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [navigate, selectedCategory]);

  const handlePostCreated = (newPost) => {
    setSelectedCategory('ALL');
    setPosts(prev => [newPost, ...prev.filter(p => p.id !== newPost.id)]);
    postService.fetchPosts({ room: 'dark', bustCache: true })
      .then(res => {
        if (res?.posts?.length) {
          setPosts(prev => {
            const hasNew = res.posts.some(p => p.id === newPost.id);
            return hasNew ? res.posts : [newPost, ...res.posts.filter(p => p.id !== newPost.id)];
          });
        }
      })
      .catch(console.error);
  };
  
  const handlePostUpdated = (updatedPost) => {
    // Replace the updated post in the posts array
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

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
        {/* Atmospheric Background - Deep red shadows */}
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(239, 68, 68, 0.05) 0%, transparent 60%)',
            zIndex: 1,
          }}
        />
        
        <div className="min-h-screen pt-4 pb-24 px-3 sm:px-4 md:px-6 relative z-10">
          <div className="max-w-full sm:max-w-2xl md:max-w-3xl mx-auto">

            {/* Hero Header - Scrolls away */}
            <div className="mb-8 sm:mb-12 font-mono">
              <button
                onClick={() => navigate('/home')}
                className="group inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-medium transition-all duration-300 rounded border border-white/10 bg-white/[0.02] text-[#928B91] hover:text-[#E7DED5] hover:border-[#B44A4A]/40 hover:bg-[#B44A4A]/5 mb-8"
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-0.5">←</span>
                <span>ROOMS</span>
              </button>

              <div className="w-12 h-px mb-8 bg-[#292630]" />
              
              <h1 className="text-lg sm:text-4xl md:text-5xl uppercase mb-4 sm:mb-6 font-bold tracking-wider" style={{ color: '#B44A4A' }}>
                THE DARK ROOM
              </h1>
              
              <p className="text-base sm:text-lg mb-2 sm:mb-3 font-semibold text-[#E7DED5]">
                Put it down.
              </p>
              
              <p className="text-xs sm:text-sm max-w-lg text-[#928B91] leading-relaxed">
                Confessions, regrets, loneliness, shame, difficult feelings. Heard without unsolicited advice.
              </p>
            </div>

            {/* Compact Sticky Bar - Thinner Premium Filter Bar */}
            <div 
              className="sticky top-14 sm:top-16 z-20 mb-6 -mx-3 sm:mx-0 px-3 sm:px-4 py-1.5 flex items-center justify-between gap-2.5 font-mono rounded-lg transition-all"
              style={{
                backgroundColor: 'rgba(15, 14, 20, 0.72)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
              }}
            >
              {/* Left: Room Title */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B44A4A]" />
                <h2 className="text-[10px] sm:text-xs uppercase tracking-[0.16em] whitespace-nowrap font-bold text-[#B44A4A]">
                  DARK ROOM
                </h2>
              </div>

              {/* Right: Back Button + Categories + POST Button */}
              <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => navigate('/home')}
                  className="flex-shrink-0 px-2.5 py-0.5 text-[9px] tracking-wider uppercase transition-all rounded font-medium flex items-center gap-1 border border-white/10 bg-white/[0.03] text-[#928B91] hover:text-[#E7DED5] hover:border-white/20"
                  aria-label="Back to rooms"
                >
                  <span className="text-[10px]">←</span>
                  <span className="hidden xs:inline">Back</span>
                </button>

                {/* Thinner Category Dropdown */}
                <div className="relative inline-flex items-center">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none pl-2.5 pr-6 py-0.5 text-[9px] tracking-wider uppercase transition-all cursor-pointer rounded border border-white/10 bg-black/60 text-[#E7DED5] hover:border-white/20 focus:outline-none focus:border-[#B44A4A]/50"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value} style={{ background: '#141318', color: '#E7DED5' }}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2 text-[8px] text-[#928B91]">▼</span>
                </div>

                {/* POST Button */}
                {isAuthenticated && (
                  <button
                    onClick={() => setIsPostFormOpen(true)}
                    className="flex-shrink-0 px-3 py-0.5 text-[9px] tracking-widest uppercase transition-all duration-200 rounded font-bold text-white shadow-sm hover:opacity-90 active:scale-[0.98]"
                    style={{
                      backgroundColor: '#B44A4A',
                    }}
                  >
                    + POST
                  </button>
                )}
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
                <p className={`text-sm ${'text-white/25'}`}>No posts yet. Be the first to share.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <DarkRoomCard 
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

        <DarkRoomPostForm
          isOpen={isPostFormOpen}
          onClose={() => {
            setIsPostFormOpen(false);
            setEditingPost(null);
          }}
          onPostCreated={editingPost ? handlePostUpdated : handlePostCreated}
          onCircleCreated={handleCircleCreated}
          circles={circles}
          editingPost={editingPost}
        />
      </Layout>
    </PageTransition>
  );
}

export default DarkRoom;
