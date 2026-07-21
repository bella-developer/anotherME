import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { login, clearError, selectAuth } from '../features/authSlice';
import EsoLogo from '../components/EsoLogo';
import GoogleSignInButton from '../components/GoogleSignInButton';
import IntrovertsBg from '../components/IntrovertsBg';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * Login Page - Dark Glassmorphic Design with Cosmic Nebula Background
 * Secure authentication with comprehensive security measures
 */
function Login() {
  usePageTitle('Sign In');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(selectAuth);
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [oauthError, setOauthError] = useState('');

  useEffect(() => {
    // Check for OAuth error in URL
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setOauthError(decodeURIComponent(errorParam));
      // Clear the error from URL after 10 seconds
      setTimeout(() => setOauthError(''), 10000);
    }
  }, [searchParams]);

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <IntrovertsBg />
      </div>
      
      {/* Light Overlay - Starfield Visible */}
      <div className="absolute inset-0 z-10 bg-black/15 backdrop-blur-sm" />
      
      <div className="relative z-20 w-full max-w-md px-4 py-4 mx-auto">
        {/* Header */}
        <div className="text-center mb-2.5">
          <Link to="/" className="inline-block mb-1 focus:outline-none focus:ring-2 focus:ring-white/50 rounded transform hover:scale-105 transition-transform duration-300">
            <EsoLogo className="h-12 w-auto mx-auto" />
          </Link>
          <h1 className={`text-xl md:text-2xl font-light tracking-[0.25em] mb-1 uppercase ${'text-white'}`}>
            Sign In
          </h1>
          <p className={`text-[0.65rem] tracking-[0.2em] uppercase ${'text-white/40'}`}>
            Continue Your Journey
          </p>
        </div>

        {/* Login Card */}
        <div className="border border-white/10 rounded-lg p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(16px)' }}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="username" className={`block text-[0.7rem] tracking-[0.15em] mb-1.5 uppercase font-bold ${'text-white/70'}`}>
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
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-white placeholder-white/20 focus:outline-none focus:border-white/25 transition-colors text-sm tracking-wide"
                placeholder="enter username"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className={`block text-[0.7rem] tracking-[0.15em] mb-1.5 uppercase font-bold ${'text-white/70'}`}>
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
                  className="w-full px-3 py-2 pr-10 bg-black/50 border border-white/10 rounded text-white placeholder-white/20 focus:outline-none focus:border-white/25 transition-colors text-sm tracking-wide"
                  placeholder="enter password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* OAuth Error Message */}
            {oauthError && (
              <div className="border border-yellow-500/25 rounded p-2.5 bg-yellow-500/5">
                <p className="text-[0.65rem] text-yellow-400 tracking-wide uppercase">
                  {oauthError}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="border border-red-500/25 rounded p-2.5 bg-red-500/5">
                <p className="text-[0.65rem] text-red-400 tracking-wide uppercase">
                  Invalid username or password
                </p>
                {error.code === 'ACCOUNT_LOCKED' && (
                  <p className="text-[0.6rem] text-red-400/70 mt-1">
                    Account locked for 24 hours
                  </p>
                )}
              </div>
            )}

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link to="/forgot-password" className={`text-[0.65rem] transition-colors tracking-wide ${'text-white/50 hover:text-white/80'}`}>
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full py-2 bg-white/10 hover:bg-white/15 disabled:bg-white/5 disabled:cursor-not-allowed text-white font-medium rounded transition-colors text-[0.7rem] tracking-[0.15em] uppercase border border-white/15"
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

          {/* Divider */}
          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-white/10"></div>
            <span className={`px-3 text-[0.6rem] tracking-wider ${'text-white/30'}`}>or</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          {/* Google Sign In */}
          <GoogleSignInButton text="Sign in with Google" action="login" />

          {/* Register Link */}
          <div className="mt-3 pt-3 border-t border-white/10 text-center">
            <p className={`text-[0.65rem] tracking-wide ${'text-white/40'}`}>
              Don't have an account?{' '}
              <Link to="/register" className={`transition-colors uppercase tracking-wider ${'text-white/75 hover:text-white'}`}>
                Create One
              </Link>
            </p>
          </div>
        </div>

        {/* Privacy Link */}
        <div className="mt-3 text-center">
          <p className={`text-[0.65rem] ${'text-white/40'}`}>
            Read our <Link to="/privacy" className={`underline ${'hover:text-white/70'}`}>Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
