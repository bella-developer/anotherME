import logoImage from '../assets/images/logo.png';

function EsoLogo({ className = "h-10 w-auto" }) {
  return (
    <div 
      className={className}
      style={{
        backgroundColor: '#000000',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img 
        src={logoImage}
        alt="ESO Logo" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

export default EsoLogo;
