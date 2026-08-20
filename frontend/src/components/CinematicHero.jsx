import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EsoLogo from './EsoLogo';

/**
 * Cinematic Hero - Premium Museum Gallery
 * Fixes all 50 UI/UX problems with museum-quality design
 */
function CinematicHero() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [currentFrame, setCurrentFrame] = useState(4);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const frames = [
    {
      id: 'welcome',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521558/fram1desktop_emb84g.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521557/frame1mobile_efrsvf.mp4',
      title: 'THE MEMORY PALACE',
      subtitle: 'Enter rooms filled with',
      description: 'memories and meaning.',
    },
    {
      id: 'dark-confession',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786357230/frae2video_qmhpf7.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521557/frame2mob_pgzsnn.mp4',
      title: 'CONFESSION',
      subtitle: 'Release what weighs',
      description: 'on your soul.',
    },
    {
      id: 'dark-understanding',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786358832/frame3vid_1_hjyi09.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521554/frame3mob_h9pzrp.mp4',
      title: 'UNDERSTANDING',
      subtitle: "You're not alone",
      description: 'in the darkness.',
    },
    {
      id: 'fantasy-daydream',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361397/frame4videoo_hizhue.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521551/frame4mob_ox4nlo.mp4',
      title: 'IMAGINATION',
      subtitle: 'Where creativity',
      description: 'flows freely.',
    },
    {
      id: 'fantasy-vibes',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361396/frame5v_wtvs09.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521549/frame5mob_q1ynbk.mp4',
      title: 'VIBES',
      subtitle: 'Fun, jokes,',
      description: 'and fantasies.',
    },
    {
      id: 'philo-questioning',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361397/frame6v_ijhpzm.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521551/frame6mob_xjoxtz.mp4',
      title: 'QUESTIONING',
      subtitle: 'Explore the big',
      description: 'questions of life.',
    },
    {
      id: 'philo-truth',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361701/frame7vide_yp9dc4.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521556/frame7mob_ovz0to.mp4',
      title: 'TRUTH',
      subtitle: 'Conspiracy, mystery,',
      description: 'cosmic connection.',
    },
  ];

  const goToNext = () => setCurrentFrame(prev => (prev + 1) % frames.length);
  const goToPrev = () => setCurrentFrame(prev => (prev - 1 + frames.length) % frames.length);
  const goToFrame = (index) => setCurrentFrame(index);

  useEffect(() => {
    let scrollTimeout;
    const handleWheel = (e) => {
      e.preventDefault();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (e.deltaY > 0) goToNext();
        else if (e.deltaY < 0) goToPrev();
      }, 50);
    };
    const container = containerRef.current;
    if (container) container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      clearTimeout(scrollTimeout);
      if (container) container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goToNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goToPrev(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Touch swipe handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = touchStartY.current - touchEndY.current;
    
    // Detect swipe gestures (both horizontal and vertical)
    const minSwipeDistance = 50;
    
    // Check if horizontal swipe is more dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe left - go to next
        goToNext();
      } else {
        // Swipe right - go to previous
        goToPrev();
      }
    }
    // Check if vertical swipe is more dominant
    else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
      if (deltaY > 0) {
        // Swipe up - go to next
        goToNext();
      } else {
        // Swipe down - go to previous
        goToPrev();
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container && isMobile) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isMobile]);

  const currentFrameData = frames[currentFrame];
  const prevFrameData = frames[(currentFrame - 1 + frames.length) % frames.length];
  const nextFrameData = frames[(currentFrame + 1) % frames.length];
  
  const videoSource = isMobile && currentFrameData.mobileVideo ? currentFrameData.mobileVideo : currentFrameData.video;
  const prevVideoSource = isMobile && prevFrameData.mobileVideo ? prevFrameData.mobileVideo : prevFrameData.video;
  const nextVideoSource = isMobile && nextFrameData.mobileVideo ? nextFrameData.mobileVideo : nextFrameData.video;

  // Premium warm metallic colors - no cold grays
  const colors = {
    bronze: '#B8860B',
    darkBronze: '#704214',
    warmGold: '#D4AF37',
    paleGold: '#F0E68C',
    deepBlack: '#0A0A0A',
    warmBlack: '#1A1410',
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full" 
      style={{ 
        height: '100vh',
        fontFamily: 'var(--font-body)', 
        overflow: 'hidden',
        background: `radial-gradient(ellipse at center, ${colors.warmBlack} 0%, ${colors.deepBlack} 100%)`,
      }}
    >
      {/* Atmospheric warm glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 45%, ${colors.darkBronze}15 0%, transparent 70%)`,
        }}
      />

      {/* Main Gallery Container - Responsive margins for all screen sizes */}
      <div 
        className="absolute inset-0 flex flex-col"
        style={{
          padding: isMobile 
            ? '70px 16px 15px' 
            : isTablet 
              ? '70px clamp(20px, 8vw, 80px) 25px' 
              : '70px clamp(40px, 12vw, 120px) 25px',
        }}
      >
        
        {/* Elegant Suspension Cable - Zero gap from navbar */}
        {!isMobile && (
          <div 
            className="flex flex-col items-center"
            style={{
              height: '18px',
              marginBottom: '0px',
              marginTop: '0px',
            }}
          >
            <div 
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: `2px solid ${colors.bronze}`,
                background: `radial-gradient(circle at 30% 30%, ${colors.warmGold}50, ${colors.darkBronze})`,
                boxShadow: `0 0 10px ${colors.bronze}40, inset 0 2px 3px rgba(0,0,0,0.6)`,
                marginBottom: '0px',
              }}
            />
            <div 
              style={{
                width: '1.5px',
                height: '18px',
                background: `linear-gradient(180deg, ${colors.bronze} 0%, ${colors.darkBronze}80 100%)`,
                boxShadow: `0 0 6px ${colors.bronze}30`,
              }}
            />
          </div>
        )}

        {/* Gallery Stage - Tighter spacing */}
        <div 
          className="flex items-center justify-center flex-1"
          style={{
            gap: isMobile ? '0' : isTablet ? '18px' : '20px',
            minHeight: 0,
          }}
        >
          {/* Left Preview Frame with Index - Landscape */}
          {!isMobile && (
            <div className="flex flex-col items-center" style={{ gap: '12px' }}>
              <motion.div
                key={`prev-${currentFrame}`}
                onClick={goToPrev}
                className="cursor-pointer flex-shrink-0 hover-lift"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0.6, x: 0 }}
                whileHover={{ opacity: 1, scale: 1.02 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: isTablet ? '180px' : '220px',
                  height: isTablet ? '120px' : '140px',
                }}
              >
                {/* Extra tiny bronze frame */}
                <div 
                  style={{
                    width: '100%',
                    height: '100%',
                    padding: '2px',
                    background: `linear-gradient(135deg, ${colors.bronze}40 0%, ${colors.darkBronze}30 100%)`,
                    borderRadius: '2px',
                    boxShadow: `
                      0 8px 24px rgba(0,0,0,0.6),
                      0 0 0 1px ${colors.bronze}20,
                      inset 0 1px 2px ${colors.warmGold}20
                    `,
                  }}
                >
                  <div className="w-full h-full overflow-hidden relative">
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover"
                      style={{ filter: 'brightness(0.7) contrast(1.1)' }}
                    >
                      <source src={prevVideoSource} type="video/mp4" />
                    </video>
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4) 100%)',
                      }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Compact Gallery Index */}
              <div className="flex flex-col items-center" style={{ gap: '1px' }}>
                {frames.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => goToFrame(index)}
                    whileHover={{ scale: 1.1 }}
                    className="transition-all duration-300"
                    style={{
                      fontSize: isTablet ? '7px' : '8px',
                      fontWeight: index === currentFrame ? 700 : 400,
                      letterSpacing: '0.12em',
                      lineHeight: isTablet ? '18px' : '20px',
                      color: index === currentFrame ? colors.warmGold : `${colors.bronze}60`,
                      cursor: 'pointer',
                      textShadow: index === currentFrame ? `0 0 8px ${colors.warmGold}60` : 'none',
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Main Frame - Borderless on Mobile */}
          <motion.div
            key={`active-${currentFrame}`}
            onClick={() => navigate('/login')}
            className="relative flex-shrink-0 cursor-pointer"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: isMobile ? '100%' : isTablet ? 'min(70vw, 750px)' : 'min(68vw, 950px)',
              height: isMobile ? '78vh' : isTablet ? 'min(70vh, 670px)' : 'min(73vh, 710px)',
            }}
          >
            {/* Borderless on mobile, tiny frame on desktop */}
            {isMobile ? (
              // Mobile: No border, direct video
              <div 
                className="w-full h-full overflow-hidden relative"
                style={{
                  background: colors.deepBlack,
                }}
              >
                {/* Video with proper mobile aspect ratio */}
                <AnimatePresence mode="wait">
                  <motion.video
                    key={currentFrame}
                    autoPlay
                    loop
                    muted
                    playsInline
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="w-full h-full"
                    style={{ 
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  >
                    <source src={videoSource} type="video/mp4" />
                  </motion.video>
                </AnimatePresence>

                {/* Subtle vignette for depth */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)',
                  }}
                />

                {/* Enhanced text contrast overlay */}
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                  style={{ padding: isMobile ? '24px' : isTablet ? '32px' : '40px' }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={currentFrame}
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -20 }} 
                      transition={{ duration: 0.7 }}
                    >
                      {currentFrame === 0 && (
                        <EsoLogo 
                          className="mb-3" 
                          style={{ 
                            height: isMobile ? '28px' : isTablet ? '38px' : '42px',
                            filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.9)) drop-shadow(0 0 20px rgba(0,0,0,0.8))',
                          }} 
                        />
                      )}
                      
                      <h1 
                        style={{ 
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: isMobile ? '24px' : isTablet ? 'clamp(34px, 4vw, 46px)' : 'clamp(38px, 4.2vw, 52px)',
                          fontWeight: 600,
                          letterSpacing: currentFrame === 0 ? '0.15em' : '0.2em',
                          textTransform: 'uppercase',
                          color: colors.paleGold,
                          marginBottom: currentFrame === 0 ? '10px' : '16px',
                          textShadow: `
                            0 0 40px rgba(0,0,0,0.9),
                            0 4px 20px rgba(0,0,0,0.9),
                            0 8px 30px rgba(0,0,0,0.7),
                            0 2px 4px rgba(0,0,0,1)
                          `,
                          WebkitTextStroke: '0.5px rgba(0,0,0,0.3)',
                        }}
                      >
                        {currentFrameData.title}
                      </h1>

                      {currentFrame === 0 ? (
                        // First frame: Minimized centered content
                        <p 
                          style={{ 
                            fontSize: isMobile ? '10px' : isTablet ? 'clamp(10px, 1.1vw, 12px)' : 'clamp(11px, 1.15vw, 13px)',
                            letterSpacing: '0.22em',
                            lineHeight: '1.8',
                            textTransform: 'uppercase',
                            color: colors.paleGold,
                            textShadow: `
                              0 0 30px rgba(0,0,0,0.95),
                              0 2px 12px rgba(0,0,0,0.9),
                              0 4px 20px rgba(0,0,0,0.8)
                            `,
                            fontWeight: 400,
                          }}
                        >
                          {currentFrameData.subtitle}<br />
                          {currentFrameData.description}
                        </p>
                      ) : (
                        <>
                          {/* Other frames: Elegant divider and text */}
                          <div className="flex items-center justify-center mb-4" style={{ gap: '14px' }}>
                            <div style={{ width: '50px', height: '1px', background: `${colors.warmGold}50` }} />
                            <div style={{ 
                              width: '4px', 
                              height: '4px', 
                              borderRadius: '50%', 
                              background: colors.warmGold,
                              boxShadow: `0 0 10px ${colors.warmGold}70`,
                            }} />
                            <div style={{ width: '50px', height: '1px', background: `${colors.warmGold}50` }} />
                          </div>

                          <p 
                            style={{ 
                              fontSize: isMobile ? '11px' : isTablet ? 'clamp(11px, 1.2vw, 13px)' : 'clamp(12px, 1.25vw, 14px)',
                              letterSpacing: '0.28em',
                              lineHeight: '1.9',
                              textTransform: 'uppercase',
                              color: colors.paleGold,
                              textShadow: `
                                0 0 30px rgba(0,0,0,0.95),
                                0 2px 12px rgba(0,0,0,0.9),
                                0 4px 20px rgba(0,0,0,0.8)
                              `,
                              fontWeight: 400,
                            }}
                          >
                            {currentFrameData.subtitle}<br />
                            {currentFrameData.description}
                          </p>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              // Desktop/Tablet: With bronze frame
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  padding: isTablet ? '4px' : '4px',
                  background: `linear-gradient(145deg, ${colors.bronze}60 0%, ${colors.darkBronze}50 50%, ${colors.bronze}60 100%)`,
                  borderRadius: '3px',
                  boxShadow: `
                    0 25px 70px rgba(0,0,0,0.7),
                    0 0 0 1px ${colors.bronze}30,
                    inset 0 2px 4px ${colors.warmGold}20,
                    inset 0 -2px 4px rgba(0,0,0,0.4)
                  `,
                }}
              >
                <div 
                  className="w-full h-full overflow-hidden relative"
                  style={{
                    background: colors.deepBlack,
                  }}
                >
          </motion.div>

          {/* Right Preview Frame with Editorial - Landscape */}
          {!isMobile && (
            <div className="flex flex-col items-center" style={{ gap: '12px' }}>
              <motion.div
                key={`next-${currentFrame}`}
                onClick={goToNext}
                className="cursor-pointer flex-shrink-0 hover-lift"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.6, x: 0 }}
                whileHover={{ opacity: 1, scale: 1.02 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: isTablet ? '180px' : '220px',
                  height: isTablet ? '120px' : '140px',
                }}
              >
                {/* Extra tiny bronze frame */}
                <div 
                  style={{
                    width: '100%',
                    height: '100%',
                    padding: '2px',
                    background: `linear-gradient(135deg, ${colors.bronze}40 0%, ${colors.darkBronze}30 100%)`,
                    borderRadius: '2px',
                    boxShadow: `
                      0 8px 24px rgba(0,0,0,0.6),
                      0 0 0 1px ${colors.bronze}20,
                      inset 0 1px 2px ${colors.warmGold}20
                    `,
                  }}
                >
                  <div className="w-full h-full overflow-hidden relative">
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover"
                      style={{ filter: 'brightness(0.7) contrast(1.1)' }}
                    >
                      <source src={nextVideoSource} type="video/mp4" />
                    </video>
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4) 100%)',
                      }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Compact Editorial Statement */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                style={{
                  width: isTablet ? '180px' : '220px',
                  textAlign: 'center',
                }}
              >
                <p 
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: isTablet ? '7px' : '8px',
                    lineHeight: '1.5',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: `${colors.warmGold}70`,
                    fontWeight: 400,
                    textShadow: `0 2px 8px rgba(0,0,0,0.6)`,
                  }}
                >
                  EVERY ROOM HOLDS A STORY.<br />
                  EVERY STORY, A PART OF YOU.
                </p>
              </motion.div>
            </div>
          )}
        </div>

        {/* Bottom - Smaller Chevron Icon Only */}
        <div 
          className="flex items-center justify-center w-full"
          style={{
            height: isMobile ? '35px' : '40px',
            marginTop: isMobile ? '8px' : '10px',
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.5 }}
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: isMobile ? '24px' : '28px',
                height: isMobile ? '24px' : '28px',
                borderRadius: '50%',
                border: `1px solid ${colors.bronze}60`,
                background: `${colors.darkBronze}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.warmGold,
                boxShadow: `0 0 10px ${colors.bronze}20`,
              }}
            >
              <ChevronDown size={isMobile ? 12 : 13} strokeWidth={2} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CinematicHero;
