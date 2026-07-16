/**
 * PaperTextureBg — HIGH CONTRAST VERSION FOR TESTING
 * Making everything VERY visible to debug
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
      {/* VERY VISIBLE diagonal stripe 1 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(125deg, rgba(255, 200, 100, 0.8) 0%, transparent 30%)',
      }} />

      {/* VERY VISIBLE diagonal stripe 2 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(125deg, transparent 30%, rgba(255, 150, 150, 0.7) 50%, transparent 70%)',
      }} />

      {/* VERY VISIBLE diagonal stripe 3 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(125deg, transparent 70%, rgba(150, 200, 255, 0.6) 85%, transparent 100%)',
      }} />

      {/* Obvious texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.5' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.2'/%3E%3C/svg%3E")`,
        opacity: 1,
      }} />
    </div>
  );
}
