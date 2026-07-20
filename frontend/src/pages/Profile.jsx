import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectAuth, setUser, clearUser } from '../features/authSlice';
import PageTransition from '../components/PageTransition';
import LoadingSpinner from '../components/LoadingSpinner';
import Layout from '../components/Layout';
import LevelBadge from '../components/LevelBadge';
import { getCurrentUser, updateUserProfile, fetchUserStats } from '../services/userService';
import { logout } from '../services/authService';
import { usePageTitle } from '../hooks/usePageTitle';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Profile Page - Artistic Redesign
 * Clean, elegant display of user identity and stats
 * Username-based identity (no alias/anonymous concept)
 */
function Profile() {
  usePageTitle('Profile');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(selectAuth);
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState(null);
  
  const [profileData, setProfileData] = useState({
    username: '',
    fullName: '',
    age: '',
    gender: ''
  });
  
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadUserData();
    loadUserStats();
  }, [isAuthenticated, navigate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      const user = userData.user || userData;
      
      const data = {
        username: user.username || '',
        fullName: user.fullName || '',
        age: user.age || '',
        gender: user.gender || ''
      };
      setProfileData(data);
      setFormData({ fullName: data.fullName, age: data.age, gender: data.gender });
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const statsData = await fetchUserStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const getHighestLevelStat = () => {
    if (!stats) return null;
    
    const allStats = [];
    ['fantasy', 'dark', 'philo'].forEach(room => {
      if (stats[room]) {
        Object.entries(stats[room]).forEach(([stat, data]) => {
          allStats.push({ room, stat, level: data.level, xp: data.xp });
        });
      }
    });
    
    if (allStats.length === 0) return null;
    allStats.sort((a, b) => b.level !== a.level ? b.level - a.level : b.xp - a.xp);
    return allStats[0];
  };

  const highestStat = getHighestLevelStat();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);
      setError(null);
      
      const updateData = {
        ...(formData.fullName !== undefined && formData.fullName !== '' && { fullName: formData.fullName }),
        ...(formData.age !== undefined && formData.age !== '' && { age: parseInt(formData.age, 10) }),
        ...(formData.gender !== undefined && formData.gender !== '' && { gender: formData.gender })
      };

      // Handle empty fullName separately (set to null to clear it)
      if (formData.fullName === '') {
        updateData.fullName = null;
      }

      const updatedUser = await updateUserProfile(updateData);
      const user = updatedUser.user || updatedUser;
      
      const data = {
        username: user.username || '',
        fullName: user.fullName || '',
        age: user.age || '',
        gender: user.gender || ''
      };
      setProfileData(data);
      setFormData({ fullName: data.fullName, age: data.age, gender: data.gender });
      dispatch(setUser({ user }));
      
      setSuccess(true);
      setIsEditing(false);
      
      // Reload user data to ensure display is in sync
      await loadUserData();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    try {
      setLoggingOut(true);
      await logout();
      dispatch(clearUser());
      navigate('/login');
    } catch (err) {
      dispatch(clearUser());
      navigate('/login');
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

  const roomAccent = {
    dark: '#c4a882',
    fantasy: '#FF9D1C',
    philo: '#8B7AA3'
  };

  return (
    <PageTransition>
      <Layout leftSidebar={null} rightSidebar={null}>
        <div className="min-h-screen pt-2 pb-12 px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="mb-10">
              <button
                onClick={() => navigate(-1)}
                className="text-[10px] tracking-[0.2em] hover:opacity-70 transition-colors mb-8 uppercase flex items-center gap-2"
                style={{ color: isLight ? 'rgba(0,0,0,0.40)' : 'rgba(255,255,255,0.30)' }}
              >
                ← Back
              </button>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="w-8 h-px mb-5" style={{ background: isLight ? 'linear-gradient(to right, rgba(0,0,0,0.2), transparent)' : 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)' }} />
                  <h1 className="text-3xl font-light tracking-[0.25em] uppercase mb-3" style={{ color: isLight ? 'rgba(0,0,0,0.90)' : 'rgba(255,255,255,0.90)' }}>
                    Profile
                  </h1>
                  <p className="text-[11px] tracking-[0.15em] uppercase" style={{ color: isLight ? 'rgba(0,0,0,0.40)' : 'rgba(255,255,255,0.35)' }}>
                    Your Identity · Stats · Progress
                  </p>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 transition-all duration-200" style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '3px'
              }}>
                <p className="text-green-400 text-xs tracking-wide">✓ Profile updated successfully</p>
              </div>
            )}

            {/* Main Profile Card */}
            <div className="mb-8 p-8" style={{
              background: 'rgba(255,255,255,0.03)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06)',
              borderRadius: '4px'
            }}>
              {/* Username Display */}
              <div className="flex items-center gap-6 mb-8 pb-8" style={{ borderBottom: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)' }}>
                <div className="relative flex-shrink-0">
                  {/* Concentric circles */}
                  <div className="absolute inset-0 rounded-full" style={{
                    border: '1px solid rgba(75, 75, 75, 0.3)',
                    transform: 'scale(1.3)'
                  }} />
                  <div className="absolute inset-0 rounded-full" style={{
                    border: '1px solid rgba(75, 75, 75, 0.25)',
                    transform: 'scale(1.15)'
                  }} />
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{
                    background: 'black',
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.1), inset 0 0 20px rgba(0,0,0,0.3)'
                  }}>
                    <span className="text-2xl font-light" style={{ color: '#D97757' }}>
                      {(profileData.fullName || profileData.username).charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-light tracking-wide" style={{ color: isLight ? 'rgba(0,0,0,0.90)' : 'rgba(255,255,255,0.90)' }}>
                      {profileData.fullName || profileData.username}
                    </h2>
                    {highestStat && (
                      <LevelBadge stat={highestStat.stat} level={highestStat.level} size="md" />
                    )}
                  </div>
                  <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.30)' }}>
                    @{profileData.username}
                  </p>
                </div>
              </div>

              {/* Demographics */}
              {!isEditing ? (
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-[9px] tracking-[0.2em] uppercase mb-2" style={{ color: isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.25)' }}>Name</p>
                    <p className="text-lg font-light" style={{ color: isLight ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.70)' }}>
                      {profileData.fullName || <span style={{ color: isLight ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.20)' }}>Not specified</span>}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.2em] uppercase mb-2" style={{ color: isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.25)' }}>Age</p>
                    <p className="text-lg font-light" style={{ color: isLight ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.70)' }}>
                      {profileData.age || <span style={{ color: isLight ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.20)' }}>Not specified</span>}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.2em] uppercase mb-2" style={{ color: isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.25)' }}>Gender</p>
                    <p className="text-lg font-light capitalize" style={{ color: isLight ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.70)' }}>
                      {profileData.gender ? profileData.gender.replace('-', ' ') : <span style={{ color: isLight ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.20)' }}>Not specified</span>}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 mb-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[9px] tracking-[0.2em] text-white/25 uppercase mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        maxLength={50}
                        className="w-full bg-black/20 text-white/90 px-4 py-2 text-sm focus:outline-none transition-all"
                        style={{
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '2px'
                        }}
                        placeholder="Optional"
                      />
                      {formData.fullName && (
                        <p className="text-[9px] mt-1 tabular-nums" style={{ color: formData.fullName.length > 40 ? '#D97757' : 'rgba(255,255,255,0.2)' }}>
                          {formData.fullName.length}/50
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[9px] tracking-[0.2em] text-white/25 uppercase mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full bg-black/20 text-white/90 px-4 py-2 text-sm focus:outline-none transition-all"
                        style={{
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '2px'
                        }}
                        min={18}
                        max={100}
                        placeholder="Optional"
                      />
                      {formData.age && (formData.age < 18 || formData.age > 100) && (
                        <p className="text-[9px] mt-1 text-red-400/80">Must be 18-100</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[9px] tracking-[0.2em] text-white/25 uppercase mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full bg-black/20 text-white/90 px-4 py-2 text-sm focus:outline-none transition-all"
                        style={{
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '2px'
                        }}
                      >
                        <option value="">Not specified</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 text-xs" style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '2px',
                      color: 'rgba(239, 68, 68, 0.9)'
                    }}>
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 text-[10px] tracking-[0.15em] uppercase font-medium transition-all disabled:opacity-50"
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '2px'
                      }}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({ fullName: profileData.fullName, age: profileData.age, gender: profileData.gender });
                        setError(null);
                      }}
                      className="px-6 py-2 text-[10px] tracking-[0.15em] uppercase transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        color: 'rgba(255,255,255,0.5)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '2px'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Action Buttons */}
              {!isEditing && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 text-[10px] tracking-[0.15em] uppercase transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.7)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '2px'
                    }}
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="px-6 py-2 text-[10px] tracking-[0.15em] uppercase transition-all disabled:opacity-50"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: 'rgba(239, 68, 68, 0.9)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '2px'
                    }}
                  >
                    {loggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              )}
            </div>

            {/* Stats Section */}
            {stats && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px" style={{ background: isLight ? 'linear-gradient(to right, rgba(0,0,0,0.2), transparent)' : 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)' }} />
                  <h3 className="text-[10px] tracking-[0.2em] uppercase" style={{ color: isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.30)' }}>Your Stats</h3>
                </div>

                {/* Room Stats */}
                {['dark', 'philo', 'fantasy'].map(room => {
                  if (!stats[room]) return null;
                  const accent = roomAccent[room];
                  const roomName = room === 'dark' ? 'Dark Room' : room === 'climb' ? 'Climb Room' : 'Philo Room';
                  
                  return (
                    <div key={room} className="p-6" style={{
                      background: 'rgba(255,255,255,0.02)',
                      boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
                      borderRadius: '3px'
                    }}>
                      <div className="flex items-center gap-2 mb-5">
                        <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
                        <h4 className="text-[10px] tracking-[0.2em] uppercase" style={{ color: accent }}>{roomName}</h4>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(stats[room]).map(([stat, data]) => (
                          <div key={stat} className="text-center">
                            <p className="text-[9px] tracking-[0.15em] uppercase mb-2" style={{ color: isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.25)' }}>{stat}</p>
                            <div className="flex flex-col items-center gap-1">
                              <LevelBadge stat={stat} level={data.level} size="sm" />
                              <p className="text-[10px]" style={{ color: isLight ? 'rgba(0,0,0,0.50)' : 'rgba(255,255,255,0.40)' }}>{data.xp} XP</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </PageTransition>
  );
}

export default Profile;
