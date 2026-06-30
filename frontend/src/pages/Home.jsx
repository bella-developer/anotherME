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
      name: 'Dark Room',
      label: 'I',
      tagline: 'The weight of feeling.',
      subtitle: ['Release.', 'Witness.', 'Discharge.'],
      description: 'Where raw emotion finds its voice. No performance. No filter. Just truth.',
      path: '/rooms/dark',
      // deep dark fog, grief, stillness
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735009/darkroom_mf0vxg.png',
      accent: 'rgba(180,140,120,0.15)',
      accentText: '#c4a882',
      glowColor: 'rgba(160,100,80,0.12)',
    },
    {
      id: 'climb',
      name: 'Climb Room',
      label: 'II',
      tagline: 'The hunger to rise.',
      subtitle: ['Build.', 'Sharpen.', 'Progress.'],
      description: 'Ideas sharpened against each other. Growth that demands something of you.',
      path: '/rooms/climb',
      // upward light beam / mountain summit
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735019/climbroom_camkye.png',
      accent: 'rgba(160,90,44,0.18)',
      accentText: '#c47a3a',
      glowColor: 'rgba(160,90,44,0.14)',
    },
    {
      id: 'philo',
      name: 'Philo Room',
      label: 'III',
      tagline: 'The question that stays.',
      subtitle: ['Understand.', 'Reflect.', 'Inquire.'],
      description: 'Thought as practice. Meaning as destination. Silence between the words.',
      path: '/rooms/philo',
      // ancient stone, cosmos, contemplation
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735026/philoroom_lazjzx.png',
      accent: 'rgba(200,180,240,0.12)',
      accentText: '#b8a8d4',
      glowColor: 'rgba(140,120,200,0.12)',
    },
  ];

  return (
    <PageTransition>
      <Layout leftSidebar={null} rightSidebar={null}>
        {/* Subtle film grain overlay */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            animation: 'grain 0.6s steps(4) infinite',
          }}
        />

        <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-16 md:py-20 lg:py-24 relative z-10">

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

          {/* Room Cards - intimate windows */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8 w-full max-w-7xl px-4 md:px-0">
            {rooms.map((room, idx) => (
              <motion.button
                key={room.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 1.2 + idx * 0.2 }}
                onClick={() => navigate(room.path)}
                onMouseEnter={() => setHovered(room.id)}
                onMouseLeave={() => setHovered(null)}
                className="group relative text-left overflow-hidden focus:outline-none bg-transparent border-none"
                style={{
                  height: 'clamp(480px, 60vh, 560px)',
                  cursor: 'pointer',
                  borderRadius: '12px', // Subtle artistic curves
                }}
              >
                {/* Soft vignette frame */}
                <div 
                  className="absolute inset-0"
                  style={{
                    boxShadow: 'inset 0 0 80px 20px rgba(0,0,0,0.4)',
                    borderRadius: '12px',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                />

                {/* Background photo - breathing */}
                <motion.div
                  animate={{
                    scale: hovered === room.id ? 1.05 : [1.02, 1.025, 1.02],
                  }}
                  transition={{
                    scale: hovered === room.id 
                      ? { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
                      : { duration: 10, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('${room.img}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: hovered === room.id 
                      ? 'brightness(0.88) contrast(1.08) saturate(0.95)' 
                      : 'brightness(0.68) contrast(0.92) saturate(0.85)',
                    transition: 'filter 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
                    borderRadius: '12px',
                  }}
                />

                {/* Warm candlelight glow on hover */}
                <motion.div
                  animate={{ 
                    opacity: hovered === room.id ? [0.6, 0.7, 0.6] : 0,
                  }}
                  transition={{
                    opacity: hovered === room.id
                      ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                      : { duration: 1 }
                  }}
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(ellipse at 50% 90%, ${room.accent.replace('0.15', '0.25').replace('0.18', '0.3').replace('0.12', '0.2')} 0%, transparent 65%)`,
                    borderRadius: '12px',
                  }}
                />

                {/* Soft atmospheric gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 42%, transparent 78%)`,
                    borderRadius: '12px',
                  }}
                />

                {/* Roman numeral - hidden beauty */}
                <motion.div
                  animate={{
                    opacity: hovered === room.id ? 0.18 : 0.06,
                  }}
                  transition={{ duration: 0.8 }}
                  className="absolute top-5 md:top-7 right-6 md:right-8 font-light"
                  style={{
                    fontSize: 'clamp(8px, 1.5vw, 9px)',
                    letterSpacing: '0.4em',
                    fontWeight: 200,
                    color: '#ffffff',
                  }}
                >
                  {room.label}
                </motion.div>

                {/* Content - intimate positioning */}
                <div className="absolute inset-x-0 bottom-0 px-6 md:px-8 lg:px-10 pb-8 md:pb-10 lg:pb-12">

                  {/* Poetic tagline */}
                  <motion.div
                    animate={{
                      opacity: hovered === room.id ? 1 : 0,
                      y: hovered === room.id ? 0 : 10,
                    }}
                    transition={{ duration: 0.8 }}
                    className="mb-3 md:mb-4 overflow-hidden"
                    style={{
                      maxHeight: hovered === room.id ? '40px' : '0',
                    }}
                  >
                    <p className="italic" style={{ 
                      fontSize: 'clamp(8px, 1.5vw, 9px)', 
                      letterSpacing: '0.18em', 
                      color: room.accentText, 
                      fontWeight: 300,
                    }}>
                      {room.tagline}
                    </p>
                  </motion.div>

                  {/* Room name - literary feel */}
                  <h2
                    className="uppercase mb-4 md:mb-5 lg:mb-6 transition-all duration-700"
                    style={{
                      fontSize: 'clamp(22px, 4vw, 28px)',
                      letterSpacing: '0.15em',
                      color: hovered === room.id ? '#ffffff' : 'rgba(255,255,255,0.85)',
                      fontWeight: 200,
                      lineHeight: 1.2,
                    }}
                  >
                    {room.name}
                  </h2>

                  {/* Subtitle verbs - staggered reveal */}
                  <div className="flex flex-wrap gap-3 md:gap-4 lg:gap-6 mb-5 md:mb-6 lg:mb-7">
                    {room.subtitle.map((line, i) => (
                      <motion.span
                        key={i}
                        animate={{
                          opacity: hovered === room.id ? 0.65 : 0.28,
                        }}
                        transition={{
                          duration: 0.6,
                          delay: hovered === room.id ? i * 0.08 : 0,
                        }}
                        style={{
                          fontSize: 'clamp(8px, 1.5vw, 9px)',
                          letterSpacing: '0.14em',
                          color: '#ffffff',
                          fontWeight: 300,
                        }}
                      >
                        {line}
                      </motion.span>
                    ))}
                  </div>

                  {/* Description - intimate prose */}
                  <motion.div
                    animate={{
                      opacity: hovered === room.id ? 1 : 0,
                      y: hovered === room.id ? 0 : 15,
                    }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                    style={{
                      maxHeight: hovered === room.id ? '100px' : '0',
                      overflow: 'hidden',
                    }}
                  >
                    <p style={{ 
                      fontSize: 'clamp(11px, 2vw, 12px)', 
                      lineHeight: '1.8', 
                      color: 'rgba(255,255,255,0.48)', 
                      letterSpacing: '0.01em',
                      fontWeight: 300,
                      marginBottom: '20px',
                    }}>
                      {room.description}
                    </p>
                  </motion.div>

                  {/* Enter - whisper */}
                  <motion.div
                    animate={{
                      opacity: hovered === room.id ? 1 : 0.4,
                    }}
                    transition={{ duration: 0.7 }}
                    className="flex items-center gap-2 md:gap-3"
                    style={{
                      paddingTop: '16px md:20px',
                      borderTop: `1px solid rgba(255,255,255,${hovered === room.id ? '0.12' : '0.06'})`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'clamp(7px, 1.5vw, 8px)',
                        letterSpacing: '0.32em',
                        textTransform: 'uppercase',
                        color: hovered === room.id ? room.accentText : 'rgba(255,255,255,0.32)',
                        transition: 'color 0.7s ease',
                        fontWeight: 300,
                      }}
                    >
                      Enter
                    </span>
                    <motion.span
                      animate={{
                        x: hovered === room.id ? 6 : 0,
                        opacity: hovered === room.id ? 1 : 0.4,
                      }}
                      transition={{ duration: 0.5 }}
                      style={{
                        color: hovered === room.id ? room.accentText : 'rgba(255,255,255,0.3)',
                        fontSize: 'clamp(9px, 1.8vw, 10px)',
                      }}
                    >
                      →
                    </motion.span>
                  </motion.div>
                </div>
              </motion.button>
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

        <style>{`
          @keyframes grain {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(-2%, -2%); }
            50% { transform: translate(2%, -1%); }
            75% { transform: translate(-1%, 2%); }
          }
        `}</style>
      </Layout>
    </PageTransition>
  );
}

export default Home;
