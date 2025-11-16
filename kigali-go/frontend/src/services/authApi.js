/**
 * Authentication API service with token refresh and interceptors
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Create axios instance for auth
const authApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store for access token (in memory, not localStorage for security)
let accessToken = null;

// Flag to prevent multiple refresh attempts
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

/**
 * Set access token in memory
 */
export const setAccessToken = (token) => {
  accessToken = token;
};

/**
 * Get access token from memory
 */
export const getAccessToken = () => {
  return accessToken;
};

/**
 * Clear access token
 */
export const clearAccessToken = () => {
  accessToken = null;
};

// Request interceptor - add access token to headers
authApi.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh on 401
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If already refreshing, queue the request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return authApi(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Attempt to refresh token
      const response = await authApi.post('/api/auth/refresh');
      const newAccessToken = response.data.access_token;
      
      setAccessToken(newAccessToken);
      
      // Process queued requests
      processQueue(null, newAccessToken);
      
      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return authApi(originalRequest);
    } catch (refreshError) {
      // Refresh failed, clear token and redirect to login
      processQueue(refreshError, null);
      clearAccessToken();
      
      // Dispatch custom event for auth context to handle
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

/**
 * Auth API methods
 */
export const authService = {
  /**
   * Register new user
   */
  register: async (email, password, name) => {
    const response = await authApi.post('/api/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  },

  /**
   * Login user
   */
  login: async (email, password, remember = false) => {
    const response = await authApi.post('/api/auth/login', {
      email,
      password,
      remember,
    });
    
    // Store access token in memory
    if (response.data.access_token) {
      setAccessToken(response.data.access_token);
    }
    
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await authApi.post('/api/auth/logout');
    } catch (error) {
      // Even if logout fails, clear local token
      console.error('Logout error:', error);
    } finally {
      clearAccessToken();
    }
  },

  /**
   * Refresh access token
   */
  refresh: async () => {
    const response = await authApi.post('/api/auth/refresh');
    
    if (response.data.access_token) {
      setAccessToken(response.data.access_token);
    }
    
    return response.data;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    const response = await authApi.get('/api/auth/me');
    return response.data.user;
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token) => {
    const response = await authApi.get(`/api/auth/verify-email?token=${token}`);
    return response.data;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email) => {
    const response = await authApi.post('/api/auth/forgot-password', {
      email,
    });
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token, password) => {
    const response = await authApi.post('/api/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },
};

export default authApi;
