import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import PageTransition from '../components/PageTransition';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchCircles } from '../services/circleService';
import { usePageTitle } from '../hooks/usePageTitle';

// Room accent config with energy ring colors matching Home page
const roomAccent = {
  dark:  { 
    color: '#2EE6FF', // Electric Cyan
    colorRGB: '46, 230, 255',
    bg: 'rgba(46, 230, 255, 0.05)', 
    glow: 'rgba(46, 230, 255, 0.3)', 
    label: 'Dark' 
  },
  climb: { 
    color: '#FF9D1C', // Amber/Gold
    colorRGB: '255, 157, 28',
    bg: 'rgba(255, 157, 28, 0.05)',  
    glow: 'rgba(255, 157, 28, 0.3)',  
    label: 'Climb' 
  },
  philo: { 
    color: '#B56DFF', // Violet
    colorRGB: '181, 109, 255',
    bg: 'rgba(181, 109, 255, 0.05)', 
    glow: 'rgba(181, 109, 255, 0.3)', 
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
      {/* Circular avatar with stable border and rotating energy arcs */}
      <div className="relative mb-4" style={{ width: '120px', height: '120px' }}>
        
        {/* Stable circular border */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid rgba(${accent.colorRGB}, 0.3)`,
            boxShadow: `
              inset 0 0 20px rgba(${accent.colorRGB}, 0.1),
              0 0 15px rgba(${accent.colorRGB}, 0.2)
            `,
          }}
        />

        {/* Rotating energy arc */}
        <div
          className="absolute inset-0"
          style={{
            animation: 'spinCircle 20s linear infinite',
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 120 120"
            style={{
              filter: `drop-shadow(0 0 8px ${accent.color})`,
            }}
          >
            <defs>
              <linearGradient id={`arc-grad-${circle.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={accent.color} stopOpacity="0" />
                <stop offset="50%" stopColor={accent.color} stopOpacity="1" />
                <stop offset="100%" stopColor={accent.color} stopOpacity="0" />
              </linearGradient>
              
              <filter id={`arc-glow-${circle.id}`}>
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Main arc (90 degrees) */}
            <path
              d="M 60,5 A 55,55 0 0,1 115,60"
              fill="none"
              stroke={`url(#arc-grad-${circle.id})`}
              strokeWidth="3"
              strokeLinecap="round"
              filter={`url(#arc-glow-${circle.id})`}
              style={{ mixBlendMode: 'screen' }}
            />
            
            {/* Bright spot */}
            <circle
              cx="87"
              cy="33"
              r="3"
              fill={accent.color}
              filter={`url(#arc-glow-${circle.id})`}
              style={{ mixBlendMode: 'screen' }}
            >
              <animate
                attributeName="r"
                values="3; 4; 3"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        {/* Counter-rotating secondary arc */}
        <div
          className="absolute inset-0"
          style={{
            animation: 'spinCircleReverse 15s linear infinite',
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 120 120"
            style={{
              filter: `drop-shadow(0 0 6px ${accent.color})`,
              opacity: 0.6,
            }}
          >
            <path
              d="M 115,60 A 55,55 0 0,1 87,87"
              fill="none"
              stroke={accent.color}
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ mixBlendMode: 'screen' }}
            />
          </svg>
        </div>

        {/* Orbital particles */}
        <div
          className="absolute inset-0"
          style={{
            animation: 'spinCircle 25s linear infinite',
          }}
        >
          {[0, 90, 180, 270].map((angle, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                background: accent.color,
                boxShadow: `0 0 6px ${accent.color}`,
                top: '50%',
                left: '50%',
                transform: `rotate(${angle}deg) translateX(55px) translateY(-50%)`,
                opacity: 0.7,
                mixBlendMode: 'screen',
              }}
            />
          ))}
        </div>

        {/* Inner circle with first letter */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{
            margin: '8px',
            background: 'rgba(0, 0, 0, 0.85)',
            boxShadow: `
              inset 0 0 15px rgba(${accent.colorRGB}, 0.1)
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
              textShadow: `0 0 12px rgba(${accent.colorRGB}, 0.6)`,
            }}
          >
            {circle.name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Room badge */}
        {circle.room && (
          <div
            className="absolute -top-1 -right-1 px-2 py-0.5 text-[8px] tracking-[0.2em] uppercase rounded-full"
            style={{
              background: hovered ? accent.bg : 'rgba(0,0,0,0.8)',
              border: `1px solid rgba(${accent.colorRGB}, ${hovered ? 0.5 : 0.3})`,
              color: accent.color,
              boxShadow: `0 0 8px rgba(${accent.colorRGB}, ${hovered ? 0.4 : 0.2})`,
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

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spinCircle {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinCircleReverse {
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
