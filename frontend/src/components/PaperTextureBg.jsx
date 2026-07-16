/**
 * PaperTextureBg — Exact reference implementation
 * Warm beige background with diagonal window light simulation
 * No pure whites or blacks - warm gray-beige family only
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
        {/* Base warm beige */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#E8E3D8',
        }} />

        {/* Fine paper texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' seed='5'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.015'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 300px',
          opacity: 1,
        }} />

        {/* Diagonal window light streaks - Main light from top-left */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '60%',
          height: '140%',
          background: 'linear-gradient(135deg, rgba(255, 251, 245, 0.6) 0%, rgba(255, 251, 245, 0.3) 30%, transparent 60%)',
          transform: 'rotate(-25deg)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        {/* Secondary light streak - Creates depth */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          left: '5%',
          width: '50%',
          height: '130%',
          background: 'linear-gradient(135deg, rgba(255, 248, 240, 0.4) 0%, rgba(255, 248, 240, 0.15) 35%, transparent 65%)',
          transform: 'rotate(-28deg)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />

        {/* Tertiary light - Softer, more diffused */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: '45%',
          height: '120%',
          background: 'linear-gradient(135deg, rgba(252, 248, 242, 0.25) 0%, transparent 50%)',
          transform: 'rotate(-30deg)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }} />

        {/* Ambient shadow on opposite side - Creates natural contrast */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: '50%',
          height: '100%',
          background: 'linear-gradient(-45deg, rgba(200, 190, 175, 0.08) 0%, transparent 60%)',
          transform: 'rotate(20deg)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }} />

        {/* Very subtle overall vignette */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(200, 190, 180, 0.03) 100%)',
          pointerEvents: 'none',
        }} />
      </div>
    </>
  );
}
