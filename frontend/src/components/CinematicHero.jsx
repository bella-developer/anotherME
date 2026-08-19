import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import EsoLogo from './EsoLogo';

/**
 * Cinematic Hero - Clean Grid Layout
 * All elements in their own space, no overlaps, fully contained
 */
function CinematicHero() {
  const containerRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(4);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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

  const currentFrameData = frames[currentFrame];
  const prevFrameData = frames[(currentFrame - 1 + frames.length) % frames.length];
  const nextFrameData = frames[(currentFrame + 1) % frames.length];
  
  const videoSource = isMobile && currentFrameData.mobileVideo ? currentFrameData.mobileVideo : currentFrameData.video;
  const prevVideoSource = isMobile && prevFrameData.mobileVideo ? prevFrameData.mobileVideo : prevFrameData.video;
  const nextVideoSource = isMobile && nextFrameData.mobileVideo ? nextFrameData.mobileVideo : nextFrameData.video;

  // Color tokens
  const colors = {
    pageBlack: '#050505',
    cardBlack: '#090806',
    deepBrown: '#17100A',
    warmGold: '#B9873D',
    paleGold: '#D0A45D',
    editorialIvory: '#D8D0C0',
    mutedGold: 'rgba(185, 135, 61, 0.65)',
    darkGold: 'rgba(185, 135, 61, 0.35)',
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full" 
      style={{ 
        height: '100vh',
        fontFamily: 'var(--font-body)', 
        overflow: 'hidden',
        background: colors.pageBlack,
      }}
    >
      {/* Atmospheric Background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 60%, ${colors.deepBrown}12 0%, transparent 50%)`,
        }}
      />

      {/* Grid Layout Container */}
      <div 
        className="absolute inset-0 flex flex-col"
        style={{
          padding: isMobile ? '80px 16px 60px' : '100px 40px 80px',
          gap: isMobile ? '16px' : '24px',
        }}
      >
        
        {/* Top Row: Suspension Cable */}
        {!isMobile && (
          <div 
            className="flex justify-center"
            style={{
              height: '60px',
              flexShrink: 0,
            }}
          >
            <div style={{ position: 'relative', width: '2px' }}>
              <div 
                style={{
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  border: `1px solid ${colors.warmGold}`,
                  background: 'transparent',
                  position: 'absolute',
                  left: '50%',
                  top: '0',
                  transform: 'translateX(-50%)',
                }}
              />
              <div 
                style={{
                  width: '2px',
                  height: '60px',
                  background: `linear-gradient(180deg, ${colors.warmGold} 0%, ${colors.darkGold} 100%)`,
                  opacity: 0.7,
                }}
              />
            </div>
          </div>
        )}

        {/* Middle Row: Gallery with Side Cards */}
        <div 
          className="flex items-center justify-center gap-4"
          style={{
            flex: 1,
            minHeight: 0,
            perspective: '1600px',
            perspectiveOrigin: 'center center',
          }}
        >
          {/* Left Side Card */}
          {!isMobile && (
            <motion.div
              key={`prev-${currentFrame}`}
              onClick={goToPrev}
              className="cursor-pointer flex-shrink-0"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 0.6, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '120px',
                height: '85%',
                maxHeight: '280px',
                transform: 'rotateY(6deg) scale(0.85) translateZ(-80px)',
                transformStyle: 'preserve-3d',
                filter: 'brightness(0.6)',
              }}
            >
              <div 
                className="w-full h-full"
                style={{
                  border: `1px solid ${colors.darkGold}`,
                  borderRadius: '10px',
                  padding: '8px',
                  boxShadow: '0 15px 50px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div 
                  className="w-full h-full overflow-hidden"
                  style={{
                    border: `1px solid rgba(185, 135, 61, 0.25)`,
                    borderRadius: '6px',
                    background: colors.cardBlack,
                  }}
                >
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                  >
                    <source src={prevVideoSource} type="video/mp4" />
                  </video>
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'rgba(0, 0, 0, 0.25)',
                      mixBlendMode: 'multiply',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Left Arrow - REMOVED */}

          {/* Center Active Card */}
          <motion.div
            key={`active-${currentFrame}`}
            className="relative flex-shrink-0"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: isMobile ? '100%' : '750px',
              height: '100%',
              maxWidth: '950px',
              maxHeight: '560px',
            }}
          >
            {/* Outer Frame */}
            <div 
              className="w-full h-full"
              style={{
                border: `1px solid ${colors.mutedGold}`,
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 30px 100px rgba(0, 0, 0, 0.7)',
              }}
            >
              {/* Inner Frame */}
              <div 
                className="w-full h-full overflow-hidden"
                style={{
                  border: `1px solid rgba(208, 164, 93, 0.45)`,
                  borderRadius: '6px',
                  background: colors.cardBlack,
                }}
              >
                {/* Video */}
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
                    transition={{ duration: 0.8 }}
                    className="w-full h-full object-cover"
                  >
                    <source src={videoSource} type="video/mp4" />
                  </motion.video>
                </AnimatePresence>

                {/* Dark overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'rgba(23, 16, 10, 0.12)',
                    mixBlendMode: 'multiply',
                  }}
                />

                {/* Content Overlay */}
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none" 
                  style={{ padding: isMobile ? '20px' : '40px' }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={currentFrame}
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -20 }} 
                      transition={{ duration: 0.9 }}
                    >
                      {currentFrame === 0 && (
                        <EsoLogo 
                          className="mb-4 w-auto" 
                          style={{ 
                            height: isMobile ? '24px' : '36px',
                            filter: 'drop-shadow(0 0 30px rgba(0,0,0,0.95))',
                            opacity: 0.88,
                          }} 
                        />
                      )}
                      
                      <h1 
                        style={{ 
                          fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
                          fontSize: isMobile ? '20px' : 'clamp(26px, 2.5vw, 34px)',
                          fontWeight: 500,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: colors.editorialIvory,
                          marginBottom: '14px',
                          textShadow: '0 4px 25px rgba(0,0,0,0.95)',
                        }}
                      >
                        {currentFrameData.title}
                      </h1>

                      {/* Divider */}
                      <div 
                        className="flex items-center justify-center"
                        style={{ marginBottom: '14px', width: '100px', margin: '0 auto 14px' }}
                      >
                        <div style={{ flex: 1, height: '1px', background: `${colors.editorialIvory}30` }} />
                        <div style={{ 
                          width: '3px', 
                          height: '3px', 
                          borderRadius: '50%', 
                          background: colors.warmGold,
                          margin: '0 6px',
                          boxShadow: `0 0 6px ${colors.warmGold}50`,
                        }} />
                        <div style={{ flex: 1, height: '1px', background: `${colors.editorialIvory}30` }} />
                      </div>

                      <p 
                        style={{ 
                          fontSize: isMobile ? '9px' : '10px',
                          letterSpacing: '0.25em',
                          lineHeight: '1.9',
                          textTransform: 'uppercase',
                          color: `${colors.editorialIvory}DD`,
                          textShadow: '0 2px 15px rgba(0,0,0,0.95)',
                          marginBottom: '4px',
                        }}
                      >
                        {currentFrameData.subtitle}
                      </p>
                      <p 
                        style={{ 
                          fontSize: isMobile ? '9px' : '10px',
                          letterSpacing: '0.25em',
                          lineHeight: '1.9',
                          textTransform: 'uppercase',
                          color: `${colors.editorialIvory}DD`,
                          textShadow: '0 2px 15px rgba(0,0,0,0.95)',
                        }}
                      >
                        {currentFrameData.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Arrow - REMOVED */}

          {/* Right Side Card */}
          {!isMobile && (
            <motion.div
              key={`next-${currentFrame}`}
              onClick={goToNext}
              className="cursor-pointer flex-shrink-0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 0.55, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '120px',
                height: '85%',
                maxHeight: '280px',
                transform: 'rotateY(-6deg) scale(0.85) translateZ(-80px)',
                transformStyle: 'preserve-3d',
                filter: 'brightness(0.5)',
              }}
            >
              <div 
                className="w-full h-full"
                style={{
                  border: `1px solid ${colors.darkGold}`,
                  borderRadius: '10px',
                  padding: '8px',
                  boxShadow: '0 15px 50px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div 
                  className="w-full h-full overflow-hidden"
                  style={{
                    border: `1px solid rgba(185, 135, 61, 0.25)`,
                    borderRadius: '6px',
                    background: colors.cardBlack,
                  }}
                >
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                  >
                    <source src={nextVideoSource} type="video/mp4" />
                  </video>
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      mixBlendMode: 'multiply',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Row: Navigation Elements */}
        <div 
          className="flex items-end justify-between"
          style={{
            height: isMobile ? '100px' : '100px',
            flexShrink: 0,
            gap: '20px',
          }}
        >
          
          {/* Left: Gallery Index - Compact */}
          {!isMobile && (
            <div 
              className="flex items-end"
              style={{
                width: '70px',
                height: '100%',
              }}
            >
              <div className="relative">
                <div 
                  style={{
                    position: 'absolute',
                    left: '0',
                    bottom: '0',
                    width: '1px',
                    height: '180px',
                    background: `linear-gradient(180deg, ${colors.darkGold}00 0%, ${colors.darkGold} 30%, ${colors.darkGold} 70%, ${colors.darkGold}00 100%)`,
                  }}
                />
                
                <div className="flex flex-col">
                  {frames.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => goToFrame(index)}
                      className="relative flex items-center transition-all duration-300"
                      style={{
                        fontSize: '9px',
                        letterSpacing: '0.14em',
                        lineHeight: '24px',
                        color: index === currentFrame ? colors.paleGold : 'rgba(185, 135, 61, 0.4)',
                        cursor: 'pointer',
                        paddingLeft: '14px',
                      }}
                    >
                      {index === currentFrame && (
                        <>
                          <motion.div
                            layoutId="activeIndicator"
                            style={{
                              position: 'absolute',
                              left: '0',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '28px',
                              height: '1px',
                              background: colors.warmGold,
                            }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          />
                          <div 
                            style={{
                              position: 'absolute',
                              left: '-3px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              background: colors.warmGold,
                              boxShadow: `0 0 6px ${colors.warmGold}60`,
                            }}
                          />
                        </>
                      )}
                      {String(index + 1).padStart(2, '0')}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Center: Scroll Prompt Only - Compact */}
          <div 
            className="flex flex-col items-center gap-2"
            style={{
              flex: 1,
            }}
          >
            {/* Scroll Prompt */}
            <motion.div
              className="flex flex-col items-center gap-1 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              {!isMobile && (
                <>
                  <p 
                    style={{
                      fontSize: '7px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: colors.warmGold,
                    }}
                  >
                    SCROLL
                  </p>
                  
                  <div 
                    style={{
                      width: '1px',
                      height: '14px',
                      background: colors.mutedGold,
                    }}
                  />
                </>
              )}
              
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: `1px solid ${colors.warmGold}`,
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.paleGold,
                }}
              >
                <ChevronDown size={12} strokeWidth={1.5} />
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Editorial Statement - Pulled Left */}
          {!isMobile && (
            <div 
              className="flex items-end gap-2"
              style={{
                width: '120px',
                height: '100%',
              }}
            >
              <div 
                style={{
                  width: '1px',
                  height: '60%',
                  background: `linear-gradient(180deg, transparent 0%, ${colors.warmGold}80 30%, ${colors.warmGold}80 70%, transparent 100%)`,
                }}
              />
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex-1"
              >
                <p 
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
                    fontSize: '7px',
                    lineHeight: '1.5',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: `${colors.editorialIvory}CC`,
                    fontWeight: 400,
                  }}
                >
                  EVERY ROOM<br />
                  HOLDS A STORY.<br />
                  EVERY STORY,<br />
                  A PART OF YOU.
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CinematicHero;
