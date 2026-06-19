import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../features/authSlice';
import * as postService from '../services/postService';
import * as circleService from '../services/circleService';
import Layout from '../components/Layout';
import PageTransition from '../components/PageTransition';
import DarkRoomCard from '../components/DarkRoomCard';
import DarkRoomPostForm from '../components/DarkRoomPostForm';
import LoadingSpinner from '../components/LoadingSpinner';

function DarkRoom() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [circles, setCircles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    { value: 'ALL', label: 'All' },
    { value: 'CONFESSION', label: 'Confession' },
    { value: 'REGRET', label: 'Regret' },
    { value: 'DARK', label: 'Dark' },
  ];

  const fetchData = async (bustCache = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch posts using service (includes JWT token via interceptor)
      const postsData = await postService.fetchPosts({
        room: 'dark',
        category: selectedCategory === 'ALL' ? undefined : selectedCategory
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
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [navigate, selectedCategory]);

  const handlePostCreated = (newPost) => setPosts(prev => [newPost, ...prev]);

  const handleCircleCreated = () => {
    // Refetch circles to update dropdown with cache bust
    fetchData(true); // Pass true to bust cache
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
        <div className="min-h-screen pt-2 pb-12 px-4 relative z-10">
          <div className="max-w-2xl mx-auto">

            {/* Room header */}
            <div className="mb-10">
              <button
                onClick={() => navigate('/home')}
                className="text-[10px] tracking-[0.2em] text-white/30 hover:text-white/70 transition-colors mb-8 uppercase flex items-center gap-2"
              >
                ← Rooms
              </button>

              <div className="flex items-start justify-between gap-4">
                <div>
                  {/* Accent bar */}
                  <div className="w-8 h-px mb-5" style={{ background: 'linear-gradient(to right, #c4a882, transparent)' }} />
                  <h1 className="text-3xl font-light tracking-[0.25em] text-white uppercase mb-3">
                    Dark Room
                  </h1>
                  <p className="text-[11px] tracking-[0.15em] text-white/35 uppercase mb-1">
                    Release · Witness · Discharge
                  </p>
                  <p className="text-[11px] text-white/25 leading-relaxed mt-2 max-w-sm">
                    A space for raw emotion and vulnerability. You are not alone in the dark.
                  </p>
                </div>
                {isAuthenticated && (
                  <button
                    onClick={() => setIsPostFormOpen(true)}
                    className="flex-shrink-0 px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-all hover:opacity-90"
                    style={{
                      background: 'rgba(196,168,130,0.12)',
                      border: '1px solid rgba(196,168,130,0.25)',
                      color: '#c4a882',
                      borderRadius: '2px',
                    }}
                  >
                    + Post
                  </button>
                )}
              </div>

              {/* Category filters */}
              <div className="flex gap-2 flex-wrap mt-8">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className="px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-all"
                    style={{
                      borderRadius: '2px',
                      background: selectedCategory === cat.value ? 'rgba(196,168,130,0.15)' : 'rgba(255,255,255,0.03)',
                      border: selectedCategory === cat.value ? '1px solid rgba(196,168,130,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      color: selectedCategory === cat.value ? '#c4a882' : 'rgba(255,255,255,0.35)',
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
                <p className="text-white/30 text-sm mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-white/60 transition-colors">Try Again</button>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-white/25 text-sm">No posts yet. Be the first to share.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <DarkRoomCard key={post.id} post={post} onReaction={handleReaction} />
                ))}
              </div>
            )}
          </div>
        </div>

        <DarkRoomPostForm
          isOpen={isPostFormOpen}
          onClose={() => setIsPostFormOpen(false)}
          onPostCreated={handlePostCreated}
          onCircleCreated={handleCircleCreated}
          circles={circles}
        />
      </Layout>
    </PageTransition>
  );
}

export default DarkRoom;
