import { Link } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';
import { usePageTitle } from '../hooks/usePageTitle';

function Terms() {
  usePageTitle('Terms');
  return (
    <div className="min-h-screen bg-black text-white relative z-10" style={{ fontFamily: "'Geist Mono', monospace" }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <EsoLogo className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-white">Sign In</Link>
            <Link to="/register" className="text-white">Register</Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          <div className="mb-12">
            <EsoLogo className="h-24 w-auto mx-auto mb-8" />
            <h1 className="text-6xl font-bold text-white mb-6">
              TERMS OF SERVICE
            </h1>
            <p className="text-2xl text-white mb-4">
              Platform Guidelines
            </p>
          </div>

          <div className="space-y-16 text-white">
            
            <div>
              <h2 className="text-3xl font-bold mb-4">ACCEPTANCE OF TERMS</h2>
              <p className="text-xl">
                By using ESO, you agree to these terms. If you don't agree, please don't use the platform.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">COMMUNITY GUIDELINES</h2>
              <p className="text-xl">
                ESO is for deep thinkers. Harassment, spam, or disruptive content is prohibited.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">CONTENT OWNERSHIP</h2>
              <p className="text-xl">
                You own your posts. By posting, you grant ESO license to display your content within the platform.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">ACCOUNT TERMINATION</h2>
              <p className="text-xl">
                We reserve the right to terminate accounts that violate these terms or disrupt the community.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">PLATFORM AVAILABILITY</h2>
              <p className="text-xl">
                ESO is provided 'as is' without warranty. We don't guarantee error-free or continuous availability.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">CHANGES TO TERMS</h2>
              <p className="text-xl">
                We may update these terms. Continued use after changes constitutes acceptance.
              </p>
            </div>

            <div className="pt-12">
              <h2 className="text-3xl font-bold mb-4">LEGAL QUESTIONS?</h2>
              <a href="mailto:legal@eso.app" className="text-2xl text-white hover:underline">
                legal@eso.app
              </a>
            </div>

            <div className="pt-8 pb-16">
              <Link to="/" className="text-xl text-white/70 hover:text-white">
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
