import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import EsoLogo from '../components/EsoLogo';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * About Us Page - Minimal, Artistic, Centered
 * ESO branding with philosophical aesthetic
 */
function AboutUs() {
  usePageTitle('About');
  const navigate = useNavigate();
  const principles = [
    {
      title: "Silence is Sacred",
      desc: "No pressure to interact"
    },
    {
      title: "Darkness is Welcome",
      desc: "Heavy feelings belong here"
    },
    {
      title: "Privacy First",
      desc: "What's shared stays here"
    },
    {
      title: "Depth Over Performance",
      desc: "Real beats perfect"
    }
  ];

  const spaces = [
    { name: "Dark", desc: "Heavy emotions" },
    { name: "Fantasy", desc: "Creative expression" },
    { name: "Philo", desc: "Deep thoughts" }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white relative">
        {/* Background */}
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(167, 139, 250, 0.03) 0%, transparent 60%)',
            zIndex: 1,
          }}
        />
        
        {/* Back Button - Compact */}
        <button
          onClick={() => navigate(-1)}
          className="fixed top-6 left-6 z-50 text-xs uppercase tracking-wider transition-colors flex items-center gap-2 px-3 py-1.5 rounded"
          style={{
            color: 'rgba(255, 255, 255, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="min-h-screen flex items-center justify-center px-6 py-12 relative z-10">
          <div className="max-w-2xl w-full text-center space-y-10">
            
            {/* Logo + Title Section - Compact */}
            <div className="space-y-6 animate-fadeIn">
              <div className="inline-block">
                <EsoLogo className="h-16 w-auto mx-auto" />
              </div>
              
              <div className="space-y-3">
                <h1 className={`text-base tracking-[0.25em] uppercase font-light ${'text-white/90'}`}>
                  Inner World, Finally Understood
                </h1>
                <p className={`text-xs leading-relaxed max-w-lg mx-auto ${'text-white/50'}`}>
                  A quiet space for introverts, deep thinkers, and those who don't fit the mold
                </p>
              </div>
            </div>

            {/* Divider - Compact */}
            <div className="flex items-center gap-3 justify-center">
              <div className={`w-6 h-px ${'bg-white/10'}`}></div>
              <div className={`w-1 h-1 rounded-full ${'bg-white/30'}`}></div>
              <div className={`w-6 h-px ${'bg-white/10'}`}></div>
            </div>

            {/* Core Principles - Compact */}
            <div className="space-y-6 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <h2 className={`text-[10px] tracking-[0.25em] uppercase font-medium ${'text-white/40'}`}>
                Our Philosophy
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
                {principles.map((item, i) => (
                  <div
                    key={i}
                    className="group p-4 rounded-lg transition-all duration-500 hover:-translate-y-1"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      boxShadow: '0 0 0 1px rgba(255,255,255,0.08)',
                    }}
                  >
                    <div className="space-y-1.5">
                      <h3 className={`text-xs font-semibold tracking-wide transition-colors ${'text-white group-hover:text-white/90'}`}>
                        {item.title}
                      </h3>
                      <p className={`text-[10px] leading-relaxed ${'text-white/50'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider - Compact */}
            <div className="flex items-center gap-3 justify-center">
              <div className="w-6 h-px bg-white/10"></div>
              <div className="w-1 h-1 rounded-full bg-white/30"></div>
              <div className="w-6 h-px bg-white/10"></div>
            </div>

            {/* Three Spaces - Compact */}
            <div className="space-y-6 animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <h2 className={`text-[10px] tracking-[0.25em] uppercase font-medium ${'text-white/40'}`}>
                Three Spaces
              </h2>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                {spaces.map((space, i) => (
                  <div
                    key={i}
                    className="group w-full sm:w-auto flex-1 p-4 rounded-lg transition-all duration-500 hover:-translate-y-1 text-center"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      boxShadow: '0 0 0 1px rgba(255,255,255,0.08)',
                    }}
                  >
                    <div className="space-y-1.5">
                      <h3 className={`text-xs font-bold tracking-wider uppercase transition-colors ${'text-white group-hover:text-white/90'}`}>
                        {space.name}
                      </h3>
                      <p className={`text-[10px] tracking-wide ${'text-white/50'}`}>
                        {space.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider - Compact */}
            <div className="flex items-center gap-3 justify-center">
              <div className="w-6 h-px bg-white/10"></div>
              <div className="w-1 h-1 rounded-full bg-white/30"></div>
              <div className="w-6 h-px bg-white/10"></div>
            </div>

            {/* Welcome Message - Compact */}
            <div className="space-y-4 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
              <div className="space-y-3">
                <p className={`text-xl font-light leading-relaxed ${'text-white/80'}`}>
                  Welcome home
                </p>
                <p className={`text-[10px] tracking-[0.2em] uppercase ${'text-white/30'}`}>
                  For deep thinkers and authentic minds
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default AboutUs;
