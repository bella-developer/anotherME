import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/**
 * Premium Hero Section with Scroll-Based Frame Animation
 * Apple-style product reveal using sequential images
 */
function PremiumHero() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('dark');
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);

  // Dark Room frame URLs
  const darkRoomFrames = [
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-1_pin8tu.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104156/dark-frame-2_tsxs4x.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104156/dark-frame-3_i3cijk.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-4_ufxpq6.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-5_mwuovr.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-6_zth05y.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-7_sd42ty.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-8_ofgw0r.png',
  ];

  const frameCount = darkRoomFrames.length;

  // Scroll-based progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Preload all images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = darkRoomFrames.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = reject;
          return img;
        });
      });

      try {
        const loadedImages = await Promise.all(imagePromises);
        imagesRef.current = loadedImages;
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImages();
  }, []);

  // Update frame based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(latest * frameCount)
      );
      setCurrentFrame(frameIndex);
    });

    return () => unsubscribe();
  }, [scrollYProgress, frameCount]);

  // Render current frame to canvas
  useEffect(() => {
    if (!canvasRef.current || !imagesLoaded || !imagesRef.current[currentFrame]) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[currentFrame];

    // Set canvas size to match container
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Calculate dimensions to cover canvas while maintaining aspect ratio
    const canvasAspect = rect.width / rect.height;
    const imgAspect = img.width / img.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > canvasAspect) {
      // Image is wider than canvas
      drawHeight = rect.height;
      drawWidth = drawHeight * imgAspect;
      offsetX = (rect.width - drawWidth) / 2;
      offsetY = 0;
    } else {
      // Image is taller than canvas
      drawWidth = rect.width;
      drawHeight = drawWidth / imgAspect;
      offsetX = 0;
      offsetY = (rect.height - drawHeight) / 2;
    }

    // Clear and draw
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, [currentFrame, imagesLoaded]);

  const rooms = [
    {
      id: 'dark',
      name: 'The Dark Room',
      tagline: 'Release. Witness. Discharge.',
      color: '#2EE6FF',
      path: '/rooms/dark'
    },
    {
      id: 'philo',
      name: 'The Philo Room',
      tagline: 'Understand. Reflect. Inquire.',
      color: '#B56DFF',
      path: '/rooms/philo'
    },
    {
      id: 'fantasy',
      name: 'The Fantasy Room',
      tagline: 'Create. Imagine. Inspire.',
      color: '#FF9D1C',
      path: '/rooms/fantasy'
    },
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section - Fixed during scroll */}
      <section className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Canvas for frame animation */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            width: '100%',
            height: '100%',
          }}
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        {/* Content overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
          {/* Top: App tagline */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-8"
          >
            <span
              className="text-xs tracking-[0.4em] uppercase font-light"
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              }}
            >
              Your Safe Space
            </span>
          </motion.div>

          {/* Center: Main headline */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight mb-6 tracking-tight"
            style={{
              color: '#ffffff',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.7)',
              lineHeight: '1.1',
            }}
          >
            Find Your Room
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-base sm:text-lg md:text-xl font-light mb-12 max-w-2xl"
            style={{
              color: 'rgba(255, 255, 255, 0.85)',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              lineHeight: '1.6',
            }}
          >
            Where authenticity lives. Where stories are heard. Where you belong.
          </motion.p>

          {/* Room selector buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => navigate(room.path)}
                className="group relative px-8 py-4 overflow-hidden transition-all duration-300"
                style={{
                  background: currentRoom === room.id 
                    ? `rgba(${room.id === 'dark' ? '46, 230, 255' : room.id === 'philo' ? '181, 109, 255' : '255, 157, 28'}, 0.15)`
                    : 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${currentRoom === room.id ? room.color : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '4px',
                }}
                onMouseEnter={() => setCurrentRoom(room.id)}
              >
                <span
                  className="relative z-10 text-sm tracking-[0.15em] uppercase font-medium transition-colors duration-300"
                  style={{
                    color: currentRoom === room.id ? room.color : '#ffffff',
                  }}
                >
                  {room.name}
                </span>
                
                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at center, ${room.color}20, transparent)`,
                  }}
                />
              </button>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2">
              <span
                className="text-xs tracking-[0.3em] uppercase"
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                }}
              >
                Scroll to explore
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-6 h-10 border-2 rounded-full flex items-start justify-center pt-2"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                <div
                  className="w-1 h-2 rounded-full"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Loading state */}
        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center">
              <div
                className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-4"
                style={{
                  borderColor: '#2EE6FF',
                  borderTopColor: 'transparent',
                }}
              />
              <p className="text-sm tracking-wider text-white/70">Loading experience...</p>
            </div>
          </div>
        )}
      </section>

      {/* Spacer for scroll */}
      <div style={{ height: '300vh' }} />
    </div>
  );
}

export default PremiumHero;
