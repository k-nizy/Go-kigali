/**
 * Authentication Context Provider
 * Manages user authentication state and provides auth methods
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, setAccessToken, clearAccessToken } from '../services/authApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Initialize auth state on mount
   * Attempt silent refresh to restore session
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Set a timeout to ensure loading doesn't hang
        const timeoutId = setTimeout(() => {
          setLoading(false);
        }, 2000);

        // Skip auth refresh for simple app - not needed
        setUser(null);
        setIsAuthenticated(false);
      } catch (error) {
        // Silent fail - user not authenticated
        console.log('No active session');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Listen for logout events from interceptor
   */
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
      clearAccessToken();
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (email, password, name) => {
    try {
      const response = await authService.register(email, password, name);
      toast.success('Registration successful! Please check your email to verify your account.');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.errors?.email?.[0] ||
                     error.response?.data?.errors?.password?.[0] ||
                     'Registration failed';
      toast.error(message);
      throw error;
    }
  }, []);

  /**
   * Sign in user
   */
  const signIn = useCallback(async (email, password, remember = false) => {
    try {
      const response = await authService.login(email, password, remember);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('Welcome back!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  }, []);

  /**
   * Sign out user
   */
  const signOut = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error) {
      // Still clear local state even if API call fails
      setUser(null);
      setIsAuthenticated(false);
      console.error('Logout error:', error);
    }
  }, []);

  /**
   * Request password reset
   */
  const requestPasswordReset = useCallback(async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      toast.success('Password reset instructions sent to your email');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      throw error;
    }
  }, []);

  /**
   * Reset password with token
   */
  const resetPassword = useCallback(async (token, password) => {
    try {
      const response = await authService.resetPassword(token, password);
      toast.success('Password reset successful! You can now log in.');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.errors?.password?.[0] ||
                     'Password reset failed';
      toast.error(message);
      throw error;
    }
  }, []);

  /**
   * Verify email with token
   */
  const verifyEmail = useCallback(async (token) => {
    try {
      const response = await authService.verifyEmail(token);
      toast.success('Email verified successfully! You can now log in.');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Email verification failed';
      toast.error(message);
      throw error;
    }
  }, []);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    signIn,
    signOut,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
