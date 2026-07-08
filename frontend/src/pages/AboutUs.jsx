import Layout from '../components/Layout';
import PageTransition from '../components/PageTransition';
import EsoLogo from '../components/EsoLogo';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * About Us Page - Minimal, Artistic, Centered
 * ESO branding with philosophical aesthetic
 */
function AboutUs() {
  usePageTitle('About');
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
      <Layout leftSidebar={null} rightSidebar={null}>
        <div className="min-h-screen flex items-center justify-center px-6 py-16 relative z-10">
          <div className="max-w-2xl w-full text-center space-y-16">
            
            {/* Logo + Title Section */}
            <div className="space-y-8 animate-fadeIn">
              <div className="inline-block">
                <EsoLogo className="h-24 w-auto mx-auto" />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-lg tracking-[0.3em] uppercase text-white/90 font-light">
                  Inner World, Finally Understood
                </h1>
                <p className="text-sm text-white/50 leading-relaxed max-w-lg mx-auto">
                  A quiet space for introverts, deep thinkers, and those who don't fit the mold
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 justify-center">
              <div className="w-8 h-px bg-white/10"></div>
              <div className="w-1 h-1 rounded-full bg-white/30"></div>
              <div className="w-8 h-px bg-white/10"></div>
            </div>

            {/* Core Principles */}
            <div className="space-y-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-xs tracking-[0.25em] uppercase text-white/40 font-medium">
                Our Philosophy
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
                {principles.map((item, i) => (
                  <div
                    key={i}
                    className="group p-6 rounded-xl transition-all duration-500 hover:-translate-y-1"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      boxShadow: '0 0 0 1px rgba(255,255,255,0.08)',
                    }}
                  >
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold tracking-wide text-white group-hover:text-white/90 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-white/50 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 justify-center">
              <div className="w-8 h-px bg-white/10"></div>
              <div className="w-1 h-1 rounded-full bg-white/30"></div>
              <div className="w-8 h-px bg-white/10"></div>
            </div>

            {/* Three Spaces */}
            <div className="space-y-8 animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-xs tracking-[0.25em] uppercase text-white/40 font-medium">
                Three Spaces
              </h2>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                {spaces.map((space, i) => (
                  <div
                    key={i}
                    className="group w-full sm:w-auto flex-1 p-6 rounded-xl transition-all duration-500 hover:-translate-y-1 text-center"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      boxShadow: '0 0 0 1px rgba(255,255,255,0.08)',
                    }}
                  >
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold tracking-wider uppercase text-white group-hover:text-white/90 transition-colors">
                        {space.name}
                      </h3>
                      <p className="text-[10px] text-white/50 tracking-wide">
                        {space.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 justify-center">
              <div className="w-8 h-px bg-white/10"></div>
              <div className="w-1 h-1 rounded-full bg-white/30"></div>
              <div className="w-8 h-px bg-white/10"></div>
            </div>

            {/* Welcome Message */}
            <div className="space-y-6 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
              <div className="space-y-4">
                <p className="text-2xl font-light text-white/80 leading-relaxed">
                  Welcome home
                </p>
                <p className="text-xs tracking-[0.2em] uppercase text-white/30">
                  For deep thinkers and authentic minds
                </p>
              </div>
            </div>

          </div>
        </div>
      </Layout>
    </PageTransition>
  );
}

export default AboutUs;
