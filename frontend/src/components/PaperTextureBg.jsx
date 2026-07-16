/**
 * PaperTextureBg — Realistic window light simulation
 * Three diagonal light bands simulating soft daylight through window
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
        background: '#E8E3D8',
      }}
    >
      {/* Light Band 1 - Brightest (top-left quadrant) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(255, 250, 242, 0.45) 0%, rgba(255, 250, 242, 0.25) 25%, transparent 40%)',
      }} />

      {/* Light Band 2 - Medium (center diagonal) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, transparent 25%, rgba(252, 248, 240, 0.30) 45%, rgba(252, 248, 240, 0.18) 60%, transparent 75%)',
      }} />

      {/* Light Band 3 - Subtle (lower-right) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, transparent 60%, rgba(250, 246, 238, 0.20) 75%, rgba(250, 246, 238, 0.10) 85%, transparent 100%)',
      }} />

      {/* Fine paper texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' seed='8'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.018'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '400px 400px',
        opacity: 1,
      }} />
    </div>
  );
}
