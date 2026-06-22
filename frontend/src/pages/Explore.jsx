import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Explore() {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      title: 'Philosophy',
      desc: 'Question reality, explore ideas, challenge conventional thinking.',
      preview: 'Recent: "What is the nature of consciousness?"',
      posts: 142,
      img: 'https://images.pexels.com/photos/1660995/pexels-photo-1660995.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 2,
      title: 'Solitude',
      desc: 'Embrace being alone. Share moments of peaceful isolation.',
      preview: 'Recent: "The art of enjoying your own company"',
      posts: 98,
      img: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 3,
      title: 'Creativity',
      desc: 'Art, writing, music, code. Share your creative expression.',
      preview: 'Recent: "Midnight poetry about existence"',
      posts: 203,
      img: 'https://images.pexels.com/photos/3094208/pexels-photo-3094208.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 4,
      title: 'Deep Talks',
      desc: 'Conversations that matter. No small talk allowed.',
      preview: 'Recent: "Why do we fear being misunderstood?"',
      posts: 176,
      img: 'https://images.pexels.com/photos/1083822/pexels-photo-1083822.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-[0.3em]" style={{ fontFamily: "'Space Mono', monospace" }}>
            ESO
          </Link>
          <div className="flex gap-6">
            <Link to="/login" className="text-sm text-white/60 hover:text-white transition-colors tracking-wider">
              SIGN IN
            </Link>
            <Link to="/register" className="text-sm text-white hover:text-white/80 transition-colors tracking-wider">
              REGISTER
            </Link>
          </div>
        </div>
      </nav>

      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-6 py-24"
      >
        <div className="text-center mb-16 mt-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-[0.2em]">EXPLORE</h1>
          <p className="text-white/60 text-sm tracking-wide">
            Preview what awaits inside. Join to participate in these communities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {categories.map((cat, i) => (
            <motion.article
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative overflow-hidden rounded-lg border border-white/10 hover:border-white/20 transition-all group"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={cat.img} 
                  alt={cat.title}
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 tracking-wider">{cat.title}</h2>
                <p className="text-white/60 text-sm mb-3">{cat.desc}</p>
                <div className="text-xs text-white/40 mb-4 italic">"{cat.preview}"</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50">{cat.posts} posts</span>
                  <button 
                    onClick={() => navigate('/register')}
                    className="text-xs text-white/70 hover:text-white uppercase tracking-wider transition-colors"
                  >
                    Join to View →
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-block border border-white/15 rounded-lg p-8" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <h3 className="text-xl font-semibold mb-3 tracking-wider">Ready to Dive Deeper?</h3>
            <p className="text-white/60 text-sm mb-6 max-w-md">
              Create an account to access all categories, post your thoughts, and connect with fellow introverts.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 bg-white text-black font-semibold tracking-wider uppercase text-sm hover:bg-white/90 transition-all"
              >
                Create Account
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 border border-white/30 text-white font-semibold tracking-wider uppercase text-sm hover:bg-white/10 transition-all"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}

export default Explore;
