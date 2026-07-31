import { motion } from 'framer-motion';
import { useState } from 'react';

export default function IntrovertHomeSection({ onExploreClick, onWhisperClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen w-full flex items-center justify-center overflow-hidden bg-black py-20 px-4 sm:px-8">
      {/* Background Image with Dark Atmospheric Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
          style={{
            backgroundImage: `url('/introvert-silhouette.jpg')`,
            filter: 'brightness(0.55) contrast(1.15) saturate(1.1)',
            transform: isHovered ? 'scale(1.03)' : 'scale(1.0)',
          }}
        />
        {/* Radial Dark Gradient Overlay for Vignette and Depth */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(10, 8, 20, 0.45) 0%, rgba(0, 0, 0, 0.85) 70%, rgba(0, 0, 0, 0.98) 100%), linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 20%, transparent 80%, #000000 100%)'
          }}
        />
        {/* Subtle Constellation Particles Grid overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(167, 139, 250, 0.4) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating Constellation Ambient Rings */}
      <motion.div 
        animate={{ 
          rotate: 360,
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          rotate: { duration: 120, repeat: Infinity, ease: 'linear' },
          scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' }
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] rounded-full pointer-events-none z-0"
        style={{
          border: '1px dashed rgba(167, 139, 250, 0.15)',
          boxShadow: '0 0 80px rgba(139, 92, 246, 0.05)',
        }}
      />

      {/* Main Content Container */}
      <div 
        className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center justify-center pt-12"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs uppercase tracking-[0.3em] text-purple-200/90 font-medium">
            ANONYMOUS SOCIAL SANCTUARY
          </span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight text-white mb-6 leading-tight max-w-4xl"
          style={{
            fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.9), 0 0 60px rgba(167, 139, 250, 0.2)',
          }}
        >
          It's an <span className="font-normal italic bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-100 to-amber-200">Introvert's Home.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="text-base sm:text-xl text-neutral-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          style={{
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
          }}
        >
          Where quiet minds gather without noise or algorithms. Share deep thoughts, cherish solitude, and connect anonymously with kindred souls.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md mb-16"
        >
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs uppercase tracking-[0.25em] font-semibold text-black transition-all duration-300 shadow-xl group relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.25), 0 10px 25px rgba(0, 0, 0, 0.5)',
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Explore Sanctuaries
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>

          <button
            onClick={onWhisperClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs uppercase tracking-[0.25em] font-semibold text-white transition-all duration-300 group"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.6)';
              e.currentTarget.style.backgroundColor = 'rgba(167, 139, 250, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
            }}
          >
            <span className="flex items-center justify-center gap-2">
              ✦ Whisper a Thought
            </span>
          </button>
        </motion.div>

        {/* Feature Badges Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl"
        >
          {[
            { label: 'Zero Noise', desc: 'No doomscrolling or viral outrage' },
            { label: 'Pure Anonymity', desc: 'Speak your truth without judgment' },
            { label: 'Deep Sanctuaries', desc: 'Philosophy, solitude, and art' },
          ].map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl text-center transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="text-xs uppercase tracking-widest text-purple-300 font-medium mb-1">
                {item.label}
              </div>
              <div className="text-xs text-neutral-400 font-light">
                {item.desc}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Downward Scroll Cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-center">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          onClick={onExploreClick}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">Scroll to Explore</span>
          <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
