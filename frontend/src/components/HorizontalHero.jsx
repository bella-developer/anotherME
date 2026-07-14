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
      videoUrl: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1783941698/darkroomeffect_owm1l3.mp4',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.3)',
    },
    {
      id: 'fantasy',
      title: 'Fantasy Room',
      subtitle: 'Creativity & Imagination',
      description: 'Where dreams become reality',
      videoUrl: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1783941699/fantasyeffect_akv18q.mp4',
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
      style={{ background: 'var(--surface-void)', paddingTop: '80px' }}
    >
      {/* Video Backgrounds - Wider Frame with Breathing Room */}
      <div className="absolute inset-0 flex items-center justify-center px-4 md:px-8" style={{ paddingTop: '80px' }}>
        <div 
          className="relative w-full h-full"
          style={{
            maxWidth: '1800px',
            border: '1px solid var(--border-whisper)',
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
                style={{
                  filter: 'contrast(1.2) brightness(0.85) saturate(1.1)',
                }}
              >
                <source src={room.videoUrl} type="video/mp4" />
              </video>
              
              {/* Medium Dimming Overlay - 50% black */}
              <div 
                className="absolute inset-0 bg-black"
                style={{
                  opacity: 0.5,
                }}
              />
              
              {/* Subtle Color Mist */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at center, ${room.bgColor.replace('0.3', '0.15')} 0%, transparent 60%)`,
                }}
              />
              
              {/* Film Grain Texture */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
                  opacity: 0.3,
                }}
              />
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
          {/* Logo - Quiet */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <EsoLogo className="h-10 md:h-12 w-auto mx-auto" style={{ opacity: 0.6 }} />
          </motion.div>

          {/* Room Label - Ultra quiet */}
          <p 
            className="text-xs tracking-ultra uppercase mb-6 font-bold"
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.3em',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.9), 0 4px 24px rgba(0, 0, 0, 0.8)',
            }}
          >
            {currentRoomData.subtitle}
          </p>

          {/* Room Title - Extra Bold, High Contrast */}
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl mb-6"
            style={{
              color: '#ffffff',
              letterSpacing: 'var(--tracking-tight)',
              lineHeight: 'var(--leading-tight)',
              fontFamily: "'EB Garamond', 'Cormorant Garamond', Georgia, serif",
              fontWeight: '700',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.95), 0 8px 40px rgba(0, 0, 0, 0.9), 0 2px 8px rgba(0, 0, 0, 1)',
              WebkitTextStroke: '0.5px rgba(0, 0, 0, 0.5)',
            }}
          >
            {currentRoomData.title}
          </h1>

          {/* Description - Bold and Visible */}
          <p 
            className="text-base md:text-lg mb-12 max-w-xl mx-auto font-semibold"
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 'var(--leading-relaxed)',
              textShadow: '0 2px 16px rgba(0, 0, 0, 0.9), 0 4px 32px rgba(0, 0, 0, 0.8)',
            }}
          >
            {currentRoomData.description}
          </p>

          {/* CTA Button - High Contrast */}
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 text-xs uppercase tracking-widest transition-all group font-bold"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 'var(--radius-soft)',
              fontWeight: '700',
              transitionDuration: 'var(--duration-slow)',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          >
            Step In
          </button>
        </motion.div>
      </div>

      {/* Navigation Dots - Subtle */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
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
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20"
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
