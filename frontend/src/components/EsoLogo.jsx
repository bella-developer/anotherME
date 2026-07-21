
const logoImageDark = 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782740739/logo_zlh8bd.png';
// For light mode, we need a dark version of the logo
// If you don't have one, we'll invert the colors using CSS

function EsoLogo({ className = "h-10 w-auto" }) {
  
  return (
    <img 
      src={logoImageDark}
      alt="ESO Logo" 
      className={`${className} ${''}`}
      style={isLightMode ? { filter: 'brightness(0) saturate(100%)' } : {}}
    />
  );
}

export default EsoLogo;
