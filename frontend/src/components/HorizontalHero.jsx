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

  useEffect(() => {
    // Notify parent of initial room
    onRoomChange(rooms[0]);
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
          style={{ top: '85px' }}
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
          >
            <source src={room.videoUrl} type="video/mp4" />
          </video>
          
          {/* Dimming Overlay */}
          <div 
            className="absolute inset-0 bg-black"
            style={{
              opacity: 0.3,
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
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 pt-64 md:pt-56">
        <motion.div
          key={currentRoom}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center max-w-4xl"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-8"
          >
            <EsoLogo className="h-20 md:h-28 w-auto mx-auto drop-shadow-2xl" />
          </motion.div>

          {/* Room Title */}
          <h1 
            className="text-6xl md:text-8xl font-bold mb-4 tracking-wider"
            style={{
              color: currentRoomData.color,
              textShadow: `0 0 40px ${currentRoomData.bgColor}, 0 0 80px ${currentRoomData.bgColor}, 0 4px 20px rgba(0,0,0,0.9)`,
            }}
          >
            {currentRoomData.title}
          </h1>

          {/* Subtitle */}
          <p 
            className="text-xl md:text-2xl text-white/90 mb-6"
            style={{
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.95), 0 4px 24px rgba(0, 0, 0, 0.8)',
            }}
          >
            {currentRoomData.subtitle}
          </p>

          {/* Description */}
          <p 
            className="text-lg md:text-xl text-white/70 mb-12"
            style={{
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.95)',
            }}
          >
            {currentRoomData.description}
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate(`/${currentRoomData.id}`)}
            className="px-10 py-4 text-lg font-semibold uppercase tracking-wider rounded-lg transition-all duration-300"
            style={{
              backgroundColor: currentRoomData.color,
              color: '#ffffff',
              boxShadow: `0 0 30px ${currentRoomData.bgColor}, 0 10px 40px rgba(0, 0, 0, 0.5)`,
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
          <p className="text-center mb-2">Scroll or use arrow keys</p>
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      )}
    </section>
  );
}

export default HorizontalHero;
