import { Link } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';

function Terms() {
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
              Terms of Service
            </h1>
            <p className="text-sm text-white opacity-60 tracking-wide uppercase mb-1">
              Platform Guidelines
            </p>
            <div className="text-xs text-white opacity-40">
              Effective: June 24, 2026
            </div>
          </header>

          {/* Content */}
          <section className="space-y-8 max-w-2xl mx-auto mb-10">
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-3 tracking-wide uppercase">Acceptance of Terms</h2>
              <p className="text-base text-white opacity-85 leading-relaxed">
                By using ESO, you agree to these terms. If you don't agree, please don't use the platform.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-3 tracking-wide uppercase">Community Guidelines</h2>
              <p className="text-base text-white opacity-85 leading-relaxed">
                ESO is for deep thinkers. Harassment, spam, or disruptive content is prohibited.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-3 tracking-wide uppercase">Content Ownership</h2>
              <p className="text-base text-white opacity-85 leading-relaxed">
                You own your posts. By posting, you grant ESO license to display your content within the platform.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4 tracking-wide uppercase">Account Termination</h2>
              <p className="text-xl text-white opacity-90 leading-relaxed">
                We reserve the right to terminate accounts that violate these terms or disrupt the community.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4 tracking-wide uppercase">Platform Availability</h2>
              <p className="text-lg text-white opacity-90 leading-relaxed">
                ESO is provided 'as is' without warranty. We don't guarantee error-free or continuous availability.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4 tracking-wide uppercase">Changes to Terms</h2>
              <p className="text-lg text-white opacity-90 leading-relaxed">
                We may update these terms. Continued use after changes constitutes acceptance.
              </p>
            </div>

          </section>

          {/* Contact */}
          <section className="text-center py-12 mt-8">
            <h2 className="text-2xl font-bold text-white mb-4 tracking-wide uppercase">Legal Questions?</h2>
            <a 
              href="mailto:legal@eso.app" 
              className="text-lg text-white hover:opacity-80 transition-opacity"
            >
              legal@eso.app
            </a>
          </section>

          {/* Back Link */}
          <footer className="text-center py-4">
            <Link 
              to="/" 
              className="text-base text-white opacity-60 hover:opacity-100 transition-opacity tracking-wide uppercase"
            >
              ← Back to Home
            </Link>
          </footer>

        </div>
      </main>
    </div>
  );
}

export default Terms;