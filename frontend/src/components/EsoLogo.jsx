/**
 * ESO Logo Component - Using brand image asset
 */

import logoImage from '../assets/logo.png';

function EsoLogo({ className = "h-10 w-auto" }) {
  return (
    <img 
      src={logoImage} 
      alt="ESO Logo" 
      className={className}
    />
  );
}

export default EsoLogo;
