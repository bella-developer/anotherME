import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EsoLogo from './EsoLogo';

// Horizontal Scrolling Hero with Video Backgrounds
function HorizontalHero({ onRoomChange = () => {} }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [currentRoom, setCurrentRoom] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [canScrollAway, setCanScrollAway] = useState(false);
  const videoOffset = '68px';
  const videoRefs = useRef([]);

  const rooms = [
    {
      id: 'dark',
      title: 'Dark Room',
      subtitle: 'Solitude & Introspection',
      description: 'A sanctuary for your deepest thoughts',
      videoUrl: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1785159408/darkroomvidbg_eccnlm.mp4',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.3)',
    },
    {
      id: 'fantasy',
      title: 'Fantasy Room',
      subtitle: 'Creativity & Imagination',
      description: 'Where imagination takes form',
      videoUrl: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1784018105/fantasyyy_djqjgx.mp4',
      color: '#f97316',
      bgColor: 'rgba(249, 115, 22, 0.3)',
    },
    {
      id: 'philo',
      title: 'Philo Room',
      subtitle: 'Philosophy & Deep Thought',
      description: 'Explore existential questions',
      videoUrl: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1783942027/philoeffect_soso3y.mp4',
      color: '#a855f7',
      bgColor: 'rgba(168, 85, 247, 0.3)',
    },
  ];

  // Auto-play through rooms
  useEffect(() => {
    const autoPlayTimer = setInterval(() => {
      if (currentRoom < rooms.length - 1) {
        changeRoom(currentRoom + 1);
      } else {
        setCurrentRoom(0);
        onRoomChange(rooms[0]);
        if (videoRefs.current[0]) {
          videoRefs.current[0].play().catch(err => console.log('Video play failed:', err));
        }
      }
    }, 5000); // Change every 5 seconds

    return () => clearInterval(autoPlayTimer);
  }, [currentRoom]);

  useEffect(() => {
    // Notify parent of initial room
    onRoomChange(rooms[0]);
    // Play first video
    if (videoRefs.current[0]) {
      videoRefs.current[0].play().catch(err => console.log('Video play failed:', err));
    }
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      const container = containerRef.current;
      if (!container) return;

      // If we're on the last room and scrolling down, allow normal scroll
      if (currentRoom === rooms.length - 1 && e.deltaY > 0) {
        setCanScrollAway(true);
        return;
      }

      // If not on last room, prevent scroll and change rooms
      if (currentRoom < rooms.length - 1 || e.deltaY < 0) {
        e.preventDefault();
        
        if (isTransitioning) return;
        
        if (e.deltaY > 0 || e.deltaX > 0) {
          // Scroll down/right - next room
          if (currentRoom < rooms.length - 1) {
            changeRoom(currentRoom + 1);
          }
        } else if (e.deltaY < 0 || e.deltaX < 0) {
          // Scroll up/left - previous room
          if (currentRoom > 0) {
            setCanScrollAway(false);
            changeRoom(currentRoom - 1);
          }
        }
      }
    };

    const handleKeyDown = (e) => {
      if (isTransitioning) return;
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentRoom < rooms.length - 1) {
          changeRoom(currentRoom + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentRoom > 0) {
          changeRoom(currentRoom - 1);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentRoom, isTransitioning]);

  const changeRoom = (newRoom) => {
    setIsTransitioning(true);
    setCurrentRoom(newRoom);
    onRoomChange(rooms[newRoom]);
    
    // Play video for current room
    if (videoRefs.current[newRoom]) {
      videoRefs.current[newRoom].play().catch(err => console.log('Video play failed:', err));
    }
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  const currentRoomData = rooms[currentRoom];

  return (
    <section 
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ background: '#000000' }}
    >
      {/* Cinematic Letterbox Bars - Top */}
      <div 
        className="absolute top-0 left-0 right-0 h-20 z-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 40%, transparent 100%)',
        }}
      />


      {/* Video Backgrounds - Full Width Scan Frame */}
      <div 
        className="absolute inset-0 flex items-center justify-center" 
        style={{ 
          paddingTop: 'clamp(52px, 10vw, 60px)',
          paddingBottom: 'clamp(52px, 10vw, 60px)',
          paddingLeft: '1.5px',
          paddingRight: '1.5px',
        }}
      >
        <div 
          className="relative w-full h-full"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.008)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
          }}
        >
          {/* Corner Frame Accents */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 z-30 pointer-events-none" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 z-30 pointer-events-none" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 z-30 pointer-events-none" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 z-30 pointer-events-none" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          {/* Video Container */}
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: currentRoom === index ? 1 : 0,
                scale: currentRoom === index ? 1 : 1.05,
              }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            >
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                muted
                playsInline
                preload="auto"
                autoPlay
              >
                <source src={room.videoUrl} type="video/mp4" />
              </video>
              
              
              
              
              
              
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content Overlay - Premium Restraint */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
        <motion.div
          key={currentRoom}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="text-center max-w-3xl"
        >
          {/* Logo - Cinematic Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="mb-16"
          >
            <EsoLogo 
              className="h-12 md:h-14 w-auto mx-auto" 
              style={{ 
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3)) drop-shadow(0 4px 40px rgba(0, 0, 0, 0.9))',
                opacity: 0.9
              }} 
            />
          </motion.div>

          {/* Room Label - Cinematic Typography */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm tracking-[0.35em] uppercase mb-8 font-extrabold"
            style={{
              color: '#FFFFFF',
              opacity: 0.85,
              letterSpacing: '0.35em',
              textShadow: `
                0 0 30px rgba(255, 255, 255, 0.5),
                0 0 60px rgba(255, 255, 255, 0.3),
                0 2px 20px rgba(0, 0, 0, 1),
                0 4px 40px rgba(0, 0, 0, 0.95),
                0 8px 60px rgba(0, 0, 0, 0.9)
              `,
              WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.2)',
            }}
          >
            {currentRoomData.subtitle}
          </motion.p>

          {/* Room Title - Dramatic Cinematic Effect */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl sm:text-7xl md:text-8xl mb-10"
            style={{
              color: '#FFFFFF',
              letterSpacing: '0.02em',
              lineHeight: '1.1',
              fontFamily: "'Playfair Display', 'EB Garamond', 'Cormorant Garamond', Georgia, serif",
              fontWeight: '900',
              textShadow: `
                0 0 40px rgba(255, 255, 255, 0.6),
                0 0 80px rgba(255, 255, 255, 0.4),
                0 2px 10px rgba(0, 0, 0, 1),
                0 4px 30px rgba(0, 0, 0, 1),
                0 8px 60px rgba(0, 0, 0, 0.95),
                0 16px 100px rgba(0, 0, 0, 0.9)
              `,
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.1)',
              filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.4))',
            }}
          >
            {currentRoomData.title}
          </motion.h1>

          {/* Description - Elegant & Legible */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl mb-14 max-w-2xl mx-auto font-light"
            style={{
              color: '#FFFFFF',
              opacity: 0.95,
              lineHeight: '1.7',
              letterSpacing: '0.03em',
              textShadow: `
                0 0 20px rgba(255, 255, 255, 0.3),
                0 2px 15px rgba(0, 0, 0, 1),
                0 4px 30px rgba(0, 0, 0, 0.95),
                0 8px 50px rgba(0, 0, 0, 0.9)
              `,
              fontWeight: '300',
            }}
          >
            {currentRoomData.description}
          </motion.p>

          {/* CTA Button - Cinematic Glass Effect */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            onClick={() => navigate('/login')}
            className="px-10 py-4 text-sm uppercase tracking-[0.25em] transition-all group font-bold relative overflow-hidden"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '8px',
              fontWeight: '700',
              transitionDuration: '0.4s',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(12px)',
              boxShadow: `
                0 4px 20px rgba(0, 0, 0, 0.5),
                0 8px 40px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = `
                0 6px 30px rgba(0, 0, 0, 0.6),
                0 12px 60px rgba(0, 0, 0, 0.4),
                0 0 40px rgba(255, 255, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.3)
              `;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = `
                0 4px 20px rgba(0, 0, 0, 0.5),
                0 8px 40px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `;
            }}
          >
            Step In
          </motion.button>
        </motion.div>
      </div>

      {/* Navigation Dots - Subtle */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {rooms.map((room, index) => (
          <button
            key={room.id}
            onClick={() => !isTransitioning && changeRoom(index)}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              backgroundColor: currentRoom === index ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.15)',
              transitionDuration: 'var(--duration-slow)',
            }}
            aria-label={`Go to ${room.title}`}
          />
        ))}
      </div>

      {/* Scroll Hint - Minimal */}
      {currentRoom === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
          className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20"
        >
          <svg 
            className="w-6 h-10 animate-bounce" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth={1}
            viewBox="0 0 24 24"
            style={{ color: 'rgba(255, 255, 255, 0.2)' }}
          >
            <rect x="8" y="5" width="8" height="14" rx="4" />
            <circle cx="12" cy="9" r="1" fill="currentColor" />
          </svg>
        </motion.div>
      )}
    </section>
  );
}

export default HorizontalHero;
