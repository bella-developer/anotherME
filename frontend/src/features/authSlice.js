import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../services/authService';

/**
 * Auth Redux Slice
 * Manages authentication state with server-side sessions
 * No token storage - sessions managed via HttpOnly cookies
 * Implements Requirements: 1.1, 2.3, 2.4
 */

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false, // Start as false - only set to true when actually loading
  error: null,
  sessionChecked: false, // Track if initial session check is done
  hasActiveSession: sessionStorage.getItem('hasActiveSession') === 'true', // Persist session flag across refreshes
};

// Async thunks

/**
 * Register a new anonymous user
 * @param {Object} registrationData - Registration data
 * @returns {Promise<Object>} User data
 */
export const register = createAsyncThunk(
  'auth/register',
  async (registrationData, { rejectWithValue }) => {
    try {
      const response = await authService.register(registrationData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Login user with username and password
 * @param {Object} loginData - Login credentials
 * @returns {Promise<Object>} User data
 */
export const login = createAsyncThunk(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await authService.login(loginData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Get current session user
 * @returns {Promise<Object>} User data
 */
export const getSession = createAsyncThunk(
  'auth/getSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getSession();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Logout user by destroying session
 * @returns {Promise<void>}
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Set user (used for session restoration)
    setUser: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
    },
    // Clear user (used for logout)
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.sessionChecked = true;
        state.hasActiveSession = true;
        state.error = null;
        // Persist session flag
        sessionStorage.setItem('hasActiveSession', 'true');
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: 'Registration failed',
          code: 'REGISTRATION_ERROR',
        };
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.sessionChecked = true;
        state.hasActiveSession = true;
        state.error = null;
        // Persist session flag
        sessionStorage.setItem('hasActiveSession', 'true');
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: 'Login failed',
          code: 'LOGIN_ERROR',
        };
      });

    // Get session
    builder
      .addCase(getSession.pending, (state) => {
        // Only show loading if session hasn't been checked yet
        if (!state.sessionChecked) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(getSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.sessionChecked = true;
        state.hasActiveSession = true;
        state.error = null;
        // Persist session flag
        sessionStorage.setItem('hasActiveSession', 'true');
      })
      .addCase(getSession.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.sessionChecked = true;
        state.hasActiveSession = false;
        // Clear session flag
        sessionStorage.removeItem('hasActiveSession');
        // Don't set error for silent rejections (initial session check on public pages)
        if (!action.payload?.silent) {
          state.error = action.payload || {
            message: 'Session retrieval failed',
            code: 'SESSION_ERROR',
          };
        }
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.hasActiveSession = false;
        state.error = null;
        // Clear session flag
        sessionStorage.removeItem('hasActiveSession');
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        // Even if logout fails on server, clear local state
        state.user = null;
        state.isAuthenticated = false;
        state.hasActiveSession = false;
        state.error = action.payload || {
          message: 'Logout failed',
          code: 'LOGOUT_ERROR',
        };
        // Clear session flag
        sessionStorage.removeItem('hasActiveSession');
      });
  },
});

// Export actions
export const { clearError, setUser, clearUser } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Export reducer
export default authSlice.reducer;
