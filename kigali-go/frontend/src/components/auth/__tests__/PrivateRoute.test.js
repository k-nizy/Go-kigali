/**
 * PrivateRoute component tests
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import { AuthProvider } from '../../../contexts/AuthContext';
import { authService } from '../../../services/authApi';

// Mock dependencies
jest.mock('../../../services/authApi');
jest.mock('react-hot-toast');

const TestComponent = () => <div>Protected Content</div>;
const SignInComponent = () => <div>Sign In Page</div>;

const renderPrivateRoute = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/signin" element={<SignInComponent />} />
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <TestComponent />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('PrivateRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.pushState({}, '', '/protected');
  });

  it('should show loading state initially', () => {
    authService.refresh.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderPrivateRoute();
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should redirect to sign in when not authenticated', async () => {
    authService.refresh.mockRejectedValue(new Error('No session'));
    
    renderPrivateRoute();
    
    await screen.findByText('Sign In Page');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render protected content when authenticated', async () => {
    authService.refresh.mockResolvedValue({ access_token: 'token123' });
    authService.getCurrentUser.mockResolvedValue({ id: 1, email: 'test@example.com' });
    
    renderPrivateRoute();
    
    await screen.findByText('Protected Content');
    expect(screen.queryByText('Sign In Page')).not.toBeInTheDocument();
  });
});
