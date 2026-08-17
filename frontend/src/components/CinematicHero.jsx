import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import EsoLogo from './EsoLogo';

/**
 * Cinematic Hero - Memory Palace Style
 * Single large ornate frame with decorative finial
 * Bottom numbered counter navigation
 */
function CinematicHero() {
  const containerRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide browser scrollbar
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Frame data
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

  // Navigation functions
  const goToNext = () => {
    setCurrentFrame(prev => (prev + 1) % frames.length);
  };

  const goToPrev = () => {
    setCurrentFrame(prev => (prev - 1 + frames.length) % frames.length);
  };

  const goToFrame = (index) => {
    setCurrentFrame(index);
  };

  // Wheel scroll navigation
  useEffect(() => {
    let scrollTimeout;
    const handleWheel = (e) => {
      e.preventDefault();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
          goToNext();
        } else if (e.deltaY < 0) {
          goToPrev();
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
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentFrameData = frames[currentFrame];
  const videoSource = isMobile && currentFrameData.mobileVideo 
    ? currentFrameData.mobileVideo 
    : currentFrameData.video;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black"
      style={{
        height: '100vh',
        fontFamily: 'var(--font-body)',
        overflow: 'hidden',
      }}
    >
      {/* Main Content - Three Column Layout */}
      <div className="absolute inset-0 flex items-center justify-center px-4 md:px-8" style={{ paddingTop: isMobile ? '100px' : '120px', paddingBottom: isMobile ? '120px' : '140px' }}>
        <div className="relative w-full max-w-7xl mx-auto flex items-center gap-6 md:gap-8">
          
          {/* LEFT SIDEBAR - Vertical Numbered List */}
          {!isMobile && (
            <div className="flex flex-col gap-3" style={{ minWidth: '60px' }}>
              {frames.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToFrame(index)}
                  className="text-left transition-all duration-300 relative"
                  style={{
                    fontSize: '14px',
                    letterSpacing: '0.1em',
                    color: index === currentFrame ? '#D4AF37' : 'rgba(201, 160, 99, 0.4)',
                    fontWeight: index === currentFrame ? 600 : 400,
                    cursor: 'pointer',
                    paddingLeft: index === currentFrame ? '20px' : '0',
                  }}
                  whileHover={{ color: '#D4AF37', paddingLeft: '20px' }}
                >
                  {index === currentFrame && (
                    <motion.div
                      layoutId="sidebarIndicator"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '12px',
                        height: '2px',
                        background: '#D4AF37',
                        boxShadow: '0 0 8px rgba(212, 175, 55, 0.8)',
                      }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                  )}
                  {String(index + 1).padStart(2, '0')}
                </motion.button>
              ))}
            </div>
          )}

          {/* CENTER - Frame with Side Previews */}
          <div className="relative flex-1 flex items-center justify-center gap-4 md:gap-6">
            
            {/* Previous Frame Preview (left edge) */}
            {!isMobile && (
              <motion.div
                key={`prev-${(currentFrame - 1 + frames.length) % frames.length}`}
                className="relative cursor-pointer"
                onClick={goToPrev}
                style={{
                  width: '160px',
                  height: '300px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid rgba(201, 160, 99, 0.3)',
                  opacity: 0.3,
                }}
                whileHover={{ opacity: 0.6, scale: 1.02 }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.4)',
                  }}
                >
                  <source src={
                    isMobile && frames[(currentFrame - 1 + frames.length) % frames.length].mobileVideo 
                      ? frames[(currentFrame - 1 + frames.length) % frames.length].mobileVideo 
                      : frames[(currentFrame - 1 + frames.length) % frames.length].video
                  } type="video/mp4" />
                </video>
              </motion.div>
            )}

            {/* Main Active Frame */}
            <div className="relative">
              
              {/* Ornate Finial - Top Center */}
              <div
                className="absolute left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
                style={{
                  top: isMobile ? '-60px' : '-80px',
                }}
              >
                <div
                  style={{
                    width: isMobile ? '24px' : '32px',
                    height: isMobile ? '24px' : '32px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #FFD700 0%, #D4AF37 40%, #C9A063 70%, #8B6F47 100%)',
                    margin: '0 auto 6px',
                    boxShadow: '0 0 25px rgba(255, 215, 0, 0.7), inset 0 3px 8px rgba(255,255,255,0.5)',
                    border: '2px solid rgba(212, 175, 55, 0.95)',
                  }}
                />
                <div
                  style={{
                    width: isMobile ? '4px' : '5px',
                    height: isMobile ? '40px' : '60px',
                    background: 'linear-gradient(180deg, #D4AF37 0%, #C9A063 50%, #8B6F47 100%)',
                    margin: '0 auto',
                    boxShadow: '0 0 10px rgba(201, 160, 99, 0.5)',
                  }}
                />
              </div>

              {/* Frame Container */}
              <div
                style={{
                  width: isMobile ? '85vw' : '700px',
                  height: isMobile ? '65vh' : '450px',
                  position: 'relative',
                }}
              >
              {/* Ornate Gold Frame Border */}
              <div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  border: isMobile ? '4px solid' : '5px solid',
                  borderImage: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 15%, #C9A063 35%, #8B6F47 50%, #C9A063 65%, #D4AF37 85%, #FFD700 100%) 1',
                  borderRadius: '16px',
                  boxShadow: `
                    0 0 25px rgba(255, 215, 0, 0.35),
                    inset 0 0 35px rgba(0,0,0,0.6),
                    inset 0 3px 6px rgba(255,255,255,0.12)
                  `,
                }}
              />

              {/* Inner Shadow */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  borderRadius: '16px',
                  boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
                }}
              />

              {/* Video Container */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  borderRadius: '12px',
                }}
              >
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
                    transition={{ duration: 0.5 }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  >
                    <source src={videoSource} type="video/mp4" />
                  </motion.video>
                </AnimatePresence>

                {/* Gradient for text readability */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 30%, transparent 50%, rgba(0,0,0,0.4) 100%)',
                  }}
                />

                {/* Text Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-12 pointer-events-none">
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
                          className="mb-6 h-10 md:h-12 w-auto" 
                          style={{
                            filter: 'drop-shadow(0 0 25px rgba(0,0,0,1))',
                          }}
                        />
                      )}
                      
                      <h1
                        className="text-2xl md:text-5xl font-light mb-4"
                        style={{
                          color: '#ffffff',
                          letterSpacing: '0.3em',
                          textShadow: '0 0 35px rgba(0,0,0,1), 0 5px 25px rgba(0,0,0,0.95)',
                          fontWeight: 200,
                        }}
                      >
                        {currentFrameData.title}
                      </h1>

                      <div
                        style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: '#D4AF37',
                          margin: '0 auto 16px',
                          boxShadow: '0 0 12px rgba(212, 175, 55, 0.9)',
                        }}
                      />

                      <p
                        className="text-sm md:text-base mb-2"
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          textShadow: '0 0 25px rgba(0,0,0,1), 0 3px 15px rgba(0,0,0,0.95)',
                          fontWeight: 300,
                        }}
                      >
                        {currentFrameData.subtitle}
                      </p>

                      <p
                        className="text-xs md:text-sm"
                        style={{
                          color: 'rgba(255, 255, 255, 0.75)',
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          textShadow: '0 0 25px rgba(0,0,0,1), 0 3px 15px rgba(0,0,0,0.95)',
                          fontWeight: 300,
                        }}
                      >
                        {currentFrameData.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation Arrows - Inside Frame */}
                <button
                  onClick={goToPrev}
                  className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-30 transition-all duration-300 hover:scale-110"
                  style={{
                    width: isMobile ? '40px' : '48px',
                    height: isMobile ? '40px' : '48px',
                    borderRadius: '50%',
                    border: '2px solid rgba(212, 175, 55, 0.6)',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#D4AF37',
                    boxShadow: '0 0 15px rgba(0,0,0,0.8)',
                  }}
                >
                  <ChevronLeft size={isMobile ? 22 : 26} />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-30 transition-all duration-300 hover:scale-110"
                  style={{
                    width: isMobile ? '40px' : '48px',
                    height: isMobile ? '40px' : '48px',
                    borderRadius: '50%',
                    border: '2px solid rgba(212, 175, 55, 0.6)',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#D4AF37',
                    boxShadow: '0 0 15px rgba(0,0,0,0.8)',
                  }}
                >
                  <ChevronRight size={isMobile ? 22 : 26} />
                </button>
              </div>
            </div>

            {/* Next Frame Preview (right edge) */}
            {!isMobile && (
              <motion.div
                key={`next-${(currentFrame + 1) % frames.length}`}
                className="relative cursor-pointer"
                onClick={goToNext}
                style={{
                  width: '160px',
                  height: '300px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid rgba(201, 160, 99, 0.3)',
                  opacity: 0.3,
                }}
                whileHover={{ opacity: 0.6, scale: 1.02 }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.4)',
                  }}
                >
                  <source src={
                    isMobile && frames[(currentFrame + 1) % frames.length].mobileVideo 
                      ? frames[(currentFrame + 1) % frames.length].mobileVideo 
                      : frames[(currentFrame + 1) % frames.length].video
                  } type="video/mp4" />
                </video>
              </motion.div>
            )}
          </div>

          {/* RIGHT SIDEBAR - Poetic Text */}
          {!isMobile && (
            <div className="flex flex-col justify-center" style={{ minWidth: '180px', maxWidth: '180px' }}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: 'rgba(201, 160, 99, 0.6)',
                    lineHeight: '2',
                    fontWeight: 300,
                  }}
                >
                  Every room<br />
                  holds a story.<br />
                  Every story,<br />
                  a part of you.
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Counter Pill - Bottom Center */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 z-40"
        style={{
          bottom: isMobile ? '80px' : '100px',
        }}
      >
        <div
          style={{
            padding: isMobile ? '6px 18px' : '8px 24px',
            borderRadius: '24px',
            border: '1px solid rgba(212, 175, 55, 0.5)',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(12px)',
            fontSize: isMobile ? '11px' : '12px',
            letterSpacing: '0.25em',
            color: '#D4AF37',
            fontWeight: 500,
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
          }}
        >
          {String(currentFrame + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}
        </div>
      </div>

      {/* Scroll Prompt */}
      <motion.div
        className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <p
          style={{
            fontSize: '9px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(201, 160, 99, 0.6)',
            fontWeight: 400,
          }}
        >
          Scroll to enter
        </p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D4AF37',
              background: 'rgba(0,0,0,0.3)',
            }}
          >
            <ChevronDown size={16} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CinematicHero;
