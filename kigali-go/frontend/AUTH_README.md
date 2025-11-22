# KigaliGo Authentication Frontend

Production ready authentication UI built with React, Material-UI, and TailwindCSS. Features complete auth flows with token management, form validation, and accessibility.

## Features

- ✅ Sign in / Sign up with validation
- ✅ Email verification flow
- ✅ Password reset flow
- ✅ Protected routes with auto-redirect
- ✅ Token refresh with automatic retry
- ✅ Password strength indicator
- ✅ Remember me functionality
- ✅ Accessible forms (ARIA attributes)
- ✅ Loading states and error handling
- ✅ Toast notifications
- ✅ Comprehensive tests

## Tech Stack

- **React 18** - UI library
- **Material-UI 7** - Component library
- **TailwindCSS 3** - Utility-first CSS
- **React Router DOM v6** - Routing
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Jest & React Testing Library** - Testing

## Project Structure

```
frontend/src/
├── components/
│   └── auth/
│       ├── PrivateRoute.js           # Protected route wrapper
│       ├── PasswordStrengthIndicator.js
│       └── __tests__/
│           └── PrivateRoute.test.js
├── contexts/
│   ├── AuthContext.js                # Auth state management
│   └── __tests__/
│       └── AuthContext.test.js
├── hooks/
│   └── usePasswordStrength.js        # Password validation hook
├── pages/
│   └── auth/
│       ├── SignIn.js                 # Sign in page
│       ├── SignUp.js                 # Sign up page
│       ├── ForgotPassword.js         # Forgot password page
│       ├── ResetPassword.js          # Reset password page
│       ├── VerifyEmail.js            # Email verification page
│       └── __tests__/
│           └── SignIn.test.js
└── services/
    └── authApi.js                    # Auth API service with interceptors
```

## Setup Instructions

### 1. Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running (see backend README)

### 2. Installation

```bash
cd frontend

# Install dependencies
npm install
```

### 3. Environment Configuration

Create `.env` file in the frontend directory:

```bash
# Copy example file
cp .env.example .env

# Edit .env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Run Development Server

```bash
npm start
```

Application will open at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

Build files will be in the `build/` directory.

## Authentication Flow

### Sign Up Flow

1. User fills registration form (name, email, password)
2. Client validates password strength (12+ chars, uppercase, lowercase, number, special)
3. API creates user and sends verification email
4. User receives email with verification link
5. User clicks link → redirected to `/verify-email?token=...`
6. Email verified → user can now sign in

### Sign In Flow

1. User enters email and password
2. Optional: Check "Remember me" for extended session
3. API validates credentials and checks email verification
4. Access token stored in memory (not localStorage)
5. Refresh token stored as HTTP-only cookie
6. User redirected to original destination or home

### Token Refresh Flow

1. Access token expires (15 minutes)
2. API request returns 401
3. Interceptor automatically calls `/api/auth/refresh`
4. New access token received and stored
5. Original request retried with new token
6. If refresh fails → user logged out and redirected to sign in

### Password Reset Flow

1. User clicks "Forgot password" on sign in page
2. Enters email address
3. API sends reset email with time-limited token
4. User clicks link → redirected to `/reset-password?token=...`
5. User enters new password (validated for strength)
6. Password updated → user can sign in with new password

## Components

### AuthProvider

Context provider that manages authentication state.

**Exposed values:**
- `user` - Current user object or null
- `loading` - Initial loading state
- `isAuthenticated` - Boolean auth status
- `signIn(email, password, remember)` - Sign in method
- `signOut()` - Sign out method
- `register(email, password, name)` - Registration method
- `requestPasswordReset(email)` - Request password reset
- `resetPassword(token, password)` - Reset password
- `verifyEmail(token)` - Verify email
- `refreshUser()` - Refresh user data

**Usage:**
```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }
  
  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### PrivateRoute

Wrapper component for protected routes. Redirects to sign in if not authenticated.

**Usage:**
```jsx
import PrivateRoute from './components/auth/PrivateRoute';

<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>
```

### PasswordStrengthIndicator

Visual indicator showing password strength and requirements.

