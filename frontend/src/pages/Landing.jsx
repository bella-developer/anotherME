import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import EsoLogo from '../components/EsoLogo';
import { usePageTitle } from '../hooks/usePageTitle';

const landingHeroBg = 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782740734/landing-hero-bg_u4uoy8.png';

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
    <div className="min-h-screen text-white overflow-x-hidden bg-black" style={{ fontFamily: "'Geist Mono', monospace" }}>

      {/* NAVIGATION */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
          isScrolled ? 'border-white/15 bg-black/95 backdrop-blur-xl' : 'border-white/5 bg-black/80 backdrop-blur-md'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-12 py-4" role="navigation" aria-label="Main navigation">
          <div className="flex items-center justify-between">
            <Link to="/" className="focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
              <EsoLogo className="h-9 w-auto" />
            </Link>
            
            <div className="flex items-center gap-8">
              <Link to="/explore" className="text-sm text-white/60 hover:text-white transition-colors tracking-wider uppercase hidden md:inline-block">
                Surf Around
              </Link>
              <a 
                href="https://t.me/hesed_perspectives" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-white/60 hover:text-white transition-colors tracking-wider uppercase hidden md:inline-block"
              >
                Socials
              </a>
              <div className="flex items-center gap-3">
                <Link 
                  to="/login"
                  className="px-5 py-2 text-sm text-white/80 hover:text-white transition-colors tracking-wider uppercase border border-white/20 hover:border-white/40 rounded"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register"
                  className="px-5 py-2 text-sm bg-white text-black font-semibold hover:bg-white/90 transition-all tracking-wider uppercase rounded"
                >
                  Join
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ 
              backgroundImage: `url(${landingHeroBg})`,
              filter: 'contrast(1.05) brightness(0.85) saturate(1.05)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-32 items-center lg:items-start">
            
            {/* LEFT SIDE - Hero Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6 md:space-y-8 pt-0 md:pt-8 lg:pt-12"
            >
              <div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-block px-4 py-2 mb-6"
                >
                  <span className="text-xs tracking-[0.25em] uppercase text-white font-bold">Safe · Cozy · Comfy Environment</span>
                </motion.div>
                
                <h1 className="leading-[1.1] mb-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative mb-6"
                  >
                    <EsoLogo className="h-20 sm:h-24 lg:h-28 w-auto" />
                  </motion.div>

                  
                  <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="block text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-wide whitespace-nowrap"
                  >
                    A Space for Deep Thinkers
                  </motion.span>
                </h1>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-base text-white/70 leading-relaxed max-w-lg"
                >
                  A quiet corner of the internet for introverts, philosophers, creators, and people who think deeply and feel differently.
                </motion.p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="flex gap-3"
              >
                <button 
                  onClick={() => navigate('/register')}
                  className="px-6 py-3 bg-white text-black font-semibold text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all shadow-lg rounded"
                  aria-label="Create an account"
                >
                  Step In →
                </button>
                
                <button 
                  onClick={() => navigate('/explore')}
                  className="px-6 py-3 text-white font-medium text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all border border-white/30 hover:border-white/50 rounded"
                  aria-label="Explore content"
                >
                  Surf Around
                </button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="flex flex-col sm:flex-row items-center sm:items-center gap-3 pt-4"
              >
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cover bg-center border-2 border-black" style={{ backgroundImage: "url('https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?w=100&h=100&fit=crop')" }} />
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cover bg-center border-2 border-black" style={{ backgroundImage: "url('https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop')" }} />
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cover bg-center border-2 border-black" style={{ backgroundImage: "url('https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=100&h=100&fit=crop')" }} />
                </div>
                <p className="text-xs sm:text-sm text-white/60 text-center sm:text-left">
                  <span className="text-white font-semibold">Join us</span> and discover your tribe
                </p>
              </motion.div>
            </motion.div>
            
            {/* RIGHT SIDE - Feature Card */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:ml-auto w-full max-w-md mx-auto lg:mx-0 pt-0 md:pt-8 lg:pt-32"
            >
              <div 
                className="p-6 md:p-8 rounded-xl backdrop-blur-md border border-white/5 hover:border-white/10 transition-all duration-500 group"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                }}
              >
                <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 tracking-wider">Why ESO?</h2>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed mb-4 md:mb-6">
                  For those who think differently.
                </p>
                
                <div className="space-y-2 md:space-y-3">
                  {['Speak freely, stay anonymous', 'Three rooms for your inner world', 'Raw conversations, zero algorithms'].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + (i * 0.1) }}
                      className="flex items-start gap-2 md:gap-3"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-white/60 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs md:text-sm text-white/80">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* SLIDING TEXT SECTION - Artistic & Beautiful */}
      <section 
        className="relative z-10 py-24 border-y border-white/5 overflow-hidden"
        style={{ 
          background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(10,5,20,0.98) 50%, rgba(0,0,0,0.95) 100%)',
          backdropFilter: 'blur(40px)',
        }}
      >
        <style>{`
          @keyframes slideLeft {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .slide-track {
            animation: slideLeft 50s linear infinite;
            display: flex;
            width: max-content;
          }
          .slide-track:hover {
            animation-play-state: paused;
          }
          .word-glow {
            filter: drop-shadow(0 0 20px rgba(167, 139, 250, 0.4)) 
                    drop-shadow(0 0 40px rgba(139, 92, 246, 0.2));
          }
        `}</style>
        
        {/* Ambient light effect */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 60%)',
          }}
        />
        
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
        
        {/* Bottom fade effect */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
          }}
        />
      </section>


      {/* FEATURES SECTION */}
      <section className="py-24 lg:py-32 relative z-10" style={{ background: 'rgba(0,0,0,0.6)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-wider">Spaces for Your Mind</h2>
            <p className="text-white/60 text-sm max-w-2xl mx-auto">
              Four unique rooms designed for different aspects of your inner world
            </p>
          </motion.div>

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
                    filter: 'contrast(1.05) brightness(0.75) saturate(1.05)',
                  }}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/98 via-transparent to-transparent group-hover:from-black/95 transition-all duration-500" style={{ backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.7) 35%, transparent 70%)' }} />

                <div className="relative z-10 flex flex-col items-center">
                  <svg className="w-6 h-6 text-white/50 mb-3 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                  <h3 className="text-sm tracking-[0.25em] uppercase font-semibold mb-2 text-white">{f.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300 mb-3">{f.desc}</p>
                  <span className="text-white/30 group-hover:text-white transition-all duration-300 group-hover:translate-x-1 text-lg">→</span>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            {/* Quote Card */}
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


            {/* Community Card */}
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
                onClick={() => navigate('/explore')}
                className="group flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-white/50 hover:text-white transition-colors duration-300"
              >
                Meet the Community
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* CTA SECTION */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 relative z-10"
        style={{ background: 'rgba(0,0,0,0.8)' }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-wider">Ready to Join?</h2>
          <p className="text-white/60 text-base mb-10 max-w-2xl mx-auto leading-relaxed">
            Create your account and start sharing your thoughts. Connect with people who value depth, 
            philosophy, creativity, and meaningful conversations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-white text-black font-semibold text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all shadow-lg rounded"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="px-8 py-3 border border-white/30 text-white font-medium text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all rounded"
            >
              Explore First
            </button>
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 relative z-10 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <EsoLogo className="h-8 w-auto" />
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                Your inner world, finally understood. A safe space for introverts and deep thinkers.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold tracking-wider uppercase mb-3 text-white/70">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/explore" className="text-sm text-white/50 hover:text-white transition-colors">Explore</Link></li>
                <li><Link to="/about" className="text-sm text-white/50 hover:text-white transition-colors">About</Link></li>
                <li><Link to="/rules" className="text-sm text-white/50 hover:text-white transition-colors">Community Rules</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold tracking-wider uppercase mb-3 text-white/70">Socials</h4>
              <ul className="space-y-2">
                <li><a href="https://t.me/hesed_perspectives" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors">Telegram</a></li>
                <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors">YouTube</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold tracking-wider uppercase mb-3 text-white/70">Connect</h4>
              <ul className="space-y-2">
                <li><a href="mailto:hello@eso.app" className="text-sm text-white/50 hover:text-white transition-colors">hello@eso.app</a></li>
                <li><a href="mailto:support@eso.app" className="text-sm text-white/50 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/40">© 2026 ESO. For deep thinkers and authentic minds.</p>
            <p className="text-xs text-white/40">No algorithms. Just real conversations.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Landing;
