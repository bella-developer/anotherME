import { Link } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';

function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Geist Mono', monospace" }}>
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md">
            <EsoLogo className="h-8 w-auto" />
          </Link>
          <Link 
            to="/" 
            className="text-xs text-white/60 hover:text-white transition-colors tracking-[0.15em] uppercase font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-3 border border-white/20 rounded-full bg-white/10 backdrop-blur-sm mb-8">
              <span className="text-xs text-white/80 tracking-[0.2em] uppercase font-medium">
                Legal Documentation
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-[0.1em] uppercase mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text">
              Privacy Policy
            </h1>
            <div className="max-w-2xl mx-auto">
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                Your privacy matters. Here's how we protect and handle your data with complete transparency.
              </p>
              <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/10 rounded-full bg-white/5">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-white/60 tracking-wider uppercase">
                  Last Updated: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Content Cards */}
          <div className="max-w-3xl mx-auto space-y-6 mb-20">
            {[
              {
                title: "Information We Collect",
                content: "We collect minimal information: username, password (encrypted), optional age range, and optional gender. We do not require email addresses for basic account creation."
              },
              {
                title: "How We Use Your Data",
                content: "Your data is used solely to provide platform functionality: authentication, displaying your profile, and enabling community interactions."
              },
              {
                title: "Data Security",
                content: "We employ industry-standard encryption for passwords and secure transmission protocols. However, no system is 100% secure—use a unique, strong password."
              },
              {
                title: "Cookies & Tracking", 
                content: "We use essential cookies for authentication and session management. No third-party tracking or advertising cookies are used."
              },
              {
                title: "Data Sharing",
                content: "We do not sell, rent, or share your personal data with third parties. Your data stays within ESO's secure infrastructure."
              },
              {
                title: "Your Rights",
                content: "You have the right to access, modify, or delete your data. Contact us to exercise these rights. We comply with GDPR and CCPA regulations."
              },
              {
                title: "Account Deletion",
                content: "You may delete your account at any time from your profile settings. This action is permanent and irreversible."
              },
              {
                title: "Changes to This Policy",
                content: "We may update this policy. We'll notify users of significant changes via platform announcements."
              }
            ].map((section, index) => (
              <div 
                key={index}
                className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                <h2 className="text-lg font-semibold tracking-wide uppercase mb-3 text-white/90">
                  {String(index + 1).padStart(2, '0')}. {section.title}
                </h2>
                <p className="text-white/70 leading-relaxed text-sm">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Contact */}
          <div className="border-t border-white/10 pt-12 text-center">
            <div className="inline-flex flex-col items-center gap-4 p-8 border border-white/10 rounded-lg bg-white/5">
              <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs tracking-wider text-white/60 uppercase mb-2">Privacy Concerns?</p>
                <a 
                  href="mailto:privacy@eso.app" 
                  className="text-white hover:text-white/80 transition-colors text-sm tracking-wide"
                >
                  privacy@eso.app
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Privacy;