import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import EsoLogo from './EsoLogo';

/**
 * Cinematic Hero - Premium Museum Gallery
 * Clean, organized, elegant proportions with proper spacing
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

  return (
    <div 
      ref={containerRef} 
      className="relative w-full" 
      style={{ 
        height: '100vh',
        fontFamily: 'var(--font-body)', 
        overflow: 'hidden',
        background: '#000000',
      }}
    >

      {/* Main Gallery Container - Clean & Organized */}
      <div 
        className="absolute inset-0 flex flex-col"
        style={{
          padding: isMobile ? '70px 20px 40px' : '80px 60px 50px',
        }}
      >
        
        {/* Elegant Suspension Cable */}
        {!isMobile && (
          <div 
            className="flex flex-col items-center"
            style={{
              height: '40px',
              marginBottom: '20px',
            }}
          >
            <div 
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                marginBottom: '2px',
              }}
            />
            <div 
              style={{
                width: '1px',
                height: '38px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 100%)',
              }}
            />
          </div>
        )}

        {/* Gallery Stage - Perfectly Centered */}
        <div 
          className="flex items-center justify-center flex-1"
          style={{
            gap: isMobile ? '0' : '40px',
            minHeight: 0,
          }}
        >
          {/* Left Preview Frame */}
          {!isMobile && (
            <motion.div
              key={`prev-${currentFrame}`}
              onClick={goToPrev}
              className="cursor-pointer flex-shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.4, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '140px',
                height: '240px',
              }}
            >
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '8px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                  borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="w-full h-full overflow-hidden" style={{ borderRadius: '2px' }}>
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                    style={{ filter: 'brightness(0.6)' }}
                  >
                    <source src={prevVideoSource} type="video/mp4" />
                  </video>
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Frame - Premium & Spacious */}
          <motion.div
            key={`active-${currentFrame}`}
            className="relative flex-shrink-0"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: isMobile ? '100%' : 'min(65vw, 900px)',
              height: isMobile ? 'auto' : 'min(52vh, 520px)',
              aspectRatio: isMobile ? '16/9' : undefined,
            }}
          >
            <div 
              style={{
                width: '100%',
                height: '100%',
                padding: isMobile ? '12px' : '16px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  padding: isMobile ? '6px' : '10px',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '4px',
                }}
              >
                <div className="w-full h-full overflow-hidden relative" style={{ borderRadius: '2px' }}>
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

                  {/* Content Overlay */}
                  <div 
                    className="absolute inset-0 flex flex-col items-center justify-center text-center"
                    style={{ padding: isMobile ? '20px' : '40px' }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={currentFrame}
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -20 }} 
                        transition={{ duration: 0.8 }}
                      >
                        {currentFrame === 0 && (
                          <EsoLogo 
                            className="mb-4" 
                            style={{ 
                              height: isMobile ? '28px' : '36px',
                              filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.8))',
                            }} 
                          />
                        )}
                        
                        <h1 
                          style={{ 
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: isMobile ? '26px' : 'clamp(32px, 3.5vw, 48px)',
                            fontWeight: 600,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: '#FFFFFF',
                            marginBottom: '16px',
                            textShadow: '0 4px 20px rgba(0,0,0,0.9)',
                          }}
                        >
                          {currentFrameData.title}
                        </h1>

                        <div className="flex items-center justify-center mb-4" style={{ gap: '12px' }}>
                          <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
                          <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }} />
                          <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
                        </div>

                        <p 
                          style={{ 
                            fontSize: isMobile ? '11px' : 'clamp(11px, 1.1vw, 13px)',
                            letterSpacing: '0.25em',
                            lineHeight: '1.8',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.9)',
                            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                          }}
                        >
                          {currentFrameData.subtitle}<br />
                          {currentFrameData.description}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Preview Frame */}
          {!isMobile && (
            <motion.div
              key={`next-${currentFrame}`}
              onClick={goToNext}
              className="cursor-pointer flex-shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 0.4, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '140px',
                height: '240px',
              }}
            >
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '8px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                  borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="w-full h-full overflow-hidden" style={{ borderRadius: '2px' }}>
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                    style={{ filter: 'brightness(0.6)' }}
                  >
                    <source src={nextVideoSource} type="video/mp4" />
                  </video>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Navigation - Clean & Organized */}
        <div 
          className="flex items-end justify-between w-full"
          style={{
            height: '70px',
            marginTop: '20px',
            maxWidth: '1400px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {/* Left: Gallery Index */}
          {!isMobile && (
            <div className="flex items-end" style={{ width: '80px' }}>
              <div className="flex flex-col gap-0.5">
                {frames.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => goToFrame(index)}
                    className="relative flex items-center transition-all duration-300"
                    style={{
                      fontSize: '10px',
                      fontWeight: index === currentFrame ? 600 : 400,
                      letterSpacing: '0.15em',
                      lineHeight: '26px',
                      color: index === currentFrame ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
                      cursor: 'pointer',
                      paddingLeft: '20px',
                    }}
                  >
                    {index === currentFrame && (
                      <motion.div
                        layoutId="indicator"
                        style={{
                          position: 'absolute',
                          left: '0',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '14px',
                          height: '1px',
                          background: 'rgba(255,255,255,0.8)',
                        }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                    {String(index + 1).padStart(2, '0')}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Center: Scroll Indicator */}
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 2 }}
            style={{ flex: 1 }}
          >
            <p 
              style={{
                fontSize: '8px',
                fontWeight: 500,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              SCROLL
            </p>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              <ChevronDown size={14} strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Right: Editorial Statement */}
          {!isMobile && (
            <div className="flex items-end gap-3" style={{ width: '140px' }}>
              <div 
                style={{
                  width: '1px',
                  height: '40px',
                  background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                }}
              />
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 1 }}
              >
                <p 
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '8px',
                    lineHeight: '1.6',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.5)',
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
