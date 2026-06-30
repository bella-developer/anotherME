import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { selectAuth, getSession } from '../features/authSlice';
import LoadingSpinner from './LoadingSpinner';

/**
 * Protected Route Component
 * Checks session and redirects to landing if user is not authenticated
 */
function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, sessionChecked, hasActiveSession } = useSelector(selectAuth);

  // Check session on mount of protected route
  useEffect(() => {
    if (!sessionChecked) {
      dispatch(getSession());
    }
  }, [dispatch, sessionChecked]);

  // Show loading while checking session (only if we think there's a session)
  if (!sessionChecked && (loading || hasActiveSession)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirect to landing page if not authenticated and session check is complete
  if (!isAuthenticated && sessionChecked) {
    return <Navigate to="/" replace />;
  }

  // Render protected content
  return children;
}

export default ProtectedRoute;
