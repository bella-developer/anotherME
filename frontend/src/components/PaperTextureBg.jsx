/**
 * PaperTextureBg — Premium tactile paper/plaster texture for light mode
 * Inspired by Apple, Linear, Notion, Arc Browser, luxury editorial design
 * 
 * Characteristics:
 * - Base: Dim pearl white (#E7E3DC)
 * - Finish: Matte (no gloss)
 * - Surface: Fine plaster/eggshell
 * - Noise: Subtle monochrome grain (3% opacity)
 * - Lighting: Soft ambient with broad diagonal shadows
 * - Mood: Calm, premium, architectural
 */

export default function PaperTextureBg() {
  return (
    <>
      <style>{`
        @keyframes subtleShift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(2px, 2px); }
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
        {/* Layer 1: Pearl base color */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#E7E3DC',
        }} />

        {/* Layer 2: Fine monochrome noise (SVG procedural) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' seed='5'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.03'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 1,
          animation: 'subtleShift 60s ease-in-out infinite',
        }} />

        {/* Layer 3: Soft paper texture (subtle bumps) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='4' seed='12'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.08'/%3E%3C/feComponentTransfer%3E%3CfeDisplacementMap in='SourceGraphic' scale='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px 400px',
          opacity: 1,
          mixBlendMode: 'overlay',
        }} />

        {/* Layer 4: Soft lighting - Top radial glow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,.25), transparent 55%)',
          pointerEvents: 'none',
        }} />

        {/* Layer 4b: Diagonal ambient gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,.12), transparent 50%, rgba(0,0,0,.03))',
          pointerEvents: 'none',
        }} />

        {/* Layer 5: Broad blurred diagonal shadow (architectural depth) */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '-10%',
          width: '60%',
          height: '120%',
          background: 'linear-gradient(120deg, transparent 0%, rgba(0,0,0,.02) 40%, transparent 80%)',
          transform: 'rotate(-15deg)',
          filter: 'blur(80px)',
          opacity: 0.6,
          pointerEvents: 'none',
        }} />
      </div>
    </>
  );
}
