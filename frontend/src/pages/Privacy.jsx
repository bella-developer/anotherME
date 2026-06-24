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

      {/* Main Content Container - More Compact and Centered */}
      <main className="pt-16 px-4 pb-8 min-h-screen flex items-center justify-center">
        <div className="max-w-3xl mx-auto w-full">
          
          {/* ESO Logo at Top */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <EsoLogo className="h-20 w-auto mx-auto" />
            </Link>
          </div>

          {/* Page Header - Compact */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-wider uppercase">
              Privacy Policy
            </h1>
            <p className="text-sm text-white opacity-60 tracking-wide uppercase mb-1">
              How We Protect Your Data
            </p>
            <div className="text-xs text-white opacity-40">
              Updated: June 24, 2026
            </div>
          </header>

          {/* Content - Very Compact */}
          <section className="space-y-8 max-w-2xl mx-auto mb-10">
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-3 tracking-wide uppercase">Data We Collect</h2>
              <p className="text-base text-white opacity-85 leading-relaxed">
                Username, password (encrypted), optional age & gender. No email required for basic accounts.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-3 tracking-wide uppercase">How It's Used</h2>
              <p className="text-base text-white opacity-85 leading-relaxed">
                Authentication, profile display, and community interactions only.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-3 tracking-wide uppercase">Security</h2>
              <p className="text-base text-white opacity-85 leading-relaxed">
                Industry-standard encryption. Your data stays within ESO's infrastructure.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-3 tracking-wide uppercase">Your Rights</h2>
              <p className="text-base text-white opacity-85 leading-relaxed">
                Access, modify, or delete your data anytime. GDPR & CCPA compliant.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-3 tracking-wide uppercase">No Tracking</h2>
              <p className="text-base text-white opacity-85 leading-relaxed">
                Essential cookies only. No third-party tracking or advertising cookies.
              </p>
            </div>

          </section>

          {/* Contact - Compact */}
          <section className="text-center mb-8">
            <h2 className="text-xl font-semibold text-white mb-3 tracking-wide uppercase">Questions?</h2>
            <a 
              href="mailto:privacy@eso.app" 
              className="text-base text-white hover:opacity-80 transition-opacity"
            >
              privacy@eso.app
            </a>
          </section>

          {/* Back Link */}
          <footer className="text-center">
            <Link 
              to="/" 
              className="text-sm text-white opacity-50 hover:opacity-80 transition-opacity tracking-wide uppercase"
            >
              ← Back to Home
            </Link>
          </footer>

        </div>
      </main>
    </div>
  );
}

export default Privacy;