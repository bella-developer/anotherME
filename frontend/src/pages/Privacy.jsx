import { Link } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';

function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12" style={{ fontFamily: "'Geist Mono', monospace" }}>
      <div className="w-full max-w-2xl">
        {/* Header - Same as auth pages */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-4 focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
            <EsoLogo className="h-16 w-auto mx-auto" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.25em] text-white mb-3 uppercase">
            Privacy Policy
          </h1>
          <p className="text-xs tracking-[0.2em] text-white/50 uppercase">
            How We Protect Your Data • v2024
          </p>
        </div>

        {/* Main Content Card - Transparent */}
        <div className="border border-white/15 rounded-lg p-8" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)' }}>
          
          {/* Last Updated */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 rounded-full bg-white/5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span className="text-xs text-white/60 tracking-wider">
                Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Minimal Content */}
          <div className="space-y-8 text-center">
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
              <div key={index} className="py-6">
                <h3 className="text-sm font-medium tracking-wider uppercase text-white/90 mb-3">
                  {section.title}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed max-w-lg mx-auto">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-12 pt-8 text-center">
            <p className="text-xs text-white/50 mb-3">Questions?</p>
            <a 
              href="mailto:privacy@eso.app" 
              className="text-xs text-white/70 hover:text-white transition-colors tracking-wide"
            >
              privacy@eso.app
            </a>
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link 
              to="/" 
              className="text-xs text-white/50 hover:text-white/70 transition-colors tracking-wider uppercase"
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