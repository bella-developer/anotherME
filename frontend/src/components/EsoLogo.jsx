/**
 * ESO Logo - Exact Replication
 * Following detailed design specifications
 */

function EsoLogo({ className = "h-10 w-auto" }) {
  return (
    <svg 
      viewBox="0 0 900 240" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        {/* Purple-to-blue gradient for E */}
        <linearGradient 
          id="gradE" 
          x1="0%" 
          y1="50%" 
          x2="100%" 
          y2="50%"
        >
          <stop offset="0%" stopColor="#9D7FFF"/>
          <stop offset="50%" stopColor="#6B4FDD"/>
          <stop offset="100%" stopColor="#4A7FE8"/>
        </linearGradient>
        
        {/* Blue gradient for O */}
        <linearGradient 
          id="gradO" 
          x1="0%" 
          y1="50%" 
          x2="100%" 
          y2="50%"
        >
          <stop offset="0%" stopColor="#7BA5FA"/>
          <stop offset="100%" stopColor="#5B85E8"/>
        </linearGradient>
        
        {/* Outer glow effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Letter E - C-shape with floating middle bar */}
      <g filter="url(#glow)">
        {/* Outer C-shape */}
        <path
          d="M 68 20
             C 48 20, 40 32, 40 48
             L 40 192
             C 40 208, 48 220, 68 220
             L 160 220
             C 176 220, 185 212, 185 196
             L 185 188
             C 185 180, 180 175, 170 175
             L 95 175
             L 95 65
             L 170 65
             C 180 65, 185 60, 185 52
             L 185 44
             C 185 28, 176 20, 160 20
             Z"
          fill="url(#gradE)"
        />
        
        {/* Floating middle bar - completely separate */}
        <rect 
          x="115" 
          y="93" 
          width="100" 
          height="55" 
          rx="28" 
          fill="url(#gradE)"
        />
      </g>
      
      {/* Letter S - Flowing ribbon with smooth Bézier curves */}
      <g filter="url(#glow)">
        <path
          d="M 290 20
             C 310 20, 328 28, 340 42
             C 350 52, 365 60, 385 60
             L 395 60
             C 410 60, 420 70, 420 85
             C 420 100, 410 110, 395 110
             L 355 110
             C 340 110, 330 118, 325 128
             C 320 135, 315 142, 315 150
             C 315 158, 320 165, 325 172
             C 330 182, 340 190, 355 190
             L 395 190
             C 410 190, 420 200, 420 215
             C 420 230, 410 240, 395 240
             L 385 240
             C 365 240, 350 232, 340 218
             C 330 208, 315 200, 295 200
             L 285 200
             C 270 200, 260 190, 260 175
             C 260 160, 270 150, 285 150
             L 325 150
             C 340 150, 350 142, 355 132
             C 360 125, 365 118, 365 110
             C 365 102, 360 95, 355 88
             C 350 78, 340 70, 325 70
             L 285 70
             C 270 70, 260 60, 260 45
             C 260 30, 270 20, 285 20
             Z"
          fill="#FFFFFF"
        />
      </g>
      
      {/* Letter O - Thick squircle donut ring */}
      <g filter="url(#glow)">
        <path
          d="M 570 20
             C 632 20, 685 72, 685 130
             C 685 188, 632 240, 570 240
             C 508 240, 455 188, 455 130
             C 455 72, 508 20, 570 20
             Z
             M 570 75
             C 540 75, 515 97, 515 127
             C 515 157, 540 182, 570 182
             C 600 182, 625 157, 625 127
             C 625 97, 600 75, 570 75
             Z"
          fill="url(#gradO)"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default EsoLogo;
