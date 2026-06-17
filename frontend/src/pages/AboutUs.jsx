import { useNavigate } from 'react-router-dom';
import { Heart, Moon, Shield, Eye, ArrowLeft, CloudMoon, Rocket, Brain } from 'lucide-react';
import PageTransition from '../components/PageTransition';

/**
 * About Us Page
 * Minimal, essential information only
 */
function AboutUs() {
  const navigate = useNavigate();

  const coreIdeas = [
    {
      icon: Moon,
      title: "Silence is Sacred",
      message: "No pressure to interact"
    },
    {
      icon: CloudMoon,
      title: "Darkness is Welcome",
      message: "Heavy feelings belong here"
    },
    {
      icon: Shield,
      title: "Privacy First",
      message: "What's shared stays here"
    },
    {
      icon: Eye,
      title: "Depth Over Performance",
      message: "Real beats perfect"
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-transparent text-white relative z-10">
        {/* Back Button */}
        <div className="max-w-3xl mx-auto px-6 pt-6 relative z-20">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group font-medium"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
        </div>

        {/* Hero Section - Compact */}
        <div className="max-w-2xl mx-auto px-6 py-16 text-center relative z-20">
          <div className="mb-6 inline-block">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{
              background: 'transparent',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.15)'
            }}>
              <Heart size={28} className="text-white/70" strokeWidth={2} />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            another<span className="text-[#D97757]">ME</span>
          </h1>
          
          <p className="text-gray-400 font-normal mb-8 text-lg">
            A quiet space for introverts, deep thinkers, and those who don't fit the mold
          </p>

          {/* Core Ideas - 4 Tiny Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {coreIdeas.map((idea, index) => {
              const Icon = idea.icon;
              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center justify-center p-6 text-center cursor-pointer group overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-1"
                  style={{
                    minHeight: '180px',
                    background: 'transparent',
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.15)',
                  }}
                >
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.06)' }} />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <Icon size={32} className="text-white/70 mb-4 group-hover:text-white transition-colors duration-300" strokeWidth={2} />
                    
                    <h3 className="text-xs font-bold text-white mb-2 tracking-wide">
                      {idea.title}
                    </h3>
                    
                    <p className="text-[11px] text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300">
                      {idea.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Three Rooms */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-white/90 mb-6 tracking-wide">Three Spaces</h2>
            
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div
                className="relative flex flex-col items-center justify-center p-5 text-center cursor-pointer group overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-1"
                style={{
                  minHeight: '140px',
                  background: 'transparent',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.15)',
                }}
              >
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.06)' }} />
                
                <div className="relative z-10">
                  <CloudMoon size={28} className="text-white/70 mb-3 mx-auto group-hover:text-white transition-colors duration-300" strokeWidth={2} />
                  <h3 className="text-xs font-bold text-white mb-1">Dark</h3>
                  <p className="text-[10px] text-white/80">Heavy emotions</p>
                </div>
              </div>

              <div
                className="relative flex flex-col items-center justify-center p-5 text-center cursor-pointer group overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-1"
                style={{
                  minHeight: '140px',
                  background: 'transparent',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.15)',
                }}
              >
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.06)' }} />
                
                <div className="relative z-10">
                  <Rocket size={28} className="text-white/70 mb-3 mx-auto group-hover:text-white transition-colors duration-300" strokeWidth={2} />
                  <h3 className="text-xs font-bold text-white mb-1">Climb</h3>
                  <p className="text-[10px] text-white/80">Ideas & growth</p>
                </div>
              </div>

              <div
                className="relative flex flex-col items-center justify-center p-5 text-center cursor-pointer group overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-1"
                style={{
                  minHeight: '140px',
                  background: 'transparent',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.15)',
                }}
              >
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: 'inset 0 0 30px rgba(255,255,255,0.06)' }} />
                
                <div className="relative z-10">
                  <Brain size={28} className="text-white/70 mb-3 mx-auto group-hover:text-white transition-colors duration-300" strokeWidth={2} />
                  <h3 className="text-xs font-bold text-white mb-1">Philo</h3>
                  <p className="text-[10px] text-white/80">Deep thoughts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Welcome */}
          <div
            className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full"
            style={{
              background: 'transparent',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.15)',
            }}
          >
            <Heart size={16} strokeWidth={2} />
            <span className="font-semibold text-xs tracking-wide">Welcome home</span>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-20" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="max-w-3xl mx-auto px-6 py-6 text-center">
            <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase">
              © 2026 anotherME
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default AboutUs;
