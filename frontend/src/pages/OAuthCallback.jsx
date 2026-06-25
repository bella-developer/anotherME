import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/authSlice';
import * as authService from '../services/authService';

/**
 * OAuth Callback Handler
 * Receives tokens from OAuth redirect and stores them
 */
function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get tokens from URL
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');

        if (!accessToken) {
          console.error('No access token in callback');
          navigate('/login', { replace: true });
          return;
        }

        // Store tokens
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }

        // Get user session
        const response = await authService.getSession();
        
        // Update Redux state
        dispatch(setUser({ user: response.user }));

        // Redirect to home
        navigate('/home', { replace: true });
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60 text-sm tracking-wider uppercase">Completing sign in...</p>
      </div>
    </div>
  );
}

export default OAuthCallback;
