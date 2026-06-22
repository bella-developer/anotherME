import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-black text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-9xl font-bold mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
          404
        </h1>
        <h2 className="text-2xl mb-4 tracking-[0.2em] uppercase" style={{ fontFamily: "'Geist Mono', monospace" }}>
          Lost in the Void
        </h2>
        <p className="text-white/60 mb-8 text-sm tracking-wide">
          The page you're looking for doesn't exist in this dimension.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-white text-black font-semibold tracking-wider uppercase text-sm hover:bg-white/90 transition-all"
          >
            Return Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-white/30 text-white font-semibold tracking-wider uppercase text-sm hover:bg-white/10 transition-all"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    </main>
  );
}

export default NotFound;
