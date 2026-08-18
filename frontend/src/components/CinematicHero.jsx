import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import EsoLogo from './EsoLogo';

/**
 * Cinematic Hero - Museum Gallery Exhibition Interface
 * Centered and responsive - all elements contained within viewport
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

      {/* Main Centered Container */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          paddingTop: isMobile ? '80px' : '100px',
          paddingBottom: isMobile ? '80px' : '100px',
          paddingLeft: isMobile ? '20px' : '40px',
          paddingRight: isMobile ? '20px' : '40px',
        }}
      >
        {/* Gallery Stage with 3D Perspective */}
        <div 
          className="relative w-full h-full max-w-[1400px] mx-auto"
          style={{
            perspective: '1600px',
            perspectiveOrigin: 'center center',
          }}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            
            {/* Left Side Card */}
            {!isMobile && (
              <motion.div
                key={`prev-${currentFrame}`}
                onClick={goToPrev}
                className="absolute cursor-pointer"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 0.6, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  left: '2%',
                  top: '50%',
                  transform: 'translateY(-50%) rotateY(8deg) scale(0.7) translateZ(-100px)',
                  width: '13vw',
                  maxWidth: '180px',
                  height: '40vh',
                  maxHeight: '380px',
                  transformStyle: 'preserve-3d',
                  filter: 'brightness(0.6)',
                  zIndex: 30,
                }}
              >
                <div 
                  className="absolute inset-0"
                  style={{
                    border: `1px solid ${colors.darkGold}`,
                    borderRadius: '12px',
                    padding: '10px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <div 
                    className="absolute inset-2 overflow-hidden"
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
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                      }}
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

            {/* Center Active Card */}
            <motion.div
              key={`active-${currentFrame}`}
              className="relative"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: isMobile ? '90%' : '65%',
                height: isMobile ? '50%' : '70%',
                maxWidth: '900px',
                maxHeight: '600px',
                zIndex: 50,
              }}
            >
              {/* Suspension Cable */}
              {!isMobile && (
                <div 
                  className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none"
                  style={{
                    bottom: '100%',
                    marginBottom: '0px',
                    zIndex: 40,
                  }}
                >
                  <div 
                    style={{
                      width: '15px',
                      height: '15px',
                      borderRadius: '50%',
                      border: `1px solid ${colors.warmGold}`,
                      background: 'transparent',
                      margin: '0 auto 4px',
                    }}
                  />
                  <div 
                    style={{
                      width: '2px',
                      height: '80px',
                      background: `linear-gradient(180deg, ${colors.warmGold} 0%, ${colors.darkGold} 100%)`,
                      margin: '0 auto',
                      opacity: 0.7,
                    }}
                  />
                </div>
              )}

              {/* Outer Frame */}
              <div 
                className="absolute inset-0"
                style={{
                  border: `1px solid ${colors.mutedGold}`,
                  borderRadius: '12px',
                  padding: '12px',
                  boxShadow: '0 30px 100px rgba(0, 0, 0, 0.7)',
                }}
              >
                {/* Inner Frame */}
                <div 
                  className="absolute inset-3 overflow-hidden"
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
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        objectPosition: 'center center',
                      }}
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

                  {/* Content */}
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
                            fontSize: isMobile ? '18px' : 'clamp(24px, 2.5vw, 32px)',
                            fontWeight: 500,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: colors.editorialIvory,
                            marginBottom: '12px',
                            textShadow: '0 4px 25px rgba(0,0,0,0.95)',
                          }}
                        >
                          {currentFrameData.title}
                        </h1>

                        {/* Divider */}
                        <div 
                          className="flex items-center justify-center"
                          style={{ marginBottom: '12px', width: '100px', margin: '0 auto 12px' }}
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
                            fontSize: isMobile ? '8px' : '10px',
                            letterSpacing: '0.25em',
                            lineHeight: '1.9',
                            textTransform: 'uppercase',
                            color: `${colors.editorialIvory}DD`,
                            textShadow: '0 2px 15px rgba(0,0,0,0.95)',
                            marginBottom: '3px',
                          }}
                        >
                          {currentFrameData.subtitle}
                        </p>
                        <p 
                          style={{ 
                            fontSize: isMobile ? '8px' : '10px',
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

            {/* Right Side Card */}
            {!isMobile && (
              <motion.div
                key={`next-${currentFrame}`}
                onClick={goToNext}
                className="absolute cursor-pointer"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 0.55, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  right: '2%',
                  top: '50%',
                  transform: 'translateY(-50%) rotateY(-8deg) scale(0.7) translateZ(-100px)',
                  width: '13vw',
                  maxWidth: '180px',
                  height: '40vh',
                  maxHeight: '380px',
                  transformStyle: 'preserve-3d',
                  filter: 'brightness(0.5)',
                  zIndex: 30,
                }}
              >
                <div 
                  className="absolute inset-0"
                  style={{
                    border: `1px solid ${colors.darkGold}`,
                    borderRadius: '12px',
                    padding: '10px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <div 
                    className="absolute inset-2 overflow-hidden"
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
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                      }}
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

            {/* Navigation Arrows */}
            {!isMobile && (
              <>
                <button
                  onClick={goToPrev}
                  className="absolute transition-all duration-300"
                  style={{
                    left: '10%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    border: `1px solid ${colors.mutedGold}`,
                    background: 'transparent',
                    color: colors.paleGold,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 60,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.warmGold;
                    e.currentTarget.style.background = 'rgba(185, 135, 61, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.mutedGold;
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <ChevronLeft size={18} strokeWidth={1.5} />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute transition-all duration-300"
                  style={{
                    right: '10%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    border: `1px solid ${colors.mutedGold}`,
                    background: 'transparent',
                    color: colors.paleGold,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 60,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.warmGold;
                    e.currentTarget.style.background = 'rgba(185, 135, 61, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.mutedGold;
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <ChevronRight size={18} strokeWidth={1.5} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Left Gallery Index */}
      {!isMobile && (
        <div 
          className="absolute"
          style={{
            left: '30px',
            bottom: '120px',
            zIndex: 70,
          }}
        >
          <div 
            style={{
              position: 'absolute',
              left: '0',
              top: '0',
              width: '1px',
              height: '240px',
              background: `linear-gradient(180deg, ${colors.darkGold}00 0%, ${colors.darkGold} 20%, ${colors.darkGold} 80%, ${colors.darkGold}00 100%)`,
            }}
          />
          
          <div className="flex flex-col">
            {frames.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToFrame(index)}
                className="relative flex items-center transition-all duration-300"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  lineHeight: '32px',
                  color: index === currentFrame ? colors.paleGold : 'rgba(185, 135, 61, 0.4)',
                  cursor: 'pointer',
                  paddingLeft: '18px',
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
                        width: '38px',
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
                        width: '6px',
                        height: '6px',
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
      )}

      {/* Bottom Counter */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{ 
          bottom: isMobile ? '90px' : '30px',
          zIndex: 70,
        }}
      >
        <div 
          style={{
            width: '85px',
            height: '32px',
            border: `1px solid ${colors.mutedGold}`,
            borderRadius: '16px',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            letterSpacing: '0.15em',
            color: colors.warmGold,
            fontWeight: 500,
          }}
        >
          {String(currentFrame + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}
        </div>
      </div>

      {/* Scroll Prompt */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center pointer-events-none"
        style={{ 
          bottom: isMobile ? '30px' : '70px',
          zIndex: 70,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        {!isMobile && (
          <>
            <p 
              style={{
                fontSize: '8px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: colors.warmGold,
                marginBottom: '10px',
              }}
            >
              SCROLL TO ENTER
            </p>
            
            <div 
              style={{
                width: '1px',
                height: '22px',
                background: colors.mutedGold,
                marginBottom: '6px',
              }}
            />
          </>
        )}
        
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            border: `1px solid ${colors.warmGold}`,
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.paleGold,
          }}
        >
          <ChevronDown size={14} strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      {/* Right Editorial Statement - Outside Frame */}
      {!isMobile && (
        <div 
          className="absolute flex items-start gap-3"
          style={{
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '140px',
            zIndex: 70,
          }}
        >
          <div 
            style={{
              width: '1px',
              height: '90px',
              background: `linear-gradient(180deg, transparent 0%, ${colors.warmGold}80 20%, ${colors.warmGold}80 80%, transparent 100%)`,
            }}
          />
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <p 
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
                fontSize: '9px',
                lineHeight: '1.8',
                letterSpacing: '0.2em',
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
  );
}

export default CinematicHero;
