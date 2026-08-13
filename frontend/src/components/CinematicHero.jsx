import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EsoLogo from './EsoLogo';

/**
 * Cinematic Storytelling Hero - "Suspended Story World"
 * Hanging memories with ceiling light, strings, and cinematic atmosphere
 * A living room of memories suspended in darkness
 */
function CinematicHero() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Scroll-based parallax
  const { scrollY } = useScroll();
  const lightY = useTransform(scrollY, [0, 500], [0, -50]);
  const frameY = useTransform(scrollY, [0, 500], [0, 100]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Story frames - same video content, new presentation
  const storyFrames = [
    {
      id: 'welcome',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521558/fram1desktop_emb84g.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521557/frame1mobile_efrsvf.mp4',
      title: 'ESO',
      subtitle: 'your safe space to breathe',
      description: 'Home of introverts • deep thinkers • philosophers',
      memory: 'Chapter I',
      showButton: false,
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
      showButton: false,
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
      showButton: true,
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
      showButton: false,
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
      showButton: true,
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
      showButton: false,
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
      showButton: true,
      buttonText: 'seek the truth',
    },
  ];

  // Navigation between frames
  const goToFrame = (direction) => {
    if (isTransitioning) return;
    
    const newFrame = currentFrame + direction;
    if (newFrame >= 0 && newFrame < storyFrames.length) {
      setIsTransitioning(true);
      setCurrentFrame(newFrame);
      setTimeout(() => setIsTransitioning(false), 800);
    }
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

  // Scroll/swipe navigation - horizontal scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Determine which frame is most visible based on scroll position
      const scrollLeft = container.scrollLeft;
      const frameWidth = isMobile ? 350 : 600;
      const gap = 96; // 24 * 4 (gap-24 in rem)
      const totalWidth = frameWidth + gap;
      
      const newFrame = Math.round(scrollLeft / totalWidth);
      if (newFrame !== currentFrame && newFrame >= 0 && newFrame < storyFrames.length) {
        setCurrentFrame(newFrame);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentFrame, storyFrames.length, isMobile]);

  const currentStory = storyFrames[currentFrame];
  const isWelcome = currentFrame === 0;

  return (
    <div 
      ref={containerRef}
      className="relative"
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        fontFamily: 'var(--font-body)',
        overflowX: 'auto',
        overflowY: 'hidden',
        // Hide scrollbar
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
      }}
    >
      {/* Hide Chrome scrollbar */}
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Atmospheric dust particles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(isMobile ? 15 : 30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [Math.random() * 0.3, Math.random() * 0.5, Math.random() * 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Ceiling light - spotlight source */}
      <motion.div
        className="fixed left-1/2 transform -translate-x-1/2 z-20 pointer-events-none"
        style={{
          top: isMobile ? '80px' : '40px',
        }}
      >
        {/* Light fixture */}
        <div
          className="relative"
          style={{
            width: isMobile ? '80px' : '120px',
            height: isMobile ? '40px' : '60px',
          }}
        >
          {/* Light body */}
          <div
            style={{
              width: '100%',
              height: '70%',
              background: 'linear-gradient(to bottom, #d4a574 0%, #f5ddb8 50%, #d4a574 100%)',
              borderRadius: '50%',
              boxShadow: `
                0 0 40px rgba(212, 165, 116, 0.8),
                0 0 80px rgba(212, 165, 116, 0.4),
                0 10px 30px rgba(0, 0, 0, 0.5)
              `,
            }}
          />
          {/* Light glow */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2"
            style={{
              width: isMobile ? '200px' : '300px',
              height: isMobile ? '200px' : '300px',
              background: 'radial-gradient(circle, rgba(212, 165, 116, 0.4) 0%, transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </motion.div>

      {/* Horizontal gallery container */}
      <div
        className="flex items-center gap-24 px-24 py-32"
        style={{
          minHeight: '100vh',
          paddingTop: '180px',
          paddingBottom: '180px',
        }}
      >
        {/* All frames displayed consecutively */}
        {storyFrames.map((story, index) => {
          const isActive = index === currentFrame;
          const frameWidth = isActive ? (isMobile ? '90%' : '65%') : (isMobile ? '70%' : '45%');
          
          return (
            <div
              key={story.id}
              className="flex-shrink-0 relative"
              style={{
                width: isMobile ? '350px' : '600px',
                transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {/* Hanging strings from ceiling to each frame */}
              <svg
                className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none"
                style={{
                  top: isMobile ? '-120px' : '-140px',
                  width: '2px',
                  height: isMobile ? '120px' : '140px',
                  zIndex: 15,
                }}
              >
                <defs>
                  <linearGradient id={`string-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8b7355" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#8b7355" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <line
                  x1="1"
                  y1="0"
                  x2="1"
                  y2="100%"
                  stroke={`url(#string-${index})`}
                  strokeWidth="2"
                />
              </svg>

              {/* Frame container with sway animation */}
              <motion.div
                className="relative"
                animate={{
                  rotateZ: isActive ? [0, 0.5, -0.5, 0] : [0, 0.3, -0.3, 0],
                  scale: isActive ? 1.05 : 1,
                }}
                transition={{
                  rotateZ: {
                    duration: isActive ? 4 : 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                  scale: {
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true);
                    setCurrentFrame(index);
                    setTimeout(() => setIsTransitioning(false), 800);
                  }
                }}
                style={{
                  cursor: 'pointer',
                }}
              >
                {/* Frame structure - old wooden frame */}
                <div
                  className="relative"
                  style={{
                    aspectRatio: isMobile ? '9/16' : '16/9',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #5a4a3a 0%, #3d3226 50%, #2d2419 100%)',
                    boxShadow: isActive
                      ? `
                          inset 0 2px 10px rgba(0, 0, 0, 0.8),
                          inset 0 -2px 10px rgba(0, 0, 0, 0.6),
                          0 20px 60px rgba(0, 0, 0, 0.9),
                          0 0 60px ${story.color ? story.color + '50' : 'rgba(212, 165, 116, 0.4)'}
                        `
                      : `
                          inset 0 2px 10px rgba(0, 0, 0, 0.8),
                          inset 0 -2px 10px rgba(0, 0, 0, 0.6),
                          0 15px 40px rgba(0, 0, 0, 0.8),
                          0 0 30px ${story.color ? story.color + '20' : 'rgba(212, 165, 116, 0.15)'}
                        `,
                    border: '2px solid #4a3a2a',
                    borderRadius: '4px',
                    transition: 'all 0.6s ease',
                  }}
                >
                  {/* Frame inner edge */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '8px',
                      border: '1px solid rgba(139, 115, 85, 0.4)',
                      borderRadius: '2px',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Video content inside frame */}
                  <div
                    className="relative w-full h-full overflow-hidden rounded-sm"
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
                        opacity: isActive ? 1 : 0.7,
                        transition: 'opacity 0.6s ease',
                      }}
                    >
                      <source 
                        src={isMobile && story.mobileVideo ? story.mobileVideo : story.video} 
                        type="video/mp4" 
                      />
                    </video>

                    {/* Vignette overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
                      }}
                    />
                  </div>

                  {/* Hanging clips/pins at corners */}
                  {[
                    { top: '-8px', left: '-8px' },
                    { top: '-8px', right: '-8px' },
                    { bottom: '-8px', left: '-8px' },
                    { bottom: '-8px', right: '-8px' },
                  ].map((pos, i) => (
                    <div
                      key={i}
                      className="absolute"
                      style={{
                        ...pos,
                        width: '16px',
                        height: '16px',
                        background: 'radial-gradient(circle, #6b5744 0%, #3d2f23 100%)',
                        borderRadius: '50%',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.2)',
                        border: '1px solid #2d2419',
                      }}
                    />
                  ))}
                </div>

                {/* Memory label - vintage tag */}
                <motion.div
                  className="absolute -bottom-16 left-1/2 transform -translate-x-1/2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive ? 1 : 0.5 }}
                  transition={{ duration: 0.6 }}
                >
                  <span
                    className="text-xs tracking-[0.3em] uppercase block mb-1"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: isActive ? (story.color || 'rgba(212, 165, 116, 0.9)') : 'rgba(212, 165, 116, 0.5)',
                      textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                      fontWeight: 300,
                      transition: 'all 0.6s ease',
                    }}
                  >
                    {story.memory}
                  </span>
                  
                  {/* Title when active */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mt-2"
                    >
                      <h2
                        className="text-lg tracking-[0.2em] uppercase mb-1"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          color: '#ffffff',
                          textShadow: `0 0 20px ${story.color || 'rgba(212, 165, 116, 0.6)'}`,
                          fontWeight: 300,
                        }}
                      >
                        {story.title}
                      </h2>
                      <p
                        className="text-[10px] tracking-[0.25em] uppercase"
                        style={{
                          color: story.color || 'rgba(212, 165, 116, 0.7)',
                          textShadow: '0 2px 6px rgba(0,0,0,0.9)',
                        }}
                      >
                        {story.subtitle}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Navigation hint - bottom center */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <p
          className="text-[9px] tracking-[0.35em] uppercase mb-2 text-center"
          style={{
            color: 'rgba(212, 165, 116, 0.6)',
            fontFamily: 'var(--font-body)',
            textShadow: '0 2px 6px rgba(0,0,0,0.9)',
          }}
        >
          scroll to explore
        </p>
        <div className="flex gap-2 justify-center">
          {storyFrames.map((_, idx) => (
            <div
              key={idx}
              className="transition-all duration-300"
              style={{
                width: currentFrame === idx ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: currentFrame === idx 
                  ? (storyFrames[currentFrame].color || 'rgba(212, 165, 116, 0.9)')
                  : 'rgba(255, 255, 255, 0.3)',
                boxShadow: currentFrame === idx 
                  ? `0 0 15px ${storyFrames[currentFrame].color || 'rgba(212, 165, 116, 0.6)'}` 
                  : 'none',
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default CinematicHero;
