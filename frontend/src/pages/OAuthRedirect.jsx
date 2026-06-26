import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';

/**
 * OAuth Redirect Loading Page
 * Shows a professional loading screen while redirecting to OAuth provider
 * Hides backend URL from users
 */
function OAuthRedirect() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const action = searchParams.get('action') || 'login';
    const apiUrl = import.meta.env.VITE_API_URL || 'https://anotherme-backend.onrender.com';
    
    // Small delay to show loading state, then redirect
    const timer = setTimeout(() => {
      window.location.href = `${apiUrl}/api/auth/google?action=${action}`;
    }, 800);

    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center animate-fadeIn">
        <EsoLogo className="h-20 w-auto mx-auto mb-8 animate-pulse" />
        
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <p className="text-white/60 text-sm tracking-wider uppercase">
          Redirecting to Google
        </p>
      </div>
    </div>
  );
}

export default OAuthRedirect;
