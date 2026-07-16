/**
 * IntrovertsBg — pure black deep-space starfield.
 * Matches a real long-exposure night sky photo:
 * mostly near-black, sparse white pin-point stars,
 * a single faint blue-tinted galaxy smudge upper-left.
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
    const size = brightness > 0.93 ? 1.8 + r() * 0.7 : brightness > 0.7 ? 1.2 : 1;
    const opacity = brightness > 0.96
      ? 0.75 + r() * 0.25          // ~4% very bright
      : brightness > 0.80
      ? 0.35 + r() * 0.3           // ~16% medium
      : 0.08 + r() * 0.18;         // ~80% very faint
    const hue = brightness > 0.94 ? `rgba(210,225,255,${opacity})` : `rgba(255,255,255,${opacity})`;
    const animate = brightness > 0.97;
    const duration = 4 + r() * 8;
    const delay = r() * 10;
    return { id: i, x, y, size, color: hue, opacity, animate, duration, delay };
  });
}

const STARS = makeStars(280, 0xdeadbeef);

export default function IntrovertsBg() {
  return (
    <>
      <style>{`
        @keyframes starPulse {
          0%, 100% { opacity: var(--op); transform: scale(1); }
          50%       { opacity: calc(var(--op) * 1.8); transform: scale(1.6); }
        }
      `}</style>

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          background: '#000000',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {/* Galaxy smudge — faint, upper-left, blue-tinted, opacity ~0.07 */}
        <div style={{
          position: 'absolute',
          left: '12%',
          top: '32%',
          width: '120px',
          height: '70px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 40% 55%, rgba(140,170,255,0.09) 0%, rgba(100,130,220,0.04) 40%, transparent 75%)',
          transform: 'rotate(-30deg)',
          filter: 'blur(6px)',
        }} />

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
              boxShadow: s.opacity > 0.65
                ? `0 0 ${s.size * 2.5}px rgba(200,215,255,${s.opacity * 0.5})`
                : 'none',
              animation: s.animate
                ? `starPulse ${s.duration}s ${s.delay}s ease-in-out infinite`
                : 'none',
              willChange: s.animate ? 'opacity, transform' : 'auto',
            }}
          />
        ))}

        {/* Light mode - Warm cream editorial background */}
        <div 
          className="light-mode-background"
          style={{
            position: 'absolute',
            inset: 0,
            background: '#F5F1EA',
            opacity: 0,
            transition: 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </>
  );
}
