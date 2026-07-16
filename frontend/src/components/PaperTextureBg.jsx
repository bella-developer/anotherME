/**
 * PaperTextureBg — Premium tactile paper/plaster texture for light mode
 * Matching the reference image: warm beige, extremely subtle texture, muted tone
 * 
 * Characteristics:
 * - Base: Warm muted beige (darker, more subdued)
 * - Finish: Ultra-matte (no shine)
 * - Surface: Very fine concrete/plaster
 * - Noise: Barely visible (1-2% opacity)
 * - Lighting: Minimal, no dramatic gradients
 * - Mood: Quiet, editorial, sophisticated
 */

export default function PaperTextureBg() {
  return (
    <>
      <style>{`
        @keyframes subtleShift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(1px, 1px); }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="paper-texture-bg"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {/* Layer 1: Warm muted beige base (matching reference image) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#E3DED6', /* Warmer, more muted beige */
        }} />

        {/* Layer 2: Extremely fine noise (barely visible) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' seed='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.015'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 300px',
          opacity: 1,
          animation: 'subtleShift 90s ease-in-out infinite',
        }} />

        {/* Layer 3: Paper grain (ultra subtle) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='8'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.02'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '500px 500px',
          opacity: 0.4,
          mixBlendMode: 'multiply',
        }} />

        {/* Layer 4: Very subtle vignette (barely there) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 40%, transparent 0%, rgba(0,0,0,0.015) 100%)',
          pointerEvents: 'none',
        }} />
      </div>
    </>
  );
}
