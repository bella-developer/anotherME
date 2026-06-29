const logoImage = 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782740739/logo_zlh8bd.png';

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
