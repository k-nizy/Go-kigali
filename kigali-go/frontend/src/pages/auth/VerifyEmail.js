/**
 * Email Verification Page
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Paper, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuth();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError('Invalid or missing verification token');
        setLoading(false);
        return;
      }

      try {
        await verifyEmail(token);
        setSuccess(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Email verification failed');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
          {loading && (
            <>
              <CircularProgress size={60} />
              <Typography variant="h5" sx={{ mt: 3 }}>
                Verifying your email...
              </Typography>
            </>
          )}

          {!loading && success && (
            <>
              <CheckCircle size={60} color="#4caf50" />
              <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
                Email Verified!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Your email has been successfully verified. You can now sign in to your account.
              </Typography>
              <Button
                component={RouterLink}
                to="/signin"
                variant="contained"
                size="large"
              >
                Go to Sign In
              </Button>
            </>
          )}

          {!loading && error && (
            <>
              <XCircle size={60} color="#f44336" />
              <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
                Verification Failed
              </Typography>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The verification link may have expired or is invalid.
              </Typography>
              <Button
                component={RouterLink}
                to="/signin"
                variant="contained"
              >
                Go to Sign In
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmail;
