import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

/**
 * Premium Cinematic Hero - Video-Based UI Tour
 * 7 Sequential video frames with scroll/keyboard navigation
 * Welcome → Dark Room (2) → Fantasy Room (2) → Philo Room (2)
 */
function PremiumHero() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Tour steps with videos, minimal content, and positioning
  const tourSteps = [
    // Frame 1: Welcome - text on right (character on left)
    {
      id: 'welcome',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786352472/frame1vid_oububm.mp4',
      title: 'ESO',
      subtitle: 'your safe space to breathe',
      description: '',
      showButton: false,
      textAlign: 'right',
      textPosition: 'right',
    },
    // Frame 2: Dark - Confession - text on left (character on right)
    {
      id: 'dark-confession',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786357230/frae2video_qmhpf7.mp4',
      title: 'CONFESSION',
      subtitle: 'release what weighs on you',
      description: 'dark stories • secrets • regrets',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      showButton: false,
      textAlign: 'left',
      textPosition: 'left',
    },
    // Frame 3: Dark - Understanding - text on center (characters scattered)
    {
      id: 'dark-understanding',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786358832/frame3vid_1_hjyi09.mp4',
      title: 'UNDERSTANDING',
      subtitle: "you're not alone",
      description: 'shared darkness • connection',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      showButton: true,
      buttonText: 'step in',
      textAlign: 'center',
      textPosition: 'center',
    },
    // Frame 4: Fantasy - Daydreaming - text on right (character on left)
    {
      id: 'fantasy-daydream',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361397/frame4videoo_hizhue.mp4',
      title: 'IMAGINATION',
      subtitle: 'where creativity flows',
      description: 'daydreams • artistic ideas',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      showButton: false,
      textAlign: 'right',
      textPosition: 'right',
    },
    // Frame 5: Fantasy - Vibes - text on right (character on left-center)
    {
      id: 'fantasy-vibes',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361396/frame5v_wtvs09.mp4',
      title: 'VIBES',
      subtitle: 'fun • jokes • fantasies',
      description: 'creative energy • music',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      showButton: true,
      buttonText: 'step in',
      textAlign: 'right',
      textPosition: 'right',
    },
    // Frame 6: Philo - Questioning - text on right (bookshelf on left)
    {
      id: 'philo-questioning',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361397/frame6v_ijhpzm.mp4',
      title: 'QUESTIONING',
      subtitle: 'the big questions',
      description: 'philosophy • spirituality',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      showButton: false,
      textAlign: 'right',
      textPosition: 'right',
    },
    // Frame 7: Philo - Truth - text on center (character bottom-left)
    {
      id: 'philo-truth',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361701/frame7vide_yp9dc4.mp4',
      title: 'TRUTH',
      subtitle: 'conspiracy • unique ideas',
      description: 'cosmic connection • mystery',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      showButton: true,
      buttonText: 'step in',
      textAlign: 'center',
      textPosition: 'center',
    },
  ];

  // Preload videos
  useEffect(() => {
    tourSteps.forEach((step, index) => {
      const video = document.createElement('video');
      video.src = step.video;
      video.preload = 'auto';
      videoRefs.current[index] = video;
    });
  }, []);

  // Play current video
  useEffect(() => {
    const currentVideo = document.querySelector(`#video-${currentStep}`);
    if (currentVideo) {
      currentVideo.play().catch(err => console.log('Video play error:', err));
    }
  }, [currentStep]);

  // Navigate to next/previous step
  const goToStep = (direction) => {
    if (isTransitioning) return;
    
    const newStep = currentStep + direction;
    if (newStep >= 0 && newStep < tourSteps.length) {
      setIsTransitioning(true);
      setCurrentStep(newStep);
      // Faster transition on mobile
      setTimeout(() => setIsTransitioning(false), isMobile ? 400 : 800);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToStep(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToStep(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isTransitioning]);

  // Scroll navigation with scroll-through at end
  useEffect(() => {
    let scrollTimeout;
    
    const handleWheel = (e) => {
      // If at last step and scrolling down, allow normal scroll
      if (currentStep === tourSteps.length - 1 && e.deltaY > 0) {
        return;
      }
      
      e.preventDefault();
      if (isTransitioning) return;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
          goToStep(1);
        } else if (e.deltaY < 0) {
          goToStep(-1);
        }
      }, isMobile ? 50 : 150); // Faster on mobile
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
  }, [currentStep, isTransitioning, tourSteps.length, isMobile]);

  // Touch swipe for mobile
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
          goToStep(1); // Swipe up = next
        } else {
          goToStep(-1); // Swipe down = previous
        }
      }
    };

    const container = containerRef.current;
    if (container && isMobile) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [currentStep, isTransitioning, isMobile]);

  const currentStepData = tourSteps[currentStep];
  const isWelcome = currentStep === 0;

  // Get positioning classes - always position text on right
  const getPositionClasses = () => {
    return 'items-end justify-end pr-8 md:pr-16 lg:pr-24';
  };

  return (
    <div 
      ref={containerRef} 
      className="relative overflow-hidden" 
      style={{ 
        height: '100vh',
        marginTop: '3rem', // Reduced from 4rem to match smaller navbar
        background: '#000000',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Video Backgrounds */}
      {tourSteps.map((step, index) => (
        <video
          key={step.id}
          id={`video-${index}`}
          autoPlay={index === 0}
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full transition-opacity ${
            isMobile ? 'duration-500' : 'duration-1000'
          } ${index === currentStep ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          style={{
            objectFit: isMobile ? 'contain' : 'cover', // contain on mobile to prevent crop, cover on desktop
            objectPosition: 'center center',
          }}
        >
          <source src={step.video} type="video/mp4" />
        </video>
      ))}

      {/* Dark overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Content Layer */}
      <div className="relative z-30 h-full flex flex-col items-center justify-center">
        {/* Center: Content */}
        <div className="flex-1 flex items-center justify-center w-full px-4 sm:px-6">
          <div className="w-full max-w-3xl text-center sm:text-right sm:ml-auto lg:mr-6 xl:mr-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: isMobile ? 0.4 : 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Title */}
                <h1
                  className={`font-light tracking-wider leading-none mb-2 sm:mb-3 ${
                    isWelcome 
                      ? 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl' 
                      : 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl'
                  }`}
                  style={{
                    color: '#ffffff',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 300,
                    letterSpacing: isWelcome ? '0.2em' : '0.15em',
                    textShadow: currentStepData.color
                      ? `0 0 12px ${currentStepData.color}40, 0 2px 6px rgba(0,0,0,0.8)`
                      : '0 0 12px rgba(255,255,255,0.2), 0 2px 6px rgba(0,0,0,0.8)',
                  }}
                >
                  {currentStepData.title}
                </h1>

                {/* Subtitle */}
                <p
                  className={`font-normal tracking-[0.35em] uppercase mb-1 sm:mb-2 ${
                    isWelcome ? 'text-xs sm:text-sm md:text-base lg:text-lg' : 'text-[10px] sm:text-xs md:text-sm lg:text-base'
                  }`}
                  style={{
                    color: currentStepData.color || 'rgba(255, 255, 255, 0.75)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    textShadow: currentStepData.color 
                      ? `0 0 8px ${currentStepData.color}30, 0 1px 3px rgba(0,0,0,0.7)`
                      : '0 0 8px rgba(255, 255, 255, 0.15), 0 1px 3px rgba(0,0,0,0.7)',
                  }}
                >
                  {currentStepData.subtitle}
                </p>

                {/* Description */}
                {currentStepData.description && (
                  <p
                    className="text-xs sm:text-sm md:text-base font-light tracking-wide leading-relaxed mb-4 sm:mb-6"
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 300,
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)',
                    }}
                  >
                    {currentStepData.description}
                  </p>
                )}

                {/* Button */}
                {currentStepData.showButton && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    onClick={() => navigate('/login')}
                    className="px-6 sm:px-8 py-2 text-xs sm:text-sm uppercase tracking-[0.4em] font-medium transition-all duration-300 mt-2 sm:mt-3"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      color: currentStepData.color || '#ffffff',
                      border: `1px solid ${currentStepData.color || 'rgba(255, 255, 255, 0.3)'}`,
                      backdropFilter: 'blur(12px)',
                      boxShadow: `0 0 15px ${currentStepData.color}25, 0 2px 8px rgba(0,0,0,0.4)`,
                      fontFamily: 'var(--font-body)',
                      fontWeight: 500,
                      textShadow: `0 0 8px ${currentStepData.color}40`,
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `rgba(${currentStepData.colorRgb}, 0.2)`;
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                      e.currentTarget.style.boxShadow = `0 0 25px ${currentStepData.color}40, 0 4px 12px rgba(0,0,0,0.5)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = `0 0 15px ${currentStepData.color}25, 0 2px 8px rgba(0,0,0,0.4)`;
                    }}
                  >
                    {currentStepData.buttonText}
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom: Scroll indicator */}
        <div className="flex-shrink-0 pb-6 sm:pb-8 px-4 flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-col items-center gap-2"
          >
            <p
              className="text-xs tracking-[0.35em] uppercase"
              style={{ 
                color: 'rgba(255, 255, 255, 0.25)',
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
              }}
            >
              {currentStep === tourSteps.length - 1 ? 'continue' : 'scroll'}
            </p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown 
                size={20} 
                style={{ 
                  color: 'rgba(255, 255, 255, 0.25)',
                  filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.15))'
                }} 
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default PremiumHero;
