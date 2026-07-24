import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { getSession } from '../services/authService';

/**
 * Debug page to diagnose authentication issues
 * Navigate to /debug-auth to see this page
 */
function DebugAuth() {
  const { user, isAuthenticated, loading } = useAuth();
  const [sessionData, setSessionData] = useState(null);
  const [sessionError, setSessionError] = useState(null);

  useEffect(() => {
    // Fetch fresh session data from backend
    getSession()
      .then(data => {
        setSessionData(data);
        setSessionError(null);
      })
      .catch(err => {
        setSessionError(err);
      });
  }, []);

  const checkLocalStorage = () => {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      hasActiveSession: sessionStorage.getItem('hasActiveSession'),
    };
  };

  const forceRefresh = async () => {
    try {
      const data = await getSession();
      setSessionData(data);
      setSessionError(null);
      alert('Session refreshed! Check console for data.');
      console.log('Fresh session data:', data);
    } catch (err) {
      setSessionError(err);
      alert('Session refresh failed: ' + err.message);
    }
  };

  const clearAuth = () => {
    localStorage.clear();
    sessionStorage.clear();
    alert('Auth cleared! Reload the page.');
  };

  const localData = checkLocalStorage();

  return (
    <div style={{ 
      padding: '40px',
      fontFamily: 'monospace',
      background: '#0a0a0a',
      color: '#ffffff',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#FF9D1C' }}>🔍 Auth Debug Page</h1>
      
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ color: '#2EE6FF' }}>Redux State (from useAuth hook)</h2>
        <pre style={{ 
          background: '#1a1a1a', 
          padding: '20px', 
          borderRadius: '8px',
          overflow: 'auto'
        }}>
          {JSON.stringify({ user, isAuthenticated, loading }, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2 style={{ color: '#2EE6FF' }}>LocalStorage / SessionStorage</h2>
        <pre style={{ 
          background: '#1a1a1a', 
          padding: '20px', 
          borderRadius: '8px',
          overflow: 'auto'
        }}>
          {JSON.stringify(localData, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2 style={{ color: '#2EE6FF' }}>Fresh Session from Backend</h2>
        {sessionData && (
          <pre style={{ 
            background: '#1a1a1a', 
            padding: '20px', 
            borderRadius: '8px',
            overflow: 'auto',
            color: '#00ff00'
          }}>
            {JSON.stringify(sessionData, null, 2)}
          </pre>
        )}
        {sessionError && (
          <pre style={{ 
            background: '#1a1a1a', 
            padding: '20px', 
            borderRadius: '8px',
            overflow: 'auto',
            color: '#ff0000'
          }}>
            {JSON.stringify(sessionError, null, 2)}
          </pre>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2 style={{ color: '#B56DFF' }}>Actions</h2>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button
            onClick={forceRefresh}
            style={{
              background: '#2EE6FF',
              color: '#0a0a0a',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Force Refresh Session
          </button>
          <button
            onClick={clearAuth}
            style={{
              background: '#ff4444',
              color: '#ffffff',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Clear All Auth Data
          </button>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2 style={{ color: '#B56DFF' }}>Diagnostics</h2>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>Has Access Token:</strong> {localData.accessToken ? '✅ Yes' : '❌ No'}
          </li>
          <li>
            <strong>Has Refresh Token:</strong> {localData.refreshToken ? '✅ Yes' : '❌ No'}
          </li>
          <li>
            <strong>Is Authenticated (Redux):</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
          </li>
          <li>
            <strong>User Object Exists:</strong> {user ? '✅ Yes' : '❌ No'}
          </li>
          <li>
            <strong>User has Role Field:</strong> {user?.role ? `✅ Yes (${user.role})` : '❌ No'}
          </li>
          <li>
            <strong>Is Admin:</strong> {user?.role === 'admin' ? '✅ Yes' : '❌ No'}
          </li>
        </ul>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#1a1a1a', borderRadius: '8px' }}>
        <h3 style={{ color: '#FF9D1C' }}>💡 Instructions</h3>
        <ol style={{ lineHeight: '2' }}>
          <li>If "User has Role Field" shows ❌, the backend still has old code or you need to refresh session</li>
          <li>Click "Force Refresh Session" to get fresh data from backend</li>
          <li>If role still missing, click "Clear All Auth Data" and log in again</li>
          <li>Check the "Fresh Session from Backend" section to see what the server returns</li>
        </ol>
      </div>
    </div>
  );
}

export default DebugAuth;
