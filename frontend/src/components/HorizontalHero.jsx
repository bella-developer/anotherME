import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EsoLogo from './EsoLogo';

// Horizontal Scrolling Hero with Video Backgrounds
function HorizontalHero({ onRoomChange }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [currentRoom, setCurrentRoom] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [canScrollAway, setCanScrollAway] = useState(false);
  const [videoOffset, setVideoOffset] = useState('110px');
  const videoRefs = useRef([]);

  // Handle responsive video offset
  useEffect(() => {
    const updateVideoOffset = () => {
      setVideoOffset(window.innerWidth >= 768 ? '70px' : '65px');
    };
    
    updateVideoOffset();
    window.addEventListener('resize', updateVideoOffset);
    return () => window.removeEventListener('resize', updateVideoOffset);
  }, []);

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
    >
      {/* Video Backgrounds */}
      {rooms.map((room, index) => (
        <motion.div
          key={room.id}
          className="absolute inset-0"
          style={{ top: videoOffset }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: currentRoom === index ? 1 : 0,
            scale: currentRoom === index ? 1 : 1.1,
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
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
              filter: 'contrast(1.3) brightness(0.9)',
            }}
          >
            <source src={room.videoUrl} type="video/mp4" />
          </video>
          
          {/* Dimming Overlay */}
          <div 
            className="absolute inset-0 bg-black"
            style={{
              opacity: 0.4,
            }}
          />
          
          {/* Color Overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, ${room.bgColor} 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <motion.div
          key={currentRoom}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center max-w-2xl"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-3"
          >
            <EsoLogo className="h-12 md:h-16 w-auto mx-auto drop-shadow-2xl" />
          </motion.div>

          {/* Room Title */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-2 tracking-wider"
            style={{
              color: currentRoomData.color,
              textShadow: `0 0 60px ${currentRoomData.bgColor}, 0 0 100px ${currentRoomData.bgColor}, 0 4px 30px rgba(0,0,0,0.95), 0 8px 40px rgba(0,0,0,0.9)`,
              WebkitTextStroke: `1px rgba(0, 0, 0, 0.5)`,
            }}
          >
            {currentRoomData.title}
          </h1>

          {/* Subtitle */}
          <p 
            className="text-sm sm:text-base md:text-lg font-bold text-white mb-2"
            style={{
              textShadow: '0 2px 16px rgba(0, 0, 0, 0.95), 0 4px 30px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 1)',
              letterSpacing: '0.05em',
            }}
          >
            {currentRoomData.subtitle}
          </p>

          {/* Description */}
          <p 
            className="text-xs sm:text-sm md:text-base font-semibold text-white/95 mb-6"
            style={{
              textShadow: '0 2px 16px rgba(0, 0, 0, 0.95), 0 4px 30px rgba(0, 0, 0, 0.9)',
              letterSpacing: '0.02em',
            }}
          >
            {currentRoomData.description}
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate(`/${currentRoomData.id}`)}
            className="px-8 py-3 text-sm md:text-base font-black uppercase tracking-wider rounded-lg transition-all duration-300"
            style={{
              backgroundColor: currentRoomData.color,
              color: '#ffffff',
              boxShadow: `0 0 40px ${currentRoomData.bgColor}, 0 10px 50px rgba(0, 0, 0, 0.6)`,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
            }}
          >
            Enter {currentRoomData.title}
          </button>
        </motion.div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {rooms.map((room, index) => (
          <button
            key={room.id}
            onClick={() => !isTransitioning && changeRoom(index)}
            className="w-3 h-3 rounded-full transition-all duration-300"
            style={{
              backgroundColor: currentRoom === index ? room.color : 'rgba(255, 255, 255, 0.3)',
              boxShadow: currentRoom === index ? `0 0 20px ${room.bgColor}` : 'none',
            }}
            aria-label={`Go to ${room.title}`}
          />
        ))}
      </div>

      {/* Scroll Hint */}
      {currentRoom === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-white/50 text-sm z-20"
        >
          <p className="text-center mb-2 font-semibold" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)' }}>Scroll or use arrow keys</p>
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      )}
    </section>
  );
}

export default HorizontalHero;
