import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_THOUGHTS = [
  {
    id: 1,
    tag: 'Solitude',
    author: '@quiet_rebel',
    content: 'Silence is not empty. It is full of answers we are too loud to hear.',
    time: '2m ago',
    likes: 42,
    gradient: 'from-purple-900/40 via-neutral-900/60 to-black/80',
    borderColor: 'rgba(168, 85, 247, 0.3)',
    glowColor: 'rgba(168, 85, 247, 0.15)',
  },
  {
    id: 2,
    tag: 'Existential',
    author: '@nocturne_soul',
    content: 'In a world that constantly demands performance, choosing solitude is an act of quiet rebellion.',
    time: '15m ago',
    likes: 89,
    gradient: 'from-indigo-900/40 via-neutral-900/60 to-black/80',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    glowColor: 'rgba(99, 102, 241, 0.15)',
  },
  {
    id: 3,
    tag: 'Late Night',
    author: '@starlight_wanderer',
    content: 'The most meaningful conversations happen at 3 AM when the world is asleep and defenses are down.',
    time: '1h ago',
    likes: 124,
    gradient: 'from-amber-900/30 via-neutral-900/60 to-black/80',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    glowColor: 'rgba(245, 158, 11, 0.15)',
  },
  {
    id: 4,
    tag: 'Creativity',
    author: '@artisan_mind',
    content: 'Solitude is the laboratory where raw thoughts distill into original art.',
    time: '3h ago',
    likes: 67,
    gradient: 'from-rose-900/30 via-neutral-900/60 to-black/80',
    borderColor: 'rgba(244, 63, 94, 0.3)',
    glowColor: 'rgba(244, 63, 94, 0.15)',
  },
  {
    id: 5,
    tag: 'Solitude',
    author: '@deep_observer',
    content: 'I don’t hate people; I just cherish the vast, quiet universe inside my mind.',
    time: '5h ago',
    likes: 156,
    gradient: 'from-teal-900/30 via-neutral-900/60 to-black/80',
    borderColor: 'rgba(20, 184, 166, 0.3)',
    glowColor: 'rgba(20, 184, 166, 0.15)',
  },
  {
    id: 6,
    tag: 'Late Night',
    author: '@cosmic_whisper',
    content: 'Anonymity grants the courage to speak what the heart could never say out loud.',
    time: '8h ago',
    likes: 210,
    gradient: 'from-violet-900/40 via-neutral-900/60 to-black/80',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    glowColor: 'rgba(139, 92, 246, 0.15)',
  },
];

export default function FloatingThoughtsGrid({ onWhisperTrigger }) {
  const [thoughts, setThoughts] = useState(INITIAL_THOUGHTS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [likedMap, setLikedMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newThought, setNewThought] = useState('');
  const [selectedTag, setSelectedTag] = useState('Solitude');

  const categories = ['All', 'Solitude', 'Existential', 'Late Night', 'Creativity'];

  const filteredThoughts = activeCategory === 'All'
    ? thoughts
    : thoughts.filter(t => t.tag === activeCategory);

  const toggleLike = (id) => {
    setLikedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    setThoughts(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          likes: likedMap[id] ? t.likes - 1 : t.likes + 1
        };
      }
      return t;
    }));
  };

  const handleAddThought = (e) => {
    e.preventDefault();
    if (!newThought.trim()) return;

    const created = {
      id: Date.now(),
      tag: selectedTag,
      author: `@introvert_${Math.floor(1000 + Math.random() * 9000)}`,
      content: newThought.trim(),
      time: 'Just now',
      likes: 1,
      gradient: 'from-purple-900/50 via-neutral-900/70 to-black/90',
      borderColor: 'rgba(167, 139, 250, 0.5)',
      glowColor: 'rgba(167, 139, 250, 0.25)',
    };

    setThoughts([created, ...thoughts]);
    setNewThought('');
    setShowModal(false);
  };

  return (
    <section className="relative py-24 px-4 sm:px-8 bg-black overflow-hidden z-10">
      {/* Background Radial Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(167, 139, 250, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-purple-300 font-semibold">
              ✦ Sphere of Quiet Thoughts
            </span>
          </div>
          <h2 
            className="text-3xl sm:text-5xl font-extralight text-white mb-4 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Ideas from <span className="italic text-purple-200">Quiet Minds</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto font-light">
            Floating epiphanies, midnight reflections, and unspoken truths posted by introverts across the sanctuary.
          </p>
        </motion.div>

        {/* Category Filters & Add Thought Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-purple-600/30 text-white border border-purple-400/50 shadow-lg shadow-purple-500/10'
                    : 'bg-white/5 text-neutral-400 border border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-purple-500/20 flex items-center gap-2"
          >
            <span className="text-sm">+</span> Share Your Thought
          </button>
        </div>

        {/* Floating Message Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredThoughts.map((item, index) => {
              const isLiked = likedMap[item.id];
              return (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: [0, index % 2 === 0 ? -6 : -10, 0] 
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ 
                    opacity: { duration: 0.5 },
                    scale: { duration: 0.5 },
                    y: { 
                      duration: 4 + (index % 3), 
                      repeat: Infinity, 
                      repeatType: 'reverse', 
                      ease: 'easeInOut',
                      delay: index * 0.3
                    }
                  }}
                  className={`group relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 bg-gradient-to-b ${item.gradient}`}
                  style={{
                    border: `1px solid ${item.borderColor}`,
                    boxShadow: `0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px ${item.glowColor}`,
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  {/* Subtle Top Ambient Accent */}
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className="px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest font-medium"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: `1px solid ${item.borderColor}`,
                        color: '#e9d5ff',
                      }}
                    >
                      ✦ {item.tag}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {item.time}
                    </span>
                  </div>

                  {/* Thought Quote Text */}
                  <p 
                    className="text-base sm:text-lg text-neutral-100 font-light leading-relaxed mb-6 group-hover:text-white transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    "{item.content}"
                  </p>

                  {/* Footer Meta & Interaction */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-xs font-mono text-purple-300/80">
                      {item.author}
                    </span>

                    <button
                      onClick={() => toggleLike(item.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-300 ${
                        isLiked 
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40' 
                          : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-transparent'
                      }`}
                    >
                      <svg 
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${isLiked ? 'scale-125 text-pink-400 fill-pink-400' : 'text-neutral-400'}`} 
                        fill={isLiked ? 'currentColor' : 'none'} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{item.likes}</span>
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Share Thought Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl p-6 sm:p-8 bg-neutral-950 border border-purple-500/30 shadow-2xl shadow-purple-500/20 relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2"
              >
                ✕
              </button>

              <h3 className="text-2xl font-light text-white mb-2">Whisper a Thought</h3>
              <p className="text-xs text-neutral-400 mb-6">
                Your message will float anonymously in the quiet sphere for fellow introverts.
              </p>

              <form onSubmit={handleAddThought} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {['Solitude', 'Existential', 'Late Night', 'Creativity'].map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          selectedTag === tag ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">Your Deep Thought</label>
                  <textarea
                    rows={4}
                    value={newThought}
                    onChange={(e) => setNewThought(e.target.value)}
                    placeholder="In silence, I realized..."
                    className="w-full rounded-xl p-4 bg-black/60 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 text-sm leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl text-xs uppercase tracking-wider text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/30"
                  >
                    Release Thought ✦
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
