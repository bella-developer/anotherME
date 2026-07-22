import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../features/authSlice';
import { fetchStatistics } from '../services/adminService';
import Layout from '../components/Layout';
import PageTransition from '../components/PageTransition';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePageTitle } from '../hooks/usePageTitle';

function AdminDashboard() {
  usePageTitle('Admin Dashboard');
  const navigate = useNavigate();
  const { user } = useSelector(selectAuth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/home');
      return;
    }

    loadStatistics();
  }, [user, navigate]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchStatistics();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <Layout leftSidebar={null} rightSidebar={null}>
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
          </div>
        </Layout>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <Layout leftSidebar={null} rightSidebar={null}>
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={loadStatistics}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
                style={{ color: '#e6edf3' }}
              >
                Retry
              </button>
            </div>
          </div>
        </Layout>
      </PageTransition>
    );
  }

  const StatCard = ({ title, value, subtitle, color = '#e6edf3', icon }) => (
    <div
      className="p-6 rounded-lg transition-all duration-300 hover:scale-105"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xs uppercase tracking-wider" style={{ 
          color: 'rgba(255, 255, 255, 0.4)',
          fontFamily: 'var(--font-heading)',
          letterSpacing: '0.1em'
        }}>
          {title}
        </h3>
        {icon && <span className="text-xl opacity-50">{icon}</span>}
      </div>
      <p className="text-4xl font-bold mb-2" style={{ 
        color,
        fontFamily: 'var(--font-heading)'
      }}>
        {value.toLocaleString()}
      </p>
      {subtitle && (
        <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );

  const ProgressBar = ({ label, value, max, color }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-xs uppercase tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            {label}
          </span>
          <span className="text-xs font-bold" style={{ color }}>
            {value.toLocaleString()}
          </span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%`, background: color }}
          />
        </div>
      </div>
    );
  };

  return (
    <PageTransition>
      <Layout leftSidebar={null} rightSidebar={null}>
        {/* Background gradient */}
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(168, 85, 247, 0.08) 0%, transparent 60%)',
            zIndex: 1,
          }}
        />

        <div className="min-h-screen pt-16 pb-24 px-4 sm:px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="mb-12">
              <button
                onClick={() => navigate('/home')}
                className="px-4 py-2 text-xs tracking-wide uppercase mb-8 transition-all flex items-center gap-2 rounded"
                style={{
                  color: '#e6edf3',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  backgroundColor: 'rgba(168, 85, 247, 0.05)',
                  fontWeight: '500',
                }}
              >
                ← BACK
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-px" style={{ 
                  background: 'linear-gradient(to right, rgba(168, 85, 247, 0.4), transparent)' 
                }} />
                <h1 className="text-3xl md:text-5xl uppercase heading-text" style={{
                  color: '#B56DFF',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.1em',
                  fontWeight: '700'
                }}>
                  ADMIN DASHBOARD
                </h1>
              </div>
              <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                Platform analytics and statistics • Updated: {new Date(stats.timestamp).toLocaleString()}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Total Users"
                value={stats.users.total}
                subtitle={`+${stats.users.new24h} last 24h`}
                color="#2EE6FF"
                icon="👥"
              />
              <StatCard
                title="Total Posts"
                value={stats.posts.total}
                subtitle={`+${stats.posts.new24h} last 24h`}
                color="#FF9D1C"
                icon="📝"
              />
              <StatCard
                title="Total Circles"
                value={stats.circles.total}
                subtitle="Active communities"
                color="#B56DFF"
                icon="⭕"
              />
              <StatCard
                title="Total Comments"
                value={stats.comments.total}
                subtitle={`+${stats.comments.new24h} last 24h`}
                color="#22c55e"
                icon="💬"
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              
              {/* User Growth */}
              <div className="p-6 rounded-lg" style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}>
                <h2 className="text-lg uppercase mb-6" style={{
                  color: '#2EE6FF',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.08em'
                }}>
                  User Growth
                </h2>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Last 24 hours</span>
                    <p className="text-3xl font-bold" style={{ color: '#2EE6FF' }}>+{stats.users.new24h}</p>
                  </div>
                  <div>
                    <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Last 7 days</span>
                    <p className="text-3xl font-bold" style={{ color: '#2EE6FF' }}>+{stats.users.new7d}</p>
                  </div>
                  <div>
                    <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Last 30 days</span>
                    <p className="text-3xl font-bold" style={{ color: '#2EE6FF' }}>+{stats.users.new30d}</p>
                  </div>
                </div>
              </div>

              {/* Gender Distribution */}
              <div className="p-6 rounded-lg" style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}>
                <h2 className="text-lg uppercase mb-6" style={{
                  color: '#B56DFF',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.08em'
                }}>
                  Gender Distribution
                </h2>
                <ProgressBar
                  label="Male"
                  value={stats.users.gender.male}
                  max={stats.users.total}
                  color="#2EE6FF"
                />
                <ProgressBar
                  label="Female"
                  value={stats.users.gender.female}
                  max={stats.users.total}
                  color="#FF9D1C"
                />
                <ProgressBar
                  label="Other/Not Specified"
                  value={stats.users.gender.other}
                  max={stats.users.total}
                  color="#B56DFF"
                />
                <div className="mt-4 flex justify-around text-center">
                  <div>
                    <p className="text-2xl font-bold" style={{ color: '#2EE6FF' }}>{stats.users.gender.malePercentage}%</p>
                    <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Male</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: '#FF9D1C' }}>{stats.users.gender.femalePercentage}%</p>
                    <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Female</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: '#B56DFF' }}>{stats.users.gender.otherPercentage}%</p>
                    <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Other</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Statistics */}
            <div className="p-6 rounded-lg mb-8" style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <h2 className="text-lg uppercase mb-6" style={{
                color: '#FF9D1C',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.08em'
              }}>
                Room Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.rooms.map((room) => (
                  <div key={room.room} className="p-4 rounded" style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <h3 className="text-sm uppercase mb-4" style={{
                      color: room.room === 'dark' ? '#2EE6FF' : room.room === 'fantasy' ? '#FF9D1C' : '#B56DFF',
                      fontFamily: 'var(--font-heading)',
                      letterSpacing: '0.1em'
                    }}>
                      {room.room.toUpperCase()} ROOM
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Posts</span>
                        <span className="text-sm font-bold" style={{ color: '#e6edf3' }}>{room.posts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Circles</span>
                        <span className="text-sm font-bold" style={{ color: '#e6edf3' }}>{room.circles}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Comments</span>
                        <span className="text-sm font-bold" style={{ color: '#e6edf3' }}>{room.comments}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement & Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Engagement Metrics */}
              <div className="p-6 rounded-lg" style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}>
                <h2 className="text-lg uppercase mb-6" style={{
                  color: '#22c55e',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.08em'
                }}>
                  Engagement Metrics
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Total Reactions</span>
                    <span className="text-xl font-bold" style={{ color: '#22c55e' }}>
                      {stats.engagement.totalReactions.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Engagement Rate</span>
                    <span className="text-xl font-bold" style={{ color: '#22c55e' }}>
                      {stats.engagement.engagementRate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Avg Comments/Post</span>
                    <span className="text-xl font-bold" style={{ color: '#22c55e' }}>
                      {stats.engagement.averageCommentsPerPost}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Stats */}
              <div className="p-6 rounded-lg" style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}>
                <h2 className="text-lg uppercase mb-6" style={{
                  color: '#f59e0b',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.08em'
                }}>
                  Content Statistics
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Posts with Images</span>
                    <span className="text-xl font-bold" style={{ color: '#f59e0b' }}>
                      {stats.posts.withImages.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Image Upload Rate</span>
                    <span className="text-xl font-bold" style={{ color: '#f59e0b' }}>
                      {stats.posts.imagePercentage}%
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${stats.posts.imagePercentage}%`,
                          background: 'linear-gradient(to right, #f59e0b, #fb923c)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Layout>
    </PageTransition>
  );
}

export default AdminDashboard;
