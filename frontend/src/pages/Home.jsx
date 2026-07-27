import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import PageTransition from '../components/PageTransition';
import { usePageTitle } from '../hooks/usePageTitle';

function Home() {
  usePageTitle('Home');
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [time, setTime] = useState(new Date());

  // Update time for time-based greeting
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const rooms = [
    {
      id: 'dark',
      name: 'DARK ROOM',
      tagline: 'Release. Witness. Discharge.',
      description: 'Where raw emotion finds its voice.',
      path: '/rooms/dark',
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735009/darkroom_mf0vxg.png',
      glowColor: '#2EE6FF', // Electric Cyan
      glowColorRGB: '46, 230, 255',
    },
    {
      id: 'fantasy',
      name: 'FANTASY ROOM',
      tagline: 'Create. Imagine. Inspire.',
      description: 'Where imagination roams free.',
      path: '/rooms/fantasy',
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1783511770/fantasy_tsqwja.png',
      glowColor: '#FF9D1C', // Amber/Gold
      glowColorRGB: '255, 157, 28',
    },
    {
      id: 'philo',
      name: 'PHILO ROOM',
      tagline: 'Understand. Reflect. Inquire.',
      description: 'The question that stays.',
      path: '/rooms/philo',
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735026/philoroom_lazjzx.png',
      glowColor: '#B56DFF', // Violet
      glowColorRGB: '181, 109, 255',
    },
  ];

  return (
    <PageTransition>
      <Layout leftSidebar={null} rightSidebar={null}>
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 py-4 md:py-6 lg:py-8 relative z-10 scale-[0.92] lg:scale-[0.95] origin-top">

          {/* Opening quote - small with background highlight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="text-center mb-6 md:mb-8"
          >
            <span 
              className="text-[10px] md:text-xs tracking-[0.35em] uppercase inline-block px-3 py-1.5 rounded"
              style={{ 
                fontFamily: 'var(--font-body)',
                fontWeight: '500',
                color: '#ffffff',
                background: 'rgba(59, 130, 246, 0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {getGreeting()}
            </span>
          </motion.div>

          {/* Header - refined, breathing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 0.8 }}
            className="text-center mb-12 md:mb-16 lg:mb-18"
          >
            <p 
              className="text-[11px] md:text-sm tracking-[0.35em] uppercase mb-6 md:mb-8"
              style={{ 
                fontFamily: 'var(--font-body)',
                fontWeight: '500',
                color: 'rgba(255, 255, 255, 0.75)',
              }}
            >
              Choose Your Room
            </p>
            <motion.h1
              animate={{ 
                scale: [1, 1.008, 1],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[0.12em] px-4"
              style={{ fontWeight: 200, color: '#ffffff' }}
            >
              Your Safe Space
            </motion.h1>
          </motion.div>

          {/* Room Cards - Circular portals with stable border and rotating energy arcs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-16 w-full max-w-7xl px-4 sm:px-6 md:px-8">
            {rooms.map((room, idx) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 1.2 + idx * 0.2 }}
                className="flex flex-col items-center w-full"
              >
                {/* Circular portal with stable border and rotating energy arcs */}
                <div className="relative w-full mx-auto" style={{ maxWidth: '380px' }}>
                  {/* Aspect ratio box using padding-bottom technique for better browser support */}
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                    <button
                      onClick={() => navigate(room.path)}
                      onMouseEnter={() => setHovered(room.id)}
                      onMouseLeave={() => setHovered(null)}
                      className="group focus:outline-none"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        cursor: 'pointer',
                      }}
                    >
                      {/* Stable circular border - BOLD IN LIGHT MODE */}
                      <div
                        className="rounded-full"
                        style={{
                          position: 'absolute',
                          top: '4px',
                          left: '4px',
                          right: '4px',
                          bottom: '4px',
                          border: `1px solid rgba(${room.glowColorRGB}, 0.3)`,
                          boxShadow: `
                              inset 0 0 30px rgba(${room.glowColorRGB}, 0.1),
                              0 0 20px rgba(${room.glowColorRGB}, 0.2)
                            `,
                          transition: 'all 0.8s ease',
                        }}
                      />

                      {/* Rotating energy arcs - MORE VISIBLE IN LIGHT MODE */}
                      <div
                        className="rounded-full"
                        style={{
                          position: 'absolute',
                          top: '4px',
                          left: '4px',
                          right: '4px',
                          bottom: '4px',
                          animation: 'rotate360 20s linear infinite',
                          opacity: 1,
                        }}
                      >
                        {/* Primary energy arc */}
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 400 400"
                          style={{
                            filter: `drop-shadow(0 0 15px ${room.glowColor})`,
                          }}
                        >
                          <defs>
                            <linearGradient id={`arc-gradient-${room.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor={room.glowColor} stopOpacity="0" />
                              <stop offset="50%" stopColor={room.glowColor} stopOpacity="1" />
                              <stop offset="100%" stopColor={room.glowColor} stopOpacity="0" />
                            </linearGradient>
                            
                            {/* Glow filter */}
                            <filter id={`arc-glow-${room.id}`}>
                              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                              <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                          </defs>
                          
                          {/* Main rotating arc (90 degrees) */}
                          <path
                            d="M 200,20 A 180,180 0 0,1 380,200"
                            fill="none"
                            stroke={`url(#arc-gradient-${room.id})`}
                            strokeWidth="4"
                            strokeLinecap="round"
                            filter={`url(#arc-glow-${room.id})`}
                            style={{ mixBlendMode: 'screen' }}
                          />
                          
                          {/* Bright spot at arc peak */}
                          <circle
                            cx="290"
                            cy="110"
                            r="6"
                            fill={room.glowColor}
                            filter={`url(#arc-glow-${room.id})`}
                            style={{ mixBlendMode: 'screen' }}
                          >
                            <animate
                              attributeName="r"
                              values="6; 8; 6"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        </svg>
                      </div>

                      {/* Counter-rotating secondary arc - MORE VISIBLE */}
                      <div
                        className="rounded-full"
                        style={{
                          position: 'absolute',
                          top: '4px',
                          left: '4px',
                          right: '4px',
                          bottom: '4px',
                          animation: 'rotate360reverse 15s linear infinite',
                          opacity: 0.6,
                        }}
                      >
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 400 400"
                          style={{
                            filter: `drop-shadow(0 0 10px ${room.glowColor})`,
                            opacity: 0.6,
                          }}
                        >
                          {/* Secondary arc (smaller, 60 degrees) */}
                          <path
                            d="M 380,200 A 180,180 0 0,1 290,290"
                            fill="none"
                            stroke={room.glowColor}
                            strokeWidth="2"
                            strokeLinecap="round"
                            style={{ mixBlendMode: 'screen' }}
                          />
                        </svg>
                      </div>

                      {/* Orbital particles - MORE VISIBLE */}
                      <div
                        className="rounded-full pointer-events-none"
                        style={{
                          position: 'absolute',
                          top: '9px',
                          left: '9px',
                          right: '9px',
                          bottom: '9px',
                          animation: 'rotate360 25s linear infinite',
                          opacity: 0.8,
                        }}
                      >
                        {[0, 90, 180, 270].map((angle, i) => {
                          const rad = (angle * Math.PI) / 180;
                          const x = 50 + 50 * Math.cos(rad);
                          const y = 50 + 50 * Math.sin(rad);
                          return (
                            <div
                              key={i}
                              className="absolute"
                              style={{
                                width: '4px',
                                height: '4px',
                                borderRadius: '50%',
                                background: room.glowColor,
                                boxShadow: `0 0 10px ${room.glowColor}`,
                                top: `${y}%`,
                                left: `${x}%`,
                                transform: 'translate(-50%, -50%)',
                                opacity: 0.8,
                                mixBlendMode: 'screen',
                              }}
                            />
                          );
                        })}
                      </div>

                      {/* CSS Animations */}
                      <style jsx>{`
                        @keyframes rotate360 {
                          from { transform: rotate(0deg); }
                          to { transform: rotate(360deg); }
                        }
                        @keyframes rotate360reverse {
                          from { transform: rotate(360deg); }
                          to { transform: rotate(0deg); }
                        }
                      `}</style>

                      {/* Atmospheric glow beneath - STRONGER IN LIGHT MODE */}
                      <div
                        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 rounded-full"
                        style={{
                          width: '70%',
                          height: '30px',
                          background: `radial-gradient(ellipse, rgba(${room.glowColorRGB}, ${hovered === room.id ? 0.4 : 0.25}) 0%, transparent 70%)`,
                          filter: 'blur(20px)',
                          transition: 'all 0.8s ease',
                        }}
                      />

                      {/* Inner circle container with static image */}
                      <div
                        className="rounded-full overflow-hidden"
                        style={{
                          position: 'absolute',
                          top: '14px',
                          left: '14px',
                          right: '14px',
                          bottom: '14px',
                          backgroundColor: '#000000',
                          border: `1px solid rgba(${room.glowColorRGB}, ${hovered === room.id ? 0.4 : 0.2})`,
                          boxShadow: `
                            inset 0 0 40px rgba(${room.glowColorRGB}, 0.15),
                            0 0 30px rgba(${room.glowColorRGB}, ${hovered === room.id ? 0.3 : 0.15})
                          `,
                          transform: hovered === room.id ? 'scale(1.03)' : 'scale(1)',
                          transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                      >
                        {/* Static room image using img tag for better loading */}
                        <img
                          src={room.img}
                          alt={room.name}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            filter: hovered === room.id 
                              ? 'brightness(1.1) contrast(1.1)' 
                              : 'brightness(0.95) contrast(1.05)',
                            transition: 'filter 0.8s ease',
                          }}
                        />

                        {/* Subtle dark overlay */}
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `radial-gradient(circle, transparent 30%, rgba(0,0,0,${hovered === room.id ? 0.2 : 0.4}) 100%)`,
                            transition: 'background 0.8s ease',
                          }}
                        />
                      </div>
                    </button>
                  </div>
                </div>

                  {/* Room info below circle - Strong whites */}
                  <div className="mt-12 md:mt-14 text-center">
                    <h2
                      className="text-xl md:text-2xl font-light tracking-[0.25em] mb-3 uppercase"
                      style={{
                        color: hovered === room.id ? room.glowColor : '#ffffff',
                        textShadow: (hovered === room.id)
                          ? `0 0 20px rgba(${room.glowColorRGB}, 0.6)` 
                          : 'none',
                        transition: 'all 0.6s ease',
                      }}
                    >
                      {room.name}
                    </h2>
                    
                    <p
                      className="text-[10px] md:text-[11px] tracking-[0.15em] mb-2"
                      style={{
                        color: '#e6edf3',
                      }}
                    >
                      {room.tagline}
                    </p>

                    {/* Enter button */}
                    <motion.div
                      animate={{
                        opacity: hovered === room.id ? 1 : 0.5,
                      }}
                      className="mt-4 flex items-center justify-center gap-2"
                    >
                      <span
                        className="text-[9px] tracking-[0.3em] uppercase"
                        style={{
                          color: hovered === room.id 
                            ? room.glowColor 
                            : '#8b949e',
                          transition: 'color 0.6s ease',
                        }}
                      >
                        ENTER
                      </span>
                      <motion.span
                        animate={{
                          x: hovered === room.id ? 4 : 0,
                        }}
                        style={{
                          color: hovered === room.id 
                            ? room.glowColor 
                            : '#8b949e',
                        }}
                      >
                        →
                      </motion.span>
                    </motion.div>
                  </div>
              </motion.div>
            ))}
          </div>

          {/* Footer text with divider lines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 2.5 }}
            className="mt-16 md:mt-20 lg:mt-24 text-center"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="h-px flex-1 max-w-[100px]" style={{ background: 'rgba(255, 255, 255, 0.1)' }} />
              <p
                className="text-[10px] md:text-xs tracking-[0.25em] uppercase"
                style={{ 
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: '500',
                }}
              >
                This is your space. Take your time.
              </p>
              <div className="h-px flex-1 max-w-[100px]" style={{ background: 'rgba(255, 255, 255, 0.1)' }} />
            </div>
          </motion.div>

        </div>
      </Layout>
    </PageTransition>
  );
}

export default Home;
