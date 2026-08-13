import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EsoLogo from './EsoLogo';

/**
 * Cinematic Museum Gallery Hero
 * Dramatic spotlight on active frame, circular carousel with hanging strings
 */
function CinematicHero() {
  const navigate = useNavigate();
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Story frames
  const storyFrames = [
    {
      id: 'welcome',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521558/fram1desktop_emb84g.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521557/frame1mobile_efrsvf.mp4',
      title: 'ESO',
      subtitle: 'your safe space to breathe',
      description: 'Home of introverts • deep thinkers • philosophers',
      memory: 'Chapter I',
    },
    {
      id: 'dark-confession',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786357230/frae2video_qmhpf7.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521557/frame2mob_pgzsnn.mp4',
      title: 'CONFESSION',
      subtitle: 'release what weighs on you',
      description: 'dark stories • secrets • regrets',
      memory: 'Chapter II',
      color: '#2EE6FF',
    },
    {
      id: 'dark-understanding',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786358832/frame3vid_1_hjyi09.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521554/frame3mob_h9pzrp.mp4',
      title: 'UNDERSTANDING',
      subtitle: "you're not alone",
      description: 'shared darkness • connection',
      memory: 'Chapter III',
      color: '#2EE6FF',
      buttonText: 'enter the dark',
    },
    {
      id: 'fantasy-daydream',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361397/frame4videoo_hizhue.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521551/frame4mob_ox4nlo.mp4',
      title: 'IMAGINATION',
      subtitle: 'where creativity flows',
      description: 'daydreams • artistic ideas',
      memory: 'Chapter IV',
      color: '#FF9D1C',
    },
    {
      id: 'fantasy-vibes',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361396/frame5v_wtvs09.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521549/frame5mob_q1ynbk.mp4',
      title: 'VIBES',
      subtitle: 'fun • jokes • fantasies',
      description: 'creative energy • music',
      memory: 'Chapter V',
      color: '#FF9D1C',
      buttonText: 'enter the fantasy',
    },
    {
      id: 'philo-questioning',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361397/frame6v_ijhpzm.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521551/frame6mob_xjoxtz.mp4',
      title: 'QUESTIONING',
      subtitle: 'the big questions',
      description: 'philosophy • spirituality',
      memory: 'Chapter VI',
      color: '#B56DFF',
    },
    {
      id: 'philo-truth',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361701/frame7vide_yp9dc4.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521556/frame7mob_ovz0to.mp4',
      title: 'TRUTH',
      subtitle: 'conspiracy • unique ideas',
      description: 'cosmic connection • mystery',
      memory: 'Chapter VII',
      color: '#B56DFF',
      buttonText: 'seek the truth',
    },
  ];

  // Navigate to next/previous
  const goToFrame = (direction) => {
    if (isTransitioning) return;
    
    let newFrame = currentFrame + direction;
    // Circular navigation
    if (newFrame < 0) newFrame = storyFrames.length - 1;
    if (newFrame >= storyFrames.length) newFrame = 0;
    
    setIsTransitioning(true);
    setCurrentFrame(newFrame);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToFrame(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToFrame(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentFrame, isTransitioning]);

  const currentStory = storyFrames[currentFrame];
  const isWelcome = currentFrame === 0;

  // Calculate positions for circular carousel
  const getFramePosition = (index) => {
    const total = storyFrames.length;
    const offset = index - currentFrame;
    
    // Circular positions
    if (offset === 0) {
      // Active frame - center, large
      return {
        x: '50%',
        translateX: '-50%',
        scale: isMobile ? 0.85 : 1,
        opacity: 1,
        zIndex: 50,
        brightness: 1,
      };
    } else if (offset === 1 || offset === -(total - 1)) {
      // Right neighbor
      return {
        x: isMobile ? '85%' : '75%',
        translateX: '-50%',
        scale: isMobile ? 0.4 : 0.5,
        opacity: 0.3,
        zIndex: 30,
        brightness: 0.3,
      };
    } else if (offset === -1 || offset === (total - 1)) {
      // Left neighbor
      return {
        x: isMobile ? '15%' : '25%',
        translateX: '-50%',
        scale: isMobile ? 0.4 : 0.5,
        opacity: 0.3,
        zIndex: 30,
        brightness: 0.3,
      };
    } else if (offset === 2 || offset === -(total - 2)) {
      // Far right
      return {
        x: isMobile ? '100%' : '90%',
        translateX: '-50%',
        scale: isMobile ? 0.25 : 0.35,
        opacity: 0.15,
        zIndex: 20,
        brightness: 0.2,
      };
    } else if (offset === -2 || offset === (total - 2)) {
      // Far left
      return {
        x: isMobile ? '0%' : '10%',
        translateX: '-50%',
        scale: isMobile ? 0.25 : 0.35,
        opacity: 0.15,
        zIndex: 20,
        brightness: 0.2,
      };
    } else {
      // Hidden
      return {
        x: offset > 0 ? '110%' : '-10%',
        translateX: '-50%',
        scale: 0.2,
        opacity: 0,
        zIndex: 10,
        brightness: 0.1,
      };
    }
  };

  return (
    <div 
      className="relative overflow-hidden"
      style={{
        minHeight: '100vh',
        background: '#000000',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Global scrollbar hide */}
      <style>{`
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        *::-webkit-scrollbar {
          display: none;
        }
        body {
          overflow-x: hidden;
        }
      `}</style>

      {/* Dramatic spotlight - follows active frame */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none"
        style={{
          width: isMobile ? '200%' : '120%',
          height: isMobile ? '80%' : '100%',
          background: `radial-gradient(ellipse 35% 50% at 50% 30%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 60%)`,
          zIndex: 40,
          transition: 'all 0.8s ease',
        }}
      />

      {/* Ceiling light - pulled down, fully visible */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
        style={{
          top: isMobile ? '100px' : '120px',
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Light fixture */}
        <div
          className="relative"
          style={{
            width: isMobile ? '100px' : '150px',
            height: isMobile ? '50px' : '70px',
          }}
        >
          {/* Light body - brighter */}
          <div
            style={{
              width: '100%',
              height: '80%',
              background: 'linear-gradient(to bottom, #ffffff 0%, #f5f5f5 30%, #e0e0e0 70%, #d4a574 100%)',
              borderRadius: '50%',
              boxShadow: `
                0 0 60px rgba(255, 255, 255, 0.9),
                0 0 120px rgba(255, 255, 255, 0.5),
                0 15px 40px rgba(0, 0, 0, 0.6)
              `,
              border: '2px solid rgba(200, 200, 200, 0.3)',
            }}
          />
          {/* Strong light beam */}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2"
            style={{
              width: isMobile ? '300px' : '500px',
              height: isMobile ? '400px' : '600px',
              background: 'radial-gradient(ellipse 40% 60% at 50% 0%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%)',
              filter: 'blur(20px)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </motion.div>

      {/* Frames carousel - circular layout */}
      <div
        className="relative"
        style={{
          minHeight: '100vh',
          paddingTop: isMobile ? '250px' : '320px',
          paddingBottom: isMobile ? '150px' : '200px',
        }}
      >
        {storyFrames.map((story, index) => {
          const position = getFramePosition(index);
          const isActive = index === currentFrame;
          const stringHeight = isMobile ? 100 : 150;
          
          return (
            <motion.div
              key={story.id}
              className="absolute"
              style={{
                left: position.x,
                top: isMobile ? '250px' : '320px',
                transform: `translateX(${position.translateX})`,
              }}
              animate={{
                left: position.x,
                scale: position.scale,
                opacity: position.opacity,
                zIndex: position.zIndex,
              }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Hanging string - VISIBLE */}
              <svg
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{
                  top: `-${stringHeight}px`,
                  width: '3px',
                  height: `${stringHeight}px`,
                  zIndex: position.zIndex + 5,
                  opacity: isActive ? 1 : 0.4,
                }}
              >
                <defs>
                  <linearGradient id={`string-grad-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={isActive ? '#cccccc' : '#666666'} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={isActive ? '#999999' : '#444444'} stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                <line
                  x1="1.5"
                  y1="0"
                  x2="1.5"
                  y2={stringHeight}
                  stroke={`url(#string-grad-${index})`}
                  strokeWidth="3"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
                />
              </svg>

              {/* Frame with dramatic lighting */}
              <motion.div
                onClick={() => {
                  if (!isTransitioning && !isActive) {
                    setIsTransitioning(true);
                    setCurrentFrame(index);
                    setTimeout(() => setIsTransitioning(false), 800);
                  }
                }}
                animate={{
                  rotateZ: isActive ? [0, 0.8, -0.8, 0] : [0, 0.4, -0.4, 0],
                }}
                transition={{
                  rotateZ: {
                    duration: isActive ? 5 : 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
                style={{
                  width: isMobile ? '280px' : '500px',
                  cursor: isActive ? 'default' : 'pointer',
                }}
              >
                {/* Wooden frame */}
                <div
                  className="relative"
                  style={{
                    aspectRatio: isMobile ? '9/16' : '16/9',
                    padding: isMobile ? '10px' : '14px',
                    background: isActive
                      ? 'linear-gradient(135deg, #6b5a48 0%, #4a3a2a 50%, #3a2a1a 100%)'
                      : 'linear-gradient(135deg, #3a2a1a 0%, #2a1a0a 50%, #1a0a00 100%)',
                    boxShadow: isActive
                      ? `
                          inset 0 3px 12px rgba(0, 0, 0, 0.9),
                          inset 0 -3px 12px rgba(0, 0, 0, 0.7),
                          0 25px 80px rgba(0, 0, 0, 0.95),
                          0 0 80px ${story.color ? story.color + '60' : 'rgba(255, 255, 255, 0.4)'},
                          0 0 40px ${story.color ? story.color + '80' : 'rgba(255, 255, 255, 0.3)'}
                        `
                      : `
                          inset 0 2px 8px rgba(0, 0, 0, 0.9),
                          0 10px 30px rgba(0, 0, 0, 0.9)
                        `,
                    border: isActive ? '3px solid #5a4a38' : '2px solid #2a1a0a',
                    borderRadius: '6px',
                    transition: 'all 0.8s ease',
                  }}
                >
                  {/* Inner frame edge */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '10px',
                      border: `1px solid ${isActive ? 'rgba(139, 115, 85, 0.5)' : 'rgba(139, 115, 85, 0.2)'}`,
                      borderRadius: '4px',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Video content */}
                  <div
                    className="relative w-full h-full overflow-hidden rounded"
                    style={{
                      background: '#000',
                    }}
                  >
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      style={{
                        filter: `brightness(${position.brightness}) contrast(${isActive ? 1.1 : 0.8})`,
                        transition: 'filter 0.8s ease',
                      }}
                    >
                      <source 
                        src={isMobile && story.mobileVideo ? story.mobileVideo : story.video} 
                        type="video/mp4" 
                      />
                    </video>

                    {/* Dramatic vignette - stronger on inactive */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: isActive
                          ? 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.5) 100%)'
                          : 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.9) 100%)',
                        transition: 'background 0.8s ease',
                      }}
                    />
                  </div>

                  {/* Corner clips */}
                  {[
                    { top: '-10px', left: '-10px' },
                    { top: '-10px', right: '-10px' },
                    { bottom: '-10px', left: '-10px' },
                    { bottom: '-10px', right: '-10px' },
                  ].map((pos, i) => (
                    <div
                      key={i}
                      className="absolute"
                      style={{
                        ...pos,
                        width: isActive ? '20px' : '16px',
                        height: isActive ? '20px' : '16px',
                        background: isActive
                          ? 'radial-gradient(circle, #7b6754 0%, #4d3f33 100%)'
                          : 'radial-gradient(circle, #3d2f23 0%, #2d1f13 100%)',
                        borderRadius: '50%',
                        boxShadow: isActive
                          ? '0 3px 10px rgba(0,0,0,0.9), inset 0 1px 3px rgba(255,255,255,0.3)'
                          : '0 2px 6px rgba(0,0,0,0.8)',
                        border: '1px solid rgba(0,0,0,0.5)',
                        transition: 'all 0.8s ease',
                      }}
                    />
                  ))}
                </div>

                {/* Info below frame - only for active */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 text-center"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6 }}
                      style={{
                        width: '120%',
                      }}
                    >
                      {/* Chapter label */}
                      <span
                        className={`block tracking-[0.3em] uppercase mb-2 ${
                          isMobile ? 'text-[10px]' : 'text-xs'
                        }`}
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: story.color || 'rgba(255, 255, 255, 0.7)',
                          textShadow: `0 0 20px ${story.color || 'rgba(255, 255, 255, 0.5)'}`,
                          fontWeight: 300,
                        }}
                      >
                        {story.memory}
                      </span>
                      
                      {/* Title */}
                      {isWelcome ? (
                        <EsoLogo 
                          className={`w-auto mx-auto ${isMobile ? 'h-10' : 'h-14'}`}
                          style={{
                            filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.6))',
                          }}
                        />
                      ) : (
                        <h2
                          className={`tracking-[0.2em] uppercase mb-1 ${
                            isMobile ? 'text-xl' : 'text-3xl'
                          }`}
                          style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#ffffff',
                            textShadow: `0 0 40px ${story.color || 'rgba(255, 255, 255, 0.8)'}, 0 4px 20px rgba(0,0,0,0.9)`,
                            fontWeight: 300,
                          }}
                        >
                          {story.title}
                        </h2>
                      )}
                      
                      {/* Subtitle */}
                      <p
                        className={`tracking-[0.25em] uppercase ${
                          isMobile ? 'text-[9px]' : 'text-xs'
                        }`}
                        style={{
                          color: story.color || 'rgba(255, 255, 255, 0.7)',
                          textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                        }}
                      >
                        {story.subtitle}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => goToFrame(-1)}
        className="fixed left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300 hover:scale-110"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: isMobile ? '40px' : '50px',
          height: isMobile ? '40px' : '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: isMobile ? '20px' : '24px',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
        }}
      >
        ‹
      </button>

      <button
        onClick={() => goToFrame(1)}
        className="fixed right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300 hover:scale-110"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: isMobile ? '40px' : '50px',
          height: isMobile ? '40px' : '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: isMobile ? '20px' : '24px',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
        }}
      >
        ›
      </button>

      {/* Navigation dots */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
        {storyFrames.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentFrame(idx);
                setTimeout(() => setIsTransitioning(false), 800);
              }
            }}
            className="transition-all duration-300"
            style={{
              width: currentFrame === idx ? '28px' : '10px',
              height: '10px',
              borderRadius: '5px',
              background: currentFrame === idx 
                ? (currentStory.color || 'rgba(255, 255, 255, 0.9)')
                : 'rgba(255, 255, 255, 0.3)',
              boxShadow: currentFrame === idx 
                ? `0 0 20px ${currentStory.color || 'rgba(255, 255, 255, 0.8)'}` 
                : 'none',
              cursor: 'pointer',
              border: 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default CinematicHero;
