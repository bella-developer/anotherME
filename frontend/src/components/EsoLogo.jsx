/**
 * ESO Logo Component - Clean, professional brand identity
 * Clear, readable letters with modern aesthetic
 */

function EsoLogo({ className = "h-10 w-auto" }) {
  return (
    <svg 
      viewBox="0 0 300 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        {/* Purple gradient for E */}
        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        
        {/* Blue gradient for O */}
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        
        {/* Subtle glow */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Letter E - Purple */}
      <g filter="url(#glow)">
        {/* C-shaped outer form */}
        <path
          d="M 15 15
             C 15 15, 10 20, 10 25
             L 10 75
             C 10 80, 15 85, 20 85
             L 70 85
             C 75 85, 75 80, 75 75
             L 75 73
             C 75 68, 70 68, 65 68
             L 28 68
             L 28 32
             L 65 32
             C 70 32, 75 32, 75 27
             L 75 25
             C 75 20, 70 15, 65 15
             Z"
          fill="url(#purpleGrad)"
        />
        
        {/* Floating horizontal bar */}
        <rect x="30" y="42" width="48" height="16" rx="8" fill="url(#purpleGrad)" />
      </g>
      
      {/* Letter S - White */}
      <g filter="url(#glow)">
        <path
          d="M 95 15
             L 155 15
             C 165 15, 170 20, 170 30
             L 170 35
             C 170 40, 167 43, 162 45
             C 167 47, 170 50, 170 55
             L 170 70
             C 170 80, 165 85, 155 85
             L 95 85
             C 85 85, 80 80, 80 70
             L 80 65
             C 80 60, 83 57, 88 55
             C 83 53, 80 50, 80 45
             L 80 30
             C 80 20, 85 15, 95 15
             Z
             M 98 30
             L 98 40
             L 152 40
             L 152 30
             Z
             M 98 60
             L 98 70
             L 152 70
             L 152 60
             Z"
          fill="#FFFFFF"
        />
      </g>
      
      {/* Letter O - Blue */}
      <g filter="url(#glow)">
        <path
          d="M 210 15
             C 235 15, 255 35, 255 50
             C 255 65, 235 85, 210 85
             C 185 85, 165 65, 165 50
             C 165 35, 185 15, 210 15
             Z
             M 210 32
             C 195 32, 182 42, 182 50
             C 182 58, 195 68, 210 68
             C 225 68, 238 58, 238 50
             C 238 42, 225 32, 210 32
             Z"
          fill="url(#blueGrad)"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default EsoLogo;
