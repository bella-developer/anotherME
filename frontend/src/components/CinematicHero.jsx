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

  // Wheel scroll navigation
  useEffect(() => {
    let scrollTimeout;

    const handleWheel = (e) => {
      e.preventDefault();
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
          // Scroll down = next
          setCurrentFrame(prev => Math.min(prev + 1, frames.length - 1));
        } else if (e.deltaY < 0) {
          // Scroll up = previous
          setCurrentFrame(prev => Math.max(prev - 1, 0));
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

  // Keyboard navigation (arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentFrame(prev => Math.min(prev + 1, frames.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentFrame(prev => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [frames.length]);

  // Get visible frames (center + 2 on each side)
  const getVisibleFrames = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = currentFrame + i;
      if (index >= 0 && index < frames.length) {
        visible.push({ frame: frames[index], index, offset: i });
      }
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
      {/* Cinema Spotlight Fixture */}
      <div
        className="absolute left-1/2 z-40 pointer-events-none"
        style={{
          top: '90px', // More breathing room from navbar
          transform: 'translateX(-50%)',
        }}
      >
        {/* Theatrical spotlight housing */}
        <div
          className="relative"
          style={{
            width: isMobile ? '70px' : '100px',
            height: isMobile ? '60px' : '85px',
          }}
        >
          {/* Spotlight body (theatrical design) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: isMobile ? '60px' : '85px',
              height: isMobile ? '42px' : '58px',
              background: 'linear-gradient(180deg, #2a2a2a 0%, #0d0d0d 100%)',
              borderRadius: '10px 10px 16px 16px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.9), inset 0 3px 6px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.6)',
              border: '1px solid rgba(80, 80, 80, 0.3)',
            }}
          />
          
          {/* Glowing lens with dramatic bloom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: isMobile ? '50px' : '70px',
              height: isMobile ? '32px' : '45px',
              background: 'radial-gradient(circle, #fffbf0 0%, #ffe680 40%, #ffcc00 80%, #cc9900 100%)',
              borderRadius: '50%',
              boxShadow: `
                0 0 20px rgba(255, 250, 200, 1),
                0 0 40px rgba(255, 230, 128, 0.9),
                0 0 60px rgba(255, 204, 0, 0.7),
                0 0 100px rgba(255, 204, 0, 0.4),
                0 4px 12px rgba(0,0,0,0.6),
                inset 0 2px 8px rgba(255, 255, 255, 0.6)
              `,
              opacity: 1,
            }}
          />
          
          {/* Lens reflection/glare */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: isMobile ? '30px' : '42px',
              height: isMobile ? '18px' : '25px',
              background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.9) 0%, transparent 70%)',
              borderRadius: '50%',
              opacity: 0.6,
            }}
          />
        </div>
      </div>

      {/* Dramatic Spotlight Beam - Visible cone of light */}
      <div
        className="absolute left-1/2 pointer-events-none z-30"
        style={{
          top: '175px',
          transform: 'translateX(-50%)',
          width: isMobile ? '280px' : '500px',
          height: isMobile ? '400px' : '600px',
          background: `
            radial-gradient(ellipse at top, 
              rgba(255, 250, 220, 0.25) 0%, 
              rgba(255, 246, 200, 0.18) 20%,
              rgba(255, 246, 200, 0.12) 35%,
              rgba(255, 240, 180, 0.08) 50%,
              rgba(255, 230, 150, 0.04) 65%,
              transparent 85%
            )
          `,
          clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)',
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Additional spotlight glow/halo */}
      <div
        className="absolute left-1/2 pointer-events-none z-29"
        style={{
          top: '175px',
          transform: 'translateX(-50%)',
          width: isMobile ? '320px' : '600px',
          height: isMobile ? '450px' : '700px',
          background: `
            radial-gradient(ellipse at top, 
              rgba(255, 250, 220, 0.15) 0%, 
              rgba(255, 246, 200, 0.08) 25%,
              transparent 60%
            )
          `,
          clipPath: 'polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)',
          mixBlendMode: 'screen',
          filter: 'blur(20px)',
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

              // Enhanced sizing hierarchy - center MUCH larger
              const centerWidth = isMobile ? 380 : 650;
              const centerHeight = isMobile ? 460 : 580;
              const sideWidth = isMobile ? 160 : 280;
              const sideHeight = isMobile ? 200 : 340;

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

                  {/* Wooden Frame Border - Enhanced visibility */}
                  <div
                    className="relative w-full h-full overflow-hidden"
                    style={{
                      background: isCenter
                        ? 'linear-gradient(135deg, #5d3a1a 0%, #3d2817 50%, #2a1810 100%)'
                        : 'linear-gradient(135deg, #2a1810 0%, #1a0f0a 50%, #000000 100%)',
                      padding: isCenter ? '16px' : '12px',
                      borderRadius: '6px',
                      boxShadow: isCenter
                        ? `
                          0 0 0 3px rgba(139, 69, 19, 0.6),
                          0 0 0 5px rgba(101, 67, 33, 0.3),
                          0 8px 24px rgba(0,0,0,0.9),
                          inset 0 2px 4px rgba(255,255,255,0.1),
                          inset 0 -2px 4px rgba(0,0,0,0.5)
                        `
                        : `
                          0 0 0 2px rgba(80, 50, 20, 0.4),
                          0 4px 16px rgba(0,0,0,0.95),
                          inset 0 1px 2px rgba(255,255,255,0.05),
                          inset 0 -1px 2px rgba(0,0,0,0.6)
                        `,
                      border: isCenter 
                        ? '2px solid rgba(139, 69, 19, 0.4)' 
                        : '1px solid rgba(80, 50, 20, 0.3)',
                    }}
                  >
                    {/* Video */}
                    <div
                      className="relative w-full h-full overflow-hidden"
                      style={{
                        borderRadius: '3px',
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
                          filter: isCenter
                            ? 'brightness(1.05) contrast(1.05) saturate(1.1)'
                            : 'brightness(0.12) contrast(0.9) saturate(0.8)',
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

                      {/* Text overlay - only on center frame with enhanced readability */}
                      {isCenter && (
                        <div
                          className="absolute inset-0 flex items-end justify-center p-6 pointer-events-none"
                          style={{
                            background:
                              'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0.3) 65%, transparent 85%)',
                          }}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-center"
                            style={{
                              textShadow: '0 0 40px rgba(0,0,0,0.9)',
                            }}
                          >
                            {frame.id === 'welcome' ? (
                              <EsoLogo 
                                className="h-14 md:h-16 w-auto mx-auto mb-3" 
                                style={{
                                  filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.9)) drop-shadow(0 4px 12px rgba(0,0,0,0.8))',
                                }}
                              />
                            ) : (
                              <h2
                                className="text-3xl md:text-4xl font-light tracking-wider mb-3"
                                style={{
                                  color: '#ffffff',
                                  textShadow: `
                                    0 0 20px rgba(0,0,0,1),
                                    0 0 40px rgba(0,0,0,0.9),
                                    0 4px 12px rgba(0,0,0,0.95),
                                    0 2px 4px rgba(0,0,0,1)
                                  `,
                                  fontWeight: 300,
                                }}
                              >
                                {frame.title}
                              </h2>
                            )}
                            <p
                              className="text-sm md:text-base tracking-wide mb-2"
                              style={{
                                color: 'rgba(255, 255, 255, 0.95)',
                                textShadow: `
                                  0 0 16px rgba(0,0,0,1),
                                  0 0 32px rgba(0,0,0,0.9),
                                  0 2px 8px rgba(0,0,0,0.95),
                                  0 1px 3px rgba(0,0,0,1)
                                `,
                                fontWeight: 400,
                              }}
                            >
                              {frame.subtitle}
                            </p>
                            <p
                              className="text-xs md:text-sm tracking-wide"
                              style={{
                                color: 'rgba(255, 255, 255, 0.75)',
                                textShadow: `
                                  0 0 12px rgba(0,0,0,1),
                                  0 0 24px rgba(0,0,0,0.9),
                                  0 2px 6px rgba(0,0,0,0.95),
                                  0 1px 2px rgba(0,0,0,1)
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

                    {/* Frame corner clips (wooden frame detail) - Enhanced */}
                    <div
                      className="absolute"
                      style={{
                        top: '8px',
                        left: '8px',
                        width: isCenter ? '28px' : '20px',
                        height: isCenter ? '28px' : '20px',
                        borderTop: isCenter ? '4px solid #8B4513' : '3px solid #5d3a1a',
                        borderLeft: isCenter ? '4px solid #8B4513' : '3px solid #5d3a1a',
                        opacity: isCenter ? 0.6 : 0.4,
                        boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.2)',
                      }}
                    />
                    <div
                      className="absolute"
                      style={{
                        top: '8px',
                        right: '8px',
                        width: isCenter ? '28px' : '20px',
                        height: isCenter ? '28px' : '20px',
                        borderTop: isCenter ? '4px solid #8B4513' : '3px solid #5d3a1a',
                        borderRight: isCenter ? '4px solid #8B4513' : '3px solid #5d3a1a',
                        opacity: isCenter ? 0.6 : 0.4,
                        boxShadow: 'inset -1px 1px 2px rgba(255,255,255,0.2)',
                      }}
                    />
                    <div
                      className="absolute"
                      style={{
                        bottom: '8px',
                        left: '8px',
                        width: isCenter ? '28px' : '20px',
                        height: isCenter ? '28px' : '20px',
                        borderBottom: isCenter ? '4px solid #8B4513' : '3px solid #5d3a1a',
                        borderLeft: isCenter ? '4px solid #8B4513' : '3px solid #5d3a1a',
                        opacity: isCenter ? 0.6 : 0.4,
                        boxShadow: 'inset 1px -1px 2px rgba(255,255,255,0.2)',
                      }}
                    />
                    <div
                      className="absolute"
                      style={{
                        bottom: '8px',
                        right: '8px',
                        width: isCenter ? '28px' : '20px',
                        height: isCenter ? '28px' : '20px',
                        borderBottom: isCenter ? '4px solid #8B4513' : '3px solid #5d3a1a',
                        borderRight: isCenter ? '4px solid #8B4513' : '3px solid #5d3a1a',
                        opacity: isCenter ? 0.6 : 0.4,
                        boxShadow: 'inset -1px -1px 2px rgba(255,255,255,0.2)',
                      }}
                    />
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
