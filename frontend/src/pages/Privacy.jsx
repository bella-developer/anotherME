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

      {/* Main Content Container */}
      <main className="pt-24 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Page Header */}
          <header className="text-center py-16">
            <Link to="/" className="inline-block mb-8">
              <EsoLogo className="h-20 w-auto mx-auto" />
            </Link>
            <h1 className="text-6xl font-bold text-white mb-6 tracking-wider uppercase">
              Privacy Policy
            </h1>
            <p className="text-xl text-white opacity-80 tracking-wider uppercase">
              How We Protect Your Data
            </p>
            <div className="mt-4 text-white opacity-60">
              Updated: June 24, 2026
            </div>
          </header>

          {/* Content */}
          <section className="space-y-16 max-w-3xl mx-auto py-8">
            
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6 tracking-wider uppercase">Data We Collect</h2>
              <p className="text-xl text-white opacity-90 leading-relaxed">
                Username, password (encrypted), optional age & gender. No email required for basic accounts.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6 tracking-wider uppercase">How It's Used</h2>
              <p className="text-xl text-white opacity-90 leading-relaxed">
                Authentication, profile display, and community interactions only.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6 tracking-wider uppercase">Security</h2>
              <p className="text-xl text-white opacity-90 leading-relaxed">
                Industry-standard encryption. Your data stays within ESO's infrastructure.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6 tracking-wider uppercase">Your Rights</h2>
              <p className="text-xl text-white opacity-90 leading-relaxed">
                Access, modify, or delete your data anytime. GDPR & CCPA compliant.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6 tracking-wider uppercase">No Tracking</h2>
              <p className="text-xl text-white opacity-90 leading-relaxed">
                Essential cookies only. No third-party tracking or advertising cookies.
              </p>
            </div>

          </section>

          {/* Contact */}
          <section className="text-center py-16">
            <h2 className="text-3xl font-bold text-white mb-8 tracking-wider uppercase">Questions?</h2>
            <a 
              href="mailto:privacy@eso.app" 
              className="text-2xl text-white hover:opacity-80 transition-opacity tracking-wide"
            >
              privacy@eso.app
            </a>
          </section>

          {/* Back Link */}
          <footer className="text-center py-8">
            <Link 
              to="/" 
              className="text-lg text-white opacity-70 hover:opacity-100 transition-opacity tracking-wider uppercase"
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