import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EsoLogo from './EsoLogo';
import '../styles/daggersquare.css';

/**
 * Premium App Tour - UI Guide with Sequential Storytelling
 * Fixed layout with scroll/keyboard-driven frame transitions
 * Tells a cohesive story: Intro → Dark Room → Fantasy Room → Philo Room
 */
function PremiumHero() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Tour steps with narrative flow
  const tourSteps = [
    // Step 0: Intro
    {
      type: 'intro',
      title: 'WELCOME TO YOUR SAFE SPACE',
      subtitle: 'unique peoples home • introverts • deep thinkers • philosophers',
      description: '',
      image: null,
    },
    // Steps 1-8: Dark Room (8 frames)
    {
      type: 'dark',
      room: 'The Dark Room',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      title: 'CONFESSION',
      subtitle: 'the weight you carry',
      description: 'alone at 3 am, thoughts racing',
      frame: 0,
    },
    {
      type: 'dark',
      room: 'The Dark Room',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      title: 'UNDERSTANDING',
      subtitle: 'others feel it too',
      description: "you're not the only one",
      frame: 1,
    },
    {
      type: 'dark',
      room: 'The Dark Room',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      title: 'RELEASE',
      subtitle: 'share your truth',
      description: 'without judgment',
      frame: 2,
    },
    {
      type: 'dark',
      room: 'The Dark Room',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      title: 'CONNECTION',
      subtitle: 'in the shadows',
      description: 'find those who understand',
      frame: 3,
    },
    {
      type: 'dark',
      room: 'The Dark Room',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      title: 'YOUR STORY',
      subtitle: 'matters here',
      description: 'every regret, every mistake',
      frame: 4,
    },
    {
      type: 'dark',
      room: 'The Dark Room',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      title: 'HEALING',
      subtitle: 'through sharing',
      description: 'the burden becomes lighter',
      frame: 5,
    },
    {
      type: 'dark',
      room: 'The Dark Room',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      title: 'ACCEPTANCE',
      subtitle: 'of your past',
      description: 'this is your safe space',
      frame: 6,
    },
    {
      type: 'dark',
      room: 'The Dark Room',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      title: 'RELEASE WHAT WEIGHS ON YOU',
      subtitle: 'the dark room awaits',
      description: 'where shadows find light',
      frame: 7,
      cta: 'Enter the Dark Room',
      ctaPath: '/rooms/dark',
    },
    // Steps 9-16: Fantasy Room (8 frames - placeholders)
    {
      type: 'fantasy',
      room: 'The Fantasy Room',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      title: 'IMAGINATION',
      subtitle: 'your creative spark',
      description: 'the idea that keeps you awake',
      frame: 0,
    },
    {
      type: 'fantasy',
      room: 'The Fantasy Room',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      title: 'DAYDREAMS',
      subtitle: 'that fill your mind',
      description: 'the worlds you create',
      frame: 1,
    },
    {
      type: 'fantasy',
      room: 'The Fantasy Room',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      title: 'EXPRESSION',
      subtitle: 'through art and story',
      description: 'your unique voice',
      frame: 2,
    },
    {
      type: 'fantasy',
      room: 'The Fantasy Room',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      title: 'WONDER',
      subtitle: 'in the impossible',
      description: 'where creativity flows',
      frame: 3,
    },
    {
      type: 'fantasy',
      room: 'The Fantasy Room',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      title: 'JOY',
      subtitle: 'in small things',
      description: 'the beauty you notice',
      frame: 4,
    },
    {
      type: 'fantasy',
      room: 'The Fantasy Room',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      title: 'INSPIRATION',
      subtitle: 'that strikes suddenly',
      description: 'share your vision',
      frame: 5,
    },
    {
      type: 'fantasy',
      room: 'The Fantasy Room',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      title: 'CREATION',
      subtitle: 'from imagination',
      description: 'your ideas take form',
      frame: 6,
    },
    {
      type: 'fantasy',
      room: 'The Fantasy Room',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      title: 'DREAM WITHOUT LIMITS',
      subtitle: 'the fantasy room awaits',
      description: 'where imagination becomes reality',
      frame: 7,
      cta: 'Enter the Fantasy Room',
      ctaPath: '/rooms/fantasy',
    },
    // Steps 17-24: Philo Room (8 frames - placeholders)
    {
      type: 'philo',
      room: 'The Philo Room',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      title: 'QUESTIONS',
      subtitle: 'that haunt you',
      description: 'why are we here?',
      frame: 0,
    },
    {
      type: 'philo',
      room: 'The Philo Room',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      title: 'WONDER',
      subtitle: 'at the cosmos',
      description: 'the universe within',
      frame: 1,
    },
    {
      type: 'philo',
      room: 'The Philo Room',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      title: 'SEEKING',
      subtitle: 'deeper meaning',
      description: 'beyond the surface',
      frame: 2,
    },
    {
      type: 'philo',
      room: 'The Philo Room',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      title: 'CONSPIRACY',
      subtitle: "what if they're right?",
      description: 'question everything',
      frame: 3,
    },
    {
      type: 'philo',
      room: 'The Philo Room',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      title: 'SPIRITUALITY',
      subtitle: 'your own path',
      description: 'beyond religion',
      frame: 4,
    },
    {
      type: 'philo',
      room: 'The Philo Room',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      title: 'EXISTENCE',
      subtitle: 'the big questions',
      description: 'for deep thinkers',
      frame: 5,
    },
    {
      type: 'philo',
      room: 'The Philo Room',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      title: 'TRUTH',
      subtitle: 'your perspective',
      description: 'unique and valid',
      frame: 6,
    },
    {
      type: 'philo',
      room: 'The Philo Room',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      title: 'QUESTION EVERYTHING',
      subtitle: 'the philo room awaits',
      description: 'where minds expand',
      frame: 7,
      cta: 'Enter the Philo Room',
      ctaPath: '/rooms/philo',
    },
  ];

  // All frame images
  const allFrames = [
    // Dark Room frames (8)
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-1_pin8tu.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104156/dark-frame-2_tsxs4x.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104156/dark-frame-3_i3cijk.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-4_ufxpq6.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-5_mwuovr.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-6_zth05y.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-7_sd42ty.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-8_ofgw0r.png',
    // Fantasy Room placeholders (8)
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
    // Philo Room placeholders (8)
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
  ];



  // Preload all images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = allFrames.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = reject;
        });
      });

      try {
        const loadedImages = await Promise.all(imagePromises);
        imagesRef.current = loadedImages;
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error loading tour images:', error);
      }
    };

    loadImages();
  }, []);

  // Navigate to next/previous step
  const goToStep = (direction) => {
    if (isTransitioning) return;
    
    const newStep = currentStep + direction;
    if (newStep >= 0 && newStep < tourSteps.length) {
      setIsTransitioning(true);
      setCurrentStep(newStep);
      
      // Update frame if step has one
      const step = tourSteps[newStep];
      if (step.type !== 'intro' && step.frame !== undefined) {
        const frameOffset = step.type === 'dark' ? 0 : step.type === 'fantasy' ? 8 : 16;
        setCurrentFrame(frameOffset + step.frame);
      }
      
      setTimeout(() => setIsTransitioning(false), 600);
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

  // Scroll/wheel navigation with scroll-through at end
  useEffect(() => {
    let scrollTimeout;
    
    const handleWheel = (e) => {
      // If at last step and scrolling down, allow normal scroll
      if (currentStep === tourSteps.length - 1 && e.deltaY > 0) {
        return; // Let normal scroll happen
      }
      
      // Otherwise handle tour navigation
      e.preventDefault();
      if (isTransitioning) return;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
          goToStep(1);
        } else if (e.deltaY < 0) {
          goToStep(-1);
        }
      }, 100);
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
  }, [currentStep, isTransitioning]);

  // Render current frame to canvas
  useEffect(() => {
    if (!canvasRef.current || !imagesLoaded || currentStep === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[currentFrame];

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
  }, [currentFrame, imagesLoaded, currentStep]);

  const currentStepData = tourSteps[currentStep];

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden" style={{ background: '#000000', fontFamily: "'Dagger Square', serif" }}>
      {/* Background Canvas - Only shown after intro */}
      {currentStep > 0 && (
        <>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: 'cover', zIndex: 1 }}
          />
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.75) 100%)',
              zIndex: 2,
            }}
          />
        </>
      )}

      {/* Fixed Content Layout */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top: Logo */}
        <div className="flex-shrink-0 pt-20 sm:pt-24 pb-6 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <EsoLogo 
              className="h-10 sm:h-14 w-auto mx-auto" 
              style={{ filter: 'drop-shadow(0 0 25px rgba(255, 255, 255, 0.25))' }} 
            />
          </motion.div>
        </div>

        {/* Center: Tour Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
          <div className="text-center max-w-3xl w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                {/* Main Title */}
                <h2
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-5 tracking-tight leading-none"
                  style={{
                    color: '#ffffff',
                    textShadow: currentStepData.color 
                      ? `0 0 60px ${currentStepData.color}30, 0 4px 40px rgba(0, 0, 0, 0.95)`
                      : '0 4px 40px rgba(0, 0, 0, 0.95)',
                    fontFamily: "'Dagger Square', serif",
                    background: currentStepData.color 
                      ? `linear-gradient(135deg, #ffffff 0%, ${currentStepData.color}90 100%)`
                      : 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {currentStepData.title}
                </h2>

                {/* Subtitle */}
                <p
                  className="text-xl sm:text-2xl md:text-3xl font-normal mb-4"
                  style={{
                    color: currentStepData.color || 'rgba(255, 255, 255, 0.9)',
                    textShadow: `0 2px 20px rgba(0, 0, 0, 0.9), 0 0 30px ${currentStepData.color || '#ffffff'}40`,
                    fontFamily: "'Dagger Square', serif",
                  }}
                >
                  {currentStepData.subtitle}
                </p>

                {/* Description - Only show if not empty */}
                {currentStepData.description && (
                  <p
                    className="text-base sm:text-lg md:text-xl font-light mb-10 leading-relaxed"
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      textShadow: '0 2px 15px rgba(0, 0, 0, 0.85)',
                      fontFamily: "'Dagger Square', serif",
                    }}
                  >
                    {currentStepData.description}
                  </p>
                )}

                {/* Step In Button - Always visible for room steps */}
                {currentStep > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    onClick={() => navigate('/login')}
                    className="px-12 py-5 text-sm uppercase tracking-[0.3em] font-bold transition-all duration-300 mt-4"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      border: currentStepData.color 
                        ? `2px solid rgba(${currentStepData.colorRgb}, 0.6)`
                        : '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '10px',
                      backdropFilter: 'blur(20px)',
                      textShadow: '0 2px 15px rgba(0, 0, 0, 0.95)',
                      boxShadow: currentStepData.color
                        ? `0 8px 30px rgba(0, 0, 0, 0.7), 0 0 60px rgba(${currentStepData.colorRgb}, 0.25)`
                        : '0 8px 30px rgba(0, 0, 0, 0.7)',
                      fontFamily: "'Dagger Square', serif",
                    }}
                    onMouseEnter={(e) => {
                      if (currentStepData.color) {
                        e.currentTarget.style.backgroundColor = `rgba(${currentStepData.colorRgb}, 0.2)`;
                        e.currentTarget.style.borderColor = `rgba(${currentStepData.colorRgb}, 0.9)`;
                        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0, 0, 0, 0.8), 0 0 80px rgba(${currentStepData.colorRgb}, 0.4)`;
                      } else {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                      }
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.borderColor = currentStepData.color 
                        ? `rgba(${currentStepData.colorRgb}, 0.6)`
                        : 'rgba(255, 255, 255, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = currentStepData.color
                        ? `0 8px 30px rgba(0, 0, 0, 0.7), 0 0 60px rgba(${currentStepData.colorRgb}, 0.25)`
                        : '0 8px 30px rgba(0, 0, 0, 0.7)';
                    }}
                  >
                    STEP IN
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom: Navigation Hint Only */}
        <div className="flex-shrink-0 pb-10 sm:pb-14 px-4">
          {/* Navigation Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-center text-xs tracking-widest uppercase"
            style={{ 
              color: 'rgba(255, 255, 255, 0.35)',
              fontFamily: "'Dagger Square', serif",
            }}
          >
            {currentStep === 0 ? 'scroll or use arrow keys to begin' : currentStep === tourSteps.length - 1 ? 'scroll down to continue' : 'navigate with ← → or scroll'}
          </motion.div>
        </div>
      </div>

      {/* Loading Overlay */}
      {!imagesLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
          <EsoLogo 
            className="h-16 sm:h-20 w-auto mb-6" 
            style={{ filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.3))' }} 
          />
          <p 
            className="text-sm tracking-widest lowercase" 
            style={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: "'Dagger Square', serif",
            }}
          >
            loading...
          </p>
        </div>
      )}
    </div>
  );
}

export default PremiumHero;
