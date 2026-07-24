import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { fetchStatistics, fetchDetailedUsers, fetchDetailedPosts, fetchDetailedCircles } from '../services/adminService';
import { Users, FileText, Circle, MessageSquare, TrendingUp, Image, ChevronDown, ChevronUp } from 'lucide-react';

function AdminDashboard() {
  console.log('[AdminDashboard] Component rendering');
  
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
    console.log('[AdminDashboard] Auth state:', { isAuthenticated, user, authLoading });

    // Wait for auth to load
    if (authLoading) {
      console.log('[AdminDashboard] Auth still loading...');
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      console.log('[AdminDashboard] Not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    // Check if user data exists
    if (!user) {
      console.log('[AdminDashboard] No user data yet');
      return;
    }

    console.log('[AdminDashboard] User role:', user.role);

    // Check if user is admin
    if (user.role !== 'admin') {
      console.log('[AdminDashboard] User is not admin, redirecting to home');
      navigate('/home');
      return;
    }

    // Fetch statistics
    console.log('[AdminDashboard] Fetching statistics...');
    fetchStatistics()
      .then(data => {
        console.log('[AdminDashboard] Statistics loaded:', data);
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('[AdminDashboard] Error fetching statistics:', err);
        setError(err.message || 'Failed to load statistics');
        setLoading(false);
      });
  }, [isAuthenticated, user, authLoading, navigate]);

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
      console.error('Failed to load detailed data:', err);
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
      case 'dark': return '#2EE6FF';
      case 'fantasy': return '#FF9D1C';
      case 'philo': return '#B56DFF';
      default: return '#8b949e';
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontFamily: "'IBM Plex Mono', monospace"
      }}>
        Loading admin dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ff4444',
        fontFamily: "'IBM Plex Mono', monospace",
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>⚠️ Error Loading Dashboard</div>
        <div style={{ marginBottom: '20px' }}>{error}</div>
        <button
          onClick={() => navigate('/home')}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: "'Space Mono', monospace"
          }}
        >
          Go Home
        </button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#ffffff',
      padding: '80px 20px 40px',
      fontFamily: "'IBM Plex Mono', monospace",
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <button
            onClick={() => navigate('/home')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              marginBottom: '20px',
              letterSpacing: '0.05em'
            }}
          >
            ← BACK
          </button>
          <h1 style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '32px',
            letterSpacing: '0.1em',
            color: '#B56DFF',
            marginBottom: '10px'
          }}>
            ADMIN DASHBOARD
          </h1>
          <p style={{
            color: '#8b949e',
            fontSize: '12px',
            letterSpacing: '0.05em'
          }}>
            Platform analytics and operations • Updated: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* Total Users */}
          <div
            onClick={() => toggleSection('users')}
            style={{
              background: 'rgba(46, 230, 255, 0.05)',
              border: '1px solid rgba(46, 230, 255, 0.2)',
              borderRadius: '8px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Users size={20} color="#2EE6FF" />
              {expandedSection === 'users' ? <ChevronUp size={16} color="#2EE6FF" /> : <ChevronDown size={16} color="#2EE6FF" />}
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2EE6FF', marginBottom: '5px' }}>
              {stats.users.total}
            </div>
            <div style={{ fontSize: '11px', color: '#8b949e', letterSpacing: '0.05em' }}>
              TOTAL USERS
            </div>
            <div style={{ fontSize: '10px', color: '#6b7985', marginTop: '8px' }}>
              +{stats.users.new24h} last 24h
            </div>
          </div>

          {/* Total Posts */}
          <div
            onClick={() => toggleSection('posts')}
            style={{
              background: 'rgba(255, 157, 28, 0.05)',
              border: '1px solid rgba(255, 157, 28, 0.2)',
              borderRadius: '8px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <FileText size={20} color="#FF9D1C" />
              {expandedSection === 'posts' ? <ChevronUp size={16} color="#FF9D1C" /> : <ChevronDown size={16} color="#FF9D1C" />}
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FF9D1C', marginBottom: '5px' }}>
              {stats.posts.total}
            </div>
            <div style={{ fontSize: '11px', color: '#8b949e', letterSpacing: '0.05em' }}>
              TOTAL POSTS
            </div>
            <div style={{ fontSize: '10px', color: '#6b7985', marginTop: '8px' }}>
              +{stats.posts.new24h} last 24h
            </div>
          </div>

          {/* Total Circles */}
          <div
            onClick={() => toggleSection('circles')}
            style={{
              background: 'rgba(181, 109, 255, 0.05)',
              border: '1px solid rgba(181, 109, 255, 0.2)',
              borderRadius: '8px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Circle size={20} color="#B56DFF" />
              {expandedSection === 'circles' ? <ChevronUp size={16} color="#B56DFF" /> : <ChevronDown size={16} color="#B56DFF" />}
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#B56DFF', marginBottom: '5px' }}>
              {stats.circles.total}
            </div>
            <div style={{ fontSize: '11px', color: '#8b949e', letterSpacing: '0.05em' }}>
              ACTIVE COMMUNITIES
            </div>
          </div>

          {/* Total Comments */}
          <div style={{
            background: 'rgba(139, 148, 158, 0.05)',
            border: '1px solid rgba(139, 148, 158, 0.2)',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <div style={{ marginBottom: '10px' }}>
              <MessageSquare size={20} color="#8b949e" />
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ffffff', marginBottom: '5px' }}>
              {stats.comments.total}
            </div>
            <div style={{ fontSize: '11px', color: '#8b949e', letterSpacing: '0.05em' }}>
              TOTAL COMMENTS
            </div>
            <div style={{ fontSize: '10px', color: '#6b7985', marginTop: '8px' }}>
              +{stats.comments.new24h} last 24h
            </div>
          </div>
        </div>

        {/* Detailed Users List */}
        {expandedSection === 'users' && detailedUsers.length > 0 && (
          <div style={{
            background: 'rgba(46, 230, 255, 0.05)',
            border: '1px solid rgba(46, 230, 255, 0.2)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h2 style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '16px',
              color: '#2EE6FF',
              marginBottom: '20px',
              letterSpacing: '0.1em'
            }}>
              ALL USERS ({detailedUsers.length})
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(46, 230, 255, 0.2)' }}>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#2EE6FF', fontWeight: 'normal' }}>USERNAME</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#2EE6FF', fontWeight: 'normal' }}>GENDER</th>
                    <th style={{ textAlign: 'center', padding: '10px', color: '#2EE6FF', fontWeight: 'normal' }}>TOTAL</th>
                    <th style={{ textAlign: 'center', padding: '10px', color: '#2EE6FF', fontWeight: 'normal' }}>DARK</th>
                    <th style={{ textAlign: 'center', padding: '10px', color: '#FF9D1C', fontWeight: 'normal' }}>FANTASY</th>
                    <th style={{ textAlign: 'center', padding: '10px', color: '#B56DFF', fontWeight: 'normal' }}>PHILO</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#2EE6FF', fontWeight: 'normal' }}>JOINED</th>
                  </tr>
                </thead>
                <tbody>
                  {detailedUsers.map((user, idx) => (
                    <tr key={user._id} style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'
                    }}>
                      <td style={{ padding: '10px', color: '#ffffff' }}>{user.username}</td>
                      <td style={{ padding: '10px', color: '#8b949e' }}>{user.gender || '-'}</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#ffffff', fontWeight: 'bold' }}>
                        {user.totalPosts}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#2EE6FF' }}>
                        {user.darkPosts}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#FF9D1C' }}>
                        {user.fantasyPosts}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#B56DFF' }}>
                        {user.philoPosts}
                      </td>
                      <td style={{ padding: '10px', color: '#6b7985', fontFamily: "'VT323', monospace" }}>
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detailed Posts List */}
        {expandedSection === 'posts' && detailedPosts.length > 0 && (
          <div style={{
            background: 'rgba(255, 157, 28, 0.05)',
            border: '1px solid rgba(255, 157, 28, 0.2)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h2 style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '16px',
              color: '#FF9D1C',
              marginBottom: '20px',
              letterSpacing: '0.1em'
            }}>
              ALL POSTS ({detailedPosts.length})
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 157, 28, 0.2)' }}>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#FF9D1C', fontWeight: 'normal', width: '30%' }}>TITLE</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#FF9D1C', fontWeight: 'normal' }}>AUTHOR</th>
                    <th style={{ textAlign: 'center', padding: '10px', color: '#FF9D1C', fontWeight: 'normal' }}>ROOM</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#FF9D1C', fontWeight: 'normal' }}>CATEGORY</th>
                    <th style={{ textAlign: 'center', padding: '10px', color: '#FF9D1C', fontWeight: 'normal' }}>IMG</th>
                    <th style={{ textAlign: 'center', padding: '10px', color: '#FF9D1C', fontWeight: 'normal' }}>💬</th>
                    <th style={{ textAlign: 'center', padding: '10px', color: '#FF9D1C', fontWeight: 'normal' }}>❤️</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#FF9D1C', fontWeight: 'normal' }}>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {detailedPosts.map((post, idx) => (
                    <tr key={post.id} style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'
                    }}>
                      <td style={{ padding: '10px', color: '#ffffff', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {post.title || 'Untitled'}
                      </td>
                      <td style={{ padding: '10px', color: '#8b949e' }}>{post.author}</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: getRoomColor(post.room), fontWeight: 'bold' }}>
                        {post.room.toUpperCase()}
                      </td>
                      <td style={{ padding: '10px', color: '#6b7985' }}>{post.category}</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        {post.hasImage && <Image size={14} color="#8b949e" />}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#ffffff' }}>
                        {post.commentCount}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#ffffff' }}>
                        {post.reactionCount}
                      </td>
                      <td style={{ padding: '10px', color: '#6b7985', fontFamily: "'VT323', monospace" }}>
                        {formatDate(post.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detailed Circles List */}
        {expandedSection === 'circles' && detailedCircles.length > 0 && (
          <div style={{
            background: 'rgba(181, 109, 255, 0.05)',
            border: '1px solid rgba(181, 109, 255, 0.2)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h2 style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '16px',
              color: '#B56DFF',
              marginBottom: '20px',
              letterSpacing: '0.1em'
            }}>
              ALL CIRCLES ({detailedCircles.length})
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(181, 109, 255, 0.2)' }}>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#B56DFF', fontWeight: 'normal', width: '30%' }}>NAME</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#B56DFF', fontWeight: 'normal' }}>CREATOR</th>
                    <th style={{ textAlign: 'center', padding: '10px', color: '#B56DFF', fontWeight: 'normal' }}>ROOM</th>
                    <th style={{ textAlign: 'center', padding: '10px', color: '#B56DFF', fontWeight: 'normal' }}>MEMBERS</th>
                    <th style={{ textAlign: 'center', padding: '10px', color: '#B56DFF', fontWeight: 'normal' }}>POSTS</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#B56DFF', fontWeight: 'normal' }}>CREATED</th>
                  </tr>
                </thead>
                <tbody>
                  {detailedCircles.map((circle, idx) => (
                    <tr key={circle.id} style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'
                    }}>
                      <td style={{ padding: '10px', color: '#ffffff' }}>{circle.name}</td>
                      <td style={{ padding: '10px', color: '#8b949e' }}>{circle.creator}</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: getRoomColor(circle.room), fontWeight: 'bold' }}>
                        {circle.room.toUpperCase()}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#ffffff' }}>
                        {circle.memberCount}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#ffffff', fontWeight: 'bold' }}>
                        {circle.postCount}
                      </td>
                      <td style={{ padding: '10px', color: '#6b7985', fontFamily: "'VT323', monospace" }}>
                        {formatDate(circle.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Gender Distribution */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h2 style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '14px',
            color: '#ffffff',
            marginBottom: '15px',
            letterSpacing: '0.1em'
          }}>
            GENDER DISTRIBUTION
          </h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              flex: stats.users.gender.malePercentage,
              height: '40px',
              background: 'linear-gradient(90deg, #2EE6FF, #1a8a9a)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {stats.users.gender.malePercentage}%
            </div>
            <div style={{
              flex: stats.users.gender.femalePercentage,
              height: '40px',
              background: 'linear-gradient(90deg, #FF9D1C, #cc7d16)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {stats.users.gender.femalePercentage}%
            </div>
            {stats.users.gender.other > 0 && (
              <div style={{
                flex: stats.users.gender.otherPercentage,
                height: '40px',
                background: 'linear-gradient(90deg, #B56DFF, #8a53cc)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {stats.users.gender.otherPercentage}%
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '11px', color: '#8b949e' }}>
            <div>MALE: {stats.users.gender.male}</div>
            <div>FEMALE: {stats.users.gender.female}</div>
            {stats.users.gender.other > 0 && <div>OTHER: {stats.users.gender.other}</div>}
          </div>
        </div>

        {/* Room Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {stats.rooms.map(room => (
            <div key={room.room} style={{
              background: `rgba(${room.room === 'dark' ? '46, 230, 255' : room.room === 'fantasy' ? '255, 157, 28' : '181, 109, 255'}, 0.05)`,
              border: `1px solid rgba(${room.room === 'dark' ? '46, 230, 255' : room.room === 'fantasy' ? '255, 157, 28' : '181, 109, 255'}, 0.2)`,
              borderRadius: '8px',
              padding: '20px'
            }}>
              <h3 style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '14px',
                color: getRoomColor(room.room),
                marginBottom: '15px',
                letterSpacing: '0.1em'
              }}>
                {room.room.toUpperCase()} ROOM
              </h3>
              <div style={{ fontSize: '11px', lineHeight: '1.8', color: '#c9d1d9' }}>
                <div>Posts: <span style={{ fontWeight: 'bold', color: '#ffffff' }}>{room.posts}</span></div>
                <div>Circles: <span style={{ fontWeight: 'bold', color: '#ffffff' }}>{room.circles}</span></div>
                <div>Comments: <span style={{ fontWeight: 'bold', color: '#ffffff' }}>{room.comments}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
