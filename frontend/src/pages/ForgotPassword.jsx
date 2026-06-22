import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement password reset API call
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light tracking-[0.25em] text-white mb-3 uppercase">
            Reset Password
          </h1>
          <p className="text-xs tracking-[0.2em] text-white/70 uppercase">
            Recover Your Account
          </p>
        </div>

        {submitted ? (
          <div className="border border-white/15 rounded-lg p-8 text-center" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)' }}>
            <svg className="w-16 h-16 mx-auto mb-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2 className="text-xl font-semibold mb-3 tracking-wider">Check Your Email</h2>
            <p className="text-white/60 text-sm mb-6">
              If an account exists with {email}, you'll receive password reset instructions shortly.
            </p>
            <Link to="/login" className="inline-block px-6 py-3 bg-white text-black font-semibold tracking-wider uppercase text-sm hover:bg-white/90 transition-all">
              Back to Login
            </Link>
          </div>
        ) : (
          <div className="border border-white/15 rounded-lg p-8" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)' }}>
            <p className="text-white/60 text-sm mb-6 text-center">
              Note: Password recovery requires an email on file. If you didn't provide an email during registration, please contact support.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-xs tracking-[0.15em] text-white/55 mb-2 uppercase">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-white/15 bg-white/5 rounded text-white placeholder-white/25 focus:outline-none focus:border-white/30 transition-colors text-sm tracking-wide"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-white hover:bg-white/90 text-black font-medium rounded transition-colors text-sm tracking-[0.15em] uppercase"
              >
                Send Reset Link
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-white/60 tracking-wide">
                Remember your password?{' '}
                <Link to="/login" className="text-white hover:text-white/80 transition-colors uppercase tracking-wider">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
