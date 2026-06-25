import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Invalid or missing reset token');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://anotherme-backend.onrender.com'}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-black text-white relative z-10" style={{ fontFamily: "'Geist Mono', monospace" }}>
        <div className="w-full max-w-md animate-fadeIn">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6 transform hover:scale-105 transition-transform duration-300">
              <EsoLogo className="h-16 w-auto mx-auto" />
            </Link>
          </div>

          <div className="border border-white/15 rounded-lg p-8 bg-white/5 backdrop-blur-sm text-center">
            <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-xl font-semibold tracking-wider uppercase mb-4">
              Password Reset Complete
            </h1>
            <p className="text-white/60 text-sm mb-8 leading-relaxed">
              Your password has been successfully reset. Redirecting to login in a few seconds...
            </p>
            
            <Link 
              to="/login" 
              className="inline-block px-6 py-3 bg-white text-black font-semibold tracking-wider uppercase text-xs hover:bg-white/90 transition-all rounded"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black text-white relative z-10" style={{ fontFamily: "'Geist Mono', monospace" }}>
      <div className="w-full max-w-md animate-fadeIn">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4 focus:outline-none focus:ring-2 focus:ring-white/50 rounded transform hover:scale-105 transition-transform duration-300">
            <EsoLogo className="h-16 w-auto mx-auto" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.25em] text-white mb-3 uppercase animate-slideUp">
            Set New Password
          </h1>
          <p className="text-xs tracking-[0.2em] text-white/50 uppercase animate-slideUp" style={{ animationDelay: '0.1s' }}>
            Choose a Strong Password
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
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[0.7rem] tracking-[0.15em] text-white/80 mb-2 uppercase">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors text-sm tracking-wide"
                placeholder="enter new password"
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-[0.7rem] tracking-[0.15em] text-white/80 mb-2 uppercase">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors text-sm tracking-wide"
                placeholder="confirm new password"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full py-3.5 bg-white/10 hover:bg-white/15 disabled:bg-white/5 disabled:cursor-not-allowed text-white font-medium rounded transition-colors text-sm tracking-[0.15em] uppercase border border-white/20"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;