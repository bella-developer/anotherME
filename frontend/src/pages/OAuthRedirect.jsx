import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EsoLogo from '../components/EsoLogo';

/**
 * OAuth Redirect Loading Page
 * Shows a professional loading screen while redirecting to OAuth provider
 * Hides backend URL and Render cold start from users
 */
function OAuthRedirect() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Preparing...');

  useEffect(() => {
    const action = searchParams.get('action') || 'login';
    const apiUrl = import.meta.env.VITE_API_URL || 'https://anotherme-backend.onrender.com';
    
    // Update status messages
    const statusTimer1 = setTimeout(() => setStatus('Connecting...'), 1000);
    const statusTimer2 = setTimeout(() => setStatus('Almost ready...'), 3000);
    
    // Ping backend first to wake it up if needed
    const wakeUpBackend = async () => {
      try {
        // Try to ping the health endpoint first
        await fetch(`${apiUrl}/api/health`, { method: 'HEAD' });
      } catch (error) {
        // Backend might be cold starting, that's okay
        console.log('Backend warming up...');
      }
      
      // Wait a bit then redirect
      setTimeout(() => {
        window.location.href = `${apiUrl}/api/auth/google?action=${action}`;
      }, 1500);
    };
    
    wakeUpBackend();

    return () => {
      clearTimeout(statusTimer1);
      clearTimeout(statusTimer2);
    };
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
        
        <p className="text-white/60 text-sm tracking-wider uppercase mb-2">
          {status}
        </p>
        <p className="text-white/30 text-xs tracking-wide">
          Setting up secure connection
        </p>
      </div>
    </div>
  );
}

export default OAuthRedirect;
