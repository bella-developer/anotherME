import { Link } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';

function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Geist Mono', monospace" }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
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

      {/* Main Content Container - Auth Page Style */}
      <main className="pt-16 px-4 pb-8 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          
          {/* Header Section - Same as Auth Pages */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4 focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
              <EsoLogo className="h-16 w-auto mx-auto" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-light tracking-[0.25em] text-white mb-3 uppercase">
              Privacy Policy
            </h1>
            <p className="text-xs tracking-[0.2em] text-white/50 uppercase">
              How We Protect Your Data
            </p>
          </div>

          {/* Content Container */}
          <div className="border border-white/15 rounded-lg p-8" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)' }}>
            
            {/* Last Updated */}
            <div className="text-center mb-6">
              <div className="text-xs text-white/60 tracking-wider">
                Updated: June 24, 2026
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-6">
              
              <div className="text-center">
                <h2 className="text-sm font-medium tracking-wider uppercase text-white/90 mb-2">Data We Collect</h2>
                <p className="text-xs text-white/70 leading-relaxed">
                  Username, password (encrypted), optional age & gender. No email required for basic accounts.
                </p>
              </div>

              <div className="text-center">
                <h2 className="text-sm font-medium tracking-wider uppercase text-white/90 mb-2">How It's Used</h2>
                <p className="text-xs text-white/70 leading-relaxed">
                  Authentication, profile display, and community interactions only.
                </p>
              </div>

              <div className="text-center">
                <h2 className="text-sm font-medium tracking-wider uppercase text-white/90 mb-2">Security</h2>
                <p className="text-xs text-white/70 leading-relaxed">
                  Industry-standard encryption. Your data stays within ESO's infrastructure.
                </p>
              </div>

              <div className="text-center">
                <h2 className="text-sm font-medium tracking-wider uppercase text-white/90 mb-2">Your Rights</h2>
                <p className="text-xs text-white/70 leading-relaxed">
                  Access, modify, or delete your data anytime. GDPR & CCPA compliant.
                </p>
              </div>

              <div className="text-center">
                <h2 className="text-sm font-medium tracking-wider uppercase text-white/90 mb-2">No Tracking</h2>
                <p className="text-xs text-white/70 leading-relaxed">
                  Essential cookies only. No third-party tracking or advertising cookies.
                </p>
              </div>

            </div>

            {/* Contact */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-white/50 mb-2">Questions?</p>
              <a 
                href="mailto:privacy@eso.app" 
                className="text-xs text-white/70 hover:text-white transition-colors tracking-wide"
              >
                privacy@eso.app
              </a>
            </div>

            {/* Back Link */}
            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="text-xs text-white/50 hover:text-white/70 transition-colors tracking-wider uppercase"
              >
                ← Back to Home
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Privacy;