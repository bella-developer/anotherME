/**
 * PaperTextureBg — Realistic window light simulation
 * Three VISIBLE diagonal light bands with clear texture
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
      {/* Light Band 1 - Brightest (top-left) - VISIBLE */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(255, 248, 235, 0.7) 0%, rgba(255, 248, 235, 0.4) 20%, transparent 35%)',
      }} />

      {/* Light Band 2 - Medium (center) - VISIBLE */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, transparent 25%, rgba(252, 245, 230, 0.5) 45%, rgba(252, 245, 230, 0.3) 55%, transparent 70%)',
      }} />

      {/* Light Band 3 - Subtle (lower-right) - VISIBLE */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, transparent 60%, rgba(248, 242, 225, 0.4) 75%, rgba(248, 242, 225, 0.25) 85%, transparent 100%)',
      }} />

      {/* VISIBLE paper texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' seed='5'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.08'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '300px 300px',
        opacity: 1,
        mixBlendMode: 'multiply',
      }} />
    </div>
  );
}
