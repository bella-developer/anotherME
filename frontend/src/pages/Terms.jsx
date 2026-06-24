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

      {/* Main Content Container - Auth Page Style */}
      <main className="pt-16 px-4 pb-8 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          
          {/* Header Section - Same as Auth Pages */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4 focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
              <EsoLogo className="h-16 w-auto mx-auto" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-light tracking-[0.25em] text-white mb-3 uppercase">
              Terms of Service
            </h1>
            <p className="text-xs tracking-[0.2em] text-white/50 uppercase">
              Platform Guidelines
            </p>
          </div>

          {/* Content Container */}
          <div className="border border-white/15 rounded-lg p-8" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)' }}>
            
            {/* Last Updated */}
            <div className="text-center mb-6">
              <div className="text-xs text-white/60 tracking-wider">
                Effective: June 24, 2026
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-6">
              
              <div className="text-center">
                <h2 className="text-sm font-medium tracking-wider uppercase text-white/90 mb-2">Acceptance of Terms</h2>
                <p className="text-xs text-white/70 leading-relaxed">
                  By using ESO, you agree to these terms. If you don't agree, please don't use the platform.
                </p>
              </div>

              <div className="text-center">
                <h2 className="text-sm font-medium tracking-wider uppercase text-white/90 mb-2">Community Guidelines</h2>
                <p className="text-xs text-white/70 leading-relaxed">
                  ESO is for deep thinkers. Harassment, spam, or disruptive content is prohibited.
                </p>
              </div>

              <div className="text-center">
                <h2 className="text-sm font-medium tracking-wider uppercase text-white/90 mb-2">Content Ownership</h2>
                <p className="text-xs text-white/70 leading-relaxed">
                  You own your posts. By posting, you grant ESO license to display your content within the platform.
                </p>
              </div>

              <div className="text-center">
                <h2 className="text-sm font-medium tracking-wider uppercase text-white/90 mb-2">Account Termination</h2>
                <p className="text-xs text-white/70 leading-relaxed">
                  We reserve the right to terminate accounts that violate these terms or disrupt the community.
                </p>
              </div>

              <div className="text-center">
                <h2 className="text-sm font-medium tracking-wider uppercase text-white/90 mb-2">Platform Availability</h2>
                <p className="text-xs text-white/70 leading-relaxed">
                  ESO is provided 'as is' without warranty. We don't guarantee error-free or continuous availability.
                </p>
              </div>

              <div className="text-center">
                <h2 className="text-sm font-medium tracking-wider uppercase text-white/90 mb-2">Changes to Terms</h2>
                <p className="text-xs text-white/70 leading-relaxed">
                  We may update these terms. Continued use after changes constitutes acceptance.
                </p>
              </div>

            </div>

            {/* Contact */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-white/50 mb-2">Legal Questions?</p>
              <a 
                href="mailto:legal@eso.app" 
                className="text-xs text-white/70 hover:text-white transition-colors tracking-wide"
              >
                legal@eso.app
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

export default Terms;