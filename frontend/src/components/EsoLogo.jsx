/**
 * ESO Logo Component - Matching the exact reference design
 * Bold, rounded letters with specific styling
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
      
      {/* Letter E - Bold C-shape with horizontal bar */}
      <g filter="url(#glow)">
        {/* Main C body - very thick stroke */}
        <path
          d="M 90 30
             C 60 30, 40 50, 40 80
             L 40 120
             C 40 150, 60 170, 90 170
             L 140 170
             C 155 170, 165 160, 165 145
             L 165 140
             C 165 130, 155 125, 145 125
             L 95 125
             L 95 75
             L 145 75
             C 155 75, 165 70, 165 60
             L 165 55
             C 165 40, 155 30, 140 30
             Z"
          fill="url(#purpleGrad)"
        />
        
        {/* Floating horizontal bar - completely separate */}
        <rect 
          x="100" 
          y="85" 
          width="90" 
          height="30" 
          rx="15" 
          fill="url(#purpleGrad)" 
        />
      </g>
      
      {/* Letter S - Bold angular S shape */}
      <g filter="url(#glow)">
        <path
          d="M 220 30
             L 360 30
             C 378 30, 385 38, 385 55
             L 385 60
             C 385 68, 382 74, 375 78
             L 285 78
             C 275 78, 270 83, 270 88
             L 270 92
             C 270 97, 275 102, 285 102
             L 375 102
             C 382 106, 385 112, 385 120
             L 385 145
             C 385 162, 378 170, 360 170
             L 220 170
             C 202 170, 195 162, 195 145
             L 195 140
             C 195 132, 198 126, 205 122
             L 305 122
             C 315 122, 320 117, 320 112
             L 320 108
             C 320 103, 315 98, 305 98
             L 205 98
             C 198 94, 195 88, 195 80
             L 195 55
             C 195 38, 202 30, 220 30
             Z"
          fill="#FFFFFF"
        />
      </g>
      
      {/* Letter O - Perfect thick donut */}
      <g filter="url(#glow)">
        <path
          d="M 480 30
             C 530 30, 570 70, 570 100
             C 570 130, 530 170, 480 170
             C 430 170, 390 130, 390 100
             C 390 70, 430 30, 480 30
             Z
             M 480 75
             C 460 75, 445 85, 445 100
             C 445 115, 460 125, 480 125
             C 500 125, 515 115, 515 100
             C 515 85, 500 75, 480 75
             Z"
          fill="url(#blueGrad)"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default EsoLogo;
