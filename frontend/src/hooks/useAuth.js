import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  register as registerAction,
  getSession as getSessionAction,
  logout as logoutAction,
  clearError,
  clearUser,
} from '../features/authSlice';

/**
 * useAuth Hook
 * Provides authentication state and actions
 * Handles session restoration on mount
 * Implements Requirements: 2.3
 */
export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  /**
   * Initialize auth state from session on mount
   */
  useEffect(() => {
    // Only attempt to restore session if not already authenticated
    if (!isAuthenticated && !loading) {
      dispatch(getSessionAction());
    }
  }, []); // Run once on mount

  /**
   * Register a new anonymous user
   * @param {Object} registrationData - Optional age and gender
   * @returns {Promise}
   */
  const register = useCallback(
    async (registrationData = {}) => {
      return dispatch(registerAction(registrationData));
    },
    [dispatch]
  );

  /**
   * Get current session user
   * @returns {Promise}
   */
  const getSession = useCallback(async () => {
    return dispatch(getSessionAction());
  }, [dispatch]);

  /**
   * Logout user
   * @returns {Promise}
   */
  const logout = useCallback(async () => {
    return dispatch(logoutAction());
  }, [dispatch]);

  /**
   * Clear authentication error
   */
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    auth,
    user,
    isAuthenticated,
    loading,
    error,

    // Actions
    register,
    getSession,
    logout,
    clearError: clearAuthError,
  };
}

export default useAuth;
