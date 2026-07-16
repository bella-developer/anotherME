/**
 * PaperTextureBg — Exact reference implementation
 * Warm beige background with VERY SUBTLE diagonal window light
 * Barely visible texture - organic and muted
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
        {/* Base warm beige - exact reference color */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#E8E3D8',
        }} />

        {/* Ultra-fine paper texture - barely visible */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' seed='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.012'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px 400px',
          opacity: 1,
        }} />

        {/* VERY subtle diagonal light - Main streak (much more subtle) */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          left: '-8%',
          width: '55%',
          height: '130%',
          background: 'linear-gradient(135deg, rgba(255, 252, 248, 0.15) 0%, rgba(255, 252, 248, 0.08) 30%, transparent 55%)',
          transform: 'rotate(-22deg)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />

        {/* Secondary light - Even more subtle */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '5%',
          width: '45%',
          height: '120%',
          background: 'linear-gradient(135deg, rgba(250, 248, 245, 0.1) 0%, rgba(250, 248, 245, 0.04) 35%, transparent 60%)',
          transform: 'rotate(-25deg)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }} />

        {/* Extremely subtle vignette */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(184, 176, 165, 0.02) 100%)',
          pointerEvents: 'none',
        }} />
      </div>
    </>
  );
}
