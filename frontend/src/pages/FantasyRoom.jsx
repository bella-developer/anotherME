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
            <div className="mb-8 sm:mb-12 font-mono">
              <button
                onClick={() => navigate('/home')}
                className="px-4 py-2 text-xs tracking-wide uppercase mb-12 transition-all flex items-center gap-2 rounded border border-[#292630] bg-[#191820] text-[#E7DED5] hover:border-[#DB762E] hover:text-[#DB762E]"
              >
                ← ROOMS
              </button>

              <div className="w-12 h-px mb-8 bg-[#292630]" />
              
              <h1 className="text-lg sm:text-4xl md:text-5xl uppercase mb-4 sm:mb-6 font-bold tracking-wider" style={{ color: '#DB762E' }}>
                THE FANTASY ROOM
              </h1>
              
              <p className="text-base sm:text-lg mb-2 sm:mb-3 font-semibold text-[#E7DED5]">
                Let your mind wander.
              </p>
              
              <p className="text-xs sm:text-sm max-w-lg text-[#928B91] leading-relaxed">
                Daydreams, imaginary worlds, strange ideas, and creative expression.
              </p>
            </div>

            {/* Compact Sticky Bar */}
            <div className="sticky top-16 z-20 mb-6 -mx-3 sm:mx-0 px-3 sm:px-4 py-2 flex items-center justify-between gap-3 font-mono" style={{
              backgroundColor: '#111117',
              borderBottom: '1px solid #292630',
            }}>
              {/* Left: Room Title */}
              <h2 className="text-[10px] sm:text-sm uppercase tracking-wider whitespace-nowrap flex-shrink-0 font-bold" style={{ color: '#DB762E' }}>
                FANTASY ROOM
              </h2>

              {/* Right: Back Button + Categories + POST Button */}
              <div className="flex items-center gap-2 ml-auto">
                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => navigate('/home')}
                  className="flex-shrink-0 px-2.5 py-1 text-[9px] sm:text-[10px] tracking-wider uppercase transition-all rounded font-medium flex items-center gap-1 border border-[#292630] bg-[#191820] text-[#E7DED5] hover:border-[#DB762E]"
                  style={{ height: '22px' }}
                  aria-label="Back to rooms"
                >
                  <span>←</span>
                  <span>Back</span>
                </button>

                {/* Category Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-2 py-0.5 text-[8px] sm:text-[9px] tracking-wide uppercase transition-all cursor-pointer rounded border border-[#292630] bg-[#191820] text-[#E7DED5]"
                  style={{ height: '22px' }}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value} style={{ background: '#191820', color: '#E7DED5' }}>
                      {cat.label}
                    </option>
                  ))}
                </select>

                {/* POST Button */}
                {isAuthenticated && (
                  <button
                    onClick={() => setIsPostFormOpen(true)}
                    className="flex-shrink-0 px-3 py-1 text-[9px] sm:text-[10px] tracking-widest uppercase transition-all rounded font-bold text-[#E7DED5]"
                    style={{
                      backgroundColor: '#DB762E',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#b85e1f';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#DB762E';
                    }}
                  >
                    POST
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
          onPostCreated={editingPost ? handlePostUpdated : handlePostCreated}
          onCircleCreated={handleCircleCreated}
          circles={circles}
          editingPost={editingPost}
        />
      </Layout>
    </PageTransition>
  );
}

export default FantasyRoom;
