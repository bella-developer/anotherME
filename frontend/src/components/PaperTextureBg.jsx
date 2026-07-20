/**
 * PaperTextureBg — Premium light mode background
 * Refined, intentional design with subtle depth
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
        background: 'linear-gradient(135deg, #EBE6DB 0%, #E8E3D8 50%, #E5E0D5 100%)',
      }}
    >
      {/* Subtle vignette for depth */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.03) 100%)',
      }} />

      {/* Refined diagonal light - softer, more intentional */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: '60%',
        height: '140%',
        background: 'linear-gradient(135deg, rgba(255, 252, 245, 0.5) 0%, rgba(255, 252, 245, 0.2) 40%, transparent 70%)',
        filter: 'blur(100px)',
        transform: 'rotate(-15deg)',
      }} />

      {/* Subtle shadow accent - adds depth without being messy */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '50%',
        height: '130%',
        background: 'linear-gradient(225deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.02) 40%, transparent 70%)',
        filter: 'blur(120px)',
        transform: 'rotate(15deg)',
      }} />

      {/* Premium paper texture - subtle and refined */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' seed='5'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.08'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '300px 300px',
        opacity: 1,
        mixBlendMode: 'multiply',
      }} />

      {/* Soft ambient light for warmth */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '30%',
        width: '40%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(255, 248, 235, 0.3) 0%, transparent 60%)',
        filter: 'blur(80px)',
      }} />
    </div>
  );
}
