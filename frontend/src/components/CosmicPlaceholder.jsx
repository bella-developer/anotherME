import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Temporary Cosmic Placeholder (until videos are ready)
function CosmicPlaceholder({ 
  title, 
  description, 
  room,
  index 
}) {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  const handleMouseMove = (e) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePosition({ x: x * 20, y: y * 20 });
    }
  };

  const roomThemes = {
    dark: {
      primary: '#ef4444',
      secondary: '#dc2626',
      glow: 'rgba(239, 68, 68, 0.5)',
      gradient: 'linear-gradient(135deg, #7f1d1d 0%, #1a0000 50%, #000000 100%)',
    },
    fantasy: {
      primary: '#f97316',
      secondary: '#ea580c',
      glow: 'rgba(249, 115, 22, 0.5)',
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #1a0a00 50%, #000000 100%)',
    },
    philo: {
      primary: '#a855f7',
      secondary: '#9333ea',
      glow: 'rgba(168, 85, 247, 0.5)',
      gradient: 'linear-gradient(135deg, #581c87 0%, #1a001a 50%, #000000 100%)',
    }
  };

  const theme = roomThemes[room];

  return (
    <motion.section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{ opacity }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Cosmic Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{
            background: theme.gradient,
            scale,
          }}
        >
          {/* Animated Stars */}
          <div className="absolute inset-0">
            {[...Array(100)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute w-0.5 h-0.5 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.7 + 0.3,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Cosmic Circles */}
          <motion.div
            className="absolute inset-0"
            style={{
              x: mousePosition.x,
              y: mousePosition.y,
            }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`circle-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${(i + 1) * 200}px`,
                  height: `${(i + 1) * 200}px`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: `1px solid ${theme.glow}`,
                  opacity: 0.1,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </motion.div>

          {/* Floating Orbs */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute rounded-full blur-xl"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: theme.glow,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.5 }}
        >
          <motion.h2 
            className="text-5xl md:text-7xl font-bold mb-6 tracking-wider"
            style={{
              color: theme.primary,
              textShadow: `0 0 40px ${theme.glow}, 0 0 80px ${theme.glow}, 0 4px 20px rgba(0,0,0,0.9)`,
            }}
            animate={{
              textShadow: [
                `0 0 40px ${theme.glow}, 0 0 80px ${theme.glow}`,
                `0 0 60px ${theme.glow}, 0 0 120px ${theme.glow}`,
                `0 0 40px ${theme.glow}, 0 0 80px ${theme.glow}`,
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            {title}
          </motion.h2>
          
          <p 
            className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed"
            style={{
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.9)',
            }}
          >
            {description}
          </p>
          
          <motion.button
            onClick={() => navigate(`/${room}`)}
            className="px-8 py-4 text-lg font-semibold uppercase tracking-wider transition-all duration-300 rounded-lg"
            style={{
              backgroundColor: theme.primary,
              color: '#ffffff',
              boxShadow: `0 0 30px ${theme.glow}, 0 10px 40px rgba(0, 0, 0, 0.5)`,
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: `0 0 50px ${theme.glow}, 0 15px 50px rgba(0, 0, 0, 0.6)`,
            }}
            whileTap={{ scale: 0.95 }}
          >
            Enter {title}
          </motion.button>
        </motion.div>
      </div>

      {/* Particle Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: theme.primary,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 10px ${theme.glow}`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.section>
  );
}

export default CosmicPlaceholder;
