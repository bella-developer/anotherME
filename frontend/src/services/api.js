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

// Track if we're currently refreshing the token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Response interceptor - Handle errors with automatic token refresh
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
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if we're on a public page (login/register)
      const isPublicPage = window.location.pathname === '/login' || 
                          window.location.pathname === '/register' ||
                          window.location.pathname === '/';
      
      // Don't try to refresh on public pages
      if (isPublicPage) {
        return Promise.reject({
          message: 'Authentication required',
          code: 'UNAUTHORIZED',
          status: 401,
          silent: true, // Flag to suppress error display
        });
      }
      
      // Try to refresh the token
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        // No refresh token available - redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject({
          message: 'Session expired. Please log in again.',
          code: 'SESSION_EXPIRED',
          status: 401,
        });
      }
      
      if (isRefreshing) {
        // Already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );
        
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
        
        // Store new tokens
        localStorage.setItem('accessToken', newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        
        // Update header for original request
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        
        // Process queued requests
        processQueue(null, newAccessToken);
        
        isRefreshing = false;
        
        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        processQueue(refreshError, null);
        isRefreshing = false;
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        
        return Promise.reject({
          message: 'Session expired. Please log in again.',
          code: 'REFRESH_FAILED',
          status: 401,
        });
      }
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
