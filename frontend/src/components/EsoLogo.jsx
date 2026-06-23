/**
 * ESO Logo - Premium Geometric Wordmark
 * Custom letterforms built with monoline ribbon shapes
 * Luxury SaaS / AI startup aesthetic
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
        {/* Premium gradient: purple → indigo → blue */}
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
      </defs>
      
      {/* Letter E - C-shape with three horizontal arms */}
      <path
        d="M 62 40
           C 50 40, 40 50, 40 62
           L 40 178
           C 40 190, 50 200, 62 200
           L 138 200
           C 150 200, 160 190, 160 178
           L 160 156
           L 84 156
           L 84 142
           L 144 142
           L 144 98
           L 84 98
           L 84 84
           L 160 84
           L 160 62
           C 160 50, 150 40, 138 40
           Z"
        fill="url(#brandGradient)"
      />
      
      {/* Letter S - Flowing ribbon with smooth Bézier curves */}
      <path
        d="M 278 40
           C 302 40, 322 52, 332 70
           L 368 70
           C 380 70, 388 78, 388 90
           C 388 102, 380 110, 368 110
           L 316 110
           C 310 118, 298 124, 284 124
           L 264 124
           C 252 124, 246 130, 246 138
           C 246 146, 252 152, 264 152
           L 332 152
           C 360 152, 378 170, 378 198
           L 378 202
           C 378 214, 368 224, 356 224
           L 240 224
           C 228 224, 218 214, 218 202
           L 218 180
           L 294 180
           L 294 166
           L 234 166
           L 234 122
           L 294 122
           L 294 108
           L 218 108
           L 218 66
           C 218 54, 228 40, 250 40
           Z"
        fill="#FFFFFF"
      />
      
      {/* Letter O - Thick squircle ring */}
      <path
        d="M 460 40
           C 508 40, 548 78, 548 117
           L 548 123
           C 548 162, 508 200, 460 200
           C 412 200, 372 162, 372 123
           L 372 117
           C 372 78, 412 40, 460 40
           Z
           M 460 84
           C 436 84, 416 101, 416 117
           L 416 123
           C 416 139, 436 156, 460 156
           C 484 156, 504 139, 504 123
           L 504 117
           C 504 101, 484 84, 460 84
           Z"
        fill="url(#brandGradient)"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default EsoLogo;
