import { Link } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';

function Privacy() {
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
            <div className="text-sm text-white/40 tracking-wider">
              Updated: June 24, 2026
            </div>
          </div>

          {/* Content Sections */}
          <div className="max-w-4xl mx-auto space-y-12">
            
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-wider uppercase text-white mb-4">
                Data We Collect
              </h2>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
                Username, password (encrypted), optional age & gender. No email required for basic accounts.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-wider uppercase text-white mb-4">
                How It's Used
              </h2>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
                Authentication, profile display, and community interactions only.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-wider uppercase text-white mb-4">
                Security
              </h2>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
                Industry-standard encryption. Your data stays within ESO's infrastructure.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-wider uppercase text-white mb-4">
                Your Rights
              </h2>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
                Access, modify, or delete your data anytime. GDPR & CCPA compliant.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-wider uppercase text-white mb-4">
                No Tracking
              </h2>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
                Essential cookies only. No third-party tracking or advertising cookies.
              </p>
            </div>

          </div>

          {/* Contact Section */}
          <div className="text-center mt-20">
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
          <div className="text-center mt-16">
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
