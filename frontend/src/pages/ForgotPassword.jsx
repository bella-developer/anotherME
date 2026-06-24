import { useState } from 'react';
import { Link } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://anotherme-backend.onrender.com'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Failed to send reset email');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-black text-white" style={{ fontFamily: "'Geist Mono', monospace" }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <EsoLogo className="h-16 w-auto mx-auto" />
            </Link>
          </div>

          <div className="border border-white/15 rounded-lg p-8 bg-white/5 backdrop-blur-sm text-center">
            <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h1 className="text-xl font-semibold tracking-wider uppercase mb-4">
              Check Your Email
            </h1>
            <p className="text-white/60 text-sm mb-4 leading-relaxed">
              If an account exists with
            </p>
            <div className="text-white text-sm font-mono mb-6 px-3 py-2 border border-white/10 rounded bg-white/5">
              {email}
            </div>
            <p className="text-white/60 text-sm mb-8 leading-relaxed">
              you'll receive password reset instructions shortly.
            </p>
            
            <Link 
              to="/login" 
              className="inline-block px-6 py-3 bg-white text-black font-semibold tracking-wider uppercase text-xs hover:bg-white/90 transition-all rounded"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black text-white" style={{ fontFamily: "'Geist Mono', monospace" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4 focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
            <EsoLogo className="h-16 w-auto mx-auto" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.25em] text-white mb-3 uppercase">
            Reset Password
          </h1>
          <p className="text-xs tracking-[0.2em] text-white/50 uppercase">
            Recover Your Account
          </p>
        </div>

        <div className="border border-white/15 rounded-lg p-8" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)' }}>
          {error && (
            <div className="border border-red-500/30 rounded-lg p-4 mb-6 bg-red-500/10">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-red-400 tracking-wide uppercase">{error}</p>
              </div>
            </div>
          )}
          
          <div className="mb-6 p-4 border border-white/10 rounded bg-white/5">
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-white/60 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-white/60 text-xs leading-relaxed">
                <strong className="text-white/80">Note:</strong> Password recovery requires an email on file. If you didn't provide an email during registration, please contact support.
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[0.7rem] tracking-[0.15em] text-white/80 mb-2 uppercase">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 glass border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors text-sm tracking-wide"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white hover:bg-white/90 disabled:bg-white/20 disabled:cursor-not-allowed text-black font-medium rounded transition-colors text-sm tracking-[0.15em] uppercase"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-white/60 tracking-wide">
              Remember your password?{' '}
              <Link to="/login" className="text-white hover:text-white/80 transition-colors uppercase tracking-wider">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;