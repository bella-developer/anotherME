import { useState } from 'react';
import PremiumHero from './PremiumHero';
import CinematicHero from './CinematicHero';

/**
 * Hero Variant Toggle
 * Allows switching between PremiumHero and CinematicHero for testing
 */
function HeroVariantToggle() {
  const [variant, setVariant] = useState('premium'); // 'premium' or 'cinematic'

  return (
    <div className="relative">
      {/* Toggle Control - Fixed position */}
      <div 
        className="fixed top-20 right-4 z-[9999] bg-black/80 backdrop-blur-md rounded-lg p-3 border border-white/20"
        style={{
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        <p 
          className="text-[9px] tracking-[0.3em] uppercase mb-2 text-white/60"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Hero Style
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setVariant('premium')}
            className="px-3 py-1.5 rounded text-xs tracking-wider uppercase transition-all duration-300"
            style={{
              background: variant === 'premium' 
                ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
                : 'rgba(255,255,255,0.1)',
              color: variant === 'premium' ? '#ffffff' : '#ffffff80',
              border: variant === 'premium' ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.2)',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              boxShadow: variant === 'premium' ? '0 0 20px rgba(59, 130, 246, 0.4)' : 'none',
              cursor: 'pointer',
            }}
          >
            Premium
          </button>
          <button
            onClick={() => setVariant('cinematic')}
            className="px-3 py-1.5 rounded text-xs tracking-wider uppercase transition-all duration-300"
            style={{
              background: variant === 'cinematic' 
                ? 'linear-gradient(135deg, #d4a574 0%, #b8935f 100%)' 
                : 'rgba(255,255,255,0.1)',
              color: variant === 'cinematic' ? '#ffffff' : '#ffffff80',
              border: variant === 'cinematic' ? '1px solid #d4a574' : '1px solid rgba(255,255,255,0.2)',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              boxShadow: variant === 'cinematic' ? '0 0 20px rgba(212, 165, 116, 0.4)' : 'none',
              cursor: 'pointer',
            }}
          >
            Cinematic
          </button>
        </div>
      </div>

      {/* Render selected hero variant */}
      {variant === 'premium' ? <PremiumHero /> : <CinematicHero />}
    </div>
  );
}

export default HeroVariantToggle;
