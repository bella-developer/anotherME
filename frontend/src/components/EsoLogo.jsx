/**
 * ESO Logo Component - Refined with thinner strokes
 * Clean, modern design with reduced curviness
 */

function EsoLogo({ className = "h-10 w-auto" }) {
  return (
    <svg 
      viewBox="0 0 600 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        {/* Purple gradient for E */}
        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9D7FFF" />
          <stop offset="100%" stopColor="#6B4FDD" />
        </linearGradient>
        
        {/* Blue gradient for O */}
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7BA5FA" />
          <stop offset="100%" stopColor="#4A7FE8" />
        </linearGradient>
        
        {/* Glow effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Letter E - Thinner C-shape with horizontal bar */}
      <g filter="url(#glow)">
        {/* Main C body - thinner stroke */}
        <path
          d="M 80 40
             C 55 40, 40 55, 40 80
             L 40 120
             C 40 145, 55 160, 80 160
             L 130 160
             C 145 160, 155 150, 155 135
             L 155 132
             C 155 125, 148 120, 140 120
             L 85 120
             L 85 80
             L 140 80
             C 148 80, 155 75, 155 68
             L 155 65
             C 155 50, 145 40, 130 40
             Z"
          fill="url(#purpleGrad)"
        />
        
        {/* Floating horizontal bar - thinner */}
        <rect 
          x="90" 
          y="90" 
          width="85" 
          height="20" 
          rx="10" 
          fill="url(#purpleGrad)" 
        />
      </g>
      
      {/* Letter S - Cleaner, less curvy S */}
      <g filter="url(#glow)">
        <path
          d="M 210 40
             L 350 40
             C 365 40, 375 48, 375 60
             L 375 65
             C 375 72, 372 77, 365 80
             L 280 80
             C 270 80, 265 85, 265 90
             L 265 94
             C 265 99, 270 104, 280 104
             L 365 104
             C 372 107, 375 112, 375 119
             L 375 140
             C 375 152, 365 160, 350 160
             L 210 160
             C 195 160, 185 152, 185 140
             L 185 135
             C 185 128, 188 123, 195 120
             L 300 120
             C 310 120, 315 115, 315 110
             L 315 106
             C 315 101, 310 96, 300 96
             L 195 96
             C 188 93, 185 88, 185 81
             L 185 60
             C 185 48, 195 40, 210 40
             Z"
          fill="#FFFFFF"
        />
      </g>
      
      {/* Letter O - Thinner donut ring */}
      <g filter="url(#glow)">
        <path
          d="M 480 40
             C 525 40, 560 75, 560 100
             C 560 125, 525 160, 480 160
             C 435 160, 400 125, 400 100
             C 400 75, 435 40, 480 40
             Z
             M 480 70
             C 455 70, 435 85, 435 100
             C 435 115, 455 130, 480 130
             C 505 130, 525 115, 525 100
             C 525 85, 505 70, 480 70
             Z"
          fill="url(#blueGrad)"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default EsoLogo;
