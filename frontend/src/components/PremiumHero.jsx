import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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

  // Tour steps with videos and minimal content
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
    // Frame 2: Dark Room - Confession
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
    // Frame 3: Dark Room - Understanding
    {
      id: 'dark-understanding',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786358832/frame3vid_1_hjyi09.mp4',
      title: 'UNDERSTANDING',
      subtitle: "you're not alone",
      description: 'shared darkness • connection',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      showButton: true,
      buttonText: 'ENTER THE DARK ROOM',
      buttonPath: '/rooms/dark',
    },
    // Frame 4: Fantasy Room - Daydreaming
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
    // Frame 5: Fantasy Room - Vibes
    {
      id: 'fantasy-vibes',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361396/frame5v_wtvs09.mp4',
      title: 'VIBES',
      subtitle: 'fun • jokes • fantasies',
      description: 'creative energy • music',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      showButton: true,
      buttonText: 'ENTER THE FANTASY ROOM',
      buttonPath: '/rooms/fantasy',
    },
    // Frame 6: Philo Room - Questioning
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
    // Frame 7: Philo Room - Truth
    {
      id: 'philo-truth',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361701/frame7vide_yp9dc4.mp4',
      title: 'TRUTH',
      subtitle: 'conspiracy • unique ideas',
      description: 'cosmic connection • mystery',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      showButton: true,
      buttonText: 'ENTER THE PHILO ROOM',
      buttonPath: '/rooms/philo',
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
      setTimeout(() => setIsTransitioning(false), 800);
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
      }, 150);
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
  }, [currentStep, isTransitioning, tourSteps.length]);

  const currentStepData = tourSteps[currentStep];
  const isWelcome = currentStep === 0;

  return (
    <div 
      ref={containerRef} 
      className="relative h-screen overflow-hidden" 
      style={{ 
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
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentStep ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <source src={step.video} type="video/mp4" />
        </video>
      ))}

      {/* Dark overlay for better text visibility */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: isWelcome
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.6) 100%)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Content Layer */}
      <div className="relative z-30 h-full flex flex-col">
        {/* Top: Logo */}
        <div className="flex-shrink-0 pt-16 sm:pt-20 pb-4 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <EsoLogo 
              className="h-8 sm:h-12 w-auto mx-auto" 
              style={{ filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))' }} 
            />
          </motion.div>
        </div>

        {/* Center: Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
          <div className="text-center max-w-4xl w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Title */}
                <h1
                  className={`font-light tracking-wide leading-none mb-3 ${
                    isWelcome 
                      ? 'text-8xl sm:text-9xl md:text-[10rem]' 
                      : 'text-6xl sm:text-7xl md:text-8xl'
                  }`}
                  style={{
                    color: '#ffffff',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 300,
                    letterSpacing: isWelcome ? '0.15em' : '0.1em',
                    textShadow: currentStepData.color
                      ? `0 0 8px ${currentStepData.color}30, 0 1px 3px rgba(0,0,0,0.7)`
                      : '0 0 8px rgba(255,255,255,0.15), 0 1px 3px rgba(0,0,0,0.7)',
                  }}
                >
                  {currentStepData.title}
                </h1>

                {/* Subtitle */}
                <p
                  className={`font-normal tracking-[0.3em] uppercase mb-2 ${
                    isWelcome ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                  }`}
                  style={{
                    color: currentStepData.color || 'rgba(255, 255, 255, 0.7)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    textShadow: currentStepData.color 
                      ? `0 0 6px ${currentStepData.color}25, 0 1px 2px rgba(0,0,0,0.6)`
                      : '0 0 6px rgba(255, 255, 255, 0.12), 0 1px 2px rgba(0,0,0,0.6)',
                  }}
                >
                  {currentStepData.subtitle}
                </p>

                {/* Description */}
                {currentStepData.description && (
                  <p
                    className="text-xs sm:text-sm font-light tracking-wider leading-relaxed mb-8"
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 300,
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    {currentStepData.description}
                  </p>
                )}

                {/* Button */}
                {currentStepData.showButton && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    onClick={() => navigate(currentStepData.buttonPath)}
                    className="px-8 py-2.5 text-xs uppercase tracking-[0.35em] font-medium transition-all duration-500 mt-4"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      color: currentStepData.color || '#ffffff',
                      border: `1px solid ${currentStepData.color || 'rgba(255, 255, 255, 0.25)'}`,
                      backdropFilter: 'blur(10px)',
                      boxShadow: `0 0 10px ${currentStepData.color}20, 0 2px 5px rgba(0,0,0,0.3)`,
                      fontFamily: 'var(--font-body)',
                      fontWeight: 500,
                      textShadow: `0 0 6px ${currentStepData.color}30`,
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `rgba(${currentStepData.colorRgb}, 0.15)`;
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                      e.currentTarget.style.boxShadow = `0 0 20px ${currentStepData.color}35, 0 4px 10px rgba(0,0,0,0.4)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = `0 0 10px ${currentStepData.color}20, 0 2px 5px rgba(0,0,0,0.3)`;
                    }}
                  >
                    {currentStepData.buttonText}
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom: Progress & Navigation */}
        <div className="flex-shrink-0 pb-8 px-4">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-3">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className="transition-all duration-300 cursor-pointer"
                onClick={() => !isTransitioning && setCurrentStep(index)}
                style={{
                  width: index === currentStep ? '24px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: index === currentStep 
                    ? (currentStepData.color || 'rgba(255, 255, 255, 0.8)')
                    : 'rgba(255, 255, 255, 0.2)',
                  boxShadow: index === currentStep && currentStepData.color
                    ? `0 0 8px ${currentStepData.color}40`
                    : 'none',
                }}
              />
            ))}
          </div>

          {/* Navigation hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-center text-xs tracking-[0.3em] uppercase"
            style={{ 
              color: 'rgba(255, 255, 255, 0.2)',
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
            }}
          >
            {currentStep === 0 
              ? 'scroll or use arrow keys to explore' 
              : currentStep === tourSteps.length - 1 
                ? 'scroll down to continue' 
                : 'navigate with ← → or scroll'}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

export default PremiumHero;
