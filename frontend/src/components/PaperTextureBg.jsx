/**
 * PaperTextureBg — Realistic window light simulation
 * Visible diagonal light bands with subtle gradients
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
      {/* Composite background with all layers */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          linear-gradient(125deg, 
            transparent 0%,
            transparent 10%,
            rgba(255, 250, 242, 0.4) 15%,
            rgba(255, 250, 242, 0.25) 25%,
            transparent 35%,
            transparent 40%,
            rgba(252, 248, 240, 0.25) 45%,
            rgba(252, 248, 240, 0.15) 55%,
            transparent 65%,
            transparent 70%,
            rgba(250, 246, 238, 0.15) 75%,
            rgba(250, 246, 238, 0.08) 85%,
            transparent 95%
          )
        `,
        filter: 'blur(60px)',
      }} />

      {/* Fine paper texture overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '300px 300px',
        mixBlendMode: 'multiply',
        opacity: 0.8,
      }} />
    </div>
  );
}
