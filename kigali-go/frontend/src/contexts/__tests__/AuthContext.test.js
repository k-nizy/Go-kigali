/**
 * AuthContext tests
 */
import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { authService } from '../../services/authApi';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('../../services/authApi');
jest.mock('react-hot-toast');

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authService.refresh.mockRejectedValue(new Error('No session'));
  });

  describe('initialization', () => {
    it('should initialize with loading state', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      expect(result.current.loading).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });

    it('should restore session on mount if refresh succeeds', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      authService.refresh.mockResolvedValue({ access_token: 'token123' });
      authService.getCurrentUser.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      authService.register.mockResolvedValue({ message: 'Success' });
      toast.success.mockImplementation(() => {});

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.register('test@example.com', 'Password123!', 'Test User');
      });

      expect(authService.register).toHaveBeenCalledWith('test@example.com', 'Password123!', 'Test User');
      expect(toast.success).toHaveBeenCalled();
    });

    it('should handle registration error', async () => {
      const error = {
        response: { data: { message: 'Email already exists' } }
      };
      authService.register.mockRejectedValue(error);
      toast.error.mockImplementation(() => {});

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.register('test@example.com', 'Password123!', 'Test');
        })
      ).rejects.toEqual(error);

      expect(toast.error).toHaveBeenCalledWith('Email already exists');
    });
  });

  describe('signIn', () => {
    it('should sign in user successfully', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      authService.login.mockResolvedValue({
        access_token: 'token123',
        user: mockUser
      });
      toast.success.mockImplementation(() => {});

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signIn('test@example.com', 'Password123!', false);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(toast.success).toHaveBeenCalled();
    });

    it('should handle sign in error', async () => {
      const error = {
        response: { data: { message: 'Invalid credentials' } }
      };
      authService.login.mockRejectedValue(error);
      toast.error.mockImplementation(() => {});

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.signIn('test@example.com', 'wrong', false);
        })
      ).rejects.toEqual(error);

      expect(result.current.isAuthenticated).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  describe('signOut', () => {
    it('should sign out user successfully', async () => {
      authService.logout.mockResolvedValue({});
      toast.success.mockImplementation(() => {});

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Set authenticated state first
      act(() => {
        result.current.user = { id: 1 };
        result.current.isAuthenticated = true;
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
      expect(toast.success).toHaveBeenCalled();
    });
  });

  describe('requestPasswordReset', () => {
    it('should request password reset successfully', async () => {
      authService.forgotPassword.mockResolvedValue({ message: 'Email sent' });
      toast.success.mockImplementation(() => {});

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.requestPasswordReset('test@example.com');
      });

      expect(authService.forgotPassword).toHaveBeenCalledWith('test@example.com');
      expect(toast.success).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      authService.resetPassword.mockResolvedValue({ message: 'Password reset' });
      toast.success.mockImplementation(() => {});

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.resetPassword('token123', 'NewPassword123!');
      });

      expect(authService.resetPassword).toHaveBeenCalledWith('token123', 'NewPassword123!');
      expect(toast.success).toHaveBeenCalled();
    });
  });
});
