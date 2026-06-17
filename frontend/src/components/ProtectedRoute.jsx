import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../features/authSlice';

/**
 * Protected Route Component
 * Redirects to entry warning if user is not authenticated
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector(selectAuth);

  // Redirect to landing page if not authenticated
  // Note: App.jsx handles initial session loading
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Render protected content
  return children;
}

export default ProtectedRoute;
