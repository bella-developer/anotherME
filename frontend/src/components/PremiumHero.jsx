import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EsoLogo from './EsoLogo';

/**
 * Premium Scroll-Based Hero - Complete App Tour
 * Three room sections with sequential frame animations
 * Tells the story of ESO as a sanctuary for introverts and deep thinkers
 */
function PremiumHero() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRefs = useRef([]);
  const canvasRefs = useRef([]);
  const imagesRefs = useRef([[], [], []]);
  const [imagesLoaded, setImagesLoaded] = useState([false, false, false]);

  // Three room configurations
  const rooms = [
    {
      id: 'dark',
      name: 'The Dark Room',
      color: '#2EE6FF',
      colorRgb: '46, 230, 255',
      headline: 'Release what weighs on you',
      subheadline: 'Your confessions. Your regrets. Your truth.',
      description: 'A sanctuary for the unspoken. Share your mistakes, your dark secrets, the weight you carry alone. Here, judgment fades into understanding.',
      cta: 'Enter the Dark Room',
      frames: [
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-1_pin8tu.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104156/dark-frame-2_tsxs4x.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104156/dark-frame-3_i3cijk.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-4_ufxpq6.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-5_mwuovr.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-6_zth05y.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-7_sd42ty.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1786104155/dark-frame-8_ofgw0r.png',
      ]
    },
    {
      id: 'fantasy',
      name: 'The Fantasy Room',
      color: '#FF9D1C',
      colorRgb: '255, 157, 28',
      headline: 'Dream without limits',
      subheadline: 'Your ideas. Your fantasies. Your visions.',
      description: 'Where imagination runs wild. Share your daydreams, creative sparks, wild ideas, and the stories only you can tell. This is where joy lives.',
      cta: 'Enter the Fantasy Room',
      frames: [
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
      ]
    },
    {
      id: 'philo',
      name: 'The Philo Room',
      color: '#B56DFF',
      colorRgb: '181, 109, 255',
      headline: 'Question everything',
      subheadline: 'Your philosophy. Your spirituality. Your truth.',
      description: 'For deep thinkers and cosmic wanderers. Explore conspiracies, spirituality, existential questions, and ideas that challenge the ordinary. Think freely.',
      cta: 'Enter the Philo Room',
      frames: [
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
        'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
      ]
    }
  ];

  // Preload images for all sections
  useEffect(() => {
    rooms.forEach((room, sectionIndex) => {
      const loadImages = async () => {
        const imagePromises = room.frames.map((src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = reject;
          });
        });

        try {
          const loadedImages = await Promise.all(imagePromises);
          imagesRefs.current[sectionIndex] = loadedImages;
          setImagesLoaded(prev => {
            const newState = [...prev];
            newState[sectionIndex] = true;
            return newState;
          });
        } catch (error) {
          console.error(`Error loading ${room.name} images:`, error);
        }
      };

      loadImages();
    });
  }, []);

  // Handle scroll to determine active section and frame
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Determine which section is active
      const sectionHeight = windowHeight * 4;
      const currentSection = Math.min(
        rooms.length - 1,
        Math.floor(scrolled / sectionHeight)
      );
      setActiveSection(currentSection);

      // Calculate progress within current section
      const sectionStart = currentSection * sectionHeight;
      const sectionScroll = scrolled - sectionStart;
      const progress = Math.max(0, Math.min(1, sectionScroll / sectionHeight));
      setScrollProgress(progress);

      // Render current frame for active section
      renderFrame(currentSection, progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [imagesLoaded]);

  // Render frame to canvas
  const renderFrame = (sectionIndex, progress) => {
    const canvas = canvasRefs.current[sectionIndex];
    const images = imagesRefs.current[sectionIndex];
    
    if (!canvas || !images || images.length === 0 || !imagesLoaded[sectionIndex]) return;

    const ctx = canvas.getContext('2d');
    const frameIndex = Math.min(images.length - 1, Math.floor(progress * images.length));
    const img = images[frameIndex];

    if (!img) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

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

  return (
    <div ref={containerRef} className="relative">
      {/* Intro Section - App Identity */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden" style={{ background: '#000000' }}>
        <div className="relative z-10 text-center px-4 sm:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="mb-8"
          >
            <EsoLogo 
              className="h-16 sm:h-20 w-auto mx-auto mb-8" 
              style={{ filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))' }} 
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extralight mb-6 tracking-tight"
            style={{
              color: '#ffffff',
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.8)',
              lineHeight: '1.1',
            }}
          >
            For the ones who think differently
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-base sm:text-xl font-light mb-12 leading-relaxed"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textShadow: '0 2px 15px rgba(0, 0, 0, 0.7)',
            }}
          >
            A sanctuary for introverts, philosophers, dreamers, and deep souls.<br />
            Where your secrets are safe. Where your ideas matter.<br />
            Where you belong.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-xs tracking-[0.35em] uppercase"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            Scroll to explore
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-8"
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>

        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(46, 230, 255, 0.1) 0%, transparent 50%)',
          }}
        />
      </section>

      {/* Three Room Sections */}
      {rooms.map((room, index) => (
        <section
          key={room.id}
          ref={el => sectionRefs.current[index] = el}
          className="sticky top-0 h-screen w-full overflow-hidden"
          style={{ 
            background: '#000000',
            zIndex: activeSection === index ? 20 : 10,
          }}
        >
          <canvas
            ref={el => canvasRefs.current[index] = el}
            className="absolute inset-0 w-full h-full"
            style={{ 
              objectFit: 'cover',
              opacity: activeSection === index ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          />

          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.6) 100%)',
            }}
          />

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-8 text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: activeSection === index ? 1 : 0,
                y: activeSection === index ? 0 : 30,
              }}
              transition={{ duration: 0.8 }}
            >
              <div 
                className="text-xs tracking-[0.4em] uppercase font-bold mb-4"
                style={{
                  color: room.color,
                  textShadow: `0 0 20px ${room.color}40, 0 2px 10px rgba(0, 0, 0, 0.8)`,
                }}
              >
                {room.name}
              </div>

              <h2
                className="text-4xl sm:text-6xl md:text-7xl font-extralight mb-4 tracking-tight"
                style={{
                  color: '#ffffff',
                  textShadow: `0 0 40px ${room.color}20, 0 4px 30px rgba(0, 0, 0, 0.9)`,
                  lineHeight: '1.1',
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {room.headline}
              </h2>

              <p
                className="text-lg sm:text-2xl font-light mb-6"
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '0 2px 15px rgba(0, 0, 0, 0.8)',
                }}
              >
                {room.subheadline}
              </p>

              <p
                className="text-sm sm:text-base font-light mb-10 max-w-2xl leading-relaxed"
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
                }}
              >
                {room.description}
              </p>

              <button
                onClick={() => navigate(`/rooms/${room.id}`)}
                className="px-10 py-4 text-sm uppercase tracking-[0.25em] font-bold transition-all"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: `2px solid rgba(${room.colorRgb}, 0.4)`,
                  borderRadius: '6px',
                  backdropFilter: 'blur(12px)',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                  boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(${room.colorRgb}, 0.15)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `rgba(${room.colorRgb}, 0.15)`;
                  e.currentTarget.style.borderColor = `rgba(${room.colorRgb}, 0.6)`;
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 6px 30px rgba(0, 0, 0, 0.6), 0 0 60px rgba(${room.colorRgb}, 0.25)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = `rgba(${room.colorRgb}, 0.4)`;
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(${room.colorRgb}, 0.15)`;
                }}
              >
                {room.cta}
              </button>
            </motion.div>
          </div>

          {!imagesLoaded[index] && activeSection === index && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
              <div className="text-center">
                <div
                  className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-4 mx-auto"
                  style={{
                    borderColor: room.color,
                    borderTopColor: 'transparent',
                  }}
                />
                <p className="text-xs tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Loading {room.name}...
                </p>
              </div>
            </div>
          )}
        </section>
      ))}

      <div style={{ height: `${rooms.length * 400}vh` }} />
    </div>
  );
}

export default PremiumHero;
