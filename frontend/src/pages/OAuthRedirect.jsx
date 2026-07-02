import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * OAuth Redirect Loading Page
 * Minimal loading while redirecting to OAuth provider
 */
function OAuthRedirect() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const action = searchParams.get('action') || 'login';
    const apiUrl = import.meta.env.VITE_API_URL || 'https://anotherme-backend.onrender.com';
    
    // Redirect immediately (backend stays awake now)
    window.location.href = `${apiUrl}/api/auth/google?action=${action}`;
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <p className="text-white/60 text-sm">...</p>
      </div>
    </div>
  );
}

export default OAuthRedirect;
