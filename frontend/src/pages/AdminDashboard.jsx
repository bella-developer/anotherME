import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Layout from '../components/Layout';
import { fetchStatistics, fetchDetailedUsers, fetchDetailedPosts, fetchDetailedCircles } from '../services/adminService';
import { Users, FileText, Circle, MessageSquare, TrendingUp, Image, ChevronDown, ChevronUp } from 'lucide-react';

function AdminDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [detailedUsers, setDetailedUsers] = useState([]);
  const [detailedPosts, setDetailedPosts] = useState([]);
  const [detailedCircles, setDetailedCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) {
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if user data exists
    if (!user) {
      return;
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      navigate('/home');
      return;
    }

    // Only fetch if we haven't loaded stats yet
    if (stats) {
      setLoading(false);
      return;
    }

    // Fetch statistics
    setLoading(true);
    fetchStatistics()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load statistics');
        setLoading(false);
      });
  }, [isAuthenticated, user, authLoading, navigate, stats]);

  const loadDetailedData = async (type) => {
    try {
      if (type === 'users' && detailedUsers.length === 0) {
        const data = await fetchDetailedUsers();
        setDetailedUsers(data.users || []);
      } else if (type === 'posts' && detailedPosts.length === 0) {
        const data = await fetchDetailedPosts();
        setDetailedPosts(data.posts || []);
      } else if (type === 'circles' && detailedCircles.length === 0) {
        const data = await fetchDetailedCircles();
        setDetailedCircles(data.circles || []);
      }
    } catch (err) {
      // Silent fail - data already loaded or network error
    }
  };

  const toggleSection = async (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
      await loadDetailedData(section);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoomColor = (room) => {
    switch (room) {
      case 'dark': return '#DC2626';
      case 'fantasy': return '#F97316';
      case 'philo': return '#6366F1';
      default: return '#8b949e';
    }
  };

  if (authLoading || loading) {
    return (
      <Layout leftSidebar={null} rightSidebar={null}>
        <div className="flex items-center justify-center min-h-[50vh] text-neutral-400 font-mono text-xs">
          Loading admin dashboard...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout leftSidebar={null} rightSidebar={null}>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-5">
          <div className="text-red-500 font-mono text-sm mb-3">⚠️ Error Loading Dashboard</div>
          <div className="text-neutral-400 font-mono text-xs mb-4">{error}</div>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-1.5 rounded text-xs font-mono text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
          >
            Go Home
          </button>
        </div>
      </Layout>
    );
  }

  if (!stats) return null;

  const glassCardStyle = {
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
  };

  return (
    <Layout leftSidebar={null} rightSidebar={null}>
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
        {/* Centered Header */}
        <div className="flex flex-col items-center text-center pb-6 mb-6 border-b border-[#21262d]">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans mb-1.5">
            ADMIN DASHBOARD
          </h1>
          <p className="text-xs font-mono text-neutral-400">
            Platform analytics and operations • Updated: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Users */}
          <div
            onClick={() => toggleSection('users')}
            style={glassCardStyle}
            className="p-5 cursor-pointer hover:border-red-500/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2.5">
              <Users size={20} color="#DC2626" />
              {expandedSection === 'users' ? <ChevronUp size={16} color="#DC2626" /> : <ChevronDown size={16} color="#DC2626" />}
            </div>
            <div className="text-3xl font-bold text-[#DC2626] mb-1 font-mono">
              {stats.users.total}
            </div>
            <div className="text-[11px] text-[#8b949e] font-mono tracking-wider">
              TOTAL USERS
            </div>
            <div className="text-[10px] text-[#6b7985] font-mono mt-2">
              +{stats.users.new24h} last 24h
            </div>
          </div>

          {/* Total Posts */}
          <div
            onClick={() => toggleSection('posts')}
            style={glassCardStyle}
            className="p-5 cursor-pointer hover:border-orange-500/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2.5">
              <FileText size={20} color="#F97316" />
              {expandedSection === 'posts' ? <ChevronUp size={16} color="#F97316" /> : <ChevronDown size={16} color="#F97316" />}
            </div>
            <div className="text-3xl font-bold text-[#F97316] mb-1 font-mono">
              {stats.posts.total}
            </div>
            <div className="text-[11px] text-[#8b949e] font-mono tracking-wider">
              TOTAL POSTS
            </div>
            <div className="text-[10px] text-[#6b7985] font-mono mt-2">
              +{stats.posts.new24h} last 24h
            </div>
          </div>

          {/* Total Circles */}
          <div
            onClick={() => toggleSection('circles')}
            style={glassCardStyle}
            className="p-5 cursor-pointer hover:border-indigo-500/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2.5">
              <Circle size={20} color="#6366F1" />
              {expandedSection === 'circles' ? <ChevronUp size={16} color="#6366F1" /> : <ChevronDown size={16} color="#6366F1" />}
            </div>
            <div className="text-3xl font-bold text-[#6366F1] mb-1 font-mono">
              {stats.circles.total}
            </div>
            <div className="text-[11px] text-[#8b949e] font-mono tracking-wider">
              ACTIVE COMMUNITIES
            </div>
          </div>

          {/* Total Comments */}
          <div style={glassCardStyle} className="p-5">
            <div className="mb-2.5">
              <MessageSquare size={20} color="#8b949e" />
            </div>
            <div className="text-3xl font-bold text-white mb-1 font-mono">
              {stats.comments.total}
            </div>
            <div className="text-[11px] text-[#8b949e] font-mono tracking-wider">
              TOTAL COMMENTS
            </div>
            <div className="text-[10px] text-[#6b7985] font-mono mt-2">
              +{stats.comments.new24h} last 24h
            </div>
          </div>
        </div>

        {/* Detailed Users List */}
        {expandedSection === 'users' && detailedUsers.length > 0 && (
          <div style={glassCardStyle} className="p-5 mb-8">
            <h2 className="text-sm font-sans font-bold text-[#DC2626] mb-4 tracking-wider">
              ALL USERS ({detailedUsers.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-[#DC2626]/20">
                    <th className="text-left p-2.5 text-[#DC2626] font-normal">USERNAME</th>
                    <th className="text-left p-2.5 text-[#DC2626] font-normal">GENDER</th>
                    <th className="text-center p-2.5 text-[#DC2626] font-normal">TOTAL</th>
                    <th className="text-center p-2.5 text-[#DC2626] font-normal">DARK</th>
                    <th className="text-center p-2.5 text-[#F97316] font-normal">FANTASY</th>
                    <th className="text-center p-2.5 text-[#6366F1] font-normal">PHILO</th>
                    <th className="text-left p-2.5 text-[#DC2626] font-normal">JOINED</th>
                  </tr>
                </thead>
                <tbody>
                  {detailedUsers.map((u, idx) => (
                    <tr
                      key={u._id}
                      className={`border-b border-white/[0.05] ${idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'}`}
                    >
                      <td className="p-2.5 text-white">{u.username}</td>
                      <td className="p-2.5 text-[#8b949e]">{u.gender || '-'}</td>
                      <td className="p-2.5 text-center text-white font-bold">{u.totalPosts}</td>
                      <td className="p-2.5 text-center text-[#DC2626]">{u.darkPosts}</td>
                      <td className="p-2.5 text-center text-[#F97316]">{u.fantasyPosts}</td>
                      <td className="p-2.5 text-center text-[#6366F1]">{u.philoPosts}</td>
                      <td className="p-2.5 text-[#6b7985]">{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detailed Posts List */}
        {expandedSection === 'posts' && detailedPosts.length > 0 && (
          <div style={glassCardStyle} className="p-5 mb-8">
            <h2 className="text-sm font-sans font-bold text-[#F97316] mb-4 tracking-wider">
              ALL POSTS ({detailedPosts.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-[#F97316]/20">
                    <th className="text-left p-2.5 text-[#F97316] font-normal w-[30%]">TITLE</th>
                    <th className="text-left p-2.5 text-[#F97316] font-normal">AUTHOR</th>
                    <th className="text-center p-2.5 text-[#F97316] font-normal">ROOM</th>
                    <th className="text-left p-2.5 text-[#F97316] font-normal">CATEGORY</th>
                    <th className="text-center p-2.5 text-[#F97316] font-normal">IMG</th>
                    <th className="text-center p-2.5 text-[#F97316] font-normal">💬</th>
                    <th className="text-center p-2.5 text-[#F97316] font-normal">❤️</th>
                    <th className="text-left p-2.5 text-[#F97316] font-normal">DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {detailedPosts.map((post, idx) => (
                    <tr
                      key={post.id}
                      className={`border-b border-white/[0.05] ${idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'}`}
                    >
                      <td className="p-2.5 text-white max-w-[300px] truncate">{post.title || 'Untitled'}</td>
                      <td className="p-2.5 text-[#8b949e]">{post.author}</td>
                      <td className="p-2.5 text-center font-bold" style={{ color: getRoomColor(post.room) }}>
                        {post.room.toUpperCase()}
                      </td>
                      <td className="p-2.5 text-[#6b7985]">{post.category}</td>
                      <td className="p-2.5 text-center">
                        {post.hasImage && <Image size={14} className="text-[#8b949e] inline" />}
                      </td>
                      <td className="p-2.5 text-center text-white">{post.commentCount}</td>
                      <td className="p-2.5 text-center text-white">{post.reactionCount}</td>
                      <td className="p-2.5 text-[#6b7985]">{formatDate(post.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detailed Circles List */}
        {expandedSection === 'circles' && detailedCircles.length > 0 && (
          <div style={glassCardStyle} className="p-5 mb-8">
            <h2 className="text-sm font-sans font-bold text-[#6366F1] mb-4 tracking-wider">
              ALL CIRCLES ({detailedCircles.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-[#6366F1]/20">
                    <th className="text-left p-2.5 text-[#6366F1] font-normal w-[30%]">NAME</th>
                    <th className="text-left p-2.5 text-[#6366F1] font-normal">CREATOR</th>
                    <th className="text-center p-2.5 text-[#6366F1] font-normal">ROOM</th>
                    <th className="text-center p-2.5 text-[#6366F1] font-normal">MEMBERS</th>
                    <th className="text-center p-2.5 text-[#6366F1] font-normal">POSTS</th>
                    <th className="text-left p-2.5 text-[#6366F1] font-normal">CREATED</th>
                  </tr>
                </thead>
                <tbody>
                  {detailedCircles.map((circle, idx) => (
                    <tr
                      key={circle.id}
                      className={`border-b border-white/[0.05] ${idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'}`}
                    >
                      <td className="p-2.5 text-white">{circle.name}</td>
                      <td className="p-2.5 text-[#8b949e]">{circle.creator}</td>
                      <td className="p-2.5 text-center font-bold" style={{ color: getRoomColor(circle.room) }}>
                        {circle.room.toUpperCase()}
                      </td>
                      <td className="p-2.5 text-center text-white">{circle.memberCount}</td>
                      <td className="p-2.5 text-center text-white font-bold">{circle.postCount}</td>
                      <td className="p-2.5 text-[#6b7985]">{formatDate(circle.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Gender Distribution */}
        <div style={glassCardStyle} className="p-5 mb-8">
          <h2 className="text-sm font-sans font-bold text-white mb-4 tracking-wider">
            GENDER DISTRIBUTION
          </h2>
          <div className="flex gap-2.5 mb-3">
            <div
              style={{
                flex: stats.users.gender.malePercentage,
                height: '40px',
                background: 'linear-gradient(90deg, #DC2626, #991B1B)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {stats.users.gender.malePercentage}%
            </div>
            <div
              style={{
                flex: stats.users.gender.femalePercentage,
                height: '40px',
                background: 'linear-gradient(90deg, #F97316, #C2410C)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {stats.users.gender.femalePercentage}%
            </div>
            {stats.users.gender.other > 0 && (
              <div
                style={{
                  flex: stats.users.gender.otherPercentage,
                  height: '40px',
                  background: 'linear-gradient(90deg, #6366F1, #4338CA)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                {stats.users.gender.otherPercentage}%
              </div>
            )}
          </div>
          <div className="flex gap-5 text-xs font-mono text-[#8b949e]">
            <div>MALE: {stats.users.gender.male}</div>
            <div>FEMALE: {stats.users.gender.female}</div>
            {stats.users.gender.other > 0 && <div>OTHER: {stats.users.gender.other}</div>}
          </div>
        </div>

        {/* Room Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.rooms.map((room) => (
            <div key={room.room} style={glassCardStyle} className="p-5">
              <h3
                className="text-sm font-sans font-bold mb-3 tracking-wider"
                style={{ color: getRoomColor(room.room) }}
              >
                {room.room.toUpperCase()} ROOM
              </h3>
              <div className="text-xs font-mono leading-relaxed text-[#c9d1d9] space-y-1">
                <div>Posts: <span className="font-bold text-white">{room.posts}</span></div>
                <div>Circles: <span className="font-bold text-white">{room.circles}</span></div>
                <div>Comments: <span className="font-bold text-white">{room.comments}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;
