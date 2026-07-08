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
                  {/* Stable circular border */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      margin: '10px',
                      border: `2px solid rgba(${room.glowColorRGB}, 0.3)`,
                      boxShadow: `
                        inset 0 0 30px rgba(${room.glowColorRGB}, 0.1),
                        0 0 20px rgba(${room.glowColorRGB}, 0.2)
                      `,
                    }}
                  />

                  {/* Rotating energy arcs */}
                  <div
                    className="absolute inset-0"
                    style={{
                      margin: '10px',
                      animation: 'rotate360 20s linear infinite',
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

                  {/* Counter-rotating secondary arc */}
                  <div
                    className="absolute inset-0"
                    style={{
                      margin: '10px',
                      animation: 'rotate360reverse 15s linear infinite',
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

                  {/* Orbital particles */}
                  <div
                    className="absolute inset-0"
                    style={{
                      margin: '10px',
                      animation: 'rotate360 25s linear infinite',
                    }}
                  >
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute"
                        style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: room.glowColor,
                          boxShadow: `0 0 10px ${room.glowColor}`,
                          top: '50%',
                          left: '50%',
                          transform: `rotate(${i * 90}deg) translateX(180px) translateY(-50%)`,
                          opacity: 0.8,
                          mixBlendMode: 'screen',
                        }}
                      />
                    ))}
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
