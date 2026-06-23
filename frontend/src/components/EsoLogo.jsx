/**
 * ESO Logo - Simple and clean, matching reference exactly
 */

function EsoLogo({ className = "h-10 w-auto" }) {
  return (
    <svg 
      viewBox="0 0 400 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9D7FFF"/>
          <stop offset="100%" stopColor="#5B85E8"/>
        </linearGradient>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* E - Simple blocky E shape */}
      <g filter="url(#glow)">
        <rect x="10" y="20" width="30" height="80" rx="15" fill="url(#grad)"/>
        <rect x="10" y="20" width="70" height="25" rx="12" fill="url(#grad)"/>
        <rect x="10" y="47" width="55" height="25" rx="12" fill="url(#grad)"/>
        <rect x="10" y="75" width="70" height="25" rx="12" fill="url(#grad)"/>
      </g>
      
      {/* S - Two horizontal bars */}
      <g filter="url(#glow)">
        <rect x="120" y="30" width="80" height="20" rx="10" fill="#FFFFFF"/>
        <rect x="120" y="70" width="80" height="20" rx="10" fill="#FFFFFF"/>
      </g>
      
      {/* O - Simple circle ring */}
      <g filter="url(#glow)">
        <circle cx="280" cy="60" r="40" fill="url(#grad)"/>
        <circle cx="280" cy="60" r="20" fill="#000000"/>
      </g>
    </svg>
  );
}

export default EsoLogo;
