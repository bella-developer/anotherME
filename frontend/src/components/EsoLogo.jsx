/**
 * ESO Logo Component - Professional rendering
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
        mixBlendMode: 'screen',
        filter: 'brightness(1.1) contrast(1.05)',
      }}
    />
  );
}

export default EsoLogo;
