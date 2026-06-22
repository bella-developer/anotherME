import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Terms() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-[0.3em]" style={{ fontFamily: "'Space Mono', monospace" }}>
            ESO
          </Link>
          <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors tracking-wider">
            BACK TO HOME
          </Link>
        </div>
      </nav>

      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-6 py-24"
      >
        <h1 className="text-4xl font-bold mb-8 tracking-[0.2em] mt-12">TERMS OF SERVICE</h1>
        <p className="text-white/60 mb-12 text-sm">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-8 text-white/80 leading-relaxed">
          <div>
            <h2 className="text-2xl font-semibold mb-4 tracking-wider">1. Acceptance of Terms</h2>
            <p>By accessing and using Eso, you accept and agree to be bound by these Terms of Service. If you do not agree, please discontinue use immediately.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 tracking-wider">2. User Conduct</h2>
            <p>Users must engage respectfully. Harassment, hate speech, spam, and illegal content are strictly prohibited. Violations may result in account suspension or termination.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 tracking-wider">3. Content Ownership</h2>
            <p>You retain ownership of content you post. By posting, you grant Eso a non-exclusive license to display and distribute your content on the platform.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 tracking-wider">4. Privacy & Data</h2>
            <p>Your privacy matters. We collect minimal data necessary for platform functionality. See our <Link to="/privacy" className="text-white underline">Privacy Policy</Link> for details.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 tracking-wider">5. Account Responsibility</h2>
            <p>You are responsible for maintaining the security of your account credentials. Choose a strong password and do not share your login information.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 tracking-wider">6. Limitation of Liability</h2>
            <p>Eso is provided "as is" without warranties. We are not liable for any damages arising from your use of the platform.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 tracking-wider">7. Changes to Terms</h2>
            <p>We reserve the right to modify these terms. Continued use after changes constitutes acceptance of updated terms.</p>
          </div>
        </section>

        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-white/60 text-sm">
            Questions? Contact us at <a href="mailto:support@eso.app" className="text-white underline">support@eso.app</a>
          </p>
        </div>
      </motion.main>
    </div>
  );
}

export default Terms;
