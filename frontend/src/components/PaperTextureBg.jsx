/**
 * PaperTextureBg — Realistic window light simulation
 * THREE diagonal light bands at 120-125° angle
 * Simulates soft daylight through window hitting textured wall
 */

export default function PaperTextureBg() {
  return (
    <svg
      aria-hidden="true"
      className="paper-texture-bg"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Fine plaster texture */}
        <filter id="plasterTexture">
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="4" seed="8"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.025"/>
          </feComponentTransfer>
        </filter>

        {/* Light band gradients - diagonal window light */}
        <linearGradient id="lightBand1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFAF2" stopOpacity="0.35"/>
          <stop offset="50%" stopColor="#FFFAF2" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#FFFAF2" stopOpacity="0"/>
        </linearGradient>

        <linearGradient id="lightBand2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCF8F0" stopOpacity="0.22"/>
          <stop offset="50%" stopColor="#FCF8F0" stopOpacity="0.10"/>
          <stop offset="100%" stopColor="#FCF8F0" stopOpacity="0"/>
        </linearGradient>

        <linearGradient id="lightBand3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FAF6EE" stopOpacity="0.12"/>
          <stop offset="50%" stopColor="#FAF6EE" stopOpacity="0.05"/>
          <stop offset="100%" stopColor="#FAF6EE" stopOpacity="0"/>
        </linearGradient>

        {/* Heavy blur filters for soft daylight edges */}
        <filter id="softBlur1">
          <feGaussianBlur stdDeviation="135"/>
        </filter>

        <filter id="softBlur2">
          <feGaussianBlur stdDeviation="150"/>
        </filter>

        <filter id="softBlur3">
          <feGaussianBlur stdDeviation="160"/>
        </filter>

        {/* Subtle vignette */}
        <radialGradient id="vignette">
          <stop offset="0%" stopColor="transparent"/>
          <stop offset="100%" stopColor="#C8BEAF" stopOpacity="0.015"/>
        </radialGradient>
      </defs>

      {/* Base warm beige */}
      <rect width="100%" height="100%" fill="#E8E3D8"/>

      {/* Paper/plaster texture overlay */}
      <rect width="100%" height="100%" filter="url(#plasterTexture)" opacity="1"/>

      {/* Light Band 1 - Brightest (top-left) */}
      <rect 
        x="-20%" 
        y="-10%" 
        width="50%" 
        height="120%" 
        fill="url(#lightBand1)"
        transform="rotate(-35 960 540)"
        filter="url(#softBlur1)"
      />

      {/* Light Band 2 - Medium (middle) */}
      <rect 
        x="10%" 
        y="10%" 
        width="45%" 
        height="110%" 
        fill="url(#lightBand2)"
        transform="rotate(-35 960 540)"
        filter="url(#softBlur2)"
      />

      {/* Light Band 3 - Subtle (lower-right) */}
      <rect 
        x="30%" 
        y="25%" 
        width="40%" 
        height="100%" 
        fill="url(#lightBand3)"
        transform="rotate(-35 960 540)"
        filter="url(#softBlur3)"
      />

      {/* Very subtle vignette */}
      <rect width="100%" height="100%" fill="url(#vignette)"/>
    </svg>
  );
}
