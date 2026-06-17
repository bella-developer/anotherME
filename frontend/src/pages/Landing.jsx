import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

const features = [
    {
      title: 'Philosophy',
      desc: 'Explore ideas that challenge the ordinary.',
      icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
      img: 'https://images.pexels.com/photos/1660995/pexels-photo-1660995.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      title: 'Solitude',
      desc: 'Embracing the beauty of being alone.',
      icon: 'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z',
      img: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      title: 'Creativity',
      desc: 'Thoughts, stories, and art from quiet minds.',
      icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42',
      img: 'https://images.pexels.com/photos/3094208/pexels-photo-3094208.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      title: 'Deep Talks',
      desc: 'Conversations that go beneath the surface.',
      icon: 'M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155',
      img: 'https://images.pexels.com/photos/1083822/pexels-photo-1083822.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  ];

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ fontFamily: "'Geist Mono', 'Courier New', monospace" }}>

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10" style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(14px)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-semibold tracking-[0.22em] uppercase leading-tight">Introverts safe place.</div>
          </div>
        </div>
      </header>

      {/* HERO - Netflix-Inspired Split Layout (App Style) */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-[url('/landing-hero-bg.png')] bg-cover bg-center" 
            style={{ 
              filter: 'contrast(1.05) brightness(0.95) saturate(1.05)',
              imageRendering: 'crisp-edges'
            }}
          />
          {/* Minimal vignette for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full py-24">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* LEFT SIDE - Minimalist Typographic with Geometric Elements */}
            <div className="space-y-8">
              <h1 className="leading-[1.1]" style={{ fontFamily: "'Geist Mono', 'Courier New', monospace" }}>
                {/* WELCOME - Outlined with geometric accent */}
                <div className="relative mb-3">
                  <div 
                    className="absolute -left-4 top-1/2 w-2 h-2 border border-white/40"
                    style={{ transform: 'translateY(-50%) rotate(45deg)' }}
                  />
                  <span 
                    className="block text-4xl sm:text-5xl lg:text-6xl font-light relative"
                    style={{ 
                      letterSpacing: '0.15em',
                      color: 'transparent',
                      WebkitTextStroke: '1.5px rgba(255,255,255,0.8)',
                      textShadow: '0 0 40px rgba(255,255,255,0.15)',
                    }}
                  >
                    WELCOME
                  </span>
                </div>
                
                {/* HOME, - Solid fill with offset shadow */}
                <div className="relative mb-3">
                  <span 
                    className="block text-4xl sm:text-5xl lg:text-6xl font-black relative"
                    style={{ 
                      letterSpacing: '0.12em',
                      color: 'white',
                      textShadow: '6px 6px 0px rgba(0,0,0,0.5)',
                    }}
                  >
                    HOME,
                  </span>
                  <div 
                    className="absolute -right-6 top-0 w-1 h-full bg-white/20"
                    style={{ transform: 'skewX(-15deg)' }}
                  />
                </div>
                
                {/* BUDDY. - Inline shadow with line accent */}
                <div className="relative">
                  <div 
                    className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-white/60 via-white/20 to-transparent"
                  />
                  <span 
                    className="block text-3xl sm:text-4xl lg:text-5xl font-medium"
                    style={{ 
                      letterSpacing: '0.18em',
                      color: 'white',
                      textShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 4px 30px rgba(0,0,0,0.9)',
                      opacity: 0.95,
                    }}
                  >
                    BUDDY.
                  </span>
                </div>
              </h1>
              
              {/* Decorative geometric element */}
              <div className="flex items-center gap-3 pt-4">
                <div className="w-8 h-px bg-white/30" />
                <div className="w-1.5 h-1.5 bg-white/50 rotate-45" />
                <div className="w-16 h-px bg-gradient-to-r from-white/30 to-transparent" />
              </div>
            </div>
            
            {/* RIGHT SIDE - Transparent Card with Minimal Border */}
            <div className="lg:ml-auto max-w-md">
              <div 
                className="p-8 rounded-xl space-y-6 transition-all duration-500 hover:-translate-y-1"
                style={{
                  background: 'transparent',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.15)',
                }}
              >
                {/* Subtle hover glow */}
                <div 
                  className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.05)' }} 
                />
                
                {/* Subtitle with minimal border */}
                <div className="border-l-2 border-white/30 pl-4 relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    A Safe Haven
                  </h2>
                  <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">
                    For Deep Thinkers
                  </p>
                </div>
                
                {/* Description */}
                <p className="text-sm text-gray-300 leading-relaxed relative z-10">
                  In a world of noise, survival means finding your tribe. Join introverts, philosophers, and quiet souls who seek depth over superficiality.
                </p>
                
                {/* CTAs - App Style */}
                <div className="flex gap-4 relative z-10">
                  <button 
                    onClick={() => navigate('/login')}
                    className="flex-1 py-3 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all"
                  >
                    STEP IN
                  </button>
                  
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-6 py-3 text-white font-semibold text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                    style={{
                      background: 'transparent',
                      boxShadow: '0 0 0 1px rgba(255,255,255,0.3)',
                    }}
                  >
                    EXPLORE
                  </button>
                </div>
                
                {/* Community Badge */}
                <div 
                  className="pt-4 flex items-center gap-3 relative z-10"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?w=100&h=100&fit=crop')", boxShadow: '0 0 0 2px rgba(255,255,255,0.1)' }} />
                    <div className="w-8 h-8 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop')", boxShadow: '0 0 0 2px rgba(255,255,255,0.1)' }} />
                    <div className="w-8 h-8 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=100&h=100&fit=crop')", boxShadow: '0 0 0 2px rgba(255,255,255,0.1)' }} />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">
                    <span className="text-white font-bold">2,847+</span> thoughtful minds
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="relative z-10 py-12" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4">
            {[
              { icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z', val: '2,847', label: 'Quiet Minds' },
              { icon: 'M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155', val: '1,203', label: 'Deep Discussions' },
              { icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25', val: '436', label: 'Shared Thoughts' },
              { icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253', val: '23 Countries', label: 'Worldwide' },
              { icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z', val: 'No noise.', label: 'Just real connections.' },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center text-center py-6 px-4 rounded-lg transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 4px 24px rgba(0,0,0,0.4)',
                }}
              >
                <svg className="w-5 h-5 text-white/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
                <div className="text-base font-light tracking-wide mb-1 text-white">{s.val}</div>
                <div className="text-[9px] tracking-[0.18em] text-white/40 uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES + QUOTE + COMMUNITY */}
      <section className="py-20 lg:py-28 relative z-10" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">

          {/* Feature cards — 4 cols, no grid lines, floating cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {features.map((f) => (
              <div
                key={f.title}
                onClick={() => navigate('/login')}
                className="relative flex flex-col items-center justify-between p-7 text-center cursor-pointer group overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-1"
                style={{
                  minHeight: '260px',
                  background: 'rgba(255,255,255,0.02)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 8px 40px rgba(0,0,0,0.6)',
                }}
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center rounded-xl transition-transform duration-700 group-hover:scale-110"
                  style={{ 
                    backgroundImage: `url('${f.img}')`, 
                    filter: 'contrast(1.3) brightness(0.5) saturate(1.2)',
                    imageRendering: 'crisp-edges'
                  }}
                />
                {/* Vignette */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 via-black/10 to-black/30 group-hover:from-black/60 transition-all duration-500" />
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.04)' }} />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">
                  <svg className="w-6 h-6 text-white/50 mb-5 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                  <div className="text-[10px] tracking-[0.25em] uppercase font-semibold mb-3 text-white">{f.title}</div>
                  <p className="text-[11px] text-white/50 leading-relaxed group-hover:text-white/80 transition-colors duration-300">{f.desc}</p>
                </div>
                <span className="relative z-10 mt-6 text-white/25 group-hover:text-white transition-all duration-300 group-hover:translate-x-1 inline-block">→</span>
              </div>
            ))}
          </div>

          {/* Quote + Community — 2 cols, same card style */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Quote */}
            <div
              className="relative flex items-center justify-center text-center overflow-hidden rounded-xl"
              style={{
                minHeight: '280px',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 8px 40px rgba(0,0,0,0.6)',
              }}
            >
              <div 
                className="absolute inset-0 rounded-xl" 
                style={{ 
                  backgroundImage: "url('/landing-hero-bg.png')", 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center', 
                  filter: 'contrast(1.2) brightness(0.4) saturate(1.1)',
                  imageRendering: 'crisp-edges'
                }} 
              />
              <div className="absolute inset-0 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 100%)' }} />
              <div className="relative z-10 px-10 py-12">
                <svg className="w-6 h-6 text-white/15 mb-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-xl lg:text-2xl font-light leading-snug text-white mb-5">
                  Most people seek attention.<br />Few seek understanding.
                </p>
                <div className="text-[9px] tracking-[0.3em] text-white/30 uppercase">— anotherME</div>
              </div>
            </div>

            {/* Community */}
            <div
              className="flex flex-col items-center justify-center text-center px-10 py-12 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.025)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 8px 40px rgba(0,0,0,0.5)',
              }}
            >
              <div className="text-[9px] tracking-[0.28em] text-white/30 uppercase mb-5">The Community</div>
              
              {/* 4 Lines - Each phrase on separate line */}
              <div className="text-xs sm:text-sm font-light leading-relaxed text-white mb-1">
                The thinkers.
              </div>
              <div className="text-xs sm:text-sm font-light leading-relaxed text-white mb-1">
                The dreamers.
              </div>
              <div className="text-xs sm:text-sm font-light leading-relaxed text-white mb-1">
                The outsiders.
              </div>
              <div className="text-xs sm:text-sm font-light leading-relaxed text-white mb-4">
                The observers.
              </div>
              
              <p className="text-[11px] text-white/35 mb-7">They're all here.</p>
              <div className="flex justify-center -space-x-2 mb-7">
                <div className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-black" style={{ backgroundImage: "url('https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100&h=100&fit=crop')" }} />
                <div className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-black" style={{ backgroundImage: "url('https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?w=100&h=100&fit=crop')" }} />
                <div className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-black" style={{ backgroundImage: "url('https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?w=100&h=100&fit=crop')" }} />
                <div className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-black" style={{ backgroundImage: "url('https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop')" }} />
                <div className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-black" style={{ backgroundImage: "url('https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=100&h=100&fit=crop')" }} />
                <div className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-black" style={{ backgroundImage: "url('https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=100&h=100&fit=crop')" }} />
              </div>
              <button onClick={() => navigate('/login')} className="group flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-white/40 hover:text-white transition-colors duration-300">
                Meet the Community
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 relative z-10" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
          <div className="text-center">
            <p className="text-sm text-white/50">the introverts gathered here.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Landing;
