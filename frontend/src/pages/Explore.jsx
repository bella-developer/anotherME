import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import EsoLogo from '../components/EsoLogo';
import { usePageTitle } from '../hooks/usePageTitle';

function Explore() {
  usePageTitle('Explore');
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-black text-white relative z-10" style={{ fontFamily: "'Geist Mono', monospace" }}>
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between border-b border-white/10">
          <Link to="/" className="focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md">
            <EsoLogo className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <Link 
              to="/login" 
              className="text-xs text-white/60 hover:text-white transition-colors tracking-[0.15em] uppercase font-medium"
            >
              Sign In
            </Link>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 text-xs text-white hover:bg-white/5 transition-all tracking-[0.15em] uppercase font-medium"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* FEATURES SECTION */}
      <section className="pt-32 py-24 lg:py-32 relative z-10" style={{ background: 'rgba(0,0,0,0.6)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-wider">Safe Space for Inner Reflection</h2>
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
                className="relative flex flex-col items-center justify-end p-8 text-center cursor-pointer group overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-2"
                style={{
                  minHeight: '300px',
                  background: 'rgba(255,255,255,0.02)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.08)',
                }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center rounded-xl transition-transform duration-700 group-hover:scale-110"
                  style={{ 
                    backgroundImage: `url('${f.img}')`, 
                    filter: 'contrast(1.1) brightness(0.6) saturate(1.1)',
                  }}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/95 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-500" />

                <div className="relative z-10 flex flex-col items-center pb-4">
                  <svg className="w-7 h-7 text-white/50 mb-4 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                  <h3 className="text-sm tracking-[0.25em] uppercase font-semibold mb-3 text-white">{f.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300">{f.desc}</p>
                  <span className="mt-4 text-white/30 group-hover:text-white transition-all duration-300 group-hover:translate-x-1 text-lg">→</span>
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
                  filter: 'contrast(1.1) brightness(0.5) saturate(1.1)',
                }} 
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-black/70 to-black/40" />
              <div className="relative z-10 px-10 py-12">
                <svg className="w-8 h-8 text-white/15 mb-6 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-xl lg:text-2xl font-light leading-snug text-white mb-6">
                  Most people seek attention.<br />Few seek understanding.
                </p>
                <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase">— Eso Philosophy</div>
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
                onClick={() => navigate('/register')}
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
              onClick={() => navigate('/login')}
              className="px-8 py-3 border border-white/30 text-white font-medium text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all rounded"
            >
              Sign In
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
                <li><Link to="/" className="text-sm text-white/50 hover:text-white transition-colors">Home</Link></li>
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

export default Explore;
