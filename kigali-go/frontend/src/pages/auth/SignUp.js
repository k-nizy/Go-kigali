/**
 * Sign Up Page
 */
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PasswordStrengthIndicator from '../../components/auth/PasswordStrengthIndicator';

const SignUp = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess(false);
    setVerificationToken('');

    try {
      const response = await registerUser(data.email, data.password, data.name);
      setSuccess(true);
      
      // In development, show the verification token
      if (response?.dev_token) {
        setVerificationToken(response.dev_token);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors?.email?.[0] ||
                          err.response?.data?.errors?.password?.[0] ||
                          'Failed to create account';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <UserPlus size={48} style={{ color: '#1976d2' }} />
            <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join KigaliGo and start your journey
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} role="alert">
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }} role="alert">
              <Typography variant="body2" sx={{ mb: 1 }}>
                ✅ Account created successfully!
              </Typography>
              {verificationToken ? (
                <>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Development Mode:</strong> Click the link below to verify your email:
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/verify-email?token=${verificationToken}`)}
                    sx={{ mt: 1 }}
                  >
                    Verify Email Now
                  </Button>
                </>
              ) : (
                <Typography variant="body2">
                  Please check your email to verify your account.
                </Typography>
              )}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              autoComplete="name"
              autoFocus
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
              inputProps={{
                'aria-label': 'Full name',
                'aria-required': 'true',
                'aria-invalid': !!errors.name,
              }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              inputProps={{
                'aria-label': 'Email address',
                'aria-required': 'true',
                'aria-invalid': !!errors.email,
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 12,
                  message: 'Password must be at least 12 characters',
                },
                validate: {
                  hasUppercase: (value) =>
                    /[A-Z]/.test(value) || 'Must contain at least one uppercase letter',
                  hasLowercase: (value) =>
                    /[a-z]/.test(value) || 'Must contain at least one lowercase letter',
                  hasNumber: (value) =>
                    /\d/.test(value) || 'Must contain at least one number',
                  hasSpecial: (value) =>
                    /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                    'Must contain at least one special character',
                },
              })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                'aria-label': 'Password',
                'aria-required': 'true',
                'aria-invalid': !!errors.password,
                'aria-describedby': 'password-requirements',
              }}
            />

            <Box id="password-requirements">
              <PasswordStrengthIndicator password={password} />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || success}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/signin"
                  sx={{ textDecoration: 'none', fontWeight: 'medium' }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp;
