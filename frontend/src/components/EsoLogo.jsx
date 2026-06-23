/**
 * ESO Logo Component - Brand identity
 * Exact custom letter shapes from the reference design
 */

function EsoLogo({ className = "h-10 w-auto" }) {
  return (
    <svg 
      viewBox="0 0 500 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        {/* Purple gradient for E */}
        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        
        {/* Blue gradient for O */}
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        
        {/* Glow effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Letter E - C shape with SEPARATE floating horizontal bar */}
      <g filter="url(#glow)">
        {/* Main C-shaped body of E */}
        <path
          d="M 40 30 
             C 40 30, 20 30, 20 50
             L 20 150
             C 20 170, 40 170, 40 170
             L 120 170
             C 130 170, 130 160, 130 150
             L 130 145
             C 130 135, 120 135, 120 135
             L 60 135
             L 60 65
             L 120 65
             C 130 65, 130 55, 130 50
             L 130 45
             C 130 35, 120 30, 120 30
             Z"
          fill="url(#purpleGrad)"
        />
        
        {/* SEPARATE floating horizontal bar (not connected to E body) */}
        <rect x="65" y="85" width="75" height="30" rx="15" fill="url(#purpleGrad)" />
      </g>
      
      {/* Letter S - Angular geometric S */}
      <g filter="url(#glow)">
        <path
          d="M 160 30
             L 280 30
             C 295 30, 300 35, 300 50
             L 300 60
             C 300 67, 295 72, 285 75
             L 200 75
             C 190 75, 185 80, 185 85
             L 185 90
             C 185 95, 190 100, 200 100
             L 285 100
             C 295 103, 300 108, 300 115
             L 300 150
             C 300 165, 295 170, 280 170
             L 160 170
             C 145 170, 140 165, 140 150
             L 140 140
             C 140 133, 145 128, 155 125
             L 255 125
             C 265 125, 270 120, 270 115
             L 270 110
             C 270 105, 265 100, 255 100
             L 155 100
             C 145 97, 140 92, 140 85
             L 140 50
             C 140 35, 145 30, 160 30
             Z"
          fill="#FFFFFF"
        />
      </g>
      
      {/* Letter O - Donut ring shape with TRANSPARENT hole */}
      <g filter="url(#glow)">
        <path
          d="M 400 20
             C 444 20, 480 56, 480 100
             C 480 144, 444 180, 400 180
             C 356 180, 320 144, 320 100
             C 320 56, 356 20, 400 20
             Z
             M 400 65
             C 380 65, 365 80, 365 100
             C 365 120, 380 135, 400 135
             C 420 135, 435 120, 435 100
             C 435 80, 420 65, 400 65
             Z"
          fill="url(#blueGrad)"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default EsoLogo;
