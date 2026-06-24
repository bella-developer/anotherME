/**
 * ESO Logo Component - Natural transparent PNG
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
      }}
    />
  );
}

export default EsoLogo;
