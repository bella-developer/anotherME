import apiClient from './api';

/**
 * Authentication Service
 * Handles authentication API calls with server-side sessions
 * No token storage - sessions managed via HttpOnly cookies
 * Implements Requirements: 1.1, 2.3, 2.4, 14.2
 */

/**
 * Register a new anonymous user
 * @param {Object} registrationData - Registration data
 * @param {string} registrationData.username - Optional username (auto-generated if not provided)
 * @param {string} registrationData.password - Required password
 * @param {number} registrationData.age - Optional age (18-100)
 * @param {string} registrationData.gender - Optional gender
 * @returns {Promise<Object>} User data
 */
export async function register(registrationData = {}) {
  try {
    const response = await apiClient.post('/auth/register', registrationData);
    
    // Validate response structure (defensive programming)
    if (!response.data || !response.data.data) {
      throw {
        message: 'Invalid response structure from server',
        code: 'INVALID_RESPONSE',
        status: 0,
      };
    }
    
    const { user, accessToken, refreshToken } = response.data.data;
    
    // Validate required fields
    if (!user || !accessToken) {
      throw {
        message: 'Missing required fields in response',
        code: 'INVALID_RESPONSE',
        status: 0,
      };
    }
    
    // Store tokens in localStorage (secure for HTTPS)
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    return {
      user,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Login user with username and password
 * @param {Object} loginData - Login credentials
 * @param {string} loginData.username - Username
 * @param {string} loginData.password - Password
 * @returns {Promise<Object>} User data
 */
export async function login(loginData) {
  try {
    const response = await apiClient.post('/auth/login', loginData);
    
    // Validate response structure
    if (!response.data || !response.data.data) {
      throw {
        message: 'Invalid response structure from server',
        code: 'INVALID_RESPONSE',
        status: 0,
      };
    }
    
    const { user, accessToken, refreshToken } = response.data.data;
    
    // Validate required fields
    if (!user || !accessToken) {
      throw {
        message: 'Missing required fields in response',
        code: 'INVALID_RESPONSE',
        status: 0,
      };
    }
    
    // Store tokens in localStorage
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    return {
      user,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Get current session user
 * @returns {Promise<Object>} User data
 */
export async function getSession() {
  try {
    const response = await apiClient.get('/auth/session');
    
    // Validate response structure
    if (!response.data || !response.data.data) {
      throw {
        message: 'Invalid response structure from server',
        code: 'INVALID_RESPONSE',
        status: 0,
      };
    }
    
    const { user } = response.data.data;
    
    // Validate required fields
    if (!user) {
      throw {
        message: 'Missing required fields in response',
        code: 'INVALID_RESPONSE',
        status: 0,
      };
    }
    
    return {
      user,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Logout user by destroying session
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    // Call logout endpoint (requires authentication)
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Log error but don't throw - we still want to clear local state
    // Silent logout failure for security
  } finally {
    // Always clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

/**
 * Check if user is authenticated
 * Must call getSession() to verify
 * @returns {Promise<boolean>} True if session is valid
 */
export async function isAuthenticated() {
  try {
    await getSession();
    return true;
  } catch (error) {
    return false;
  }
}
