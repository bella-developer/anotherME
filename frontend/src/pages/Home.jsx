import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Layout from '../components/Layout';
import CinematicBackground from '../components/CinematicBackground';
import { usePageTitle } from '../hooks/usePageTitle';

function Home() {
  usePageTitle('Home');
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const rooms = [
    {
      id: 'dark',
      name: 'Dark Room',
      label: 'I',
      tagline: 'The weight of feeling.',
      description: 'Where raw emotion finds its voice. No performance. No filter. Just truth.',
      path: '/rooms/dark',
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735009/darkroom_mf0vxg.png',
      accentText: '#c4a882',
    },
    {
      id: 'climb',
      name: 'Climb Room',
      label: 'II',
      tagline: 'The hunger to rise.',
      description: 'Ideas sharpened against each other. Growth that demands something of you.',
      path: '/rooms/climb',
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735019/climbroom_camkye.png',
      accentText: '#c47a3a',
    },
    {
      id: 'philo',
      name: 'Philo Room',
      label: 'III',
      tagline: 'The question that stays.',
      description: 'Thought as practice. Meaning as destination. Silence between the words.',
      path: '/rooms/philo',
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735026/philoroom_lazjzx.png',
      accentText: '#b8a8d4',
    },
  ];

  return (
    <Layout leftSidebar={null} rightSidebar={null}>
      <CinematicBackground />
      
      <div ref={containerRef} className="relative" style={{ zIndex: 10 }}>
        
        {/* HERO SECTION - Full viewport opening */}
        <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
            className="text-center"
          >
            <h1
              className="font-light text-white leading-none mb-8"
              style={{
                fontSize: 'clamp(4rem, 10vw, 9rem)',
                letterSpacing: '0.5em',
                fontWeight: 200,
                lineHeight: 0.95,
              }}
            >
              Y O U R<br />
              S A F E<br />
              S P A C E
            </h1>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
            className="absolute bottom-12 flex flex-col items-center gap-3"
          >
            <p className="text-white/30 text-[9px] tracking-[0.3em] uppercase">Scroll to enter</p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent"
            />
          </motion.div>
        </section>

        {/* DARK ROOM SCENE */}
        <CinematicRoomSection
          room={rooms[0]}
          onEnter={() => navigate(rooms[0].path)}
          index={0}
        />

        {/* CLIMB ROOM SCENE */}
        <CinematicRoomSection
          room={rooms[1]}
          onEnter={() => navigate(rooms[1].path)}
          index={1}
        />

        {/* PHILO ROOM SCENE */}
        <CinematicRoomSection
          room={rooms[2]}
          onEnter={() => navigate(rooms[2].path)}
          index={2}
        />

        {/* FINAL CLOSING SCENE */}
        <section className="h-screen flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950/10 via-black to-black" />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8 }}
            viewport={{ once: true, amount: 0.8 }}
            className="text-center relative z-10"
          >
            <p
              className="text-white/60 font-light"
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                letterSpacing: '0.15em',
                lineHeight: 1.6,
              }}
            >
              No judgment.<br />
              No performance.<br />
              Just you.
            </p>
          </motion.div>
        </section>

      </div>
    </Layout>
  );
}

/**
 * Cinematic Room Section Component
 * Full-screen scene with scroll-triggered animations
 */
function CinematicRoomSection({ room, onEnter, index }) {
  const sectionRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);
  const imageBrightness = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.4]);
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -40]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      onClick={onEnter}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-screen relative overflow-hidden cursor-pointer"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Full-bleed background image */}
      <motion.div
        className="absolute inset-0"
        style={{
          scale: imageScale,
          backgroundImage: `url('${room.img}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: `brightness(${imageBrightness})`,
        }}
      />

      {/* Black gradient overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.6) 40%, transparent 70%)',
        }}
      />

      {/* Accent glow on hover */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: isHovered ? 0.15 : 0 }}
        transition={{ duration: 0.8 }}
        style={{
          background: `radial-gradient(circle at 50% 80%, ${room.accentText}, transparent 60%)`,
        }}
      />

      {/* Roman numeral watermark */}
      <div
        className="absolute top-8 right-12 text-white/10 font-light"
        style={{
          fontSize: '14px',
          letterSpacing: '0.4em',
        }}
      >
        {room.label}
      </div>

      {/* Content - bottom left composition */}
      <motion.div
        className="absolute bottom-16 left-12 max-w-2xl"
        style={{ y: textY, opacity: textOpacity }}
      >
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mb-4"
          style={{
            fontSize: '11px',
            letterSpacing: '0.25em',
            color: room.accentText,
            textTransform: 'uppercase',
          }}
        >
          {room.tagline}
        </motion.p>

        {/* Room name - LARGE */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.2 }}
          className="text-white font-light uppercase mb-6"
          style={{
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            letterSpacing: '0.25em',
            lineHeight: 1,
          }}
        >
          {room.name}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1.2 }}
          className="text-white/50 mb-8"
          style={{
            fontSize: '1.1rem',
            letterSpacing: '0.05em',
            lineHeight: 1.8,
            maxWidth: '32rem',
          }}
        >
          {room.description}
        </motion.p>

        {/* Enter CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="flex items-center gap-4"
        >
          <span
            className="text-white/40 uppercase"
            style={{
              fontSize: '10px',
              letterSpacing: '0.3em',
            }}
          >
            Enter Room
          </span>
          <motion.span
            animate={{ x: isHovered ? 8 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ color: room.accentText }}
          >
            →
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Home;
