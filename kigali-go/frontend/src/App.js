import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ThemeProvider, useThemeMode } from './ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import i18n from './i18n/i18n';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import PlanTripPage from './pages/PlanTripPage';
import FareEstimatorPage from './pages/FareEstimatorPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import PrivateRoute from './components/auth/PrivateRoute';
import './App.css';

const AppContent = () => {
  const { theme, mode } = useThemeMode();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                
                {/* App Routes with Layout */}
                <Route path="/*" element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/map" element={<MapPage />} />
                      <Route path="/plan" element={<PlanTripPage />} />
                      <Route path="/fare-estimator" element={<FareEstimatorPage />} />
                      <Route path="/reports" element={<ReportsPage />} />
                      <Route path="/profile" element={
                        <PrivateRoute>
                          <ProfilePage />
                        </PrivateRoute>
                      } />
                    </Routes>
                  </Layout>
                } />
              </Routes>
              
              {/* Toast notifications */}
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: mode === 'dark' ? '#181818' : '#FFFFFF',
                    color: mode === 'dark' ? '#fff' : '#1A1A1A',
                    borderRadius: '8px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: mode === 'dark' 
                      ? '1px solid rgba(255, 255, 255, 0.1)' 
                      : '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: mode === 'dark' 
                      ? 'none' 
                      : '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#0D7377',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#E22134',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </I18nextProvider>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
