/**
 * ESO Logo Component - Brand identity
 * Exact replica of the official ESO brand design
 * Features: Bold rounded letters, purple-white-blue gradient, glow effects
 */

function EsoLogo({ className = "h-10 w-auto" }) {
  return (
    <svg 
      width="120" 
      height="48" 
      viewBox="0 0 400 160" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        {/* Gradient for E - Purple */}
        <linearGradient id="gradientE" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#A78BFA', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#6366F1', stopOpacity: 1 }} />
        </linearGradient>
        
        {/* Gradient for O - Blue */}
        <linearGradient id="gradientO" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#60A5FA', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
        </linearGradient>
        
        {/* Glow filters for depth */}
        <filter id="glowE" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="glowS" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="glowO" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Letter E - Purple gradient with rounded bold design */}
      <path 
        d="M 20 20 L 120 20 L 120 45 L 55 45 L 55 65 L 110 65 L 110 90 L 55 90 L 55 115 L 120 115 L 120 140 L 20 140 Z" 
        fill="url(#gradientE)"
        filter="url(#glowE)"
      />
      
      {/* Letter S - White bold rounded design */}
      <path 
        d="M 280 20 L 180 20 L 180 45 L 245 45 Q 260 45 260 60 Q 260 75 245 75 L 180 75 Q 150 75 150 105 L 150 135 Q 150 165 180 165 L 280 165 L 280 140 L 215 140 Q 200 140 200 125 Q 200 110 215 110 L 280 110 Q 310 110 310 80 L 310 50 Q 310 20 280 20 Z" 
        fill="#FFFFFF"
        filter="url(#glowS)"
      />
      
      {/* Letter O - Blue gradient with rounded bold design */}
      <path 
        d="M 340 20 Q 310 20 310 50 L 310 130 Q 310 160 340 160 L 370 160 Q 400 160 400 130 L 400 50 Q 400 20 370 20 Z M 345 45 L 365 45 Q 375 45 375 55 L 375 125 Q 375 135 365 135 L 345 135 Q 335 135 335 125 L 335 55 Q 335 45 345 45 Z" 
        fill="url(#gradientO)"
        filter="url(#glowO)"
      />
    </svg>
  );
}

export default EsoLogo;
