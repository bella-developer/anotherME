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
          top: '70px', // 70px from navbar
          transform: 'translateX(-50%)',
        }}
      >
        {/* Theatrical spotlight housing */}
        <div
          className="relative"
          style={{
            width: isMobile ? '60px' : '80px',
            height: isMobile ? '50px' : '70px',
          }}
        >
          {/* Spotlight body (theatrical design) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: isMobile ? '50px' : '65px',
              height: isMobile ? '35px' : '45px',
              background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
              borderRadius: '8px 8px 12px 12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.1)',
            }}
          />
          
          {/* Glowing lens */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: isMobile ? '40px' : '50px',
              height: isMobile ? '25px' : '32px',
              background: 'radial-gradient(circle, #fff9e6 0%, #ffe680 50%, #ffcc00 100%)',
              borderRadius: '50%',
              boxShadow: '0 0 30px rgba(255, 230, 128, 0.8), 0 0 60px rgba(255, 204, 0, 0.5), 0 2px 8px rgba(0,0,0,0.6)',
              opacity: 0.95,
            }}
          />
        </div>
      </div>

      {/* Spotlight beam - only on center frame */}
      <div
        className="absolute left-1/2 pointer-events-none z-30"
        style={{
          top: '140px',
          transform: 'translateX(-50%)',
          width: isMobile ? '200px' : '400px',
          height: isMobile ? '300px' : '500px',
          background: 'radial-gradient(ellipse at top, rgba(255, 246, 200, 0.15) 0%, rgba(255, 246, 200, 0.08) 30%, transparent 70%)',
          clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)',
        }}
      />

      {/* Museum Gallery - Multiple Frames */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          paddingLeft: '6px',
          paddingRight: '6px',
          paddingTop: isMobile ? '140px' : '180px',
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <AnimatePresence mode="sync">
            {visibleFrames.map(({ frame, index, offset }) => {
              const isCenter = offset === 0;
              const videoSource = isMobile && frame.mobileVideo ? frame.mobileVideo : frame.video;

              // Sizing hierarchy
              const centerWidth = isMobile ? 320 : 550;
              const centerHeight = isMobile ? 400 : 500;
              const sideWidth = isMobile ? 180 : 300;
              const sideHeight = isMobile ? 240 : 380;

              // Positioning
              const spacing = isMobile ? 200 : 380;
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
                  className="absolute cursor-pointer"
                  style={{
                    width: isCenter ? centerWidth : sideWidth,
                    height: isCenter ? centerHeight : sideHeight,
                    zIndex: isCenter ? 20 : 10 - Math.abs(offset),
                  }}
                  onClick={() => !isCenter && setCurrentFrame(index)}
                >
                  {/* HUGE Hanging String */}
                  <div
                    className="absolute left-1/2 pointer-events-none"
                    style={{
                      top: isMobile ? '-140px' : '-180px',
                      transform: 'translateX(-50%)',
                      width: isCenter ? '8px' : '5px',
                      height: isMobile ? '140px' : '180px',
                      background: 'linear-gradient(180deg, #888 0%, #666 50%, #444 100%)',
                      boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.5), inset 2px 0 4px rgba(255,255,255,0.2), 0 0 10px rgba(0,0,0,0.8)',
                      borderRadius: '2px',
                    }}
                  />

                  {/* Wooden Frame Border */}
                  <div
                    className="relative w-full h-full overflow-hidden"
                    style={{
                      background: isCenter
                        ? 'linear-gradient(135deg, #3d2817 0%, #2a1810 50%, #1a0f0a 100%)'
                        : 'linear-gradient(135deg, #2a1810 0%, #1a0f0a 50%, #0d0805 100%)',
                      padding: '12px',
                      borderRadius: '4px',
                      boxShadow: isCenter
                        ? '0 0 0 2px rgba(139, 69, 19, 0.3)'
                        : '0 0 0 1px rgba(139, 69, 19, 0.2)',
                    }}
                  >
                    {/* Video */}
                    <div
                      className="relative w-full h-full overflow-hidden"
                      style={{
                        borderRadius: '2px',
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
                            ? 'brightness(1)'
                            : 'brightness(0.15)',
                        }}
                      >
                        <source src={videoSource} type="video/mp4" />
                      </video>

                      {/* Heavy vignette on inactive frames */}
                      {!isCenter && (
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.95) 100%)',
                          }}
                        />
                      )}

                      {/* Subtle vignette on active frame */}
                      {isCenter && (
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)',
                          }}
                        />
                      )}

                      {/* Text overlay - only on center frame */}
                      {isCenter && (
                        <div
                          className="absolute inset-0 flex items-end justify-center p-6 pointer-events-none"
                          style={{
                            background:
                              'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)',
                          }}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-center"
                          >
                            {frame.id === 'welcome' ? (
                              <EsoLogo className="h-12 w-auto mx-auto mb-2" />
                            ) : (
                              <h2
                                className="text-2xl md:text-3xl font-light tracking-wider mb-2"
                                style={{
                                  color: '#ffffff',
                                  textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                                }}
                              >
                                {frame.title}
                              </h2>
                            )}
                            <p
                              className="text-xs md:text-sm tracking-wide mb-1"
                              style={{
                                color: 'rgba(255, 255, 255, 0.85)',
                                textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                              }}
                            >
                              {frame.subtitle}
                            </p>
                            <p
                              className="text-[10px] md:text-xs tracking-wide"
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                              }}
                            >
                              {frame.description}
                            </p>
                          </motion.div>
                        </div>
                      )}
                    </div>

                    {/* Frame corner clips (wooden frame detail) */}
                    <div
                      className="absolute"
                      style={{
                        top: '6px',
                        left: '6px',
                        width: '20px',
                        height: '20px',
                        borderTop: isCenter ? '3px solid #8B4513' : '2px solid #5d3a1a',
                        borderLeft: isCenter ? '3px solid #8B4513' : '2px solid #5d3a1a',
                        opacity: 0.4,
                      }}
                    />
                    <div
                      className="absolute"
                      style={{
                        top: '6px',
                        right: '6px',
                        width: '20px',
                        height: '20px',
                        borderTop: isCenter ? '3px solid #8B4513' : '2px solid #5d3a1a',
                        borderRight: isCenter ? '3px solid #8B4513' : '2px solid #5d3a1a',
                        opacity: 0.4,
                      }}
                    />
                    <div
                      className="absolute"
                      style={{
                        bottom: '6px',
                        left: '6px',
                        width: '20px',
                        height: '20px',
                        borderBottom: isCenter ? '3px solid #8B4513' : '2px solid #5d3a1a',
                        borderLeft: isCenter ? '3px solid #8B4513' : '2px solid #5d3a1a',
                        opacity: 0.4,
                      }}
                    />
                    <div
                      className="absolute"
                      style={{
                        bottom: '6px',
                        right: '6px',
                        width: '20px',
                        height: '20px',
                        borderBottom: isCenter ? '3px solid #8B4513' : '2px solid #5d3a1a',
                        borderRight: isCenter ? '3px solid #8B4513' : '2px solid #5d3a1a',
                        opacity: 0.4,
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Frame counter - subtle */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none"
        style={{
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '10px',
          letterSpacing: '0.2em',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
        }}
      >
        {currentFrame + 1} / {frames.length}
      </div>
    </div>
  );
}

export default CinematicHero;
