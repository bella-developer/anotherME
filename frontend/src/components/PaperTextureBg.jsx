/**
 * PaperTextureBg — Matching the exact reference image tone
 * Much more muted, barely visible texture, warm greige
 */

export default function PaperTextureBg() {
  return (
    <>
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
        {/* Base — Muted warm greige (matching reference exactly) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#D8D3CB',
        }} />

        {/* Barely visible texture - extremely subtle */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' seed='1'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.008'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px 400px',
          opacity: 1,
        }} />

        {/* Ultra-subtle vignette */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.008) 100%)',
        }} />
      </div>
    </>
  );
}
