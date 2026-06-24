import { Link } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';

function Terms() {
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
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-[0.2em] uppercase mb-4">
              Terms of Service
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full bg-white/5">
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
              <span className="text-xs text-white/60 tracking-wider uppercase">
                Effective: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>

          {/* Content Cards */}
          <div className="space-y-8 mb-16">
            {[
              {
                title: "Acceptance of Terms",
                content: "By accessing and using ESO, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, you should not use the platform."
              },
              {
                title: "Use License",
                content: "Permission is granted to temporarily create an account and participate in ESO for personal, non-commercial use only. This is the grant of a license, not a transfer of title."
              },
              {
                title: "Community Guidelines",
                content: "ESO is a space for deep thinkers and meaningful conversations. Harassment, spam, hate speech, or content that disrupts the contemplative atmosphere is prohibited."
              },
              {
                title: "Content Ownership", 
                content: "You retain ownership of content you post. By posting, you grant ESO a license to display and distribute your content within the platform. You are responsible for your content."
              },
              {
                title: "Account Termination",
                content: "ESO reserves the right to terminate accounts that violate these terms or disrupt the community. You may also delete your account at any time."
              },
              {
                title: "Intellectual Property",
                content: "The ESO platform, design, and original content are protected by copyright and other intellectual property laws. Unauthorized use is prohibited."
              },
              {
                title: "Disclaimers",
                content: "ESO is provided 'as is' without warranty of any kind. We do not guarantee the platform will be error-free or continuously available."
              },
              {
                title: "Limitation of Liability",
                content: "ESO shall not be liable for any damages arising from the use or inability to use the platform, including but not limited to direct, indirect, or consequential damages."
              },
              {
                title: "Governing Law",
                content: "These terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through appropriate legal channels."
              },
              {
                title: "Changes to Terms",
                content: "ESO reserves the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms."
              }
            ].map((section, index) => (
              <div 
                key={index}
                className="border border-white/10 rounded-lg p-8 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
              >
                <h2 className="text-xl font-semibold tracking-wider uppercase mb-4 text-white">
                  {String(index + 1).padStart(2, '0')}. {section.title}
                </h2>
                <p className="text-white/80 leading-relaxed text-sm">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs tracking-wider text-white/60 uppercase mb-2">Legal Questions?</p>
                <a 
                  href="mailto:legal@eso.app" 
                  className="text-white hover:text-white/80 transition-colors text-sm tracking-wide"
                >
                  legal@eso.app
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Terms;