**Usage:**
```jsx
import PasswordStrengthIndicator from './components/auth/PasswordStrengthIndicator';

<PasswordStrengthIndicator password={passwordValue} />
```

## API Service

### authApi.js

Axios instance configured for authentication with:
- Base URL from environment
- Credentials support for cookies
- Request interceptor (adds access token)
- Response interceptor (handles 401 and token refresh)

**Methods:**
```javascript
import { authService } from './services/authApi';

// Register
await authService.register(email, password, name);

// Login
const { access_token, user } = await authService.login(email, password, remember);

// Logout
await authService.logout();

// Refresh token
const { access_token } = await authService.refresh();

// Get current user
const user = await authService.getCurrentUser();

// Verify email
await authService.verifyEmail(token);

// Forgot password
await authService.forgotPassword(email);

// Reset password
await authService.resetPassword(token, newPassword);
```

## Form Validation

### Password Requirements

All password fields validate:
- Minimum 12 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*(),.?":{}|<>)

### Email Validation

Standard email format validation using regex pattern.

## Accessibility

All forms include:
- Proper ARIA labels (`aria-label`, `aria-required`, `aria-invalid`)
- Role attributes for alerts
- Keyboard navigation support
- Focus management
- Screen reader friendly error messages

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test SignIn.test.js

# Run in watch mode
npm test -- --watch
```

### Test Coverage

Tests include:
- ✅ AuthContext initialization and methods
- ✅ Sign in form validation
- ✅ Sign up form validation
- ✅ Protected route behavior
- ✅ Token refresh flow
- ✅ Error handling
- ✅ Loading states

## Routing Setup

Add auth routes to your main App.js:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_URL` | Backend API base URL | http://localhost:5000 | Yes |

## Security Features

### Token Storage
- **Access token**: Stored in memory (not localStorage) to prevent XSS attacks
- **Refresh token**: HTTP-only cookie (not accessible to JavaScript)

### Token Refresh
- Automatic refresh when access token expires
- Token rotation on each refresh
- Failed queue to prevent multiple refresh attempts

### Password Security
- Client-side validation before submission
- Server-side validation with bcrypt hashing
- Password strength indicator guides users

### CSRF Protection
- Credentials included in requests
- SameSite cookie attribute
- Backend CSRF tokens (in production)

## Troubleshooting

### CORS Issues

If you see CORS errors:
1. Check backend `CORS_ORIGINS` includes frontend URL
2. Ensure `withCredentials: true` in axios config
3. Verify backend allows credentials

### Token Not Persisting

If user gets logged out on refresh:
1. Check cookies are enabled in browser
2. Verify backend sets cookies correctly
3. Check cookie domain and path settings

### Forms Not Submitting

If forms don't submit:
1. Check browser console for validation errors
2. Verify API URL in `.env`
3. Check network tab for failed requests

## Best Practices

### Using Auth in Components

```jsx
// ✅ Good - use AuthContext
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  // ...
}

// ❌ Bad - don't access tokens directly
import { getAccessToken } from './services/authApi';
```

### Handling Errors

```jsx
// ✅ Good - let AuthContext handle errors
try {
  await signIn(email, password);
} catch (error) {
  // Error already shown via toast
}

// ❌ Bad - don't show duplicate errors
try {
  await signIn(email, password);
} catch (error) {
  toast.error(error.message); // Already shown by context
}
```

### Protected Content

```jsx
// ✅ Good - use PrivateRoute for routes
<Route path="/dashboard" element={
  <PrivateRoute><Dashboard /></PrivateRoute>
} />

// ✅ Good - conditional rendering in components
const { isAuthenticated } = useAuth();
if (!isAuthenticated) return <SignInPrompt />;

// ❌ Bad - manual token checks
if (!getAccessToken()) { /* ... */ }
```

## Performance Optimization

- Access token stored in memory (fast access)
- Automatic token refresh prevents unnecessary re-authentication
- Form validation happens client-side first
- Loading states prevent duplicate submissions

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Follow React best practices
2. Use ESLint and Prettier
3. Write tests for new features
4. Update documentation
5. Ensure accessibility compliance

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Email: support@kigaligo.com
