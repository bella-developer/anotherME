/**
 * ESO Logo - Custom Geometric Wordmark
 * Built with thick monoline ribbon shapes, not fonts
 * Premium SaaS aesthetic with purple-blue gradient
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
        {/* Brand gradient - purple to blue */}
        <linearGradient 
          id="brandGradient" 
          x1="0%" 
          y1="50%" 
          x2="100%" 
          y2="50%"
        >
          <stop offset="0%" stopColor="#7C3AED"/>
          <stop offset="55%" stopColor="#4F46E5"/>
          <stop offset="100%" stopColor="#3B82F6"/>
        </linearGradient>
        
        {/* Subtle glow for premium effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Letter E - Rounded C-shape with horizontal bar */}
      <g filter="url(#glow)">
        <path
          d="M 62 40
             C 48 40, 40 48, 40 62
             L 40 178
             C 40 192, 48 200, 62 200
             L 138 200
             C 152 200, 160 192, 160 178
             L 160 174
             C 160 168, 156 162, 148 162
             L 84 162
             L 84 78
             L 148 78
             C 156 78, 160 72, 160 66
             L 160 62
             C 160 48, 152 40, 138 40
             Z"
          fill="url(#brandGradient)"
        />
        
        {/* Center horizontal bar - blended into spine */}
        <path
          d="M 84 98
             L 150 98
             C 162 98, 172 108, 172 120
             C 172 132, 162 142, 150 142
             L 84 142
             Z"
          fill="url(#brandGradient)"
        />
      </g>
      
      {/* Letter S - Smooth ribbon with Bézier curves */}
      <g filter="url(#glow)">
        <path
          d="M 250 40
             C 264 40, 275 46, 282 56
             L 360 56
             C 372 56, 380 64, 380 76
             L 380 84
             C 380 96, 372 104, 360 104
             L 295 104
             C 288 112, 278 118, 265 118
             L 245 118
             C 232 118, 228 124, 228 130
             L 228 130
             C 228 136, 232 142, 245 142
             L 325 142
             C 352 142, 370 160, 370 187
             L 370 193
             C 370 207, 362 215, 348 215
             L 238 215
             C 224 215, 216 207, 216 193
             L 216 189
             C 216 183, 220 177, 228 177
             L 293 177
             C 300 169, 310 163, 323 163
             L 343 163
             C 356 163, 360 157, 360 151
             L 360 151
             C 360 145, 356 139, 343 139
             L 263 139
             C 236 139, 218 121, 218 94
             L 218 88
             C 218 61, 236 40, 263 40
             Z"
          fill="#FFFFFF"
        />
      </g>
      
      {/* Letter O - Thick circular ring with squircle influence */}
      <g filter="url(#glow)">
        <path
          d="M 460 40
             C 508 40, 548 77, 548 117
             L 548 123
             C 548 163, 508 200, 460 200
             C 412 200, 372 163, 372 123
             L 372 117
             C 372 77, 412 40, 460 40
             Z
             M 460 84
             C 438 84, 422 98, 422 117
             L 422 123
             C 422 142, 438 156, 460 156
             C 482 156, 498 142, 498 123
             L 498 117
             C 498 98, 482 84, 460 84
             Z"
          fill="url(#brandGradient)"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default EsoLogo;
