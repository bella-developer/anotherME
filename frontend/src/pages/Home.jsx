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
      id: 'climb',
      name: 'CLIMB ROOM',
      tagline: 'Build. Sharpen. Progress.',
      description: 'The hunger to rise.',
      path: '/rooms/climb',
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735019/climbroom_camkye.png',
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
        <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6 md:py-10 lg:py-14 relative z-10">

          {/* Opening quote - fades in slowly */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="text-center mb-6 md:mb-8"
          >
            <p className="text-[9px] tracking-[0.28em] text-white/15 uppercase font-light italic">
              "{getGreeting()}"
            </p>
          </motion.div>

          {/* Header - refined, breathing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 0.8 }}
            className="text-center mb-16 md:mb-20 lg:mb-24"
          >
            <p className="text-[9px] tracking-[0.22em] text-white/18 uppercase mb-4 md:mb-6 font-light">
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
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[0.12em] text-white/92 px-4"
              style={{ fontWeight: 200 }}
            >
              Your Safe Space
            </motion.h1>
          </motion.div>

          {/* Room Cards - Circular portals with organic plasma energy rings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 lg:gap-20 w-full max-w-7xl px-4 md:px-8">
            {rooms.map((room, idx) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 1.2 + idx * 0.2 }}
                className="flex flex-col items-center"
              >
                {/* Circular portal with organic plasma energy ring */}
                <button
                  onClick={() => navigate(room.path)}
                  onMouseEnter={() => setHovered(room.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative group focus:outline-none"
                  style={{
                    width: 'min(85vw, 380px)',
                    height: 'min(85vw, 380px)',
                    cursor: 'pointer',
                  }}
                >
                  {/* SVG Energy Ring with organic waveform */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 400 400"
                    style={{
                      filter: 'drop-shadow(0 0 20px ' + room.glowColor + ')',
                      opacity: hovered === room.id ? 1 : 0.85,
                      transition: 'opacity 0.8s ease',
                    }}
                  >
                    <defs>
                      {/* Turbulence for organic wave distortion */}
                      <filter id={`plasma-${room.id}`}>
                        <feTurbulence
                          type="fractalNoise"
                          baseFrequency="0.02 0.08"
                          numOctaves="3"
                          seed={idx}
                        >
                          <animate
                            attributeName="baseFrequency"
                            values="0.02 0.08; 0.025 0.09; 0.02 0.08"
                            dur="8s"
                            repeatCount="indefinite"
                          />
                        </feTurbulence>
                        <feDisplacementMap in="SourceGraphic" scale="8">
                          <animate
                            attributeName="scale"
                            values="8; 12; 8"
                            dur="6s"
                            repeatCount="indefinite"
                          />
                        </feDisplacementMap>
                        <feGaussianBlur stdDeviation="1.5" />
                      </filter>

                      {/* Bloom/glow effect */}
                      <filter id={`glow-${room.id}`} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>

                      {/* Gradient for the energy ring */}
                      <linearGradient id={`gradient-${room.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={room.glowColor} stopOpacity="0.4">
                          <animate
                            attributeName="stopOpacity"
                            values="0.4; 0.7; 0.4"
                            dur="3s"
                            repeatCount="indefinite"
                          />
                        </stop>
                        <stop offset="50%" stopColor={room.glowColor} stopOpacity="1">
                          <animate
                            attributeName="stopOpacity"
                            values="1; 0.8; 1"
                            dur="3s"
                            repeatCount="indefinite"
                          />
                        </stop>
                        <stop offset="100%" stopColor={room.glowColor} stopOpacity="0.5">
                          <animate
                            attributeName="stopOpacity"
                            values="0.5; 0.9; 0.5"
                            dur="3s"
                            repeatCount="indefinite"
                          />
                        </stop>
                      </linearGradient>
                    </defs>

                    {/* Main energy ring with rotation */}
                    <g filter={`url(#glow-${room.id})`}>
                      <circle
                        cx="200"
                        cy="200"
                        r="185"
                        fill="none"
                        stroke={`url(#gradient-${room.id})`}
                        strokeWidth="3"
                        filter={`url(#plasma-${room.id})`}
                        style={{
                          transformOrigin: 'center',
                          mixBlendMode: 'screen',
                        }}
                      >
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from="0 200 200"
                          to="360 200 200"
                          dur="25s"
                          repeatCount="indefinite"
                        />
                        {/* Pulsation */}
                        <animate
                          attributeName="r"
                          values="185; 188; 185"
                          dur="4s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="stroke-width"
                          values="3; 4; 3"
                          dur="4s"
                          repeatCount="indefinite"
                        />
                      </circle>

                      {/* Secondary inner ring for depth */}
                      <circle
                        cx="200"
                        cy="200"
                        r="180"
                        fill="none"
                        stroke={room.glowColor}
                        strokeWidth="1"
                        opacity="0.3"
                        filter={`url(#plasma-${room.id})`}
                        style={{
                          transformOrigin: 'center',
                          mixBlendMode: 'screen',
                        }}
                      >
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from="360 200 200"
                          to="0 200 200"
                          dur="30s"
                          repeatCount="indefinite"
                        />
                      </circle>

                      {/* Particle sparks */}
                      {[...Array(8)].map((_, i) => {
                        const angle = (i * 360) / 8;
                        const x = 200 + 185 * Math.cos((angle * Math.PI) / 180);
                        const y = 200 + 185 * Math.sin((angle * Math.PI) / 180);
                        return (
                          <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="1.5"
                            fill={room.glowColor}
                            opacity="0"
                            style={{ mixBlendMode: 'screen' }}
                          >
                            <animate
                              attributeName="opacity"
                              values="0; 0.8; 0"
                              dur="2s"
                              begin={`${i * 0.25}s`}
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="r"
                              values="1.5; 2.5; 1.5"
                              dur="2s"
                              begin={`${i * 0.25}s`}
                              repeatCount="indefinite"
                            />
                          </circle>
                        );
                      })}
                    </g>
                  </svg>

                  {/* Atmospheric glow beneath */}
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
                    className="absolute inset-0 rounded-full overflow-hidden"
                    style={{
                      margin: '30px',
                      border: `1px solid rgba(${room.glowColorRGB}, ${hovered === room.id ? 0.4 : 0.2})`,
                      boxShadow: `
                        inset 0 0 40px rgba(${room.glowColorRGB}, 0.15),
                        0 0 30px rgba(${room.glowColorRGB}, ${hovered === room.id ? 0.3 : 0.15})
                      `,
                      transform: hovered === room.id ? 'scale(1.03)' : 'scale(1)',
                      transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    {/* Static room image */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url('${room.img}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: hovered === room.id 
                          ? 'brightness(1.1) contrast(1.1)' 
                          : 'brightness(0.95) contrast(1.05)',
                        transition: 'filter 0.8s ease',
                      }}
                    />

                    {/* Subtle dark overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(circle, transparent 30%, rgba(0,0,0,${hovered === room.id ? 0.2 : 0.4}) 100%)`,
                        transition: 'background 0.8s ease',
                      }}
                    />
                  </div>
                </button>

                {/* Room info below circle */}
                <div className="mt-12 md:mt-14 text-center">
                  <h2
                    className="text-xl md:text-2xl font-light tracking-[0.25em] mb-3 uppercase"
                    style={{
                      color: hovered === room.id ? room.glowColor : 'rgba(255,255,255,0.9)',
                      textShadow: hovered === room.id 
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
                      color: 'rgba(255,255,255,0.5)',
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
                        color: hovered === room.id ? room.glowColor : 'rgba(255,255,255,0.4)',
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
                        color: hovered === room.id ? room.glowColor : 'rgba(255,255,255,0.4)',
                      }}
                    >
                      →
                    </motion.span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Closing thought - contemplative */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 2.5 }}
            className="mt-16 md:mt-20 lg:mt-24 text-[8px] tracking-[0.26em] text-white/10 uppercase font-light italic px-4 text-center"
          >
            A space to breathe, to think, to be.
          </motion.p>

        </div>
      </Layout>
    </PageTransition>
  );
}

export default Home;
