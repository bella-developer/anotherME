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

        // Store tokens synchronously
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }

        // Small delay to ensure localStorage is persisted
        await new Promise(resolve => setTimeout(resolve, 100));

        // Verify tokens are stored
        const storedToken = localStorage.getItem('accessToken');
        if (!storedToken) {
          console.error('Failed to store access token');
          navigate('/login', { replace: true });
          return;
        }

        // Get user session (will now include token in header)
        const response = await authService.getSession();
        
        // Update Redux state
        dispatch(setUser({ user: response.user }));

        // Redirect to home
        navigate('/home', { replace: true });
      } catch (error) {
        console.error('OAuth callback error:', error);
        // Clear tokens on error
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login?error=' + encodeURIComponent('Authentication failed. Please try again.'), { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <p className="text-white/60 text-sm">...</p>
      </div>
    </div>
  );
}

export default OAuthCallback;
