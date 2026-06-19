import axios from 'axios';

// Get API base URL from environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Send cookies with requests (backwards compatibility)
});

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Get access token from localStorage
    const accessToken = localStorage.getItem('accessToken');
    
    // Add Authorization header if token exists
    if (accessToken) {
      // Ensure headers object exists
      if (!config.headers) {
        config.headers = {};
      }
      // Set Authorization header (use lowercase for consistency)
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      // No token available - silent for security
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    // Validate response structure (defensive programming)
    if (!response || typeof response !== 'object') {
      // Invalid response structure
      return Promise.reject({
        message: 'Invalid response from server',
        code: 'INVALID_RESPONSE',
        status: 0,
      });
    }
    
    // Return successful response
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized - DO NOT auto-redirect on public pages
    // Let the calling code handle 401 errors appropriately
    if (error.response?.status === 401) {
      // Check if we're on a public page (login/register)
      const isPublicPage = window.location.pathname === '/login' || 
                          window.location.pathname === '/register' ||
                          window.location.pathname === '/';
      
      // Don't show error messages on public pages during initial session check
      if (isPublicPage) {
        return Promise.reject({
          message: 'Authentication required',
          code: 'UNAUTHORIZED',
          status: 401,
          silent: true, // Flag to suppress error display
        });
      }
      
      // For protected pages, show authentication error
      return Promise.reject({
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
        status: 401,
      });
    }
    
    // Handle other errors
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || 'An error occurred';
      const errorCode = error.response.data?.code || 'UNKNOWN_ERROR';
      
      return Promise.reject({
        message: errorMessage,
        code: errorCode,
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // Request made but no response received - don't show on public pages
      const isPublicPage = window.location.pathname === '/login' || 
                          window.location.pathname === '/register' ||
                          window.location.pathname === '/';
      
      return Promise.reject({
        message: isPublicPage ? 'Unable to connect' : 'No response from server. Please check your connection.',
        code: 'NETWORK_ERROR',
        status: 0,
      });
    } else {
      // Error in request setup
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        code: 'REQUEST_ERROR',
        status: 0,
      });
    }
  }
);

export default apiClient;
