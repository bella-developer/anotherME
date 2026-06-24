import { Link } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';

function Terms() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12" style={{ fontFamily: "'Geist Mono', monospace" }}>
      <div className="w-full max-w-2xl">
        {/* Header - Same as auth pages */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-4 focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
            <EsoLogo className="h-16 w-auto mx-auto" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.25em] text-white mb-3 uppercase">
            Terms of Service
          </h1>
          <p className="text-xs tracking-[0.2em] text-white/50 uppercase">
            Platform Guidelines • v2024
          </p>
        </div>

        {/* Main Content Card - Transparent */}
        <div className="border border-white/15 rounded-lg p-8" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)' }}>
          
          {/* Last Updated */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 rounded-full bg-white/5">
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
              <span className="text-xs text-white/60 tracking-wider">
                Effective: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Minimal Content */}
          <div className="space-y-8 text-center">
            {[
              {
                title: "Acceptance of Terms",
                content: "By using ESO, you agree to these terms. If you don't agree, please don't use the platform."
              },
              {
                title: "Community Guidelines",
                content: "ESO is for deep thinkers. Harassment, spam, or disruptive content is prohibited."
              },
              {
                title: "Content Ownership",
                content: "You own your posts. By posting, you grant ESO license to display your content within the platform."
              },
              {
                title: "Account Termination",
                content: "We reserve the right to terminate accounts that violate these terms or disrupt the community."
              },
              {
                title: "Platform Availability",
                content: "ESO is provided 'as is' without warranty. We don't guarantee error-free or continuous availability."
              },
              {
                title: "Changes to Terms",
                content: "We may update these terms. Continued use after changes constitutes acceptance."
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
            <p className="text-xs text-white/50 mb-3">Legal Questions?</p>
            <a 
              href="mailto:legal@eso.app" 
              className="text-xs text-white/70 hover:text-white transition-colors tracking-wide"
            >
              legal@eso.app
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

export default Terms;