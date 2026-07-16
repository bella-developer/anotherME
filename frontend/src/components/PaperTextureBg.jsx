/**
 * PaperTextureBg — Realistic window light simulation
 * THREE diagonal light bands simulating daylight through window
 * CSS-based for guaranteed rendering
 */

export default function PaperTextureBg() {
  return (
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
      {/* Base warm beige */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: '#E8E3D8',
      }} />

      {/* Fine plaster texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Cfilter id='texture'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' seed='8'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.025'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23texture)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '600px 600px',
        opacity: 1,
      }} />

      {/* Light Band 1 - Brightest (top-left) */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-15%',
        width: '60%',
        height: '140%',
        background: 'linear-gradient(125deg, rgba(255, 250, 242, 0.35) 0%, rgba(255, 250, 242, 0.15) 50%, transparent 100%)',
        filter: 'blur(135px)',
        transform: 'rotate(-35deg)',
        transformOrigin: 'center center',
      }} />

      {/* Light Band 2 - Medium (middle) */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '5%',
        width: '55%',
        height: '130%',
        background: 'linear-gradient(125deg, rgba(252, 248, 240, 0.22) 0%, rgba(252, 248, 240, 0.10) 50%, transparent 100%)',
        filter: 'blur(150px)',
        transform: 'rotate(-35deg)',
        transformOrigin: 'center center',
      }} />

      {/* Light Band 3 - Subtle (lower-right) */}
      <div style={{
        position: 'absolute',
        top: '0%',
        left: '25%',
        width: '50%',
        height: '120%',
        background: 'linear-gradient(125deg, rgba(250, 246, 238, 0.12) 0%, rgba(250, 246, 238, 0.05) 50%, transparent 100%)',
        filter: 'blur(160px)',
        transform: 'rotate(-35deg)',
        transformOrigin: 'center center',
      }} />

      {/* Very subtle vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(200, 190, 175, 0.015) 100%)',
      }} />
    </div>
  );
}
