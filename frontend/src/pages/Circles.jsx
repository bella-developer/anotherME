import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PageTransition from '../components/PageTransition';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchCircles } from '../services/circleService';
import { usePageTitle } from '../hooks/usePageTitle';

// Room accent config
const roomAccent = {
  dark:  { color: '#c4a882', bg: 'rgba(196,168,130,0.08)', glow: 'rgba(196,168,130,0.12)', label: 'Dark' },
  climb: { color: '#c47a3a', bg: 'rgba(196,122,58,0.08)',  glow: 'rgba(196,122,58,0.12)',  label: 'Climb' },
  philo: { color: '#b8a8d4', bg: 'rgba(184,168,212,0.08)', glow: 'rgba(184,168,212,0.12)', label: 'Philo' },
};

function CircleCard({ circle, onClick }) {
  const [hovered, setHovered] = useState(false);
  const accent = roomAccent[circle.room] || { color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.04)', glow: 'rgba(255,255,255,0.06)', label: circle.room };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-pointer outline-none"
      style={{
        borderRadius: '3px',
        padding: '28px 24px 24px',
        background: hovered ? accent.bg : 'rgba(255,255,255,0.025)',
        boxShadow: hovered
          ? `0 0 0 1px rgba(255,255,255,0.1), 0 12px 40px rgba(0,0,0,0.5), 0 0 24px ${accent.glow}`
          : '0 0 0 1px rgba(255,255,255,0.055), 0 4px 20px rgba(0,0,0,0.35)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.35s ease',
      }}
    >
      {/* Room label — top right, minimal */}
      {circle.room && (
        <div
          className="absolute top-4 right-4 text-[9px] tracking-[0.22em] uppercase"
          style={{ color: hovered ? accent.color : 'rgba(255,255,255,0.22)' }}
        >
          {accent.label}
        </div>
      )}

      {/* Accent dot */}
      <div
        className="w-1.5 h-1.5 rounded-full mb-6 transition-all duration-300"
        style={{
          background: hovered ? accent.color : 'rgba(255,255,255,0.15)',
          boxShadow: hovered ? `0 0 8px ${accent.color}` : 'none',
        }}
      />

      {/* Circle name */}
      <h3
        className="font-light tracking-wide mb-3 transition-colors duration-300"
        style={{
          fontSize: '15px',
          letterSpacing: '0.08em',
          color: hovered ? '#ffffff' : 'rgba(255,255,255,0.75)',
        }}
      >
        {circle.name}
      </h3>

      {/* Description */}
      <p
        className="text-xs leading-relaxed mb-5 transition-colors duration-300"
        style={{ color: hovered ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.28)' }}
      >
        {circle.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] tracking-[0.12em] transition-colors duration-300"
          style={{ color: hovered ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.18)' }}
        >
          {(circle.activeUserCount || 0).toLocaleString()} souls
        </span>
        <span
          className="text-[10px] transition-all duration-300"
          style={{
            color: hovered ? accent.color : 'rgba(255,255,255,0.15)',
            transform: hovered ? 'translateX(3px)' : 'translateX(0)',
          }}
        >
          →
        </span>
      </div>
    </div>
  );
}

function Circles() {
  usePageTitle('Circles');
  const navigate = useNavigate();
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const loadCircles = async () => {
    try {
      const data = await fetchCircles();
      setCircles(data.circles);
    } catch (err) {
      console.error('Failed to load circles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCircles(); }, []);
  useEffect(() => {
    const interval = setInterval(loadCircles, 10000);
    return () => clearInterval(interval);
  }, []);

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'philo', label: 'Philo' },
    { value: 'climb', label: 'Climb' },
    { value: 'dark', label: 'Dark' },
  ];

  const visible = filter === 'all' ? circles : circles.filter(c => c.room === filter);

  if (loading) {
    return (
      <PageTransition>
        <Layout>
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner />
          </div>
        </Layout>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Layout leftSidebar={null} rightSidebar={null}>
        <div className="relative z-10 max-w-5xl mx-auto py-12 px-4">

          {/* Header */}
          <div className="mb-12">
            <div className="w-8 h-px mb-6" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.4), transparent)' }} />
            <h1 className="text-3xl font-light tracking-[0.2em] text-white uppercase mb-3">
              Circles
            </h1>
            <p className="text-[11px] text-white/30 tracking-[0.12em]">
              Quietly explore the unspoken thoughts of the collective.
            </p>
          </div>

          {/* Filter row */}
          <div className="flex gap-2 mb-10 flex-wrap">
            {filters.map((f) => {
              const acc = f.value !== 'all' ? roomAccent[f.value] : null;
              const active = filter === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className="px-4 py-1.5 text-[10px] tracking-[0.18em] uppercase transition-all duration-200"
                  style={{
                    borderRadius: '2px',
                    background: active ? (acc ? acc.bg : 'rgba(255,255,255,0.06)') : 'rgba(255,255,255,0.025)',
                    boxShadow: active
                      ? `0 0 0 1px ${acc ? acc.color + '44' : 'rgba(255,255,255,0.2)'}`
                      : '0 0 0 1px rgba(255,255,255,0.07)',
                    color: active ? (acc ? acc.color : 'rgba(255,255,255,0.8)') : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {visible.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/20 text-sm tracking-wide">No circles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {visible.map((circle) => (
                <CircleCard
                  key={circle.id}
                  circle={circle}
                  onClick={() => navigate(`/circles/${circle.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </Layout>
    </PageTransition>
  );
}

export default Circles;
