import { Link } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';

function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Geist Mono', monospace" }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl">
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
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <Link to="/" className="inline-block mb-6 focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
              <EsoLogo className="h-20 w-auto mx-auto" />
            </Link>
            <h1 className="text-5xl md:text-6xl font-light tracking-[0.2em] text-white mb-4 uppercase">
              Privacy Policy
            </h1>
            <p className="text-sm tracking-[0.15em] text-white/50 uppercase mb-4">
              How We Protect Your Data
            </p>
            <div className="text-xs text-white/40 tracking-wider">
              Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-16 max-w-3xl mx-auto">
            {[
              {
                title: "Data We Collect",
                content: "Username, password (encrypted), optional age & gender. No email required for basic accounts."
              },
              {
                title: "How It's Used",
                content: "Authentication, profile display, and community interactions only."
              },
              {
                title: "Security",
                content: "Industry-standard encryption. Your data stays within ESO's infrastructure."
              },
              {
                title: "Your Rights",
                content: "Access, modify, or delete your data anytime. GDPR & CCPA compliant."
              },
              {
                title: "No Tracking",
                content: "Essential cookies only. No third-party tracking or advertising cookies."
              }
            ].map((section, index) => (
              <div key={index} className="text-center">
                <h2 className="text-xl font-light tracking-[0.2em] uppercase text-white mb-6">
                  {section.title}
                </h2>
                <p className="text-white/70 text-base leading-relaxed max-w-2xl mx-auto">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="text-center mt-20">
            <h2 className="text-xl font-light tracking-[0.2em] uppercase text-white mb-6">Questions?</h2>
            <a 
              href="mailto:privacy@eso.app" 
              className="text-white/70 hover:text-white transition-colors tracking-wide text-lg"
            >
              privacy@eso.app
            </a>
          </div>

          {/* Back Link */}
          <div className="text-center mt-16">
            <Link 
              to="/" 
              className="text-white/50 hover:text-white/70 transition-colors tracking-wider uppercase text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;