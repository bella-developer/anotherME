import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/**
 * Scene Component
 * Minimal full-viewport room scene with subtle reveal
 * Alternates text position (left/right) for rhythm
 */
function Scene({ room, align = 'left', index }) {
  const navigate = useNavigate();

  return (
    <section className="h-screen relative overflow-hidden">
      {/* Full-screen background image */}
      <motion.div
        initial={{ opacity: 0, filter: 'brightness(0.4)' }}
        whileInView={{ 
          opacity: 1, 
          filter: 'brightness(1)',
          scale: 1,
        }}
        transition={{ 
          duration: 1.2, 
          ease: [0.22, 1, 0.36, 1],
        }}
        viewport={{ once: true, amount: 0.3 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${room.img}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          scale: 1.03,
        }}
      />

      {/* Dark gradient overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(5,5,5,0.8) 0%, rgba(5,5,5,0.45) 35%, transparent 65%)',
        }}
      />

      {/* Content - bottom left or right */}
      <div
        className={`absolute bottom-0 ${align === 'left' ? 'left-0' : 'right-0'} p-16 md:p-24 max-w-2xl`}
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-[#9B9B9B] mb-6"
          style={{
            fontSize: '11px',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            fontWeight: 400,
          }}
        >
          {room.label}
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-[#ECECEC] mb-8"
          style={{
            fontSize: 'clamp(3rem, 5vw, 4rem)',
            fontWeight: 300,
            letterSpacing: '0.18em',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          {room.name}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-[#9B9B9B] mb-12"
          style={{
            fontSize: '16px',
            lineHeight: 2,
            maxWidth: '28rem',
          }}
        >
          {room.description}
        </motion.p>

        {/* Enter button - looks like text */}
        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true, amount: 0.5 }}
          onClick={() => navigate(room.path)}
          className="group relative text-[#ECECEC] bg-transparent border-none cursor-pointer"
          style={{
            fontSize: '11px',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            fontWeight: 400,
            padding: 0,
          }}
        >
          <span className="inline-block transition-opacity duration-200 group-hover:opacity-100 opacity-70">
            ENTER →
          </span>
          <span
            className="absolute bottom-0 left-0 h-px bg-[#ECECEC] transition-all duration-200 opacity-0 group-hover:opacity-100"
            style={{ width: '100%' }}
          />
        </motion.button>
      </div>
    </section>
  );
}

export default Scene;
