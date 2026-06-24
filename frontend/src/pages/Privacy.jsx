import { Link } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';

function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Geist Mono', monospace" }}>
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
              PRIVACY POLICY
            </h1>
            <p className="text-2xl text-white mb-4">
              How We Protect Your Data
            </p>
          </div>

          <div className="space-y-16 text-white">
            
            <div>
              <h2 className="text-3xl font-bold mb-4">DATA WE COLLECT</h2>
              <p className="text-xl">
                Username, password (encrypted), optional age & gender. No email required for basic accounts.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">HOW IT'S USED</h2>
              <p className="text-xl">
                Authentication, profile display, and community interactions only.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">SECURITY</h2>
              <p className="text-xl">
                Industry-standard encryption. Your data stays within ESO's infrastructure.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">YOUR RIGHTS</h2>
              <p className="text-xl">
                Access, modify, or delete your data anytime. GDPR & CCPA compliant.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">NO TRACKING</h2>
              <p className="text-xl">
                Essential cookies only. No third-party tracking or advertising cookies.
              </p>
            </div>

            <div className="pt-12">
              <h2 className="text-3xl font-bold mb-4">QUESTIONS?</h2>
              <a href="mailto:privacy@eso.app" className="text-2xl text-white hover:underline">
                privacy@eso.app
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

export default Privacy;
