import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import EsoLogo from './EsoLogo';

/**
 * Cinematic Hero - Premium Nostalgic Gallery
 * Vintage film projection aesthetic with elegant proportions
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

  // Nostalgic vintage color palette
  const colors = {
    pageBlack: '#0A0908',
    warmSepia: '#2B2118',
    vintageGold: '#C9A063',
    paleGold: '#E6C896',
    antiqueBronze: '#8B6F47',
    creamIvory: '#F2E8CF',
    deepBrown: '#1C1410',
    mutedGold: 'rgba(201, 160, 99, 0.7)',
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full" 
      style={{ 
        height: '100vh',
        fontFamily: 'var(--font-body)', 
        overflow: 'hidden',
        background: `linear-gradient(180deg, ${colors.pageBlack} 0%, ${colors.deepBrown} 100%)`,
      }}
    >
      {/* Vintage Film Grain Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.4,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Warm Atmospheric Glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 40% at 50% 50%, ${colors.warmSepia}20 0%, transparent 60%)`,
        }}
      />

      {/* Main Gallery Container */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          padding: isMobile ? '80px 16px 60px' : '90px 40px 70px',
          gap: isMobile ? '12px' : '16px',
        }}
      >
        
        {/* Ornate Suspension Hook */}
        {!isMobile && (
          <div 
            className="flex flex-col items-center"
            style={{
              height: '50px',
              flexShrink: 0,
            }}
          >
            {/* Decorative ceiling mount */}
            <div 
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: `2px solid ${colors.vintageGold}`,
                background: `radial-gradient(circle at 30% 30%, ${colors.paleGold}40, ${colors.antiqueBronze})`,
                boxShadow: `0 0 15px ${colors.vintageGold}30, inset 0 2px 4px rgba(0,0,0,0.5)`,
                marginBottom: '4px',
              }}
            />
            {/* Elegant chain/cable */}
            <div 
              style={{
                width: '2px',
                height: '46px',
                background: `linear-gradient(180deg, ${colors.vintageGold} 0%, ${colors.antiqueBronze} 100%)`,
                boxShadow: `0 0 8px ${colors.vintageGold}20`,
                opacity: 0.85,
              }}
            />
          </div>
        )}

        {/* Gallery Stage with Perspective */}
        <div 
          className="flex items-center justify-center w-full"
          style={{
            flex: 1,
            minHeight: 0,
            perspective: '2000px',
            perspectiveOrigin: 'center center',
            gap: isMobile ? '0' : '20px',
          }}
        >
          {/* Left Side Frame - Portrait Vintage Photo */}
          {!isMobile && (
            <motion.div
              key={`prev-${currentFrame}`}
              onClick={goToPrev}
              className="cursor-pointer flex-shrink-0"
              initial={{ opacity: 0, rotateY: 15 }}
              animate={{ opacity: 0.5, rotateY: 12 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '160px',
                height: '240px',
                transform: 'rotateY(12deg) translateZ(-120px)',
                transformStyle: 'preserve-3d',
                filter: 'brightness(0.5) sepia(0.3)',
              }}
            >
              {/* Vintage frame with worn edges */}
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '14px',
                  background: `linear-gradient(135deg, ${colors.antiqueBronze} 0%, ${colors.warmSepia} 50%, ${colors.antiqueBronze} 100%)`,
                  borderRadius: '3px',
                  boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.6),
                    inset 0 0 20px rgba(0, 0, 0, 0.4),
                    inset 0 2px 4px rgba(255, 255, 255, 0.1)
                  `,
                  border: `1px solid ${colors.antiqueBronze}`,
                }}
              >
                <div 
                  className="w-full h-full overflow-hidden"
                  style={{
                    border: `3px solid ${colors.warmSepia}`,
                    boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                    style={{
                      filter: 'sepia(0.15) contrast(1.1)',
                    }}
                  >
                    <source src={prevVideoSource} type="video/mp4" />
                  </video>
                </div>
              </div>
            </motion.div>
          )}

          {/* Center Main Frame - Premium Responsive */}
          <motion.div
            key={`active-${currentFrame}`}
            className="relative flex-shrink-0"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: isMobile ? '92%' : 'clamp(680px, 62vw, 880px)',
              height: isMobile ? 'calc((92vw - 32px) * 0.48)' : 'clamp(340px, 30vw, 440px)',
              maxWidth: '880px',
            }}
          >
            {/* Ornate vintage frame - museum quality */}
            <div 
              style={{
                width: '100%',
                height: '100%',
                padding: isMobile ? '16px' : '20px',
                background: `linear-gradient(135deg, 
                  ${colors.antiqueBronze} 0%, 
                  ${colors.warmSepia} 25%, 
                  ${colors.antiqueBronze} 50%, 
                  ${colors.warmSepia} 75%, 
                  ${colors.antiqueBronze} 100%
                )`,
                borderRadius: '6px',
                boxShadow: `
                  0 20px 80px rgba(0, 0, 0, 0.8),
                  0 0 0 1px ${colors.vintageGold}40,
                  inset 0 0 40px rgba(0, 0, 0, 0.5),
                  inset 0 3px 8px rgba(255, 255, 255, 0.1),
                  inset 0 -3px 8px rgba(0, 0, 0, 0.5)
                `,
                border: `2px solid ${colors.antiqueBronze}`,
              }}
            >
              {/* Inner mat/border */}
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  padding: isMobile ? '8px' : '12px',
                  background: `linear-gradient(180deg, ${colors.deepBrown}CC 0%, ${colors.warmSepia}DD 100%)`,
                  borderRadius: '2px',
                  boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.7)',
                }}
              >
                {/* Film/photo area */}
                <div 
                  className="w-full h-full overflow-hidden relative"
                  style={{
                    border: `1px solid ${colors.antiqueBronze}60`,
                    boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.6)',
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
                      transition={{ duration: 1 }}
                      className="w-full h-full object-cover"
                      style={{
                        filter: 'sepia(0.08) contrast(1.05) brightness(0.95)',
                      }}
                    >
                      <source src={videoSource} type="video/mp4" />
                    </motion.video>
                  </AnimatePresence>

                  {/* Vintage film vignette */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)',
                      mixBlendMode: 'multiply',
                    }}
                  />

                  {/* Content overlay */}
                  <div 
                    className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
                    style={{ padding: isMobile ? '16px' : '32px' }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={currentFrame}
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -15 }} 
                        transition={{ duration: 1 }}
                      >
                        {currentFrame === 0 && (
                          <EsoLogo 
                            className="mb-3 w-auto" 
                            style={{ 
                              height: isMobile ? '24px' : '32px',
                              filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.9))',
                              opacity: 0.9,
                            }} 
                          />
                        )}
                        
                        <h1 
                          style={{ 
                            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                            fontSize: isMobile ? '22px' : 'clamp(28px, 2.8vw, 38px)',
                            fontWeight: 600,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: colors.creamIvory,
                            marginBottom: '12px',
                            textShadow: `
                              0 2px 4px rgba(0,0,0,0.8),
                              0 4px 12px rgba(0,0,0,0.6),
                              0 0 20px rgba(0,0,0,0.5)
                            `,
                          }}
                        >
                          {currentFrameData.title}
                        </h1>

                        {/* Vintage ornamental divider */}
                        <div 
                          className="flex items-center justify-center mb-3"
                          style={{ width: '100px', margin: '0 auto 10px' }}
                        >
                          <div style={{ flex: 1, height: '1px', background: `${colors.vintageGold}40` }} />
                          <div style={{ 
                            width: '4px', 
                            height: '4px', 
                            borderRadius: '50%', 
                            background: colors.vintageGold,
                            margin: '0 8px',
                            boxShadow: `0 0 8px ${colors.vintageGold}60`,
                          }} />
                          <div style={{ flex: 1, height: '1px', background: `${colors.vintageGold}40` }} />
                        </div>

                        <p 
                          style={{ 
                            fontSize: isMobile ? '10px' : 'clamp(10px, 1vw, 12px)',
                            letterSpacing: '0.28em',
                            lineHeight: '1.8',
                            textTransform: 'uppercase',
                            color: colors.creamIvory,
                            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                            marginBottom: '4px',
                            fontWeight: 400,
                          }}
                        >
                          {currentFrameData.subtitle}
                        </p>
                        <p 
                          style={{ 
                            fontSize: isMobile ? '10px' : 'clamp(10px, 1vw, 12px)',
                            letterSpacing: '0.28em',
                            lineHeight: '1.8',
                            textTransform: 'uppercase',
                            color: `${colors.creamIvory}DD`,
                            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                            fontWeight: 400,
                          }}
                        >
                          {currentFrameData.description}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side Frame - Portrait Vintage Photo */}
          {!isMobile && (
            <motion.div
              key={`next-${currentFrame}`}
              onClick={goToNext}
              className="cursor-pointer flex-shrink-0"
              initial={{ opacity: 0, rotateY: -15 }}
              animate={{ opacity: 0.45, rotateY: -12 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '160px',
                height: '240px',
                transform: 'rotateY(-12deg) translateZ(-120px)',
                transformStyle: 'preserve-3d',
                filter: 'brightness(0.45) sepia(0.35)',
              }}
            >
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '14px',
                  background: `linear-gradient(135deg, ${colors.antiqueBronze} 0%, ${colors.warmSepia} 50%, ${colors.antiqueBronze} 100%)`,
                  borderRadius: '3px',
                  boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.6),
                    inset 0 0 20px rgba(0, 0, 0, 0.4),
                    inset 0 2px 4px rgba(255, 255, 255, 0.1)
                  `,
                  border: `1px solid ${colors.antiqueBronze}`,
                }}
              >
                <div 
                  className="w-full h-full overflow-hidden"
                  style={{
                    border: `3px solid ${colors.warmSepia}`,
                    boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                    style={{
                      filter: 'sepia(0.2) contrast(1.1)',
                    }}
                  >
                    <source src={nextVideoSource} type="video/mp4" />
                  </video>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Navigation - Vintage Typography */}
        <div 
          className="flex items-end justify-between w-full"
          style={{
            height: '80px',
            flexShrink: 0,
            maxWidth: '1200px',
            gap: '20px',
          }}
        >
          {/* Left: Gallery Index */}
          {!isMobile && (
            <div className="flex items-end" style={{ width: '60px' }}>
              <div className="relative">
                <div 
                  style={{
                    position: 'absolute',
                    left: '0',
                    bottom: '0',
                    width: '1px',
                    height: '160px',
                    background: `linear-gradient(180deg, transparent 0%, ${colors.vintageGold}40 30%, ${colors.vintageGold}40 70%, transparent 100%)`,
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
                        fontWeight: index === currentFrame ? 600 : 400,
                        letterSpacing: '0.12em',
                        lineHeight: '22px',
                        color: index === currentFrame ? colors.paleGold : `${colors.vintageGold}60`,
                        cursor: 'pointer',
                        paddingLeft: '14px',
                      }}
                    >
                      {index === currentFrame && (
                        <>
                          <motion.div
                            layoutId="indicator"
                            style={{
                              position: 'absolute',
                              left: '0',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '26px',
                              height: '1px',
                              background: colors.vintageGold,
                              boxShadow: `0 0 6px ${colors.vintageGold}60`,
                            }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
                              background: colors.vintageGold,
                              boxShadow: `0 0 8px ${colors.vintageGold}80`,
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

          {/* Center: Scroll Indicator */}
          <motion.div
            className="flex flex-col items-center gap-1 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 2 }}
            style={{ flex: 1 }}
          >
            {!isMobile && (
              <>
                <p 
                  style={{
                    fontSize: '7px',
                    fontWeight: 500,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: colors.vintageGold,
                  }}
                >
                  SCROLL
                </p>
                <div 
                  style={{
                    width: '1px',
                    height: '12px',
                    background: `${colors.vintageGold}60`,
                  }}
                />
              </>
            )}
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                border: `1px solid ${colors.vintageGold}`,
                background: `${colors.antiqueBronze}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.paleGold,
                boxShadow: `0 0 8px ${colors.vintageGold}30, inset 0 0 8px rgba(0,0,0,0.3)`,
              }}
            >
              <ChevronDown size={12} strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Right: Editorial Statement */}
          {!isMobile && (
            <div className="flex items-end gap-2" style={{ width: '110px' }}>
              <div 
                style={{
                  width: '1px',
                  height: '50px',
                  background: `linear-gradient(180deg, transparent 0%, ${colors.vintageGold}60 30%, ${colors.vintageGold}60 70%, transparent 100%)`,
                }}
              />
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 1 }}
              >
                <p 
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '7px',
                    lineHeight: '1.5',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: `${colors.creamIvory}CC`,
                    fontWeight: 500,
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
