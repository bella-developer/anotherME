import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Privacy() {
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
        <h1 className="text-4xl font-bold mb-8 tracking-[0.2em] mt-12">PRIVACY POLICY</h1>
        <p className="text-white/60 mb-12 text-sm">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-8 text-white/80 leading-relaxed">
          <div>
            <h2 className="text-2xl font-semibold mb-4 tracking-wider">1. Information We Collect</h2>
            <p>We collect minimal information: username, password (encrypted), optional age range, and optional gender. We do not require email addresses for basic account creation.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 tracking-wider">2. How We Use Your Data</h2>
            <p>Your data is used solely to provide platform functionality: authentication, displaying your profile, and enabling community interactions.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 tracking-wider">3. Data Security</h2>
            <p>We employ industry-standard encryption for passwords and secure transmission protocols. However, no system is 100% secure—use a unique, strong password.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 tracking-wider">4. Cookies & Tracking</h2>
            <p>We use essential cookies for authentication and session management. No third-party tracking or advertising cookies are used.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 tracking-wider">5. Data Sharing</h2>
            <p>We do not sell, rent, or share your personal data with third parties. Your data stays within Eso's secure infrastructure.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 tracking-wider">6. Your Rights (GDPR/CCPA)</h2>
            <p>You have the right to access, modify, or delete your data. Contact us to exercise these rights. We comply with GDPR and CCPA regulations.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 tracking-wider">7. Account Deletion</h2>
            <p>You may delete your account at any time from your profile settings. This action is permanent and irreversible.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 tracking-wider">8. Changes to This Policy</h2>
            <p>We may update this policy. We'll notify users of significant changes via platform announcements.</p>
          </div>
        </section>

        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-white/60 text-sm">
            Privacy concerns? Reach out at <a href="mailto:privacy@eso.app" className="text-white underline">privacy@eso.app</a>
          </p>
        </div>
      </motion.main>
    </div>
  );
}

export default Privacy;
