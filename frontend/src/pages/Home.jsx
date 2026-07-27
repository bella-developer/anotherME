import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSettings, FiInfo } from 'react-icons/fi';
import { TbYinYang, TbSparkles, TbBook2 } from 'react-icons/tb';
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
      tagline: 'Embrace the shadows.',
      description: 'Understand yourself.',
      path: '/rooms/dark',
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735009/darkroom_mf0vxg.png',
      glowColor: '#2EE6FF', // Electric Cyan
      glowColorRGB: '46, 230, 255',
      icon: TbYinYang,
    },
    {
      id: 'fantasy',
      name: 'FANTASY ROOM',
      tagline: 'Let your imagination fly.',
      description: 'Create your world.',
      path: '/rooms/fantasy',
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1783511770/fantasy_tsqwja.png',
      glowColor: '#FF9D1C', // Amber/Gold
      glowColorRGB: '255, 157, 28',
      icon: TbSparkles,
    },
    {
      id: 'philo',
      name: 'PHILO ROOM',
      tagline: 'Question. Reflect. Grow.',
      description: 'Seek what matters.',
      path: '/rooms/philo',
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735026/philoroom_lazjzx.png',
      glowColor: '#B56DFF', // Violet
      glowColorRGB: '181, 109, 255',
      icon: TbBook2,
    },
  ];

  return (
    <PageTransition>
      <Layout leftSidebar={null} rightSidebar={null}>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6 md:py-10 lg:py-14 relative z-10">

          {/* Top decorative icon */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="mb-8 md:mb-10"
          >
            <div 
              className="w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center"
              style={{ 
                borderColor: 'rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.03)',
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#ffffff' }} />
            </div>
          </motion.div>

          {/* Greeting text - small */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="text-center mb-2"
          >
            <p 
              className="text-[10px] md:text-xs tracking-[0.35em] uppercase"
              style={{ 
                color: 'rgba(255, 255, 255, 0.4)',
                fontFamily: 'var(--font-body)',
                fontWeight: '300',
              }}
            >
              {getGreeting()}
            </p>
          </motion.div>

          {/* Choose Your Room - small */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.6 }}
            className="text-center mb-6 md:mb-8"
          >
            <p 
              className="text-[11px] md:text-sm tracking-[0.35em] uppercase"
              style={{ 
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'var(--font-body)',
                fontWeight: '400',
              }}
            >
              Choose Your Room
            </p>
          </motion.div>

          {/* Your Safe Space - large heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 0.8 }}
            className="text-center mb-6 md:mb-8"
          >
            <motion.h1
              animate={{ 
                scale: [1, 1.005, 1],
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

          {/* Subtitle - Three paths */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
            className="text-center mb-12 md:mb-16"
          >
            <p 
              className="text-xs md:text-sm tracking-[0.08em]"
              style={{ 
                color: 'rgba(255, 255, 255, 0.4)',
                fontFamily: 'var(--font-body)',
                fontWeight: '300',
              }}
            >
              Three paths. Three energies. One place for you.
            </p>
          </motion.div>

          {/* Room Cards - Circular portals with icons and decorations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-16 w-full max-w-7xl px-4 sm:px-6 md:px-8">
            {rooms.map((room, idx) => {
              const RoomIcon = room.icon;
              return (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 1.2 + idx * 0.2 }}
                  className="flex flex-col items-center w-full"
                >
                  {/* Circular portal with decorative icons */}
                  <div className="relative w-full mx-auto" style={{ maxWidth: '380px' }}>
                    {/* Aspect ratio box */}
                    <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                      
                      {/* Top decorative icon */}
                      <div 
                        className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10 w-6 h-6 rounded-full border flex items-center justify-center"
                        style={{ 
                          borderColor: `rgba(${room.glowColorRGB}, 0.4)`,
                          background: 'rgba(0, 0, 0, 0.8)',
                        }}
                      >
                        <div className="w-1 h-1 rounded-full" style={{ background: room.glowColor }} />
                      </div>

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
                        {/* Stable circular border */}
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

                        {/* Rotating energy arcs */}
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
                              
                              <filter id={`arc-glow-${room.id}`}>
                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                <feMerge>
                                  <feMergeNode in="coloredBlur"/>
                                  <feMergeNode in="coloredBlur"/>
                                  <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                              </filter>
                            </defs>
                            
                            <path
                              d="M 200,20 A 180,180 0 0,1 380,200"
                              fill="none"
                              stroke={`url(#arc-gradient-${room.id})`}
                              strokeWidth="4"
                              strokeLinecap="round"
                              filter={`url(#arc-glow-${room.id})`}
                              style={{ mixBlendMode: 'screen' }}
                            />
                            
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

                        {/* CSS Animations */}
                        <style jsx>{`
                          @keyframes rotate360 {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
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

                        {/* Inner circle with image */}
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

                      {/* Bottom decorative icon with room-specific icon */}
                      <div 
                        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-10 w-10 h-10 rounded-full border flex items-center justify-center"
                        style={{ 
                          borderColor: `rgba(${room.glowColorRGB}, 0.4)`,
                          background: 'rgba(0, 0, 0, 0.9)',
                          boxShadow: `0 0 20px rgba(${room.glowColorRGB}, 0.3)`,
                        }}
                      >
                        <RoomIcon size={20} style={{ color: room.glowColor }} />
                      </div>
                    </div>
                  </div>

                  {/* Room info below circle */}
                  <div className="mt-14 md:mt-16 text-center">
                    <h2
                      className="text-lg md:text-xl font-normal tracking-[0.25em] mb-2 uppercase"
                      style={{
                        color: room.glowColor,
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      {room.name}
                    </h2>
                    
                    <p
                      className="text-[11px] md:text-xs tracking-[0.08em] mb-1"
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {room.tagline}
                    </p>

                    <p
                      className="text-[10px] md:text-xs tracking-[0.08em]"
                      style={{
                        color: 'rgba(255, 255, 255, 0.4)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {room.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 2.5 }}
            className="mt-16 md:mt-20 text-center relative w-full"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="h-px flex-1 max-w-[100px]" style={{ background: 'rgba(255, 255, 255, 0.1)' }} />
              <p
                className="text-[10px] md:text-xs tracking-[0.25em] uppercase"
                style={{ 
                  color: 'rgba(255, 255, 255, 0.3)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: '300',
                }}
              >
                This is your space. Take your time.
              </p>
              <div className="h-px flex-1 max-w-[100px]" style={{ background: 'rgba(255, 255, 255, 0.1)' }} />
            </div>

            {/* Bottom corner buttons */}
            <div className="absolute bottom-0 left-4 flex items-center gap-2">
              <button
                className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase transition-colors"
                style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.3)'}
              >
                <FiSettings size={14} />
                <span>Settings</span>
              </button>
            </div>

            <div className="absolute bottom-0 right-4 flex items-center gap-2">
              <button
                className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase transition-colors"
                style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.3)'}
              >
                <span>About this space</span>
                <FiInfo size={14} />
              </button>
            </div>
          </motion.div>

        </div>
      </Layout>
    </PageTransition>
  );
}

export default Home;
