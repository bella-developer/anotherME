import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EsoLogo from './EsoLogo';

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
      title: 'Welcome',
      subtitle: 'To your sanctuary',
      description: 'A space for the quiet ones. The deep thinkers. The misunderstood.',
      image: null,
    },
    // Steps 1-8: Dark Room (8 frames)
    {
      type: 'dark',
      room: 'The Dark Room',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      title: 'Confession',
      subtitle: 'The weight you carry',
      description: 'Alone at 3 AM, thoughts racing',
      frame: 0,
    },
    {
      type: 'dark',
      room: 'The Dark Room',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      title: 'Understanding',
      subtitle: 'Others feel it too',
      description: 'You\'re not the only one',
      frame: 1,
    },
    {
      type: 'dark',
      room: 'The Dark Room',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      title: 'Release',
      subtitle: 'Share your truth',
      description: 'Without judgment',
      frame: 2,
    },
    {
      type: 'dark',
      room: 'The Dark Room',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      title: 'Connection',
      subtitle: 'In the shadows',
      description: 'Find those who understand',
      frame: 3,
    },
    {
      type: 'dark',
      room: 'The Dark Room',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      title: 'Your story',
      subtitle: 'Matters here',
      description: 'Every regret, every mistake',
      frame: 4,
    },
    {
      type: 'dark',
      room: 'The Dark Room',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      title: 'Healing',
      subtitle: 'Through sharing',
      description: 'The burden becomes lighter',
      frame: 5,
    },
    {
      type: 'dark',
      room: 'The Dark Room',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      title: 'Acceptance',
      subtitle: 'Of your past',
      description: 'This is your safe space',
      frame: 6,
    },
    {
      type: 'dark',
      room: 'The Dark Room',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      title: 'Release what weighs on you',
      subtitle: 'The Dark Room awaits',
      description: 'Where shadows find light',
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
      title: 'Imagination',
      subtitle: 'Your creative spark',
      description: 'The idea that keeps you awake',
      frame: 0,
    },
    {
      type: 'fantasy',
      room: 'The Fantasy Room',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      title: 'Daydreams',
      subtitle: 'That fill your mind',
      description: 'The worlds you create',
      frame: 1,
    },
    {
      type: 'fantasy',
      room: 'The Fantasy Room',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      title: 'Expression',
      subtitle: 'Through art and story',
      description: 'Your unique voice',
      frame: 2,
    },
    {
      type: 'fantasy',
      room: 'The Fantasy Room',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      title: 'Wonder',
      subtitle: 'In the impossible',
      description: 'Where creativity flows',
      frame: 3,
    },
    {
      type: 'fantasy',
      room: 'The Fantasy Room',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      title: 'Joy',
      subtitle: 'In small things',
      description: 'The beauty you notice',
      frame: 4,
    },
    {
      type: 'fantasy',
      room: 'The Fantasy Room',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      title: 'Inspiration',
      subtitle: 'That strikes suddenly',
      description: 'Share your vision',
      frame: 5,
    },
    {
      type: 'fantasy',
      room: 'The Fantasy Room',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      title: 'Creation',
      subtitle: 'From imagination',
      description: 'Your ideas take form',
      frame: 6,
    },
    {
      type: 'fantasy',
      room: 'The Fantasy Room',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      title: 'Dream without limits',
      subtitle: 'The Fantasy Room awaits',
      description: 'Where imagination becomes reality',
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
      title: 'Questions',
      subtitle: 'That haunt you',
      description: 'Why are we here?',
      frame: 0,
    },
    {
      type: 'philo',
      room: 'The Philo Room',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      title: 'Wonder',
      subtitle: 'At the cosmos',
      description: 'The universe within',
      frame: 1,
    },
    {
      type: 'philo',
      room: 'The Philo Room',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      title: 'Seeking',
      subtitle: 'Deeper meaning',
      description: 'Beyond the surface',
      frame: 2,
    },
    {
      type: 'philo',
      room: 'The Philo Room',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      title: 'Conspiracy',
      subtitle: 'What if they\'re right?',
      description: 'Question everything',
      frame: 3,
    },
    {
      type: 'philo',
      room: 'The Philo Room',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      title: 'Spirituality',
      subtitle: 'Your own path',
      description: 'Beyond religion',
      frame: 4,
    },
    {
      type: 'philo',
      room: 'The Philo Room',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      title: 'Existence',
      subtitle: 'The big questions',
      description: 'For deep thinkers',
      frame: 5,
    },
    {
      type: 'philo',
      room: 'The Philo Room',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      title: 'Truth',
      subtitle: 'Your perspective',
      description: 'Unique and valid',
      frame: 6,
    },
    {
      type: 'philo',
      room: 'The Philo Room',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      title: 'Question everything',
      subtitle: 'The Philo Room awaits',
      description: 'Where minds expand',
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

  // Scroll/wheel navigation
  useEffect(() => {
    let scrollTimeout;
    
    const handleWheel = (e) => {
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
  const progress = ((currentStep + 1) / tourSteps.length) * 100;



  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden" style={{ background: '#000000' }}>
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
                {/* Room Label (for room steps) */}
                {currentStepData.room && (
                  <div 
                    className="text-xs sm:text-sm tracking-[0.4em] uppercase font-bold mb-4"
                    style={{
                      color: currentStepData.color,
                      textShadow: `0 0 30px ${currentStepData.color}70, 0 2px 15px rgba(0, 0, 0, 0.9)`,
                    }}
                  >
                    {currentStepData.room}
                  </div>
                )}

                {/* Main Title */}
                <h2
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight mb-5 tracking-tight leading-none"
                  style={{
                    color: '#ffffff',
                    textShadow: currentStepData.color 
                      ? `0 0 60px ${currentStepData.color}30, 0 4px 40px rgba(0, 0, 0, 0.95)`
                      : '0 4px 40px rgba(0, 0, 0, 0.95)',
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {currentStepData.title}
                </h2>

                {/* Subtitle */}
                <p
                  className="text-xl sm:text-2xl md:text-3xl font-light mb-4"
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    textShadow: '0 2px 20px rgba(0, 0, 0, 0.9)',
                  }}
                >
                  {currentStepData.subtitle}
                </p>

                {/* Description */}
                <p
                  className="text-base sm:text-lg md:text-xl font-light mb-10 leading-relaxed"
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textShadow: '0 2px 15px rgba(0, 0, 0, 0.85)',
                  }}
                >
                  {currentStepData.description}
                </p>

                {/* CTA Button (for final step of each room) */}
                {currentStepData.cta && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    onClick={() => navigate(currentStepData.ctaPath)}
                    className="px-12 py-5 text-sm uppercase tracking-[0.3em] font-bold transition-all duration-300"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      border: `2px solid rgba(${currentStepData.colorRgb}, 0.6)`,
                      borderRadius: '10px',
                      backdropFilter: 'blur(20px)',
                      textShadow: '0 2px 15px rgba(0, 0, 0, 0.95)',
                      boxShadow: `0 8px 30px rgba(0, 0, 0, 0.7), 0 0 60px rgba(${currentStepData.colorRgb}, 0.25)`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `rgba(${currentStepData.colorRgb}, 0.2)`;
                      e.currentTarget.style.borderColor = `rgba(${currentStepData.colorRgb}, 0.9)`;
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)`;
                      e.currentTarget.style.boxShadow = `0 12px 40px rgba(0, 0, 0, 0.8), 0 0 80px rgba(${currentStepData.colorRgb}, 0.4)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.borderColor = `rgba(${currentStepData.colorRgb}, 0.6)`;
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = `0 8px 30px rgba(0, 0, 0, 0.7), 0 0 60px rgba(${currentStepData.colorRgb}, 0.25)`;
                    }}
                  >
                    {currentStepData.cta}
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom: Progress & Navigation */}
        <div className="flex-shrink-0 pb-10 sm:pb-14 px-4">
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-6">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white/40"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="mt-3 text-center text-xs tracking-widest" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              {currentStep + 1} / {tourSteps.length}
            </div>
          </div>

          {/* Navigation Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-center text-xs tracking-widest uppercase"
            style={{ color: 'rgba(255, 255, 255, 0.35)' }}
          >
            {currentStep === 0 ? 'Scroll or use arrow keys to begin' : 'Navigate with ← → or scroll'}
          </motion.div>
        </div>
      </div>

      {/* Loading Overlay */}
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
          <div className="text-center">
            <div
              className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-4 mx-auto"
              style={{
                borderColor: '#2EE6FF',
                borderTopColor: 'transparent',
              }}
            />
            <p className="text-sm tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Loading your sanctuary...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PremiumHero;
