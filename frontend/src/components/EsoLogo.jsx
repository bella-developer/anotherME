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
      
      {/* Letter E - Custom shape with horizontal bar through middle */}
      <g filter="url(#glow)">
        {/* Outer C shape of E */}
        <path
          d="M 40 30 
             C 40 30, 20 30, 20 50
             L 20 150
             C 20 170, 40 170, 40 170
             L 120 170
             C 130 170, 130 160, 130 150
             L 130 145
             C 130 135, 120 135, 120 135
             L 55 135
             L 55 110
             L 110 110
             C 120 110, 120 100, 120 95
             L 120 90
             C 120 80, 110 80, 110 80
             L 55 80
             L 55 65
             L 120 65
             C 130 65, 130 55, 130 50
             L 130 45
             C 130 35, 120 30, 120 30
             Z"
          fill="url(#purpleGrad)"
        />
        
        {/* Horizontal bar through E */}
        <rect x="55" y="85" width="80" height="20" rx="10" fill="url(#purpleGrad)" />
      </g>
      
      {/* Letter S - Angular geometric S */}
      <g filter="url(#glow)">
        <path
          d="M 160 30
             L 280 30
             C 290 30, 295 35, 295 45
             L 295 55
             C 295 60, 292 65, 285 68
             L 200 68
             C 195 68, 190 73, 190 78
             L 190 82
             C 190 87, 195 92, 200 92
             L 285 92
             C 292 95, 295 100, 295 105
             L 295 155
             C 295 165, 290 170, 280 170
             L 160 170
             C 150 170, 145 165, 145 155
             L 145 145
             C 145 140, 148 135, 155 132
             L 255 132
             C 260 132, 265 127, 265 122
             L 265 118
             C 265 113, 260 108, 255 108
             L 155 108
             C 148 105, 145 100, 145 95
             L 145 45
             C 145 35, 150 30, 160 30
             Z"
          fill="#FFFFFF"
        />
      </g>
      
      {/* Letter O - Perfect circle with thick stroke */}
      <g filter="url(#glow)">
        {/* Outer circle */}
        <circle cx="400" cy="100" r="80" fill="url(#blueGrad)" />
        {/* Inner circle (creates the hollow) */}
        <circle cx="400" cy="100" r="45" fill="#0A0A1A" />
      </g>
    </svg>
  );
}

export default EsoLogo;
