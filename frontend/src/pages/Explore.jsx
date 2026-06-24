import { Link, useNavigate } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';

function Explore() {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'philosophy',
      title: 'Philosophy',
      desc: 'Question reality, explore ideas, challenge conventional thinking.',
      preview: '"What is the nature of consciousness?"',
      posts: 142,
      icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25'
    },
    {
      id: 'solitude',
      title: 'Solitude',
      desc: 'Embrace being alone. Share moments of peaceful isolation.',
      preview: '"The art of enjoying your own company"',
      posts: 98,
      icon: 'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z'
    },
    {
      id: 'creativity',
      title: 'Creativity',
      desc: 'Art, writing, music, code. Share your creative expression.',
      preview: '"Midnight poetry about existence"',
      posts: 203,
      icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42'
    },
    {
      id: 'deeptalks',
      title: 'Deep Talks',
      desc: 'Conversations that matter. No small talk allowed.',
      preview: '"Why do we fear being misunderstood?"',
      posts: 176,
      icon: 'M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Geist Mono', monospace" }}>
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md">
            <EsoLogo className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <Link 
              to="/login" 
              className="text-xs text-white/60 hover:text-white transition-colors tracking-[0.15em] uppercase font-medium"
            >
              Sign In
            </Link>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 border border-white/20 hover:border-white/40 text-xs text-white hover:bg-white/5 transition-all tracking-[0.15em] uppercase font-medium rounded"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-[0.25em] uppercase mb-6">
              Surf Around
            </h1>
            <p className="text-white/60 text-sm tracking-wide max-w-2xl mx-auto">
              Preview what awaits inside. Join to participate in these communities of deep thinkers.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group border border-white/10 rounded-lg p-8 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                {/* Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center group-hover:border-white/40 transition-colors">
                    <svg className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={category.icon} />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/40 tracking-wider uppercase">Posts</div>
                    <div className="text-sm text-white/60 font-mono">{category.posts}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold tracking-wider uppercase text-white group-hover:text-white transition-colors">
                    {category.title}
                  </h2>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {category.desc}
                  </p>
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-xs text-white/50 italic mb-3">Recent:</div>
                    <div className="text-xs text-white/60 leading-relaxed">
                      {category.preview}
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                  <span className="text-xs text-white/40 tracking-wider uppercase">Locked</span>
                  <button 
                    onClick={() => navigate('/register')}
                    className="text-xs text-white/70 hover:text-white uppercase tracking-wider transition-colors group-hover:translate-x-1 duration-300"
                  >
                    Join to View →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="inline-block max-w-lg">
              <div className="border border-white/15 rounded-lg p-10 bg-white/5 backdrop-blur-sm">
                <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-semibold tracking-wider uppercase mb-4 text-white">
                  Ready to Dive Deeper?
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-8">
                  Create an account to access all categories, post your thoughts, and connect with fellow deep thinkers.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => navigate('/register')}
                    className="px-6 py-3 bg-white text-black font-semibold tracking-wider uppercase text-xs hover:bg-white/90 transition-all rounded"
                  >
                    Create Account
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-3 border border-white/30 text-white font-semibold tracking-wider uppercase text-xs hover:bg-white/10 transition-all rounded"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Explore;