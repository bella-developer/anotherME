import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EsoLogo from './EsoLogo';

function HorizontalHero({ onRoomChange = () => {} }) {
  const navigate = useNavigate();
  const [currentRoom, setCurrentRoom] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRefs = useRef([]);

  const rooms = [
    {
      id: 'dark',
      num: '01',
      title: 'Dark Room',
      subtitle: 'Solitude & Introspection',
      description: 'A sanctuary for your deepest thoughts',
      videoUrl: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1785500775/darkfineedit_fxticc.mp4',
      accent: '#ef4444',
      rgb: '239, 68, 68',
    },
    {
      id: 'fantasy',
      num: '02',
      title: 'Fantasy Room',
      subtitle: 'Creativity & Imagination',
      description: 'Where imagination takes form',
      videoUrl: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1785499720/fansyedit_ozhjwj.mp4',
      accent: '#f97316',
      rgb: '249, 115, 22',
    },
    {
      id: 'philo',
      num: '03',
      title: 'Philo Room',
      subtitle: 'Philosophy & Deep Thought',
      description: 'Explore existential questions',
      videoUrl: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1785499721/philoedit_fwdmqu.mp4',
      accent: '#a855f7',
      rgb: '168, 85, 247',
    },
  ];

  const current = rooms[currentRoom];

  // Auto-play timer (6 seconds)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentRoom((prev) => (prev + 1) % rooms.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, rooms.length]);

  useEffect(() => {
    onRoomChange(current);
    if (videoRefs.current[currentRoom]) {
      videoRefs.current[currentRoom].play().catch(() => {});
    }
  }, [currentRoom]);

  return (
    <section 
      className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Full Bleed Video Backgrounds with Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden">
        {rooms.map((room, idx) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ 
              opacity: currentRoom === idx ? 1 : 0,
              scale: currentRoom === idx ? 1 : 1.05
            }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <video
              ref={(el) => (videoRefs.current[idx] = el)}
              className="w-full h-full object-cover filter brightness-[0.78] contrast-[1.05]"
              loop
              muted
              playsInline
              preload="auto"
              src={room.videoUrl}
            />
          </motion.div>
        ))}
      </div>

      {/* Cinematic Gradient Overlays (Replaces Oval Clipping) */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `
            linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%, transparent 25%, transparent 70%, rgba(0, 0, 0, 0.85) 100%),
            radial-gradient(circle at 50% 50%, rgba(${current.rgb}, 0.18) 0%, transparent 65%)
          `
        }}
      />

      {/* Subtle Filmic Noise Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-15 mix-blend-overlay bg-repeat bg-[length:128px_128px]" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Editorial Center Stage Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            {/* Logo */}
            <div className="mb-4">
              <EsoLogo className="h-8 sm:h-12 w-auto mx-auto opacity-90 drop-shadow-lg" />
            </div>

            {/* Category Tagline */}
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-8 bg-white/30" />
              <span className="text-xs uppercase tracking-[0.35em] text-white/70 font-mono font-medium">
                {current.num} &mdash; {current.subtitle}
              </span>
              <span className="h-[1px] w-8 bg-white/30" />
            </div>

            {/* Room Title */}
            <h1 
              className="text-5xl sm:text-7xl md:text-8xl font-serif font-black text-white tracking-wider leading-none mb-4 drop-shadow-2xl"
              style={{
                textShadow: `0 0 40px rgba(${current.rgb}, 0.5), 0 10px 30px rgba(0,0,0,0.8)`
              }}
            >
              {current.title}
            </h1>

            {/* Subtitle / Description */}
            <p className="text-base sm:text-xl font-light text-white/80 max-w-xl mb-8 tracking-wide font-sans">
              {current.description}
            </p>

            {/* Premium CTA Glass Button */}
            <button
              onClick={() => navigate('/login')}
              className="group relative px-8 py-4 rounded-full text-xs uppercase tracking-[0.25em] font-semibold text-white overflow-hidden transition-all duration-500"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid rgba(${current.rgb}, 0.4)`,
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)`
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Step In
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at center, rgba(${current.rgb}, 0.35) 0%, transparent 70%)` }}
              />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Glass Room Deck Navigation */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl">
          {rooms.map((room, idx) => {
            const isActive = currentRoom === idx;
            return (
              <button
                key={room.id}
                onClick={() => setCurrentRoom(idx)}
                className={`relative flex-1 py-2 px-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-300 flex flex-col items-center gap-1 ${
                  isActive ? 'text-white font-bold' : 'text-white/40 hover:text-white/70'
                }`}
              >
                <span>{room.num} {room.id.toUpperCase()}</span>
                {/* Active Progress Bar */}
                <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                  {isActive && (
                    <motion.div
                      key={`bar-${currentRoom}`}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 6, ease: 'linear' }}
                      className="h-full"
                      style={{ backgroundColor: room.accent }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HorizontalHero;
