import { Link } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';
import { usePageTitle } from '../hooks/usePageTitle';

function Privacy() {
  usePageTitle('Privacy');
  const sections = [
    {
      id: 'data',
      title: 'Data We Collect',
      content: 'Username, password (encrypted), optional age & gender. No email required for basic accounts.'
    },
    {
      id: 'usage',
      title: 'How It\'s Used',
      content: 'Authentication, profile display, and community interactions only.'
    },
    {
      id: 'security',
      title: 'Security',
      content: 'Industry-standard encryption. Your data stays within ESO\'s infrastructure.'
    },
    {
      id: 'rights',
      title: 'Your Rights',
      content: 'Access, modify, or delete your data anytime. GDPR & CCPA compliant.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative z-10" style={{ fontFamily: "'Geist Mono', monospace" }}>
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
            <Link
              to="/register"
              className="px-4 py-2 text-xs text-white hover:bg-white/5 transition-all tracking-[0.15em] uppercase font-medium"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <EsoLogo className="h-20 w-auto mx-auto" />
            </div>
            <h1 className="text-5xl md:text-6xl font-light tracking-[0.2em] uppercase mb-4 text-white">
              Privacy Policy
            </h1>
            <p className="text-sm tracking-[0.15em] text-white/50 uppercase mb-8">
              How We Protect Your Data
            </p>
          </div>

          {/* Content Sections */}
          <div className="max-w-3xl mx-auto space-y-12 mb-20">
            {sections.map((section) => (
              <div key={section.id} className="text-center">
                <h2 className="text-2xl font-semibold tracking-wider uppercase text-white mb-4">
                  {section.title}
                </h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold tracking-wider uppercase text-white mb-4">
              Questions?
            </h2>
            <a 
              href="mailto:privacy@eso.app" 
              className="text-lg text-white/80 hover:text-white transition-colors"
            >
              privacy@eso.app
            </a>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link 
              to="/" 
              className="text-sm text-white/50 hover:text-white/70 transition-colors tracking-wider uppercase"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Privacy;
