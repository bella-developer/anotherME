/**
 * ESO Logo Component - Pure white monochrome
 */

import logoImage from '../assets/images/logo.png';

function EsoLogo({ className = "h-10 w-auto" }) {
  return (
    <img 
      src={logoImage} 
      alt="ESO Logo" 
      className={className}
      style={{
        objectFit: 'contain',
        filter: 'grayscale(100%) brightness(2) contrast(1.5) invert(1)',
      }}
    />
  );
}

export default EsoLogo;
