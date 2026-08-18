import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import EsoLogo from './EsoLogo';

/**
 * Cinematic Hero - Memory Palace Style
 * Three-column layout with side previews, vertical counter, poetic text
 */
function CinematicHero() {
  const containerRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
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
  const videoSource = isMobile && currentFrameData.mobileVideo ? currentFrameData.mobileVideo : currentFrameData.video;

  return (
    <div ref={containerRef} className="relative w-full bg-black" style={{ height: '100vh', fontFamily: 'var(--font-body)', overflow: 'hidden' }}>
      
      {/* Three Column Layout */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ 
        paddingTop: isMobile ? '100px' : '80px', 
        paddingBottom: isMobile ? '100px' : '80px',
        paddingLeft: isMobile ? '16px' : '32px',
        paddingRight: isMobile ? '16px' : '32px',
      }}>
        <div className="relative w-full max-w-[1400px] mx-auto flex items-center justify-center" style={{ gap: isMobile ? '0' : '48px' }}>
          
          {/* LEFT: Vertical Numbers */}
          {!isMobile && (
            <div className="flex flex-col justify-center gap-4" style={{ minWidth: '80px' }}>
              {frames.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToFrame(index)}
                  className="text-left transition-all duration-300 relative flex items-center"
                  style={{
                    fontSize: '15px',
                    letterSpacing: '0.15em',
                    color: index === currentFrame ? 'rgba(184, 134, 11, 0.95)' : 'rgba(184, 134, 11, 0.35)',
                    fontWeight: index === currentFrame ? 600 : 400,
                    cursor: 'pointer',
                    paddingLeft: index === currentFrame ? '24px' : '0',
                  }}
                  whileHover={{ color: 'rgba(184, 134, 11, 0.85)', paddingLeft: '24px' }}
                >
                  {index === currentFrame && (
                    <motion.div
                      layoutId="sidebarIndicator"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '14px',
                        height: '2px',
                        background: 'rgba(184, 134, 11, 0.85)',
                        boxShadow: '0 0 10px rgba(184, 134, 11, 0.6)',
                      }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                  )}
                  {String(index + 1).padStart(2, '0')}
                </motion.button>
              ))}
            </div>
          )}

          {/* CENTER: Main Frame + Side Previews */}
          <div className="relative flex items-center justify-center" style={{ gap: isMobile ? '0' : '24px', flex: 1 }}>
            
            {/* Prev Preview */}
            {!isMobile && (
              <motion.div
                className="relative cursor-pointer flex-shrink-0"
                onClick={goToPrev}
                style={{
                  width: '120px',
                  height: '220px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '2px solid rgba(184, 134, 11, 0.25)',
                  opacity: 0.4,
                  background: 'rgba(0,0,0,0.5)',
                }}
                whileHover={{ opacity: 0.7, scale: 1.03 }}
              >
                <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }}>
                  <source src={isMobile && frames[(currentFrame - 1 + frames.length) % frames.length].mobileVideo ? frames[(currentFrame - 1 + frames.length) % frames.length].mobileVideo : frames[(currentFrame - 1 + frames.length) % frames.length].video} type="video/mp4" />
                </video>
              </motion.div>
            )}

            {/* Main Frame */}
            <div className="relative flex-shrink-0">
              
              {/* Ornate Finial */}
              <div className="absolute left-1/2 transform -translate-x-1/2 z-50 pointer-events-none" style={{ top: isMobile ? '-50px' : '-70px' }}>
                {/* Ornate top sphere */}
                <div style={{
                  width: isMobile ? '20px' : '28px',
                  height: isMobile ? '20px' : '28px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 30%, rgba(220, 180, 70, 0.9) 0%, rgba(184, 134, 11, 0.85) 50%, rgba(139, 111, 71, 0.8) 100%)',
                  margin: '0 auto 4px',
                  boxShadow: '0 0 20px rgba(184, 134, 11, 0.4), inset 0 2px 6px rgba(255,255,255,0.3)',
                  border: '1.5px solid rgba(184, 134, 11, 0.7)',
                }} />
                {/* Connecting rod */}
                <div style={{
                  width: isMobile ? '3px' : '4px',
                  height: isMobile ? '30px' : '50px',
                  background: 'linear-gradient(180deg, rgba(184, 134, 11, 0.85) 0%, rgba(139, 111, 71, 0.75) 100%)',
                  margin: '0 auto',
                  boxShadow: '0 0 8px rgba(184, 134, 11, 0.3)',
                }} />
              </div>

              {/* Frame Container - Landscape format */}
              <div style={{ 
                width: isMobile ? '90vw' : '800px', 
                height: isMobile ? 'calc(90vw * 0.56)' : '480px',
                maxWidth: isMobile ? '500px' : '800px',
                position: 'relative',
              }}>
                
                {/* Subtle Gold Border */}
                <div className="absolute inset-0 pointer-events-none z-20" style={{
                  border: isMobile ? '3px solid' : '6px solid',
                  borderImage: 'linear-gradient(135deg, rgba(220, 180, 70, 0.5) 0%, rgba(184, 134, 11, 0.55) 20%, rgba(139, 111, 71, 0.45) 40%, rgba(101, 84, 63, 0.4) 50%, rgba(139, 111, 71, 0.45) 60%, rgba(184, 134, 11, 0.55) 80%, rgba(220, 180, 70, 0.5) 100%) 1',
                  borderRadius: '12px',
                  boxShadow: '0 0 30px rgba(184, 134, 11, 0.2), inset 0 0 40px rgba(0,0,0,0.7), inset 0 2px 8px rgba(255,255,255,0.08)',
                }} />

                {/* Inner Shadow */}
                <div className="absolute inset-0 pointer-events-none z-10" style={{ 
                  borderRadius: '8px', 
                  boxShadow: 'inset 0 0 50px rgba(0,0,0,0.9)' 
                }} />

                {/* Video */}
                <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: '8px' }}>
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
                      transition={{ duration: 0.6 }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    >
                      <source src={videoSource} type="video/mp4" />
                    </motion.video>
                  </AnimatePresence>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 pointer-events-none" style={{ 
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 25%, transparent 45%, rgba(0,0,0,0.3) 100%)' 
                  }} />

                  {/* Text Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none" style={{ padding: isMobile ? '24px' : '48px' }}>
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
                            className="mb-6 w-auto" 
                            style={{ 
                              height: isMobile ? '36px' : '48px',
                              filter: 'drop-shadow(0 0 30px rgba(0,0,0,1))' 
                            }} 
                          />
                        )}
                        <h1 
                          className="font-light mb-4" 
                          style={{ 
                            fontSize: isMobile ? '28px' : '52px',
                            color: '#ffffff', 
                            letterSpacing: '0.3em', 
                            textShadow: '0 0 40px rgba(0,0,0,1), 0 6px 30px rgba(0,0,0,0.95)', 
                            fontWeight: 200 
                          }}
                        >
                          {currentFrameData.title}
                        </h1>
                        <div style={{ 
                          width: '4px', 
                          height: '4px', 
                          borderRadius: '50%', 
                          background: 'rgba(184, 134, 11, 0.8)', 
                          margin: '0 auto 18px', 
                          boxShadow: '0 0 14px rgba(184, 134, 11, 0.7)' 
                        }} />
                        <p 
                          className="mb-2" 
                          style={{ 
                            fontSize: isMobile ? '13px' : '16px',
                            color: 'rgba(255, 255, 255, 0.92)', 
                            letterSpacing: '0.2em', 
                            textTransform: 'uppercase', 
                            textShadow: '0 0 30px rgba(0,0,0,1), 0 4px 20px rgba(0,0,0,0.95)', 
                            fontWeight: 300 
                          }}
                        >
                          {currentFrameData.subtitle}
                        </p>
                        <p 
                          style={{ 
                            fontSize: isMobile ? '12px' : '14px',
                            color: 'rgba(255, 255, 255, 0.78)', 
                            letterSpacing: '0.2em', 
                            textTransform: 'uppercase', 
                            textShadow: '0 0 30px rgba(0,0,0,1), 0 4px 20px rgba(0,0,0,0.95)', 
                            fontWeight: 300 
                          }}
                        >
                          {currentFrameData.description}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Navigation Arrows */}
                  <button 
                    onClick={goToPrev} 
                    className="absolute top-1/2 transform -translate-y-1/2 z-30 transition-all duration-300 hover:scale-110" 
                    style={{ 
                      left: isMobile ? '12px' : '20px',
                      width: isMobile ? '38px' : '50px', 
                      height: isMobile ? '38px' : '50px', 
                      borderRadius: '50%', 
                      border: '2px solid rgba(184, 134, 11, 0.45)', 
                      background: 'rgba(0, 0, 0, 0.65)', 
                      backdropFilter: 'blur(10px)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer', 
                      color: 'rgba(184, 134, 11, 0.9)', 
                      boxShadow: '0 0 20px rgba(0,0,0,0.8)' 
                    }}
                  >
                    <ChevronLeft size={isMobile ? 20 : 28} />
                  </button>
                  <button 
                    onClick={goToNext} 
                    className="absolute top-1/2 transform -translate-y-1/2 z-30 transition-all duration-300 hover:scale-110" 
                    style={{ 
                      right: isMobile ? '12px' : '20px',
                      width: isMobile ? '38px' : '50px', 
                      height: isMobile ? '38px' : '50px', 
                      borderRadius: '50%', 
                      border: '2px solid rgba(184, 134, 11, 0.45)', 
                      background: 'rgba(0, 0, 0, 0.65)', 
                      backdropFilter: 'blur(10px)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer', 
                      color: 'rgba(184, 134, 11, 0.9)', 
                      boxShadow: '0 0 20px rgba(0,0,0,0.8)' 
                    }}
                  >
                    <ChevronRight size={isMobile ? 20 : 28} />
                  </button>
                </div>
              </div>
            </div>

            {/* Next Preview */}
            {!isMobile && (
              <motion.div
                className="relative cursor-pointer flex-shrink-0"
                onClick={goToNext}
                style={{
                  width: '120px',
                  height: '220px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '2px solid rgba(184, 134, 11, 0.25)',
                  opacity: 0.4,
                  background: 'rgba(0,0,0,0.5)',
                }}
                whileHover={{ opacity: 0.7, scale: 1.03 }}
              >
                <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }}>
                  <source src={isMobile && frames[(currentFrame + 1) % frames.length].mobileVideo ? frames[(currentFrame + 1) % frames.length].mobileVideo : frames[(currentFrame + 1) % frames.length].video} type="video/mp4" />
                </video>
              </motion.div>
            )}
          </div>

          {/* RIGHT: Poetic Text */}
          {!isMobile && (
            <div className="flex flex-col justify-center" style={{ minWidth: '200px', maxWidth: '200px' }}>
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 1, delay: 0.6 }}
              >
                <p style={{ 
                  fontSize: '11px', 
                  letterSpacing: '0.3em', 
                  textTransform: 'uppercase', 
                  color: 'rgba(184, 134, 11, 0.5)', 
                  lineHeight: '2.2', 
                  fontWeight: 300 
                }}>
                  Every room<br />holds a story.<br />Every story,<br />a part of you.
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Counter Pill */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 z-40" 
        style={{ bottom: isMobile ? '60px' : '80px' }}
      >
        <div style={{ 
          padding: isMobile ? '7px 20px' : '9px 26px', 
          borderRadius: '28px', 
          border: '1px solid rgba(184, 134, 11, 0.4)', 
          background: 'rgba(0, 0, 0, 0.75)', 
          backdropFilter: 'blur(14px)', 
          fontSize: isMobile ? '11px' : '13px', 
          letterSpacing: '0.28em', 
          color: 'rgba(184, 134, 11, 0.9)', 
          fontWeight: 500, 
          boxShadow: '0 4px 24px rgba(0,0,0,0.7)' 
        }}>
          {String(currentFrame + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}
        </div>
      </div>

      {/* Scroll Prompt */}
      <motion.div 
        className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none" 
        style={{ bottom: isMobile ? '20px' : '30px' }}
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1, delay: 1.5 }}
      >
        <p style={{ 
          fontSize: '9px', 
          letterSpacing: '0.35em', 
          textTransform: 'uppercase', 
          color: 'rgba(184, 134, 11, 0.5)', 
          fontWeight: 400 
        }}>
          Scroll to enter
        </p>
        <motion.div 
          animate={{ y: [0, 8, 0] }} 
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            border: '1px solid rgba(184, 134, 11, 0.4)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'rgba(184, 134, 11, 0.8)', 
            background: 'rgba(0,0,0,0.4)' 
          }}>
            <ChevronDown size={16} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CinematicHero;
