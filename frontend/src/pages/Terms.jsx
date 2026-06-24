import { Link } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';

function Terms() {
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
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-24">
            <Link to="/" className="inline-block mb-8 focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
              <EsoLogo className="h-24 w-auto mx-auto" />
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold tracking-[0.3em] text-white mb-6 uppercase">
              Terms of Service
            </h1>
            <p className="text-lg tracking-[0.2em] text-white/70 uppercase mb-6">
              Platform Guidelines
            </p>
            <div className="text-sm text-white/50 tracking-wider">
              Effective: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-20 max-w-3xl mx-auto">
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
              <div key={index} className="text-center">
                <h2 className="text-2xl font-semibold tracking-[0.3em] uppercase text-white mb-8">
                  {section.title}
                </h2>
                <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="text-center mt-24">
            <h2 className="text-2xl font-semibold tracking-[0.3em] uppercase text-white mb-8">Legal Questions?</h2>
            <a 
              href="mailto:legal@eso.app" 
              className="text-white/80 hover:text-white transition-colors tracking-wide text-xl"
            >
              legal@eso.app
            </a>
          </div>

          {/* Back Link */}
          <div className="text-center mt-20">
            <Link 
              to="/" 
              className="text-white/60 hover:text-white/80 transition-colors tracking-wider uppercase text-base"
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