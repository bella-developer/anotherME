import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import PageTransition from '../components/PageTransition';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchCircles } from '../services/circleService';
import { usePageTitle } from '../hooks/usePageTitle';

// Room accent config with electric glow colors
const roomAccent = {
  dark:  { 
    color: '#4A90E2', 
    colorRGB: '74, 144, 226',
    bg: 'rgba(74,144,226,0.05)', 
    glow: 'rgba(74,144,226,0.3)', 
    label: 'Dark' 
  },
  climb: { 
    color: '#F4A742', 
    colorRGB: '244, 167, 66',
    bg: 'rgba(244,167,66,0.05)',  
    glow: 'rgba(244,167,66,0.3)',  
    label: 'Climb' 
  },
  philo: { 
    color: '#50E3C2', 
    colorRGB: '80, 227, 194',
    bg: 'rgba(80,227,194,0.05)', 
    glow: 'rgba(80,227,194,0.3)', 
    label: 'Philo' 
  },
};

function CircleCard({ circle, onClick }) {
  const [hovered, setHovered] = useState(false);
  const accent = roomAccent[circle.room] || { 
    color: 'rgba(255,255,255,0.4)', 
    colorRGB: '255, 255, 255',
    bg: 'rgba(255,255,255,0.04)', 
    glow: 'rgba(255,255,255,0.06)', 
    label: circle.room 
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-pointer outline-none flex flex-col items-center"
      style={{
        padding: '20px',
        transition: 'all 0.35s ease',
      }}
    >
      {/* Circular avatar with animated electric glow */}
      <div className="relative mb-4" style={{ width: '120px', height: '120px' }}>
        {/* Animated circulating glow effect */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(
              from 0deg,
              transparent 0%,
              transparent 40%,
              rgba(${accent.colorRGB}, 0.6) 50%,
              rgba(${accent.colorRGB}, 0.8) 55%,
              rgba(${accent.colorRGB}, 0.6) 60%,
              transparent 90%,
              transparent 100%
            )`,
            filter: 'blur(8px)',
            animation: 'spin 15s linear infinite',
            transform: hovered ? 'scale(1.15)' : 'scale(1.08)',
            transition: 'transform 0.5s ease',
          }}
        />

        {/* Secondary glow layer */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(
              from 180deg,
              transparent 0%,
              transparent 45%,
              rgba(${accent.colorRGB}, 0.5) 55%,
              rgba(${accent.colorRGB}, 0.7) 60%,
              rgba(${accent.colorRGB}, 0.5) 65%,
              transparent 95%,
              transparent 100%
            )`,
            filter: 'blur(10px)',
            animation: 'spin-reverse 12s linear infinite',
            transform: hovered ? 'scale(1.12)' : 'scale(1.05)',
            transition: 'transform 0.5s ease',
          }}
        />

        {/* Inner circle with first letter */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{
            border: `1px solid rgba(${accent.colorRGB}, ${hovered ? 0.5 : 0.3})`,
            background: 'rgba(0, 0, 0, 0.8)',
            boxShadow: `
              inset 0 0 20px rgba(${accent.colorRGB}, 0.1),
              0 0 20px rgba(${accent.colorRGB}, ${hovered ? 0.3 : 0.15})
            `,
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.5s ease',
          }}
        >
          <span
            className="font-light"
            style={{
              fontSize: '32px',
              color: accent.color,
              textShadow: `0 0 15px rgba(${accent.colorRGB}, 0.5)`,
            }}
          >
            {circle.name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Room badge - top right of circle */}
        {circle.room && (
          <div
            className="absolute -top-1 -right-1 px-2 py-0.5 text-[8px] tracking-[0.2em] uppercase rounded-full"
            style={{
              background: hovered ? accent.bg : 'rgba(0,0,0,0.8)',
              border: `1px solid rgba(${accent.colorRGB}, ${hovered ? 0.5 : 0.3})`,
              color: accent.color,
              boxShadow: `0 0 10px rgba(${accent.colorRGB}, ${hovered ? 0.4 : 0.2})`,
              transition: 'all 0.3s ease',
            }}
          >
            {accent.label}
          </div>
        )}
      </div>

      {/* Circle name */}
      <h3
        className="font-light tracking-wide mb-2 text-center transition-colors duration-300"
        style={{
          fontSize: '14px',
          letterSpacing: '0.08em',
          color: hovered ? '#ffffff' : 'rgba(255,255,255,0.75)',
        }}
      >
        {circle.name}
      </h3>

      {/* Description */}
      <p
        className="text-[10px] leading-relaxed mb-3 text-center transition-colors duration-300 line-clamp-2"
        style={{ 
          color: hovered ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.28)',
          maxWidth: '200px',
        }}
      >
        {circle.description}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-2">
        <span
          className="text-[9px] tracking-[0.12em] transition-colors duration-300"
          style={{ color: hovered ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.18)' }}
        >
          {(circle.activeUserCount || 0).toLocaleString()} souls
        </span>
        <span
          className="text-[9px] transition-all duration-300"
          style={{
            color: hovered ? accent.color : 'rgba(255,255,255,0.15)',
            transform: hovered ? 'translateX(2px)' : 'translateX(0)',
          }}
        >
          →
        </span>
      </div>

      {/* Add keyframe animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
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

          {/* Grid - adjusted for circular cards */}
          {visible.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/20 text-sm tracking-wide">No circles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
