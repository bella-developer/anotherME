/**
 * PaperTextureBg — Matching reference: warm cream with subtle texture
 * Professional editorial aesthetic
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
        {/* Base — Warm cream (matching reference) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#EBE6DD',
        }} />

        {/* Subtle paper texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' seed='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.02'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 300px',
          opacity: 1,
        }} />
      </div>
    </>
  );
}
