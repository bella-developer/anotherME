/**
 * ESO Logo Component - Brand identity
 * Dark aesthetic with curvy, artistic letter shapes
 */

function EsoLogo({ className = "h-10 w-auto" }) {
  return (
    <svg 
      viewBox="0 0 420 200" 
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
          <stop offset="0%" stopColor="#6BA5FA" />
          <stop offset="100%" stopColor="#4A7FE8" />
        </linearGradient>
        
        {/* Strong glow effect for dark aesthetic */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Letter E - Smooth curvy C-shape with separate floating bar */}
      <g filter="url(#glow)">
        {/* Main curvy C-shaped body */}
        <path
          d="M 45 25
             C 25 25, 15 35, 15 55
             L 15 145
             C 15 165, 25 175, 45 175
             L 110 175
             C 125 175, 135 165, 135 150
             L 135 143
             C 135 133, 125 128, 115 128
             L 60 128
             L 60 72
             L 115 72
             C 125 72, 135 67, 135 57
             L 135 50
             C 135 35, 125 25, 110 25
             Z"
          fill="url(#purpleGrad)"
        />
        
        {/* Separate floating rounded bar */}
        <rect x="70" y="82" width="80" height="36" rx="18" fill="url(#purpleGrad)" />
      </g>
      
      {/* Letter S - Smooth curvy S overlapping towards O */}
      <g filter="url(#glow)">
        <path
          d="M 165 25
             C 155 25, 145 32, 145 45
             L 145 57
             C 145 67, 152 74, 162 77
             C 152 80, 145 87, 145 97
             L 145 155
             C 145 168, 155 175, 165 175
             L 265 175
             C 275 175, 285 168, 285 155
             L 285 143
             C 285 133, 278 126, 268 123
             C 278 120, 285 113, 285 103
             L 285 45
             C 285 32, 275 25, 265 25
             Z
             M 175 50
             L 255 50
             C 260 50, 263 53, 263 58
             L 263 88
             C 263 93, 260 96, 255 96
             L 175 96
             C 170 96, 167 93, 167 88
             L 167 58
             C 167 53, 170 50, 175 50
             Z
             M 175 104
             L 255 104
             C 260 104, 263 107, 263 112
             L 263 142
             C 263 147, 260 150, 255 150
             L 175 150
             C 170 150, 167 147, 167 142
             L 167 112
             C 167 107, 170 104, 175 104
             Z"
          fill="#FFFFFF"
        />
      </g>
      
      {/* Letter O - Smooth rounded donut, close to S */}
      <g filter="url(#glow)">
        <path
          d="M 350 20
             C 390 20, 420 50, 420 90
             L 420 110
             C 420 150, 390 180, 350 180
             C 310 180, 280 150, 280 110
             L 280 90
             C 280 50, 310 20, 350 20
             Z
             M 350 60
             C 332 60, 320 72, 320 90
             L 320 110
             C 320 128, 332 140, 350 140
             C 368 140, 380 128, 380 110
             L 380 90
             C 380 72, 368 60, 350 60
             Z"
          fill="url(#blueGrad)"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default EsoLogo;
