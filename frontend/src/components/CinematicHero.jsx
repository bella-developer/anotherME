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

  // Scroll/swipe navigation
  useEffect(() => {
    let scrollTimeout;
    
    const handleWheel = (e) => {
      if (currentFrame === storyFrames.length - 1 && e.deltaY > 0) {
        return; // Allow scroll past last frame
      }
      
      e.preventDefault();
      if (isTransitioning) return;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (e.deltaY > 0) goToFrame(1);
        else if (e.deltaY < 0) goToFrame(-1);
      }, 150);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      clearTimeout(scrollTimeout);
      if (container) container.removeEventListener('wheel', handleWheel);
    };
  }, [currentFrame, isTransitioning, storyFrames.length]);

  const currentStory = storyFrames[currentFrame];
  const isWelcome = currentFrame === 0;

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        height: '100vh',
        background: '#0a0a0a',
        fontFamily: 'var(--font-body)',
      }}
    >
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
        className="absolute left-1/2 transform -translate-x-1/2 z-20 pointer-events-none"
        style={{
          top: isMobile ? '80px' : '40px',
          y: lightY,
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

      {/* Hanging strings from ceiling light */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-15"
        style={{ opacity: 0.6 }}
      >
        <defs>
          <linearGradient id="stringGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b7355" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b7355" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        {/* Center string - main frame */}
        <motion.line
          x1="50%"
          y1={isMobile ? "100" : "80"}
          x2="50%"
          y2={isMobile ? "35%" : "40%"}
          stroke="url(#stringGradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>

      {/* Main hanging frame - center stage */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 z-30"
        style={{
          top: isMobile ? '35%' : '40%',
          y: frameY,
          width: isMobile ? '85%' : '50%',
          maxWidth: isMobile ? '400px' : '700px',
        }}
        initial={{ y: -100, opacity: 0, rotateX: -15 }}
        animate={{ 
          y: 0, 
          opacity: 1, 
          rotateX: 0,
          rotateZ: [0, 0.5, -0.5, 0], // Gentle sway
        }}
        transition={{
          y: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 1 },
          rotateX: { duration: 1.2 },
          rotateZ: { 
            duration: 4, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          },
        }}
      >
        {/* Frame structure - old wooden frame */}
        <div
          className="relative"
          style={{
            aspectRatio: isMobile ? '9/16' : '16/9',
            padding: '12px',
            background: 'linear-gradient(135deg, #5a4a3a 0%, #3d3226 50%, #2d2419 100%)',
            boxShadow: `
              inset 0 2px 10px rgba(0, 0, 0, 0.8),
              inset 0 -2px 10px rgba(0, 0, 0, 0.6),
              0 20px 60px rgba(0, 0, 0, 0.9),
              0 0 40px ${currentStory.color ? currentStory.color + '30' : 'rgba(212, 165, 116, 0.2)'}
            `,
            border: '2px solid #4a3a2a',
            borderRadius: '4px',
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
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFrame}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
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
              >
                <source 
                  src={isMobile && currentStory.mobileVideo ? currentStory.mobileVideo : currentStory.video} 
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
            </motion.div>
          </AnimatePresence>

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
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span
            className="text-xs tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'rgba(212, 165, 116, 0.8)',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              fontWeight: 300,
            }}
          >
            {currentStory.memory}
          </span>
        </motion.div>
      </motion.div>

      {/* Text content - floating below frame */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 z-40 text-center"
        style={{
          bottom: isMobile ? '120px' : '15%',
          width: isMobile ? '90%' : '70%',
          maxWidth: '800px',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFrame}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
          >
            {/* Title */}
            {isWelcome ? (
              <motion.div 
                className="flex justify-center mb-3"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <EsoLogo 
                  className={`w-auto ${isMobile ? 'h-12' : 'h-16'}`} 
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(212, 165, 116, 0.4))',
                  }} 
                />
              </motion.div>
            ) : (
              <h1
                className={`font-light tracking-wider leading-none mb-3 ${
                  isMobile ? 'text-2xl' : 'text-5xl'
                }`}
                style={{
                  color: '#ffffff',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 300,
                  letterSpacing: '0.15em',
                  textShadow: currentStory.color
                    ? `0 0 30px ${currentStory.color}60, 0 4px 15px rgba(0,0,0,0.9)`
                    : '0 0 30px rgba(212, 165, 116, 0.5), 0 4px 15px rgba(0,0,0,0.9)',
                }}
              >
                {currentStory.title}
              </h1>
            )}

            {/* Subtitle */}
            <p
              className={`font-normal tracking-[0.35em] uppercase mb-2 ${
                isMobile ? 'text-[10px]' : 'text-sm'
              }`}
              style={{
                color: currentStory.color || 'rgba(212, 165, 116, 0.9)',
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                textShadow: '0 2px 10px rgba(0,0,0,0.9)',
              }}
            >
              {currentStory.subtitle}
            </p>

            {/* Description */}
            {currentStory.description && (
              <p
                className={`font-light tracking-wide mb-4 ${
                  isMobile ? 'text-[10px]' : 'text-sm'
                }`}
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                  textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                }}
              >
                {currentStory.description}
              </p>
            )}

            {/* Button */}
            {currentStory.showButton && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                onClick={() => navigate('/login')}
                className={`uppercase tracking-[0.3em] font-medium transition-all duration-300 ${
                  isMobile ? 'px-6 py-2 text-xs' : 'px-8 py-3 text-sm'
                }`}
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: currentStory.color || 'rgba(212, 165, 116, 1)',
                  border: `1px solid ${currentStory.color || 'rgba(212, 165, 116, 0.5)'}`,
                  backdropFilter: 'blur(20px)',
                  boxShadow: `0 0 20px ${currentStory.color || 'rgba(212, 165, 116, 0.3)'}40, 0 4px 15px rgba(0,0,0,0.9)`,
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  textShadow: `0 0 10px ${currentStory.color || 'rgba(212, 165, 116, 0.5)'}60`,
                  cursor: 'pointer',
                  borderRadius: '2px',
                }}
              >
                {currentStory.buttonText}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
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
              width: currentFrame === idx ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: currentFrame === idx 
                ? (currentStory.color || 'rgba(212, 165, 116, 0.9)')
                : 'rgba(255, 255, 255, 0.3)',
              boxShadow: currentFrame === idx 
                ? `0 0 15px ${currentStory.color || 'rgba(212, 165, 116, 0.6)'}` 
                : 'none',
              cursor: 'pointer',
              border: 'none',
            }}
          />
        ))}
      </div>

      {/* Scroll hint - bottom */}
      <motion.div
        className="absolute bottom-16 right-8 z-50 text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <p
          className="text-[9px] tracking-[0.35em] uppercase mb-1"
          style={{
            color: 'rgba(212, 165, 116, 0.6)',
            fontFamily: 'var(--font-body)',
            textShadow: '0 2px 6px rgba(0,0,0,0.9)',
          }}
        >
          {currentFrame === storyFrames.length - 1 ? 'continue' : 'explore'}
        </p>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            width: '1px',
            height: '30px',
            background: 'linear-gradient(to bottom, rgba(212, 165, 116, 0.6), transparent)',
            marginLeft: 'auto',
            marginRight: '20px',
          }}
        />
      </motion.div>
    </div>
  );
}

export default CinematicHero;
