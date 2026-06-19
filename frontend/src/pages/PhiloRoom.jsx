import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth } from '../features/authSlice';
import { deletePost } from '../features/postsSlice';
import * as postService from '../services/postService';
import * as circleService from '../services/circleService';
import Layout from '../components/Layout';
import PageTransition from '../components/PageTransition';
import PhiloRoomCard from '../components/PhiloRoomCard';
import PhiloRoomPostForm from '../components/PhiloRoomPostForm';
import LoadingSpinner from '../components/LoadingSpinner';

function PhiloRoom() {
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
    { value: 'SPIRITUAL', label: 'Spiritual' },
    { value: 'SHADOW', label: 'Shadow' },
    { value: 'DEEP', label: 'Deep' },
  ];

  const fetchData = async (bustCache = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch posts using service (includes JWT token via interceptor)
      const postsData = await postService.fetchPosts({
        room: 'philo',
        category: selectedCategory === 'ALL' ? undefined : selectedCategory
      });
      setPosts(postsData.posts || []);
      
      // Fetch circles using service (includes JWT token via interceptor)
      const circlesData = await circleService.fetchCircles({ 
        room: 'philo',
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
                  <div className="w-8 h-px mb-5" style={{ background: 'linear-gradient(to right, #b8a8d4, transparent)' }} />
                  <h1 className="text-3xl font-light tracking-[0.25em] text-white uppercase mb-3">
                    Philo Room
                  </h1>
                  <p className="text-[11px] tracking-[0.15em] text-white/35 uppercase mb-1">
                    Understand · Reflect · Inquire
                  </p>
                  <p className="text-[11px] text-white/25 leading-relaxed mt-2 max-w-sm">
                    A space for contemplation and wisdom. Questions are encouraged, answers optional.
                  </p>
                </div>
                {isAuthenticated && (
                  <button
                    onClick={() => setIsPostFormOpen(true)}
                    className="flex-shrink-0 px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-all hover:opacity-90"
                    style={{
                      background: 'rgba(184,168,212,0.1)',
                      border: '1px solid rgba(184,168,212,0.22)',
                      color: '#b8a8d4',
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
                      background: selectedCategory === cat.value ? 'rgba(184,168,212,0.12)' : 'rgba(255,255,255,0.03)',
                      border: selectedCategory === cat.value ? '1px solid rgba(184,168,212,0.35)' : '1px solid rgba(255,255,255,0.08)',
                      color: selectedCategory === cat.value ? '#b8a8d4' : 'rgba(255,255,255,0.35)',
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
                <p className="text-white/25 text-sm">No reflections yet. Be the first to share.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <PhiloRoomCard 
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

        <PhiloRoomPostForm
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

export default PhiloRoom;
