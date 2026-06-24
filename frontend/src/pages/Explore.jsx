function Explore() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">EXPLORE</h1>
      <p className="text-white/60 mb-12">Preview what awaits inside. Join to participate in these communities.</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-white/10 p-6 rounded">
          <h2 className="text-xl font-semibold mb-2">Philosophy</h2>
          <p className="text-white/60 text-sm">Question reality, explore ideas, challenge conventional thinking.</p>
        </div>
        <div className="border border-white/10 p-6 rounded">
          <h2 className="text-xl font-semibold mb-2">Solitude</h2>
          <p className="text-white/60 text-sm">Embrace being alone. Share moments of peaceful isolation.</p>
        </div>
      </div>
    </div>
  );
}

export default Explore;
