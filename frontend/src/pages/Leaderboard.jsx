import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import LoadingSpinner from '../components/LoadingSpinner';
import apiClient from '../services/api';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * Leaderboard Page
 * Displays top users by room and stat
 */
function Leaderboard() {
  usePageTitle('Leaderboard');
  const navigate = useNavigate();
  
  const [room, setRoom] = useState('climb');
  const [stat, setStat] = useState('genius');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roomStats = {
    climb: {
      name: 'Climb Room',
      icon: '🚀',
      stats: [
        { key: 'genius', label: 'Genius', color: 'from-purple-600 to-purple-400' },
        { key: 'hustle', label: 'Hustle', color: 'from-orange-600 to-orange-400' },
        { key: 'legend', label: 'Legend', color: 'from-yellow-600 to-yellow-400' }
      ]
    },
    dark: {
      name: 'Dark Room',
      icon: '🌙',
      stats: [
        { key: 'depth', label: 'Depth', color: 'from-indigo-600 to-indigo-400' },
        { key: 'mystery', label: 'Mystery', color: 'from-violet-600 to-violet-400' },
        { key: 'wisdom', label: 'Wisdom', color: 'from-blue-600 to-blue-400' }
      ]
    },
    philo: {
      name: 'Philo Room',
      icon: '💡',
      stats: [
        { key: 'logic', label: 'Logic', color: 'from-cyan-600 to-cyan-400' },
        { key: 'insight', label: 'Insight', color: 'from-teal-600 to-teal-400' },
        { key: 'impact', label: 'Impact', color: 'from-green-600 to-green-400' }
      ]
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, [room, stat]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/users/leaderboard?room=${room}&stat=${stat}&limit=10`);
      setLeaderboard(response.data.data.leaderboard);
    } catch (err) {
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadLeaderboard();
  };

  const getCurrentStatColor = () => {
    const currentRoom = roomStats[room];
    const currentStat = currentRoom.stats.find(s => s.key === stat);
    return currentStat?.color || 'from-gray-600 to-gray-400';
  };

  return (
    <PageTransition>
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="text-[#918A87] hover:text-white transition-colors text-sm mb-4"
            >
              ← Back
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
                <p className="text-[#918A87]">Top performers across all rooms</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-white/5 text-[#918A87] rounded-lg hover:bg-[#252525] transition-colors border border-[#333] disabled:opacity-50 text-sm"
              >
                {loading ? 'Refreshing...' : '🔄 Refresh'}
              </button>
            </div>
          </div>

          {/* Room Selector */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Object.entries(roomStats).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => {
                    setRoom(key);
                    setStat(value.stats[0].key);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    room === key
                      ? 'bg-[#D97757] text-black'
                      : 'bg-white/5 text-[#918A87] hover:bg-[#252525] border border-[#333]'
                  }`}
                >
                  <span className="mr-2">{value.icon}</span>
                  {value.name}
                </button>
              ))}
            </div>
          </div>

          {/* Stat Selector */}
          <div className="mb-8">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {roomStats[room].stats.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStat(s.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    stat === s.key
                      ? 'bg-gradient-to-r ' + s.color + ' text-white'
                      : 'bg-white/5 text-[#918A87] hover:bg-[#252525] border border-[#333]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          )}

          {/* Leaderboard */}
          {!loading && !error && (
            <div className="bg-white/5 border border-[#333] rounded-lg overflow-hidden">
              {leaderboard.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-[#666]">No data yet. Be the first to earn XP!</p>
                </div>
              ) : (
                <div className="divide-y divide-[#333]">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.username}
                      className={`p-4 flex items-center gap-4 ${
                        index < 3 ? 'bg-gradient-to-r ' + getCurrentStatColor() + ' bg-opacity-5' : ''
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        {index === 0 && (
                          <span className="text-3xl">🥇</span>
                        )}
                        {index === 1 && (
                          <span className="text-3xl">🥈</span>
                        )}
                        {index === 2 && (
                          <span className="text-3xl">🥉</span>
                        )}
                        {index > 2 && (
                          <span className="text-[#666] text-lg font-bold">#{entry.rank}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#4A4458] to-[#2A2438] flex items-center justify-center">
                        <span className="text-[#8B7AA3] text-sm font-medium">
                          {entry.username.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Username */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{entry.username}</p>
                        <p className="text-[#666] text-xs">Level {entry.level}</p>
                      </div>

                      {/* XP */}
                      <div className="flex-shrink-0 text-right">
                        <p className={`text-lg font-bold bg-gradient-to-r ${getCurrentStatColor()} bg-clip-text text-transparent`}>
                          {entry.xp.toLocaleString()}
                        </p>
                        <p className="text-[#666] text-xs">XP</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 bg-white/5 border border-[#333] rounded-lg p-6">
            <h3 className="text-white font-medium mb-2">How to Climb the Leaderboard</h3>
            <ul className="text-[#918A87] text-sm space-y-2">
              <li>• Post quality content that resonates with the community</li>
              <li>• Earn reactions: PUSH (+2 XP), GEAR (+5 XP), ROCKET (+10 XP)</li>
              <li>• XP is distributed across stats: 50% primary, 30% secondary, 20% tertiary</li>
              <li>• Level up by reaching XP thresholds (Level 10 = 9001+ XP)</li>
            </ul>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Leaderboard;
