/**
 * PaperTextureBg — Premium architectural plaster texture
 * 10-layer system matching luxury editorial design
 * 
 * Color Range:
 * - Base: #D7D2CA (warm pearl beige)
 * - Lightest: #ECE7DE
 * - Darkest: #A39D94
 * - No pure whites or blacks
 */

export default function PaperTextureBg() {
  return (
    <>
      <style>{`
        @keyframes gentleShift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(0.5px, 0.5px); }
        }
      `}</style>

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
        {/* Layer 1: Base Color — Warm pearl beige foundation */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#D7D2CA',
        }} />

        {/* Layer 2: Color Variation — Large soft beige clouds */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 800px 600px at 20% 30%, #DCD7D0 0%, transparent 50%),
            radial-gradient(ellipse 900px 700px at 80% 70%, #D4CEC5 0%, transparent 50%),
            radial-gradient(ellipse 600px 800px at 50% 50%, #CEC8BF 0%, transparent 50%)
          `,
          opacity: 0.08,
        }} />

        {/* Layer 3: Fine Paper Texture — Cotton paper/matte plaster */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' seed='3'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.1'/%3E%3C/feComponentTransfer%3E%3CfeGaussianBlur stdDeviation='0.5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px 400px',
          opacity: 0.12,
          mixBlendMode: 'overlay',
        }} />

        {/* Layer 4: Micro Grain — Film grain */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='2' seed='7'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.03'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 1,
          animation: 'gentleShift 120s ease-in-out infinite',
        }} />

        {/* Layer 5: Surface Lighting — Soft radial illumination */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 1500px 1200px at 50% 20%, rgba(233, 229, 221, 0.15), transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Layer 6: Large Ambient Shadows — Diagonal bands (curtain light) */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-15%',
          width: '80%',
          height: '140%',
          background: 'linear-gradient(120deg, transparent 0%, rgba(90, 80, 70, 0.18) 35%, transparent 70%)',
          transform: 'rotate(-18deg)',
          filter: 'blur(120px)',
          pointerEvents: 'none',
        }} />

        {/* Layer 7: Contact Shadow — Darker core within ambient shadow */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '60%',
          height: '130%',
          background: 'linear-gradient(120deg, transparent 0%, rgba(75, 68, 60, 0.1) 40%, transparent 65%)',
          transform: 'rotate(-18deg)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />

        {/* Layer 8: Highlight Bloom — Soft glow at light-shadow boundary */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '20%',
          width: '70%',
          height: '120%',
          background: 'linear-gradient(120deg, rgba(255, 255, 255, 0.08) 0%, transparent 40%)',
          transform: 'rotate(-18deg)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }} />

        {/* Layer 9: Matte Finish — No reflections, ultra-subtle overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(215, 210, 202, 0.02)',
          mixBlendMode: 'soft-light',
          pointerEvents: 'none',
        }} />

        {/* Layer 10: Contrast Compression — Final color grade */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(to bottom, rgba(236, 231, 222, 0.03) 0%, transparent 30%, rgba(163, 157, 148, 0.02) 100%)
          `,
          pointerEvents: 'none',
        }} />
      </div>
    </>
  );
}
