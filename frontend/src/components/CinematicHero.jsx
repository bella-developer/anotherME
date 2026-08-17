import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EsoLogo from './EsoLogo';

/**
 * Cinematic Hero - Museum Gallery Style
 * Museum gallery with hanging frames, cinema spotlight, scroll-based navigation
 * Shows 5 frames: center (active/spotlit) + 2 on each side (in darkness)
 */
function CinematicHero() {
  const navigate = useNavigate();
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

  // Frame data with dual video sources
  const frames = [
    {
      id: 'welcome',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521558/fram1desktop_emb84g.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521557/frame1mobile_efrsvf.mp4',
      title: 'ESO',
      subtitle: 'your safe space to breathe',
      description: 'Home of introverts • deep thinkers • philosophers',
    },
    {
      id: 'dark-confession',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786357230/frae2video_qmhpf7.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521557/frame2mob_pgzsnn.mp4',
      title: 'CONFESSION',
      subtitle: 'release what weighs on you',
      description: 'dark stories • secrets • regrets',
    },
    {
      id: 'dark-understanding',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786358832/frame3vid_1_hjyi09.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521554/frame3mob_h9pzrp.mp4',
      title: 'UNDERSTANDING',
      subtitle: "you're not alone",
      description: 'shared darkness • connection',
    },
    {
      id: 'fantasy-daydream',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361397/frame4videoo_hizhue.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521551/frame4mob_ox4nlo.mp4',
      title: 'IMAGINATION',
      subtitle: 'where creativity flows',
      description: 'daydreams • artistic ideas',
    },
    {
      id: 'fantasy-vibes',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361396/frame5v_wtvs09.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521549/frame5mob_q1ynbk.mp4',
      title: 'VIBES',
      subtitle: 'fun • jokes • fantasies',
      description: 'creative energy • music',
    },
    {
      id: 'philo-questioning',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361397/frame6v_ijhpzm.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521551/frame6mob_xjoxtz.mp4',
      title: 'QUESTIONING',
      subtitle: 'the big questions',
      description: 'philosophy • spirituality',
    },
    {
      id: 'philo-truth',
      video: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786361701/frame7vide_yp9dc4.mp4',
      mobileVideo: 'https://res.cloudinary.com/dbtm7etag/video/upload/v1786521556/frame7mob_ovz0to.mp4',
      title: 'TRUTH',
      subtitle: 'conspiracy • unique ideas',
      description: 'cosmic connection • mystery',
    },
  ];

  // Wheel scroll navigation - INFINITE LOOP
  useEffect(() => {
    let scrollTimeout;

    const handleWheel = (e) => {
      e.preventDefault();
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
          // Scroll down = next (wraps to 0 after last)
          setCurrentFrame(prev => (prev + 1) % frames.length);
        } else if (e.deltaY < 0) {
          // Scroll up = previous (wraps to last from 0)
          setCurrentFrame(prev => (prev - 1 + frames.length) % frames.length);
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
  }, [frames.length]);

  // Keyboard navigation (arrow keys) - INFINITE LOOP
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentFrame(prev => (prev + 1) % frames.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentFrame(prev => (prev - 1 + frames.length) % frames.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [frames.length]);

  // Get visible frames (center + 2 on each side) with INFINITE LOOP
  const getVisibleFrames = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      // Circular/infinite loop logic
      let index = (currentFrame + i + frames.length) % frames.length;
      visible.push({ frame: frames[index], index, offset: i });
    }
    return visible;
  };

  const visibleFrames = getVisibleFrames();
  const currentFrameData = frames[currentFrame];

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
      {/* Artistic Light Source - Glowing Orb / Energy Source */}
      <div
        className="absolute left-1/2 z-40 pointer-events-none"
        style={{
          top: '70px',
          transform: 'translateX(-50%)',
        }}
      >
        {/* Ethereal glowing orb */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.95, 1, 0.95],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'relative',
            width: isMobile ? '80px' : '120px',
            height: isMobile ? '80px' : '120px',
          }}
        >
          {/* Core light source */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isMobile ? '50px' : '70px',
              height: isMobile ? '50px' : '70px',
              background: 'radial-gradient(circle, #fffbf0 0%, #ffe680 30%, #ffcc00 60%, rgba(255, 204, 0, 0.3) 100%)',
              borderRadius: '50%',
              boxShadow: `
                0 0 30px rgba(255, 250, 200, 1),
                0 0 60px rgba(255, 230, 128, 0.8),
                0 0 100px rgba(255, 204, 0, 0.6),
                0 0 140px rgba(255, 204, 0, 0.4),
                inset 0 0 20px rgba(255, 255, 255, 0.8)
              `,
            }}
          />
          
          {/* Outer glow rings */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, rgba(255, 230, 128, 0.3) 0%, rgba(255, 204, 0, 0.15) 50%, transparent 100%)',
              borderRadius: '50%',
            }}
          />
          
          {/* Energy particles effect */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isMobile ? '70px' : '100px',
              height: isMobile ? '70px' : '100px',
              background: 'radial-gradient(circle, transparent 40%, rgba(255, 240, 180, 0.2) 60%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(8px)',
            }}
          />
        </motion.div>
      </div>

      {/* Cinematic Light Beam - Wider, more artistic */}
      <div
        className="absolute left-1/2 pointer-events-none z-30"
        style={{
          top: '150px',
          transform: 'translateX(-50%)',
          width: isMobile ? '350px' : '700px',
          height: isMobile ? '450px' : '650px',
          background: `
            radial-gradient(ellipse at top, 
              rgba(255, 250, 220, 0.22) 0%, 
              rgba(255, 246, 200, 0.15) 25%,
              rgba(255, 240, 180, 0.08) 50%,
              rgba(255, 230, 150, 0.03) 70%,
              transparent 90%
            )
          `,
          clipPath: 'polygon(46% 0%, 54% 0%, 100% 100%, 0% 100%)',
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Atmospheric glow halo */}
      <div
        className="absolute left-1/2 pointer-events-none z-29"
        style={{
          top: '150px',
          transform: 'translateX(-50%)',
          width: isMobile ? '400px' : '800px',
          height: isMobile ? '500px' : '750px',
          background: `
            radial-gradient(ellipse at top, 
              rgba(255, 250, 220, 0.12) 0%, 
              rgba(255, 246, 200, 0.06) 30%,
              transparent 65%
            )
          `,
          clipPath: 'polygon(44% 0%, 56% 0%, 100% 100%, 0% 100%)',
          mixBlendMode: 'screen',
          filter: 'blur(30px)',
        }}
      />

      {/* Museum Gallery - Multiple Frames */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          paddingLeft: '20px', // Increased from 6px for better containment
          paddingRight: '20px',
          paddingTop: isMobile ? '160px' : '200px',
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <AnimatePresence mode="sync">
            {visibleFrames.map(({ frame, index, offset }) => {
              const isCenter = offset === 0;
              const videoSource = isMobile && frame.mobileVideo ? frame.mobileVideo : frame.video;

              // CINEMATIC WIDESCREEN sizing (21:9 aspect ratio)
              const centerWidth = isMobile ? 400 : 800;
              const centerHeight = isMobile ? 230 : 340; // 21:9 ratio
              const sideWidth = isMobile ? 180 : 400;
              const sideHeight = isMobile ? 100 : 170; // 21:9 ratio

              // Increased spacing for museum gallery feel
              const spacing = isMobile ? 240 : 480;
              const xOffset = offset * spacing;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: xOffset,
                    rotateZ: isCenter ? 0 : offset * 1.5, // Slight sway for side frames
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute group"
                  style={{
                    width: isCenter ? centerWidth : sideWidth,
                    height: isCenter ? centerHeight : sideHeight,
                    zIndex: isCenter ? 20 : 10 - Math.abs(offset),
                    cursor: isCenter ? 'default' : 'pointer',
                  }}
                  onClick={() => !isCenter && setCurrentFrame(index)}
                  whileHover={!isCenter ? { scale: 1.05, transition: { duration: 0.3 } } : {}}
                >
                  {/* HUGE Hanging String - PROMINENT and VISIBLE */}
                  <div
                    className="absolute left-1/2 pointer-events-none"
                    style={{
                      top: isMobile ? '-160px' : '-200px',
                      transform: 'translateX(-50%)',
                      width: isCenter ? '10px' : '6px',
                      height: isMobile ? '160px' : '200px',
                      background: `linear-gradient(90deg, 
                        #3a3a3a 0%, 
                        #888 20%, 
                        #aaa 40%, 
                        #bbb 50%, 
                        #aaa 60%, 
                        #888 80%, 
                        #3a3a3a 100%
                      )`,
                      boxShadow: `
                        inset -3px 0 6px rgba(0,0,0,0.7), 
                        inset 3px 0 6px rgba(255,255,255,0.4),
                        0 0 12px rgba(0,0,0,0.9),
                        2px 0 8px rgba(255,255,255,0.2),
                        -2px 0 8px rgba(0,0,0,0.4)
                      `,
                      borderRadius: '3px',
                      border: '0.5px solid rgba(150, 150, 150, 0.5)',
                    }}
                  />
                  
                  {/* String attachment point at top */}
                  <div
                    className="absolute left-1/2 pointer-events-none"
                    style={{
                      top: isMobile ? '-165px' : '-205px',
                      transform: 'translateX(-50%)',
                      width: isCenter ? '16px' : '12px',
                      height: isCenter ? '16px' : '12px',
                      background: 'radial-gradient(circle, #1a1a1a 0%, #000 100%)',
                      borderRadius: '50%',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.9), inset 0 1px 2px rgba(255,255,255,0.2)',
                      border: '1px solid rgba(100, 100, 100, 0.4)',
                    }}
                  />
                  
                  {/* String attachment hook on frame */}
                  <div
                    className="absolute left-1/2 pointer-events-none"
                    style={{
                      top: '-8px',
                      transform: 'translateX(-50%)',
                      width: isCenter ? '20px' : '16px',
                      height: isCenter ? '12px' : '10px',
                      background: 'linear-gradient(180deg, #8B7355 0%, #5d4a3a 100%)',
                      borderRadius: '2px 2px 4px 4px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.2)',
                    }}
                  />

                  {/* Blueprint Technical Frame - Cinematic Container */}
                  <div
                    className="relative w-full h-full overflow-hidden"
                    style={{
                      background: isCenter
                        ? 'linear-gradient(135deg, #1a2332 0%, #0d1520 50%, #050a12 100%)'
                        : 'linear-gradient(135deg, #0d1520 0%, #050a12 50%, #000000 100%)',
                      padding: isCenter ? '14px' : '10px',
                      borderRadius: '3px',
                      boxShadow: isCenter
                        ? `
                          0 0 0 2px rgba(70, 130, 180, 0.5),
                          0 0 0 3px rgba(100, 160, 220, 0.3),
                          0 0 20px rgba(70, 130, 180, 0.4),
                          0 8px 24px rgba(0,0,0,0.9),
                          inset 0 1px 2px rgba(100, 160, 220, 0.2)
                        `
                        : `
                          0 0 0 1px rgba(70, 130, 180, 0.3),
                          0 4px 16px rgba(0,0,0,0.95),
                          inset 0 1px 1px rgba(70, 130, 180, 0.1)
                        `,
                      border: isCenter 
                        ? '1px solid rgba(70, 130, 180, 0.4)' 
                        : '1px solid rgba(70, 130, 180, 0.2)',
                    }}
                  >
                    {/* Blueprint grid overlay on frame */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: isCenter
                          ? `
                            linear-gradient(rgba(70, 130, 180, 0.08) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(70, 130, 180, 0.08) 1px, transparent 1px)
                          `
                          : 'none',
                        backgroundSize: '20px 20px',
                        opacity: 0.3,
                      }}
                    />
                    
                    {/* Technical corner markers */}
                    {isCenter && (
                      <>
                        <div
                          className="absolute"
                          style={{
                            top: '5px',
                            left: '5px',
                            width: '16px',
                            height: '16px',
                            borderTop: '2px solid rgba(70, 130, 180, 0.8)',
                            borderLeft: '2px solid rgba(70, 130, 180, 0.8)',
                          }}
                        />
                        <div
                          className="absolute"
                          style={{
                            top: '5px',
                            right: '5px',
                            width: '16px',
                            height: '16px',
                            borderTop: '2px solid rgba(70, 130, 180, 0.8)',
                            borderRight: '2px solid rgba(70, 130, 180, 0.8)',
                          }}
                        />
                        <div
                          className="absolute"
                          style={{
                            bottom: '5px',
                            left: '5px',
                            width: '16px',
                            height: '16px',
                            borderBottom: '2px solid rgba(70, 130, 180, 0.8)',
                            borderLeft: '2px solid rgba(70, 130, 180, 0.8)',
                          }}
                        />
                        <div
                          className="absolute"
                          style={{
                            bottom: '5px',
                            right: '5px',
                            width: '16px',
                            height: '16px',
                            borderBottom: '2px solid rgba(70, 130, 180, 0.8)',
                            borderRight: '2px solid rgba(70, 130, 180, 0.8)',
                          }}
                        />
                      </>
                    )}
                    {/* Cinematic Video - Widescreen */}
                    <div
                      className="relative w-full h-full overflow-hidden"
                      style={{
                        borderRadius: '2px',
                        background: '#000',
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
                          objectPosition: 'center',
                          filter: isCenter
                            ? 'brightness(1.08) contrast(1.1) saturate(1.15)'
                            : 'brightness(0.10) contrast(0.8) saturate(0.7)',
                        }}
                      >
                        <source src={videoSource} type="video/mp4" />
                      </video>

                      {/* HEAVY vignette and darkness on inactive frames */}
                      {!isCenter && (
                        <>
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background:
                                'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.95) 70%, #000000 100%)',
                            }}
                          />
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: 'rgba(0, 0, 0, 0.6)',
                            }}
                          />
                        </>
                      )}

                      {/* Subtle vignette on active frame */}
                      {isCenter && (
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.25) 85%, rgba(0,0,0,0.4) 100%)',
                          }}
                        />
                      )}

                      {/* Cinematic Text Overlay - Widescreen positioning */}
                      {isCenter && (
                        <div
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                          style={{
                            background:
                              'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.8) 100%)',
                          }}
                        >
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-center px-8"
                            style={{
                              maxWidth: '90%',
                            }}
                          >
                            {frame.id === 'welcome' ? (
                              <EsoLogo 
                                className="h-12 md:h-14 w-auto mx-auto mb-2" 
                                style={{
                                  filter: 'drop-shadow(0 0 30px rgba(0,0,0,1)) drop-shadow(0 6px 20px rgba(0,0,0,0.9))',
                                }}
                              />
                            ) : (
                              <h2
                                className="text-2xl md:text-3xl font-light tracking-[0.15em] uppercase mb-2"
                                style={{
                                  color: '#ffffff',
                                  textShadow: `
                                    0 0 30px rgba(0,0,0,1),
                                    0 0 50px rgba(0,0,0,0.9),
                                    0 6px 20px rgba(0,0,0,1),
                                    0 2px 6px rgba(0,0,0,1)
                                  `,
                                  fontWeight: 200,
                                  letterSpacing: '0.2em',
                                }}
                              >
                                {frame.title}
                              </h2>
                            )}
                            <p
                              className="text-xs md:text-sm tracking-wide mb-1"
                              style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                textShadow: `
                                  0 0 20px rgba(0,0,0,1),
                                  0 0 40px rgba(0,0,0,0.95),
                                  0 3px 12px rgba(0,0,0,1),
                                  0 1px 4px rgba(0,0,0,1)
                                `,
                                fontWeight: 300,
                              }}
                            >
                              {frame.subtitle}
                            </p>
                            <p
                              className="text-[10px] md:text-xs tracking-wider opacity-75"
                              style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                textShadow: `
                                  0 0 16px rgba(0,0,0,1),
                                  0 0 30px rgba(0,0,0,0.95),
                                  0 2px 8px rgba(0,0,0,1),
                                  0 1px 3px rgba(0,0,0,1)
                                `,
                                fontWeight: 300,
                              }}
                            >
                              {frame.description}
                            </p>
                          </motion.div>
                        </div>
                      )}
                    </div>


                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation hint - Enhanced visibility with animation */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        {/* Frame counter - more visible */}
        <div
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '11px',
            letterSpacing: '0.25em',
            textShadow: `
              0 0 10px rgba(0,0,0,1),
              0 2px 6px rgba(0,0,0,0.9),
              0 1px 2px rgba(0,0,0,1)
            `,
            fontWeight: 500,
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '6px 16px',
            borderRadius: '20px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          {currentFrame + 1} / {frames.length}
        </div>
        
        {/* Scroll hint with animation */}
        <motion.div
          className="flex flex-col items-center gap-1"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '9px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              textShadow: '0 1px 4px rgba(0,0,0,0.9)',
              fontWeight: 500,
            }}
          >
            scroll
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))',
            }}
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
      
      {/* Click side frames hint - appears briefly on first load */}
      {currentFrame === 0 && (
        <motion.div
          className="absolute top-1/2 left-8 transform -translate-y-1/2 z-40 pointer-events-none"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{ duration: 3, delay: 2 }}
          style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textShadow: '0 2px 6px rgba(0,0,0,0.9)',
            fontWeight: 500,
          }}
        >
          ← click
        </motion.div>
      )}
    </div>
  );
}

export default CinematicHero;
