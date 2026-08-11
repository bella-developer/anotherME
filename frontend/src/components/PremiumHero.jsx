import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import EsoLogo from './EsoLogo';

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

  // Tour steps with videos - CONSISTENT CENTER ALIGNMENT
  const tourSteps = [
    // Frame 1: Welcome
    {
      id: 'welcome',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786352472/frame1vid_oububm.mp4',
      title: 'ESO',
      subtitle: 'your safe space to breathe',
      description: '',
      showButton: false,
    },
    // Frame 2: Dark - Confession
    {
      id: 'dark-confession',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786357230/frae2video_qmhpf7.mp4',
      title: 'CONFESSION',
      subtitle: 'release what weighs on you',
      description: 'dark stories • secrets • regrets',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      showButton: false,
    },
    // Frame 3: Dark - Understanding
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
    },
    // Frame 4: Fantasy - Daydreaming
    {
      id: 'fantasy-daydream',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361397/frame4videoo_hizhue.mp4',
      title: 'IMAGINATION',
      subtitle: 'where creativity flows',
      description: 'daydreams • artistic ideas',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      showButton: false,
    },
    // Frame 5: Fantasy - Vibes
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
    },
    // Frame 6: Philo - Questioning
    {
      id: 'philo-questioning',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361397/frame6v_ijhpzm.mp4',
      title: 'QUESTIONING',
      subtitle: 'the big questions',
      description: 'philosophy • spirituality',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      showButton: false,
    },
    // Frame 7: Philo - Truth
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

  return (
    <div 
      ref={containerRef} 
      className="relative overflow-hidden" 
      style={{ 
        minHeight: '100vh',
        paddingTop: '3.5rem', // Match navbar height
        background: '#000000',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Video Backgrounds - Using contain to prevent cropping */}
      {tourSteps.map((step, index) => (
        <div
          key={step.id}
          className={`absolute inset-0 w-full h-full transition-opacity ${
            isMobile ? 'duration-500' : 'duration-1000'
          } ${index === currentStep ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          style={{
            backgroundColor: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <video
            id={`video-${index}`}
            autoPlay={index === 0}
            loop
            muted
            playsInline
            className="w-full h-full"
            style={{
              // Use contain on mobile to show full video, cover on desktop for immersion
              objectFit: isMobile ? 'contain' : 'cover',
              objectPosition: 'center center',
              willChange: 'opacity',
            }}
          >
            <source src={step.video} type="video/mp4" />
          </video>
        </div>
      ))}

      {/* Dark overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Content Layer - CONSISTENT CENTER ALIGNMENT */}
      <div className="relative z-30 min-h-screen flex flex-col items-center justify-center py-12 md:py-20 px-4 sm:px-6">
        {/* Content */}
        <div className="flex-1 flex items-center justify-center w-full max-w-4xl mx-auto">
          <div className="w-full text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: isMobile ? 0.4 : 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Title - Logo for welcome, text for others */}
                {isWelcome ? (
                  <motion.div 
                    className="flex justify-center mb-4"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <EsoLogo className="h-20 sm:h-24 md:h-28 lg:h-32 w-auto" style={{
                      filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.3))',
                    }} />
                  </motion.div>
                ) : (
                  <h1
                    className="font-light tracking-wider leading-none mb-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                    style={{
                      color: '#ffffff',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 300,
                      letterSpacing: '0.15em',
                      textShadow: currentStepData.color
                        ? `0 0 20px ${currentStepData.color}60, 0 3px 12px rgba(0,0,0,0.9)`
                        : '0 0 20px rgba(255,255,255,0.4), 0 3px 12px rgba(0,0,0,0.9)',
                    }}
                  >
                    {currentStepData.title}
                  </h1>
                )}

                {/* Subtitle */}
                <p
                  className={`font-normal tracking-[0.35em] uppercase mb-2 ${
                    isWelcome ? 'text-sm sm:text-base md:text-lg' : 'text-xs sm:text-sm md:text-base'
                  }`}
                  style={{
                    color: currentStepData.color || 'rgba(255, 255, 255, 0.85)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    textShadow: currentStepData.color 
                      ? `0 0 10px ${currentStepData.color}40, 0 1px 4px rgba(0,0,0,0.8)`
                      : '0 0 10px rgba(255, 255, 255, 0.2), 0 1px 4px rgba(0,0,0,0.8)',
                  }}
                >
                  {currentStepData.subtitle}
                </p>

                {/* Description */}
                {currentStepData.description && (
                  <p
                    className="text-sm sm:text-base md:text-lg font-light tracking-wide leading-relaxed mb-6"
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 300,
                      textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                    }}
                  >
                    {currentStepData.description}
                  </p>
                )}

                {/* Button - Compact and visually appealing */}
                {currentStepData.showButton && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    onClick={() => navigate('/login')}
                    className="px-8 py-3 text-xs sm:text-sm uppercase tracking-[0.3em] font-medium transition-all duration-300 mt-6 min-h-[44px] rounded-sm inline-flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: currentStepData.color || '#ffffff',
                      border: `2px solid ${currentStepData.color || 'rgba(255, 255, 255, 0.3)'}`,
                      backdropFilter: 'blur(20px)',
                      boxShadow: `0 0 20px ${currentStepData.color}30, 0 4px 12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.15)`,
                      fontFamily: 'var(--font-body)',
                      fontWeight: 500,
                      textShadow: `0 0 10px ${currentStepData.color}50, 0 1px 2px rgba(0,0,0,0.8)`,
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `rgba(${currentStepData.colorRgb}, 0.3)`;
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                      e.currentTarget.style.boxShadow = `0 0 30px ${currentStepData.color}50, 0 6px 16px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.2)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = `0 0 20px ${currentStepData.color}30, 0 4px 12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.15)`;
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
        <div className="flex-shrink-0 pb-8 px-4 flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-col items-center gap-2"
          >
            <p
              className="text-xs tracking-[0.35em] uppercase"
              style={{ 
                color: 'rgba(255, 255, 255, 0.4)',
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
              }}
            >
              {currentStep === tourSteps.length - 1 ? 'continue' : 'scroll'}
            </p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown 
                size={24} 
                style={{ 
                  color: 'rgba(255, 255, 255, 0.4)',
                  filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.2))'
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
