import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { selectAuth, getSession } from '../features/authSlice';
import LoadingSpinner from './LoadingSpinner';
import EsoPassCard from './EsoPassCard';

/**
 * Protected Route Component
 * Checks session and redirects to landing if user is not authenticated.
 * Token-based permission: permits user when paid.
 */
function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, sessionChecked, hasActiveSession } = useSelector(selectAuth);
  const { isPatron } = useSelector((state) => state.sanctuary || {});

  const hasPaidPass = isPatron || Boolean(localStorage.getItem('eso_pass_token')) || localStorage.getItem('eso_sanctuary_patron') === 'true';

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

  // Permit user when user pays
  if (isAuthenticated && !hasPaidPass) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black/90">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-lg uppercase tracking-[0.2em] font-mono text-white mb-1">
              ESO Pass Required
            </h2>
            <p className="text-xs text-white/50 font-sans">
              Access is permitted upon ESO Pass payment.
            </p>
          </div>
          <EsoPassCard onPermitSuccess={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  // Render protected content
  return children;
}

export default ProtectedRoute;
