import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Cosmic Video Section Component
function CosmicVideoSection({ 
  videoUrl, 
  title, 
  description, 
  color, 
  room,
  index 
}) {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && videoRef.current && isLoaded) {
          videoRef.current.play().catch(err => console.log('Video play failed:', err));
        } else if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isLoaded]);

  const handleVideoLoaded = () => {
    setIsLoaded(true);
    if (isVisible && videoRef.current) {
      videoRef.current.play().catch(err => console.log('Video play failed:', err));
    }
  };

  const handleMouseMove = (e) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePosition({ x: x * 30, y: y * 30 });
    }
  };

  const roomColors = {
    dark: { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' },
    fantasy: { primary: '#f97316', glow: 'rgba(249, 115, 22, 0.4)' },
    philo: { primary: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' }
  };

  const roomColor = roomColors[room];

  return (
    <motion.section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{ opacity }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Video Background */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          scale,
          x: mousePosition.x,
          y: mousePosition.y,
        }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={handleVideoLoaded}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
          }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        
        {/* Loading placeholder */}
        {!isLoaded && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at center, ${roomColor.glow} 0%, #000000 70%)`,
            }}
          >
            <div className="text-white text-lg">Loading...</div>
          </div>
        )}
        
        {/* Subtle color overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${roomColor.glow} 0%, transparent 60%)`,
            mixBlendMode: 'overlay',
            opacity: 0.3,
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.5 }}
        >
          <h2 
            className="text-5xl md:text-7xl font-bold mb-6 tracking-wider"
            style={{
              color: roomColor.primary,
              textShadow: `0 0 40px ${roomColor.glow}, 0 0 80px ${roomColor.glow}, 0 4px 20px rgba(0,0,0,0.9)`,
            }}
          >
            {title}
          </h2>
          <p 
            className="text-xl md:text-2xl text-white mb-12 leading-relaxed"
            style={{
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.9), 0 2px 10px rgba(0, 0, 0, 0.8)',
            }}
          >
            {description}
          </p>
          <button
            onClick={() => navigate(`/${room}`)}
            className="px-8 py-4 text-lg font-semibold uppercase tracking-wider transition-all duration-300 rounded-lg"
            style={{
              backgroundColor: document.body.classList.contains('light-mode') ? 'rgba(0, 0, 0, 0.9)' : roomColor.primary,
              color: '#ffffff',
              boxShadow: document.body.classList.contains('light-mode') 
                ? '0 4px 20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 1)'
                : `0 0 30px ${roomColor.glow}, 0 10px 40px rgba(0, 0, 0, 0.5)`,
              border: document.body.classList.contains('light-mode') ? '2px solid rgba(0, 0, 0, 1)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (document.body.classList.contains('light-mode')) {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
              }
            }}
            onMouseLeave={(e) => {
              if (document.body.classList.contains('light-mode')) {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
              }
            }}
          >
            Enter {title}
          </button>
        </motion.div>
      </div>

      {/* Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: roomColor.primary,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 10px ${roomColor.glow}`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.section>
  );
}

export default CosmicVideoSection;
