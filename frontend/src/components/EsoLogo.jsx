/**
 * ESO Logo Component - Clear and visible
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
        filter: 'brightness(1.2) contrast(1.1)',
      }}
    />
  );
}

export default EsoLogo;
