/**
 * ESO Logo Component - Brand identity
 * Matches the exact design from the reference image
 */

function EsoLogo({ className = "h-10 w-auto" }) {
  return (
    <div className={className} style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        @keyframes subtle-glow {
          0%, 100% { filter: drop-shadow(0 0 8px currentColor); }
          50% { filter: drop-shadow(0 0 12px currentColor); }
        }
        .eso-letter {
          font-weight: 900;
          font-size: 3rem;
          line-height: 1;
          letter-spacing: -0.05em;
          animation: subtle-glow 3s ease-in-out infinite;
        }
        .eso-e {
          background: linear-gradient(180deg, #9B8BFF 0%, #7B6BFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .eso-s {
          color: #FFFFFF;
        }
        .eso-o {
          background: linear-gradient(180deg, #7BA5FF 0%, #5B85FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      <span className="eso-letter eso-e" style={{ color: '#9B8BFF' }}>E</span>
      <span className="eso-letter eso-s">S</span>
      <span className="eso-letter eso-o" style={{ color: '#7BA5FF' }}>O</span>
    </div>
  );
}

export default EsoLogo;
