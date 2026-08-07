import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EsoLogo from './EsoLogo';

/**
 * Premium Scroll-Based Hero Section
 * Cinematic frame-by-frame animation with Dark Room sequential images
 * Replaces HorizontalHero with Apple-style scroll reveal
 */
function PremiumHero() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const imagesRef = useRef([]);
  const requestRef = useRef(null);

  // Dark Room frame URLs from Cloudinary
  const frameUrls = [
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-1_pin8tu.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104156/dark-frame-2_tsxs4x.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104156/dark-frame-3_i3cijk.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-4_ufxpq6.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-5_mwuovr.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-6_zth05y.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-7_sd42ty.png',
    'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-8_ofgw0r.png',
  ];

  const frameCount = frameUrls.length;

  // Preload all images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = frameUrls.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = reject;
        });
      });

      try {
        const loadedImages = await Promise.all(imagePromises);
        imagesRef.current = loadedImages;
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error loading hero images:', error);
      }
    };

    loadImages();
  }, []);

  // Handle scroll to update frame
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const scrollHeight = container.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;

      // Calculate progress (0 to 1)
      const progress = Math.max(0, Math.min(1, scrolled / scrollHeight));
      setScrollProgress(progress);

      // Map progress to frame index
      const frameIndex = Math.min(frameCount - 1, Math.floor(progress * frameCount));
      setCurrentFrame(frameIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [frameCount]);

  // Render frame to canvas
  useEffect(() => {
    if (!canvasRef.current || !imagesLoaded || !imagesRef.current[currentFrame]) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[currentFrame];

    const render = () => {
      // Set canvas size
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Calculate cover dimensions
      const canvasAspect = rect.width / rect.height;
      const imgAspect = img.width / img.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgAspect > canvasAspect) {
        drawHeight = rect.height;
        drawWidth = drawHeight * imgAspect;
        offsetX = (rect.width - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = rect.width;
        drawHeight = drawWidth / imgAspect;
        offsetX = 0;
        offsetY = (rect.height - drawHeight) / 2;
      }

      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    render();
  }, [currentFrame, imagesLoaded]);

  return (
    <div ref={containerRef} className="relative">
      {/* Sticky Hero Section */}
      <section className="sticky top-0 h-screen w-full overflow-hidden" style={{ background: '#000000' }}>
        {/* Canvas for sequential images */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: 'cover' }}
        />

        {/* Gradient overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.5) 100%)',
          }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-8 text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-6"
          >
            <EsoLogo 
              className="h-10 sm:h-14 w-auto mx-auto" 
              style={{ 
                filter: 'drop-shadow(0 0 20px rgba(46, 230, 255, 0.3)) drop-shadow(0 4px 40px rgba(0, 0, 0, 0.9))',
              }} 
            />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="text-5xl sm:text-7xl md:text-8xl font-extralight mb-6 tracking-tight max-w-5xl"
            style={{
              color: '#ffffff',
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.8), 0 0 60px rgba(46, 230, 255, 0.2)',
              lineHeight: '1.1',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Your Safe Space
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-base sm:text-xl font-light mb-12 max-w-2xl"
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              textShadow: '0 2px 15px rgba(0, 0, 0, 0.7)',
              lineHeight: '1.6',
            }}
          >
            Where authenticity lives. Where stories are heard. Where you belong.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
            onClick={() => navigate('/login')}
            className="px-10 py-4 text-sm uppercase tracking-[0.25em] font-bold transition-all group"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: '2px solid rgba(46, 230, 255, 0.3)',
              borderRadius: '6px',
              backdropFilter: 'blur(12px)',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(46, 230, 255, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(46, 230, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(46, 230, 255, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 30px rgba(0, 0, 0, 0.6), 0 0 60px rgba(46, 230, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(46, 230, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(46, 230, 255, 0.1)';
            }}
          >
            Enter
          </motion.button>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: scrollProgress > 0.1 ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-3">
              <span
                className="text-xs tracking-[0.35em] uppercase"
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
                }}
              >
                Scroll
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-6 h-10 border-2 rounded-full flex items-start justify-center pt-2"
                style={{ borderColor: 'rgba(255, 255, 255, 0.4)' }}
              >
                <div
                  className="w-1 h-2 rounded-full"
                  style={{ background: 'rgba(255, 255, 255, 0.6)' }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Loading Overlay */}
        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
            <div className="text-center">
              <div
                className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-4 mx-auto"
                style={{
                  borderColor: '#2EE6FF',
                  borderTopColor: 'transparent',
                }}
              />
              <p className="text-sm tracking-wider text-white/70">Loading...</p>
            </div>
          </div>
        )}
      </section>

      {/* Scroll Spacer - creates scroll distance for animation */}
      <div style={{ height: '400vh' }} />
    </div>
  );
}

export default PremiumHero;
