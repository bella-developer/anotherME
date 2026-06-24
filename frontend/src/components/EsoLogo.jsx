/**
 * ESO Logo Component - Natural transparent PNG with sharp rendering
 */

import logoImage from '../assets/images/logo.png';

function EsoLogo({ className = "h-10 w-auto" }) {
  return (
    <img 
      src={`${logoImage}?v=2`}
      alt="ESO Logo" 
      className={className}
      style={{
        objectFit: 'contain',
        imageRendering: '-webkit-optimize-contrast',
      }}
      loading="eager"
    />
  );
}

export default EsoLogo;
