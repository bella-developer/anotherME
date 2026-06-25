import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError, selectAuth } from '../features/authSlice';
import EsoLogo from '../components/EsoLogo';

/**
 * Login Page - Dark Glassmorphic Design with Cosmic Nebula Background
 * Secure authentication with comprehensive security measures
 */
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(selectAuth);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;

    try {
      await dispatch(login(formData)).unwrap();
      navigate('/home', { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const isFormValid = formData.username.trim() && formData.password;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-black">
      <div className="relative z-10 w-full max-w-md animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4 focus:outline-none focus:ring-2 focus:ring-white/50 rounded transform hover:scale-105 transition-transform duration-300">
            <EsoLogo className="h-16 w-auto mx-auto" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.25em] text-white mb-3 uppercase animate-slideUp">
            Sign In
          </h1>
          <p className="text-xs tracking-[0.2em] text-white/50 uppercase animate-slideUp" style={{ animationDelay: '0.1s' }}>
            Continue Your Journey
          </p>
        </div>

        {/* Login Card - Dark Glassmorphic */}
        <div className="border border-white/15 rounded-lg p-8 animate-slideUp" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', animationDelay: '0.2s' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-[0.7rem] tracking-[0.15em] text-white/80 mb-2 uppercase">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 glass border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors text-sm tracking-wide"
                placeholder="enter username"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[0.7rem] tracking-[0.15em] text-white/80 mb-2 uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 glass border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors text-sm tracking-wide"
                  placeholder="enter password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="glass-dark border border-red-500/30 rounded p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs text-red-400 tracking-wide uppercase">
                      Invalid username or password
                    </p>
                    {error.code === 'ACCOUNT_LOCKED' && (
                      <p className="text-xs text-red-400/70 mt-2">
                        Account locked for 24 hours due to multiple failed attempts
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-white/60 hover:text-white transition-colors tracking-wide">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full py-3.5 bg-white/90 hover:bg-white disabled:bg-white/20 disabled:cursor-not-allowed text-black font-medium rounded transition-colors text-sm tracking-[0.15em] uppercase shadow-lg"
              aria-label="Sign in to your account"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing In
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-white/60 tracking-wide">
              Don't have an account?{' '}
              <Link to="/register" className="text-white hover:text-white/80 transition-colors uppercase tracking-wider">
                Create One
              </Link>
            </p>
          </div>
        </div>

        {/* Privacy Link */}
        <div className="mt-8 text-center">
          <p className="text-xs text-white/50">
            Read our <Link to="/privacy" className="underline hover:text-white">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
