/**
 * IntrovertsBg — rich cosmic deep-space starfield.
 * Realistic night sky with visible glowing stars, subtle nebulae dust,
 * and a faint blue/indigo galaxy smudge.
 */

function rand(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function makeStars(count, seed) {
  const r = rand(seed);
  return Array.from({ length: count }, (_, i) => {
    const brightness = r();
    const x = r() * 100;
    const y = r() * 100;
    const size = brightness > 0.92 ? 1.8 + r() * 0.8 : brightness > 0.65 ? 1.3 : 0.9;
    const opacity = brightness > 0.92
      ? 0.8 + r() * 0.2           // ~8% very bright
      : brightness > 0.65
      ? 0.48 + r() * 0.28         // ~27% medium
      : 0.24 + r() * 0.22;        // ~65% visible ambient stars
    const hue = brightness > 0.94
      ? `rgba(215, 230, 255, ${opacity})`
      : brightness > 0.85
      ? `rgba(235, 225, 255, ${opacity})`
      : `rgba(255, 255, 255, ${opacity})`;
    const animate = brightness > 0.82;
    const duration = 3.5 + r() * 7;
    const delay = r() * 8;
    return { id: i, x, y, size, color: hue, opacity, animate, duration, delay };
  });
}

const STARS = makeStars(340, 0xdeadbeef);

export default function IntrovertsBg() {
  return (
    <>
      <style>{`
        @keyframes starPulse {
          0%, 100% { opacity: var(--op); transform: scale(1); }
          50%       { opacity: calc(var(--op) * 1.6); transform: scale(1.4); }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="introverts-cosmic-bg pointer-events-none fixed inset-0"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          background: 'radial-gradient(ellipse at 50% 35%, #0a0b16 0%, #05060c 55%, #020204 100%)',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {/* Galaxy smudge — faint, upper-left, indigo-blue tinted */}
        <div
          style={{
            position: 'absolute',
            left: '10%',
            top: '25%',
            width: '260px',
            height: '150px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at 40% 50%, rgba(99, 102, 241, 0.16) 0%, rgba(59, 130, 246, 0.08) 40%, transparent 75%)',
            transform: 'rotate(-28deg)',
            filter: 'blur(20px)',
          }}
        />

        {/* Subtle deep crimson cosmic dust — lower right */}
        <div
          style={{
            position: 'absolute',
            right: '8%',
            bottom: '20%',
            width: '320px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(220, 38, 38, 0.09) 0%, rgba(99, 102, 241, 0.05) 45%, transparent 80%)',
            transform: 'rotate(15deg)',
            filter: 'blur(30px)',
          }}
        />

        {/* Celestial core glow */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '30%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(140, 160, 255, 0.04) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Stars */}
        {STARS.map((s) => (
          <span
            key={s.id}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              borderRadius: '50%',
              background: s.color,
              '--op': s.opacity,
              boxShadow: s.opacity > 0.7
                ? `0 0 ${s.size * 3}px rgba(215, 230, 255, 0.8)`
                : 'none',
              animation: s.animate
                ? `starPulse ${s.duration}s ${s.delay}s ease-in-out infinite`
                : 'none',
              willChange: s.animate ? 'opacity, transform' : 'auto',
            }}
          />
        ))}
      </div>
    </>
  );
}
