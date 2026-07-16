/**
 * PaperTextureBg — Simplified diagonal light simulation
 * Three visible diagonal bands from top-left to bottom-right
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
      {/* Light Band 1 - Top left quadrant */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse 1200px 1200px at 20% 20%, rgba(255, 250, 242, 0.5) 0%, transparent 50%)',
      }} />

      {/* Light Band 2 - Center */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse 1000px 1000px at 45% 45%, rgba(252, 248, 240, 0.35) 0%, transparent 50%)',
      }} />

      {/* Light Band 3 - Lower right */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse 900px 900px at 70% 70%, rgba(250, 246, 238, 0.25) 0%, transparent 50%)',
      }} />

      {/* Diagonal light overlay - actual visible diagonal */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(255, 252, 245, 0.3) 0%, transparent 40%, transparent 100%)',
      }} />

      {/* Paper texture - clearly visible */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        opacity: 1,
      }} />
    </div>
  );
}
