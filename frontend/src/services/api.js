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
  withCredentials: true, // Send cookies with requests
});

// Request interceptor - Log requests in development
apiClient.interceptors.request.use(
  (config) => {
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
      console.error('Invalid response structure received');
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
    // Handle 401 Unauthorized - session expired
    if (error.response?.status === 401) {
      // Session expired, redirect to register page
      window.location.href = '/register';
      return Promise.reject(error);
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
      // Request made but no response received
      return Promise.reject({
        message: 'No response from server. Please check your connection.',
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
