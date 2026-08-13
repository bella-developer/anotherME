import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EsoLogo from './EsoLogo';

/**
 * Cinematic Museum Gallery Hero
 * Horizontal scroll-based carousel with cinema spotlight
 */
function CinematicHero() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  // Detect mobile and window size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Story frames
  const storyFrames = [
    {
      id: 'welcome',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521558/fram1desktop_emb84g.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521557/frame1mobile_efrsvf.mp4',
      title: 'ESO',
      subtitle: 'your safe space to breathe',
      color: '#ffffff',
    },
    {
      id: 'dark-confession',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786357230/frae2video_qmhpf7.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521557/frame2mob_pgzsnn.mp4',
      title: 'CONFESSION',
      subtitle: 'release what weighs on you',
      color: '#2EE6FF',
    },
    {
      id: 'dark-understanding',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786358832/frame3vid_1_hjyi09.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521554/frame3mob_h9pzrp.mp4',
      title: 'UNDERSTANDING',
      subtitle: "you're not alone",
      color: '#2EE6FF',
    },
    {
      id: 'fantasy-daydream',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361397/frame4videoo_hizhue.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521551/frame4mob_ox4nlo.mp4',
      title: 'IMAGINATION',
      subtitle: 'where creativity flows',
      color: '#FF9D1C',
    },
    {
      id: 'fantasy-vibes',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361396/frame5v_wtvs09.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521549/frame5mob_q1ynbk.mp4',
      title: 'VIBES',
      subtitle: 'fun • jokes • fantasies',
      color: '#FF9D1C',
    },
    {
      id: 'philo-questioning',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361397/frame6v_ijhpzm.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521551/frame6mob_xjoxtz.mp4',
      title: 'QUESTIONING',
      subtitle: 'the big questions',
      color: '#B56DFF',
    },
    {
      id: 'philo-truth',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361701/frame7vide_yp9dc4.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521556/frame7mob_ovz0to.mp4',
      title: 'TRUTH',
      subtitle: 'conspiracy • unique ideas',
      color: '#B56DFF',
    },
  ];

  // Responsive frame sizing - active frame takes huge center space
  const getFrameSizes = () => {
    if (!windowWidth) return { active: 800, inactive: 300, gap: 40 };
    
    // Calculate: 6px margins + 2 inactive frames on each side + 1 active in center
    const totalMargin = 12; // 6px left + 6px right
    const availableWidth = windowWidth - totalMargin;
    
    if (isMobile) {
      // Mobile: active takes 75%, inactive takes remaining space
      const activeWidth = availableWidth * 0.75;
      const inactiveWidth = (availableWidth - activeWidth) / 4; // 2 on each side
      return { active: activeWidth, inactive: inactiveWidth, gap: 8 };
    } else {
      // Desktop: active takes 60%, inactive share remaining
      const activeWidth = availableWidth * 0.6;
      const inactiveWidth = (availableWidth - activeWidth) / 4;
      return { active: activeWidth, inactive: inactiveWidth, gap: 20 };
    }
  };

  const { active: activeWidth, inactive: inactiveWidth, gap } = getFrameSizes();

  // Detect scroll position and update current frame
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const frameWidth = activeWidth + gap;
      const newFrame = Math.round(scrollLeft / frameWidth);
      
      if (newFrame !== currentFrame && newFrame >= 0 && newFrame < storyFrames.length) {
        setCurrentFrame(newFrame);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentFrame, activeWidth, gap, storyFrames.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextScroll = (currentFrame + 1) * (activeWidth + gap);
        container.scrollTo({ left: nextScroll, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevScroll = (currentFrame - 1) * (activeWidth + gap);
        container.scrollTo({ left: prevScroll, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentFrame, activeWidth, gap]);

  const currentStory = storyFrames[currentFrame];
  const isWelcome = currentFrame === 0;
  const stringHeight = isMobile ? 120 : 180;

  return (
    <div 
      className="relative overflow-hidden"
      style={{
        height: '100vh',
        width: '100vw',
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
      `}</style>

      {/* Cinema spotlight - focused beam on center */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none"
        style={{
          width: isMobile ? '60%' : '50%',
          height: '100%',
          background: `radial-gradient(ellipse 25% 45% at 50% 15%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.08) 30%, transparent 55%)`,
          zIndex: 45,
          transition: 'all 0.8s ease',
        }}
      />

      {/* Cinema spotlight fixture - professional theatrical light */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
        style={{
          top: isMobile ? '65px' : '65px', // Just below navbar
        }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div
          className="relative"
          style={{
            width: isMobile ? '60px' : '80px',
            height: isMobile ? '80px' : '100px',
          }}
        >
          {/* Theatrical spotlight body */}
          <div
            style={{
              width: '100%',
              height: '60%',
              background: 'linear-gradient(to bottom, #1a1a1a 0%, #2a2a2a 20%, #3a3a3a 80%, #1a1a1a 100%)',
              borderRadius: '50% 50% 45% 45%',
              boxShadow: `
                inset 0 -3px 8px rgba(0, 0, 0, 0.8),
                0 5px 20px rgba(0, 0, 0, 0.9)
              `,
              border: '1px solid #0a0a0a',
              position: 'relative',
            }}
          >
            {/* Light lens/glass */}
            <div
              style={{
                position: 'absolute',
                bottom: '-5px',
                left: '10%',
                right: '10%',
                height: '25%',
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 220, 0.7) 50%, rgba(255, 230, 180, 0.5) 100%)',
                borderRadius: '50%',
                boxShadow: `
                  0 0 30px rgba(255, 255, 255, 0.8),
                  0 0 60px rgba(255, 255, 255, 0.4),
                  inset 0 2px 5px rgba(255, 255, 255, 0.6)
                `,
              }}
            />
          </div>

          {/* Focused light beam */}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2"
            style={{
              width: isMobile ? '200px' : '300px',
              height: isMobile ? '600px' : '800px',
              background: 'radial-gradient(ellipse 20% 50% at 50% 0%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.15) 25%, rgba(255, 248, 220, 0.08) 45%, transparent 60%)',
              filter: 'blur(12px)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </motion.div>

      {/* Horizontal scroll container - 6px margins, centered */}
      <div
        ref={scrollContainerRef}
        className="absolute"
        style={{
          top: isMobile ? '180px' : '200px',
          left: '6px',
          right: '6px',
          height: isMobile ? 'calc(100vh - 240px)' : 'calc(100vh - 250px)',
          overflowX: 'auto',
          overflowY: 'hidden',
          display: 'flex',
          gap: `${gap}px`,
          alignItems: 'center',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          paddingLeft: `calc(50vw - ${activeWidth / 2}px - 6px)`,
          paddingRight: `calc(50vw - ${activeWidth / 2}px - 6px)`,
        }}
      >
        {storyFrames.map((story, index) => {
          const isActive = index === currentFrame;
          const distance = Math.abs(index - currentFrame);
          
          // Width based on distance from active
          let frameWidth = inactiveWidth;
          if (isActive) frameWidth = activeWidth;
          
          // Height calculation - active is taller
          const frameHeight = isActive 
            ? (isMobile ? '70vh' : '75vh')
            : (isMobile ? '45vh' : '50vh');
          
          return (
            <motion.div
              key={story.id}
              style={{
                width: `${frameWidth}px`,
                height: frameHeight,
                flexShrink: 0,
                scrollSnapAlign: 'center',
                position: 'relative',
                opacity: distance > 2 ? 0 : 1,
                transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {/* HUGE metal string */}
              <svg
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{
                  top: `-${stringHeight}px`,
                  width: '6px',
                  height: `${stringHeight}px`,
                  zIndex: 60,
                  opacity: distance > 1 ? 0.3 : (isActive ? 1 : 0.6),
                }}
              >
                <defs>
                  <linearGradient id={`metal-string-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={isActive ? '#e0e0e0' : '#606060'} stopOpacity="0.9" />
                    <stop offset="50%" stopColor={isActive ? '#ffffff' : '#808080'} stopOpacity="1" />
                    <stop offset="100%" stopColor={isActive ? '#e0e0e0' : '#606060'} stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id={`metal-depth-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={isActive ? '#d0d0d0' : '#707070'} stopOpacity="1" />
                    <stop offset="100%" stopColor={isActive ? '#a0a0a0' : '#505050'} stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                {/* Metal cable - thick and industrial */}
                <rect
                  x="0"
                  y="0"
                  width="6"
                  height={stringHeight}
                  fill={`url(#metal-depth-${index})`}
                  filter="drop-shadow(0 3px 8px rgba(0,0,0,0.9)) drop-shadow(0 0 2px rgba(255,255,255,0.3))"
                />
                <line
                  x1="1"
                  y1="0"
                  x2="1"
                  y2={stringHeight}
                  stroke={`url(#metal-string-${index})`}
                  strokeWidth="1"
                  opacity="0.8"
                />
              </svg>

              {/* Frame - NO SHADOWS */}
              <motion.div
                animate={{
                  rotateZ: isActive ? [0, 0.6, -0.6, 0] : [0, 0.3, -0.3, 0],
                }}
                transition={{
                  rotateZ: {
                    duration: isActive ? 6 : 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                {/* Wooden frame - NO BOX SHADOW */}
                <div
                  className="relative w-full h-full"
                  style={{
                    padding: isMobile ? '8px' : '12px',
                    background: isActive
                      ? 'linear-gradient(135deg, #7a6a58 0%, #5a4a38 50%, #4a3a28 100%)'
                      : 'linear-gradient(135deg, #3a2a1a 0%, #2a1a0a 50%, #1a0a00 100%)',
                    border: isActive ? '2px solid #6a5a48' : '1px solid #2a1a0a',
                    borderRadius: '4px',
                  }}
                >
                  {/* Inner frame edge */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '6px',
                      border: `1px solid ${isActive ? 'rgba(139, 115, 85, 0.4)' : 'rgba(139, 115, 85, 0.1)'}`,
                      borderRadius: '2px',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Video content */}
                  <div className="relative w-full h-full overflow-hidden rounded">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      style={{
                        filter: `brightness(${isActive ? 1 : 0.2}) contrast(${isActive ? 1.05 : 0.8})`,
                        transition: 'filter 0.8s ease',
                      }}
                    >
                      <source 
                        src={isMobile && story.mobileVideo ? story.mobileVideo : story.video} 
                        type="video/mp4" 
                      />
                    </video>

                    {/* Text overlay - only on active */}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 50%, transparent 100%)',
                          padding: isMobile ? '40px 15px 25px' : '60px 40px 35px',
                        }}
                      >
                        {isWelcome ? (
                          <EsoLogo 
                            className={`w-auto mx-auto mb-2 ${isMobile ? 'h-10' : 'h-14'}`}
                            style={{
                              filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.9))',
                            }}
                          />
                        ) : (
                          <h2
                            className={`tracking-[0.2em] uppercase mb-2 ${
                              isMobile ? 'text-xl' : 'text-4xl'
                            }`}
                            style={{
                              fontFamily: 'var(--font-heading)',
                              color: '#ffffff',
                              textShadow: `0 0 40px ${story.color}, 0 4px 20px rgba(0,0,0,1)`,
                              fontWeight: 300,
                            }}
                          >
                            {story.title}
                          </h2>
                        )}
                        
                        <p
                          className={`tracking-[0.25em] uppercase ${
                            isMobile ? 'text-[10px]' : 'text-sm'
                          }`}
                          style={{
                            color: story.color || 'rgba(255, 255, 255, 0.9)',
                            textShadow: '0 2px 12px rgba(0,0,0,1)',
                            fontWeight: 400,
                          }}
                        >
                          {story.subtitle}
                        </p>
                      </motion.div>
                    )}

                    {/* Heavy vignette on inactive */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: isActive
                          ? 'radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.4) 100%)'
                          : 'radial-gradient(circle at center, transparent 10%, rgba(0,0,0,0.97) 100%)',
                        transition: 'background 0.8s ease',
                      }}
                    />
                  </div>

                  {/* Corner clips */}
                  {[
                    { top: '-8px', left: '-8px' },
                    { top: '-8px', right: '-8px' },
                    { bottom: '-8px', left: '-8px' },
                    { bottom: '-8px', right: '-8px' },
                  ].map((pos, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        ...pos,
                        width: isActive ? '18px' : '14px',
                        height: isActive ? '18px' : '14px',
                        background: isActive
                          ? 'radial-gradient(circle, #8a7a68 0%, #5a4a38 100%)'
                          : 'radial-gradient(circle, #3a2a1a 0%, #2a1a0a 100%)',
                        borderRadius: '50%',
                        border: '1px solid rgba(0,0,0,0.6)',
                        transition: 'all 0.8s ease',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default CinematicHero;
