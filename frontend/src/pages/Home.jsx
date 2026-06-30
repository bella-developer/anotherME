import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Atmosphere from '../components/Atmosphere';
import Scene from '../components/Scene';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * ESO Home - Minimalist Cinematic
 * Feels alive, not animated
 * Like entering a quiet sanctuary
 */
function Home() {
  usePageTitle('Home');

  const rooms = [
    {
      id: 'dark',
      name: 'Dark Room',
      label: 'Release',
      description: 'Where raw emotion finds its voice. No performance. No filter. Just truth.',
      path: '/rooms/dark',
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735009/darkroom_mf0vxg.png',
    },
    {
      id: 'climb',
      name: 'Climb Room',
      label: 'Build',
      description: 'Ideas sharpened against each other. Growth that demands something of you.',
      path: '/rooms/climb',
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735019/climbroom_camkye.png',
    },
    {
      id: 'philo',
      name: 'Philo Room',
      label: 'Reflect',
      description: 'Thought as practice. Meaning as destination. Silence between the words.',
      path: '/rooms/philo',
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735026/philoroom_lazjzx.png',
    },
  ];

  return (
    <Layout leftSidebar={null} rightSidebar={null}>
      <Atmosphere />
      
      <div className="relative" style={{ zIndex: 10 }}>
        
        {/* HERO - Quiet introduction */}
        <section className="h-screen flex flex-col items-center justify-center relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="text-center px-8"
          >
            {/* Main title - massive, spaced, light */}
            <motion.h1
              animate={{ 
                scale: [1, 1.01, 1],
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
              className="text-[#ECECEC] mb-12"
              style={{
                fontSize: 'clamp(4rem, 9vw, 8rem)',
                fontWeight: 200,
                letterSpacing: '0.45em',
                lineHeight: 0.9,
              }}
            >
              Y O U R<br />
              S A F E<br />
              S P A C E
            </motion.h1>

            {/* Subtitle - small, muted */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 1 }}
              className="text-[#9B9B9B]"
              style={{
                fontSize: '14px',
                letterSpacing: '0.05em',
                lineHeight: 1.8,
              }}
            >
              A quiet place to release, reflect, and rebuild.
            </motion.p>
          </motion.div>

          {/* Scroll indicator - simple fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: 'easeInOut',
              delay: 2,
            }}
            className="absolute bottom-16 text-[#9B9B9B]"
            style={{
              fontSize: '20px',
            }}
          >
            ↓
          </motion.div>
        </section>

        {/* DARK ROOM - Left aligned */}
        <Scene room={rooms[0]} align="left" index={0} />

        {/* CLIMB ROOM - Right aligned */}
        <Scene room={rooms[1]} align="right" index={1} />

        {/* PHILO ROOM - Left aligned */}
        <Scene room={rooms[2]} align="left" index={2} />

        {/* CLOSING SCENE - Emotional payoff */}
        <section className="h-screen flex items-center justify-center relative overflow-hidden">
          {/* Distant warm light */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(198, 134, 66, 0.08) 0%, #050505 50%)',
            }}
          />

          {/* Closing text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.8 }}
            className="text-center px-8"
          >
            <p
              className="text-[#9B9B9B]"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 300,
                letterSpacing: '0.1em',
                lineHeight: 1.8,
              }}
            >
              Silence isn't empty.<br />
              It's where you hear yourself.
            </p>
          </motion.div>
        </section>

      </div>
    </Layout>
  );
}

export default Home;
