import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EsoLogo from './EsoLogo';

/**
 * Premium Scroll-Based Hero - Complete App Tour
 * Fixed layout with dynamic background frames
 * Keyboard navigation support
 */
function PremiumHero() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentFrame, setCurrentFrame] = useState([0, 0, 0]);
  const canvasRefs = useRef([]);
  const imagesRefs = useRef([[], [], []]);
  const [imagesLoaded, setImagesLoaded] = useState([false, false, false]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Three room configurations
  const rooms = [
    {
      id: 'dark',
      name: 'The Dark Room',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      headline: 'Release what weighs on you',
      subheadline: 'Your confessions. Your regrets. Your truth.',
      description: 'A sanctuary for the unspoken. Share your mistakes, your dark secrets, the weight you carry alone. Here, judgment fades into understanding.',
      cta: 'Enter the Dark Room',
      frames: [
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-1_pin8tu.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104156/dark-frame-2_tsxs4x.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104156/dark-frame-3_i3cijk.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-4_ufxpq6.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-5_mwuovr.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-6_zth05y.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-7_sd42ty.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-8_ofgw0r.png',
      ]
    },
    {
      id: 'fantasy',
      name: 'The Fantasy Room',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      headline: 'Dream without limits',
      subheadline: 'Your ideas. Your fantasies. Your visions.',
      description: 'Where imagination runs wild. Share your daydreams, creative sparks, wild ideas, and the stories only you can tell. This is where joy lives.',
      cta: 'Enter the Fantasy Room',
      frames: [
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
      ]
    },
    {
      id: 'philo',
      name: 'The Philo Room',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      headline: 'Question everything',
      subheadline: 'Your philosophy. Your spirituality. Your truth.',
      description: 'For deep thinkers and cosmic wanderers. Explore conspiracies, spirituality, existential questions, and ideas that challenge the ordinary. Think freely.',
      cta: 'Enter the Philo Room',
      frames: [
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
      ]
    }
  ];


  // Preload images for all sections
  useEffect(() => {
    rooms.forEach((room, sectionIndex) => {
      const loadImages = async () => {
        const imagePromises = room.frames.map((src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = reject;
          });
        });

        try {
          const loadedImages = await Promise.all(imagePromises);
          imagesRefs.current[sectionIndex] = loadedImages;
          setImagesLoaded(prev => {
            const newState = [...prev];
            newState[sectionIndex] = true;
            return newState;
          });
        } catch (error) {
          console.error(`Error loading ${room.name} images:`, error);
        }
      };

      loadImages();
    });
  }, []);

  // Navigate to next/previous section
  const goToSection = (direction) => {
    if (isTransitioning) return;
    
    const newSection = currentSection + direction;
    if (newSection >= 0 && newSection < rooms.length) {
      setIsTransitioning(true);
      setCurrentSection(newSection);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToSection(1); // Forward
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToSection(-1); // Backward
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, isTransitioning]);

  // Scroll/wheel navigation
  useEffect(() => {
    let scrollTimeout;
    
    const handleWheel = (e) => {
      if (isTransitioning) {
        e.preventDefault();
        return;
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
          goToSection(1); // Scroll down = forward
        } else if (e.deltaY < 0) {
          goToSection(-1); // Scroll up = backward
        }
      }, 50);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      clearTimeout(scrollTimeout);
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentSection, isTransitioning]);

  // Animate frames within current section based on time or interaction
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setCurrentFrame(prev => {
        const newFrames = [...prev];
        const maxFrame = rooms[currentSection].frames.length - 1;
        newFrames[currentSection] = (newFrames[currentSection] + 1) % (maxFrame + 1);
        return newFrames;
      });
    }, 600); // Change frame every 600ms

    return () => clearInterval(frameInterval);
  }, [currentSection]);

  // Render frame to canvas
  useEffect(() => {
    rooms.forEach((room, sectionIndex) => {
      const canvas = canvasRefs.current[sectionIndex];
      const images = imagesRefs.current[sectionIndex];
      
      if (!canvas || !images || images.length === 0 || !imagesLoaded[sectionIndex]) return;

      const ctx = canvas.getContext('2d');
      const frameIndex = currentFrame[sectionIndex];
      const img = images[frameIndex];

      if (!img) return;

      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      const canvasAspect = rect.width / rect.height;
      const imgAspect = img.width / img.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgAspect > canvasAspect) {
        drawHeight = rect.height;
        drawWidth = drawHeight * imgAspect;
        offsetX = (rect.width - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = rect.width;
        drawHeight = drawWidth / imgAspect;
        offsetX = 0;
        offsetY = (rect.height - drawHeight) / 2;
      }

      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    });
  }, [currentFrame, imagesLoaded]);

  const currentRoom = rooms[currentSection];


  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden" style={{ background: '#000000' }}>
      {/* Background Canvases - All rooms layered */}
      {rooms.map((room, index) => (
        <canvas
          key={room.id}
          ref={el => canvasRefs.current[index] = el}
          className="absolute inset-0 w-full h-full transition-opacity duration-700"
          style={{ 
            objectFit: 'cover',
            opacity: currentSection === index ? 1 : 0,
            zIndex: 1,
          }}
        />
      ))}

      {/* Gradient overlay for text readability */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.7) 100%)',
          zIndex: 2,
        }}
      />

      {/* Fixed Content Layout */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top: Logo & Intro */}
        <div className="flex-shrink-0 pt-20 sm:pt-24 pb-8 px-4 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <EsoLogo 
              className="h-12 sm:h-16 w-auto mx-auto mb-6" 
              style={{ filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.2))' }} 
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-sm sm:text-base font-light"
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
            }}
          >
            A sanctuary for introverts, philosophers, dreamers, and deep souls
          </motion.p>
        </div>

        {/* Center: Dynamic Room Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
          <div className="text-center max-w-4xl w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                {/* Room Label */}
                <div 
                  className="text-xs sm:text-sm tracking-[0.4em] uppercase font-bold mb-4 sm:mb-6"
                  style={{
                    color: currentRoom.color,
                    textShadow: `0 0 25px ${currentRoom.color}60, 0 2px 12px rgba(0, 0, 0, 0.9)`,
                  }}
                >
                  {currentRoom.name}
                </div>

                {/* Headline */}
                <h2
                  className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight mb-4 sm:mb-6 tracking-tight leading-none"
                  style={{
                    color: '#ffffff',
                    textShadow: `0 0 50px ${currentRoom.color}25, 0 4px 35px rgba(0, 0, 0, 0.95)`,
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {currentRoom.headline}
                </h2>

                {/* Subheadline */}
                <p
                  className="text-lg sm:text-2xl md:text-3xl font-light mb-4 sm:mb-6"
                  style={{
                    color: 'rgba(255, 255, 255, 0.95)',
                    textShadow: '0 2px 18px rgba(0, 0, 0, 0.9)',
                  }}
                >
                  {currentRoom.subheadline}
                </p>

                {/* Description */}
                <p
                  className="text-sm sm:text-base md:text-lg font-light mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textShadow: '0 2px 12px rgba(0, 0, 0, 0.8)',
                  }}
                >
                  {currentRoom.description}
                </p>

                {/* CTA Button */}
                <button
                  onClick={() => navigate(`/rooms/${currentRoom.id}`)}
                  className="px-10 py-4 text-sm uppercase tracking-[0.25em] font-bold transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    border: `2px solid rgba(${currentRoom.colorRgb}, 0.5)`,
                    borderRadius: '8px',
                    backdropFilter: 'blur(16px)',
                    textShadow: '0 2px 12px rgba(0, 0, 0, 0.9)',
                    boxShadow: `0 6px 25px rgba(0, 0, 0, 0.6), 0 0 50px rgba(${currentRoom.colorRgb}, 0.2)`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `rgba(${currentRoom.colorRgb}, 0.18)`;
                    e.currentTarget.style.borderColor = `rgba(${currentRoom.colorRgb}, 0.8)`;
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                    e.currentTarget.style.boxShadow = `0 8px 35px rgba(0, 0, 0, 0.7), 0 0 70px rgba(${currentRoom.colorRgb}, 0.35)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = `rgba(${currentRoom.colorRgb}, 0.5)`;
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = `0 6px 25px rgba(0, 0, 0, 0.6), 0 0 50px rgba(${currentRoom.colorRgb}, 0.2)`;
                  }}
                >
                  {currentRoom.cta}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom: Navigation Indicators */}
        <div className="flex-shrink-0 pb-12 sm:pb-16 px-4 sm:px-8">
          <div className="flex justify-center items-center gap-6">
            {/* Navigation dots */}
            {rooms.map((room, index) => (
              <button
                key={room.id}
                onClick={() => {
                  if (!isTransitioning && index !== currentSection) {
                    setIsTransitioning(true);
                    setCurrentSection(index);
                    setTimeout(() => setIsTransitioning(false), 800);
                  }
                }}
                className="transition-all duration-300"
                style={{
                  width: currentSection === index ? '40px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  backgroundColor: currentSection === index 
                    ? room.color 
                    : 'rgba(255, 255, 255, 0.25)',
                  boxShadow: currentSection === index 
                    ? `0 0 20px ${room.color}80`
                    : 'none',
                }}
                aria-label={`Go to ${room.name}`}
              />
            ))}
          </div>

          {/* Keyboard hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-center mt-6 text-xs tracking-widest uppercase"
            style={{ color: 'rgba(255, 255, 255, 0.4)' }}
          >
            Use ← → or scroll to navigate
          </motion.div>
        </div>
      </div>

      {/* Loading states */}
      {!imagesLoaded[currentSection] && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
          <div className="text-center">
            <div
              className="w-14 h-14 border-4 border-t-transparent rounded-full animate-spin mb-4 mx-auto"
              style={{
                borderColor: currentRoom.color,
                borderTopColor: 'transparent',
              }}
            />
            <p className="text-sm tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Loading {currentRoom.name}...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PremiumHero;
