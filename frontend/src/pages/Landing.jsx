import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import EsoLogo from '../components/EsoLogo';
import { usePageTitle } from '../hooks/usePageTitle';
import HorizontalHero from '../components/HorizontalHero';

// ESO Landing Page - Updated June 29, 2026
function Landing() {
  usePageTitle('');
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: 'Philosophy',
      desc: 'Explore ideas that challenge the ordinary.',
      icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735034/philosophy_rcrqzu.png',
    },
    {
      title: 'Solitude',
      desc: 'Embracing the beauty of being alone.',
      icon: 'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z',
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735074/solitude_suyil8.png',
    },
    {
      title: 'Creativity',
      desc: 'Thoughts, stories, and art from quiet minds.',
      icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42',
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/creativity_mpfrcx.png',
    },
    {
      title: 'Deep Talks',
      desc: 'Conversations that go beneath the surface.',
      icon: 'M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155',
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/deeptalks_m615kc.png',
    },
  ];

  return (
    <div className="min-h-screen text-white overflow-x-hidden bg-black" style={{ fontFamily: "var(--font-body)" }}>

      {/* NAVIGATION - Editorial Spacing */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 transition-all"
        style={{
          zIndex: 50,
          border: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          transitionDuration: 'var(--duration-slow)',
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-3" role="navigation" aria-label="Main navigation" style={{ background: 'transparent' }}>
          <div className="flex items-center justify-between gap-4" style={{ background: 'transparent' }}>
            {/* Logo */}
            <Link to="/" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded transition-transform duration-300 hover:scale-105 flex-shrink-0" style={{ background: 'transparent' }}>
              <EsoLogo className="h-8 sm:h-10 w-auto" />
            </Link>
            
            {/* Navigation - Magazine-like spacing */}
            <div className="hidden md:flex items-center gap-8 lg:gap-12 text-xs tracking-widest uppercase flex-1 justify-center" style={{ background: 'transparent' }}>
              <a 
                href="#explore" 
                className="transition-all duration-500 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:transition-all after:duration-500"
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 1)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
              >
                Explore
              </a>
              <a 
                href="https://t.me/hesed_perspectives" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-all duration-500"
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 1)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
              >
                Community
              </a>
            </div>

            {/* Auth buttons - Responsive */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0" style={{ background: 'transparent' }}>
              <Link 
                to="/login"
                className="hidden sm:inline-block px-4 lg:px-6 py-2 text-xs transition-all duration-500 tracking-widest uppercase"
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 1)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                Sign In
              </Link>
              <Link 
                to="/register"
                className="px-4 sm:px-6 py-2 text-xs transition-all duration-500 tracking-widest uppercase join-button"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  border: `1px solid ${'#FFFFFF'}`,
                  borderRadius: 'var(--radius-soft)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                Join
              </Link>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* HORIZONTAL HERO SECTION */}
      <HorizontalHero />

      {/* SLIDING TEXT SECTION - Slowed Down, Editorial */}
      <section 
        id="explore"
        className="relative z-10 py-24 overflow-hidden"
        style={{ 
          background: '#000000',
        }}
      >
        <style>{`
          @keyframes slideLeft {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .slide-track {
            animation: slideLeft 80s linear infinite;
            display: flex;
            width: max-content;
          }
          .slide-track:hover {
            animation-play-state: paused;
          }
        `}</style>
        
        <div className="slide-track relative z-10">
          {/* Duplicate the words twice for seamless loop */}
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex items-center gap-16 px-8">
              {[
                'Creators',
                'Introverts', 
                'Unique Minds',
                'Philosophers',
                'Thinkers',
                'Deep Souls',
                'Observers',
                'Dreamers',
                'Seekers',
                'Quiet Rebels',
                'Authentic Beings',
                'Mindful Explorers'
              ].map((word, i) => (
                <div 
                  key={`${setIndex}-${i}`}
                  className="flex items-center gap-16"
                >
                  <span 
                    className="text-3xl md:text-4xl font-medium tracking-[0.08em] uppercase whitespace-nowrap transition-all duration-300 hover:scale-105"
                    style={{
                      color: '#FFFFFF',
                      textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    {word}
                  </span>
                  <span 
                    className="text-3xl"
                    style={{
                      color: 'rgba(167, 139, 250, 0.3)',
                      textShadow: '0 0 20px rgba(167, 139, 250, 0.5)',
                    }}
                  >
                    ✦
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>


      {/* FEATURES SECTION - Quieter, More Space */}
      <section className="py-32 lg:py-48 relative z-10" style={{ background: 'transparent' }}>
        <div className="max-w-6xl mx-auto px-8 lg:px-16">
          
          {/* Heading - Editorial Style */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-center mb-24"
          >
            <p className="text-xs tracking-ultra uppercase mb-4" style={{ color: 'var(--text-quaternary)' }}>
              Four Spaces
            </p>
            <h2 className="text-4xl md:text-5xl font-light mb-6" style={{ 
              letterSpacing: 'var(--tracking-tight)',
              color: 'var(--text-primary)'
            }}>
              For Your Inner World
            </h2>
            <p className="text-sm max-w-xl mx-auto" style={{ 
              color: 'var(--text-tertiary)',
              lineHeight: 'var(--leading-relaxed)'
            }}>
              Each room designed as a sanctuary for different aspects of thought
            </p>
          </motion.div>

          {/* Feature Cards - Clean Explore.jsx Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {features.map((f, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative flex flex-col items-center justify-end p-6 pb-8 text-center cursor-pointer group overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-2"
                style={{
                  minHeight: '320px',
                  background: 'rgba(255,255,255,0.02)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.08)',
                }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center rounded-xl transition-transform duration-700 group-hover:scale-110"
                  style={{ 
                    backgroundImage: `url('${f.img}')`, 
                    filter: 'contrast(1.1) brightness(0.5) saturate(1.1)',
                  }}
                />
                <div 
                  className="absolute inset-0 rounded-xl transition-all duration-500" 
                  style={{ 
                    background: 'linear-gradient(to top, rgba(0,0,0,0.99) 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.3) 100%)'
                  }} 
                />

                <div className="relative z-10 flex flex-col items-center">
                  <svg 
                    className="w-8 h-8 mb-5 group-hover:scale-110 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5}
                    style={{
                      color: '#FFFFFF',
                      filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.8))'
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                  <h3 
                    className="text-base tracking-[0.25em] uppercase font-extrabold mb-4" 
                    style={{
                      color: '#FFFFFF',
                      textShadow: '0 2px 12px rgba(0, 0, 0, 0.95), 0 4px 24px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 1)',
                      letterSpacing: '0.3em'
                    }}
                  >
                    {f.title}
                  </h3>
                  <p 
                    className="text-sm leading-relaxed transition-all duration-300 mb-5 font-medium" 
                    style={{
                      color: '#FFFFFF',
                      opacity: 0.95,
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.9), 0 4px 20px rgba(0, 0, 0, 0.7)'
                    }}
                  >
                    {f.desc}
                  </p>
                  <span 
                    className="group-hover:translate-x-1 transition-all duration-300 text-xl font-light"
                    style={{
                      color: '#FFFFFF',
                      opacity: 0.6,
                      textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)'
                    }}
                  >
                    →
                  </span>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Editorial Cards - Clean Explore.jsx Style */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            {/* Quote Card - Explore.jsx Style */}
            <div
              className="relative flex items-center justify-center text-center overflow-hidden rounded-xl min-h-[280px]"
              style={{
                boxShadow: '0 0 0 1px rgba(255,255,255,0.07)',
              }}
            >
              <div 
                className="absolute inset-0 rounded-xl" 
                style={{ 
                  backgroundImage: `url(https://res.cloudinary.com/dbtm7etag/image/upload/v1782735075/attention_ngxcb7.png)`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center', 
                  filter: 'contrast(1.05) brightness(0.8) saturate(1.1)',
                }} 
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-10">
                {/* Text at bottom with quote icons */}
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    {/* Opening quote */}
                    <svg className="w-6 h-6 text-white/20 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    
                    <p className="text-xl lg:text-2xl font-light leading-snug text-white flex-1">
                      Most people seek attention.<br />Few seek understanding.
                    </p>
                    
                    {/* Closing quote (rotated) */}
                    <svg className="w-6 h-6 text-white/20 flex-shrink-0 mt-1 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase">— Eso Philosophy</div>
                </div>
              </div>
            </div>

            {/* Community Card - Explore.jsx Style */}
            <div
              className="flex flex-col items-center justify-center text-center px-10 py-12 rounded-xl min-h-[280px]"
              style={{
                background: 'rgba(255,255,255,0.025)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.07)',
              }}
            >
              <div className="text-[10px] tracking-[0.28em] text-white/40 uppercase mb-6">Who You'll Meet</div>
              
              <div className="space-y-2 mb-8">
                {['The thinkers', 'The dreamers', 'The outsiders', 'The observers'].map((line, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + (i * 0.1) }}
                    className="text-sm font-light text-white"
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
              
              <p className="text-xs text-white/40 mb-7">They're all here, waiting.</p>
              
              <div className="flex justify-center -space-x-2 mb-8">
                {['1212984', '1438081', '1222271', '1239291', '1681010', '2379004'].map((id, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2 + (i * 0.05) }}
                    className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-black" 
                    style={{ backgroundImage: `url('https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?w=100&h=100&fit=crop')` }} 
                  />
                ))}
              </div>
              
              <button 
                onClick={() => {
                  const exploreSection = document.getElementById('explore');
                  if (exploreSection) {
                    exploreSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="group flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-white/50 hover:text-white transition-colors duration-300"
              >
                Join the Community
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* CTA SECTION - Premium Restraint */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="py-32 lg:py-48 relative z-10"
        style={{ background: 'transparent' }}
      >
        <div className="max-w-3xl mx-auto px-8 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.9 }}
          >
            <p className="text-xs tracking-ultra uppercase mb-8" style={{ color: 'var(--text-quaternary)' }}>
              Begin Your Journey
            </p>
            <h2 className="text-3xl md:text-4xl font-light mb-12" style={{ 
              letterSpacing: 'var(--tracking-tight)',
              color: 'var(--text-primary)',
              lineHeight: 'var(--leading-tight)'
            }}>
              Ideas deserve more than<br />comment sections
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-3 text-xs uppercase tracking-widest transition-all join-eso-button"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  borderRadius: 'var(--radius-soft)',
                  fontWeight: 'var(--weight-medium)',
                  transitionDuration: 'var(--duration-slow)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                Join ESO
              </button>
              <button
                onClick={() => {
                  const exploreSection = document.getElementById('explore');
                  if (exploreSection) {
                    exploreSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="px-8 py-3 text-xs uppercase tracking-widest transition-all"
                style={{
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-secondary)',
                  borderRadius: 'var(--radius-soft)',
                  fontWeight: 'var(--weight-medium)',
                  transitionDuration: 'var(--duration-slow)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }}
              >
                Explore
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* FOOTER - Editorial Spacing */}
      <footer className="border-t relative z-10" style={{ 
        borderColor: 'var(--border-whisper)',
        background: 'var(--surface-void)'
      }}>
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div>
              <div className="mb-6">
                <EsoLogo className="h-8 w-auto" />
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                A digital sanctuary for introverts and deep thinkers
              </p>
            </div>
            
            <div>
              <h4 className="text-xs tracking-ultra uppercase mb-6" style={{ color: 'var(--text-quaternary)' }}>Platform</h4>
              <ul className="space-y-3">
                <li><Link to="/explore" className="text-xs transition-colors" style={{ 
                  color: 'var(--text-tertiary)',
                  transitionDuration: 'var(--duration-normal)'
                }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}>Explore</Link></li>
                <li><Link to="/about" className="text-xs transition-colors" style={{ 
                  color: 'var(--text-tertiary)',
                  transitionDuration: 'var(--duration-normal)'
                }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}>About</Link></li>
                <li><Link to="/rules" className="text-xs transition-colors" style={{ 
                  color: 'var(--text-tertiary)',
                  transitionDuration: 'var(--duration-normal)'
                }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}>Rules</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs tracking-ultra uppercase mb-6" style={{ color: 'var(--text-quaternary)' }}>Community</h4>
              <ul className="space-y-3">
                <li><a href="https://t.me/hesed_perspectives" target="_blank" rel="noopener noreferrer" className="text-xs transition-colors" style={{ 
                  color: 'var(--text-tertiary)',
                  transitionDuration: 'var(--duration-normal)'
                }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}>Telegram</a></li>
                <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-xs transition-colors" style={{ 
                  color: 'var(--text-tertiary)',
                  transitionDuration: 'var(--duration-normal)'
                }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}>YouTube</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs tracking-ultra uppercase mb-6" style={{ color: 'var(--text-quaternary)' }}>Connect</h4>
              <ul className="space-y-3">
                <li><a href="mailto:hello@eso.app" className="text-xs transition-colors" style={{ 
                  color: 'var(--text-tertiary)',
                  transitionDuration: 'var(--duration-normal)'
                }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}>hello@eso.app</a></li>
                <li><a href="mailto:support@eso.app" className="text-xs transition-colors" style={{ 
                  color: 'var(--text-tertiary)',
                  transitionDuration: 'var(--duration-normal)'
                }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}>Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{
            borderColor: 'var(--border-whisper)'
          }}>
            <p className="text-xs" style={{ color: 'var(--text-ghost)' }}>© 2026 ESO</p>
            <p className="text-xs" style={{ color: 'var(--text-ghost)' }}>No algorithms. Just real conversations.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Landing;
