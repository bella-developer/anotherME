/**
 * PaperTextureBg — Realistic window light simulation
 * STRONG visible diagonal shadows matching reference image
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
      {/* DARK diagonal shadow bands - visible like in reference */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '50%',
        height: '130%',
        background: 'linear-gradient(125deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.04) 50%, transparent 100%)',
        filter: 'blur(80px)',
        transform: 'rotate(-15deg)',
      }} />

      <div style={{
        position: 'absolute',
        top: '-5%',
        left: '25%',
        width: '45%',
        height: '120%',
        background: 'linear-gradient(125deg, rgba(0, 0, 0, 0.06) 0%, rgba(0, 0, 0, 0.03) 50%, transparent 100%)',
        filter: 'blur(90px)',
        transform: 'rotate(-15deg)',
      }} />

      <div style={{
        position: 'absolute',
        top: '0%',
        left: '55%',
        width: '40%',
        height: '110%',
        background: 'linear-gradient(125deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.02) 50%, transparent 100%)',
        filter: 'blur(100px)',
        transform: 'rotate(-15deg)',
      }} />

      {/* LIGHT bands between shadows */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '10%',
        width: '35%',
        height: '135%',
        background: 'linear-gradient(125deg, rgba(255, 252, 245, 0.6) 0%, rgba(255, 252, 245, 0.3) 50%, transparent 100%)',
        filter: 'blur(70px)',
        transform: 'rotate(-15deg)',
      }} />

      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '40%',
        width: '30%',
        height: '125%',
        background: 'linear-gradient(125deg, rgba(255, 250, 240, 0.5) 0%, rgba(255, 250, 240, 0.25) 50%, transparent 100%)',
        filter: 'blur(80px)',
        transform: 'rotate(-15deg)',
      }} />

      {/* Strong visible paper texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' seed='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.15'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '400px 400px',
        opacity: 1,
        mixBlendMode: 'multiply',
      }} />
    </div>
  );
}
