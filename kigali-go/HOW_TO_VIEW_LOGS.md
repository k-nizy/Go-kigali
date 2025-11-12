# 📊 How to View Logs - KigaliGo Auth System

## 🚀 Quick Start

Run this command to start both servers:
```bash
.\start_auth.bat
```

This will open **2 separate windows**:
1. **Backend - Auth API** (Python/Flask logs)
2. **Frontend - React App** (React/npm logs)

---

## 🔍 Backend Logs (Flask)

### Window: "Backend - Auth API"

**What you'll see:**
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.1.178:5000
 * Debugger is active!
 * Debugger PIN: 263-793-609
```

### When you register a user:
```
[2025-11-12 00:12:28,054] INFO in auth: Verification token for test@example.com: 40OsvI7W0gsUpnZYAYPKE-BeJMyxA0K7wFERyGZJhaQ
127.0.0.1 - - [12/Nov/2025 00:12:28] "POST /api/auth/register HTTP/1.1" 201 -
```

### When you login:
```
127.0.0.1 - - [12/Nov/2025 00:13:15] "POST /api/auth/login HTTP/1.1" 200 -
```

### When you access protected routes:
```
[2025-11-12 00:20:54] INFO in auth: JWT identity: 1
127.0.0.1 - - [12/Nov/2025 00:20:54] "GET /api/auth/me HTTP/1.1" 200 -
```

### When errors occur:
```
[2025-11-12 00:13:30] ERROR in auth: Invalid token error: Subject must be a string
127.0.0.1 - - [12/Nov/2025 00:13:30] "GET /api/auth/me HTTP/1.1" 401 -
```

---

## 🎨 Frontend Logs (React)

### Window: "Frontend - React App"

**Initial startup:**
```
Compiled successfully!

You can now view kigali-go-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.178:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

### When navigating pages:
```
Compiled successfully!
```

### When API calls are made:
```
[HMR] Waiting for update signal from WDS...
```

### When you sign up:
```
POST http://localhost:5000/api/auth/register 201 (Created)
```

### When you sign in:
```
POST http://localhost:5000/api/auth/login 200 (OK)
```

### When errors occur:
```
POST http://localhost:5000/api/auth/login 401 (Unauthorized)
Error: Invalid email or password
```

---

## 🌐 Browser Console Logs

### Open Browser DevTools:
- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I`
- **Firefox**: Press `F12`

### Console Tab - What you'll see:

**On successful login:**
```javascript
Welcome back!
{user: {id: 1, email: "test@example.com", name: "Test User"}}
```

**On registration:**
```javascript
Registration successful! Please check your email to verify your account.
```

**On errors:**
```javascript
Invalid email or password
```

### Network Tab - API Requests:

1. Click **Network** tab
2. Filter by **XHR** or **Fetch**
3. You'll see all API calls:

```
POST /api/auth/register    201  Created
GET  /api/auth/verify-email 200  OK
POST /api/auth/login        200  OK
GET  /api/auth/me           200  OK
POST /api/auth/logout       200  OK
```

Click on any request to see:
- **Headers**: Authorization tokens, cookies
- **Payload**: Request body (email, password, etc.)
- **Response**: Server response data
- **Cookies**: refresh_token_cookie

---

## 📱 Testing the Complete Flow

### 1. Open Frontend
Go to: http://localhost:3000/signup

### 2. Register a User
- Fill in: Name, Email, Password
- Click "Sign Up"
- **Check Backend Window** for verification token

### 3. Verify Email
- Copy token from backend logs
- Go to: `http://localhost:3000/verify-email?token=YOUR_TOKEN`
- **Check Backend Window** for verification success

### 4. Sign In
- Go to: http://localhost:3000/signin
- Enter email and password
- **Check Backend Window** for login request
- **Check Browser Console** for "Welcome back!" message

### 5. Access Protected Content
- After login, you should see user dashboard
- **Check Backend Window** for `/api/auth/me` requests
- **Check Network Tab** for Authorization headers

---

## 🐛 Common Log Messages

### Backend

| Log Message | Meaning |
|-------------|---------|
| `201 -` | Resource created successfully (register) |
| `200 -` | Request successful |
| `401 -` | Unauthorized (invalid/missing token) |
| `403 -` | Forbidden (unverified email, inactive account) |
| `404 -` | Not found |
| `500 -` | Server error |

### Frontend

| Log Message | Meaning |
|-------------|---------|
| `Compiled successfully!` | Code compiled, no errors |
| `Compiled with warnings` | Code works but has warnings |
| `Failed to compile` | Syntax errors in code |
| `webpack compiled` | Build process complete |

---

## 🔧 Debugging Tips

### If Backend logs show errors:
1. Check the error message
2. Look at the stack trace
3. Check if database is accessible
4. Verify .env file configuration

### If Frontend logs show errors:
1. Check browser console for JavaScript errors
2. Look at Network tab for failed API calls
3. Verify API_URL in .env
4. Check if backend is running

### If no logs appear:
1. Make sure windows are not minimized
2. Check Task Manager for running processes
3. Try restarting: `.\start_auth.bat`

---

## 📊 Real-Time Log Monitoring

### Backend (PowerShell):
```powershell
# In a new terminal
cd backend
Get-Content -Path "flask.log" -Wait -Tail 50
```

### Or use Python logging:
The backend already logs to console. Just watch the "Backend - Auth API" window.

---

## 🎯 What to Look For

### Successful Flow:
```
Backend:  POST /register → 201
Backend:  GET /verify-email → 200
Backend:  POST /login → 200
Backend:  GET /me → 200
Frontend: "Welcome back!" toast
Browser:  User data in console
```

### Failed Flow:
```
Backend:  POST /login → 401
Frontend: "Invalid credentials" toast
Browser:  Error message in console
```

---

## 📝 Log Files

Currently logs go to console only. To save logs to files:

### Backend:
Add to `run.py`:
```python
import logging
logging.basicConfig(filename='backend.log', level=logging.INFO)
```

### Frontend:
Logs are in browser console. Use browser's save console feature.

---

## ✅ Verification Checklist

- [ ] Backend window shows "Running on http://127.0.0.1:5000"
- [ ] Frontend window shows "Compiled successfully!"
- [ ] Browser opens to http://localhost:3000
- [ ] Can access http://localhost:5000/health
- [ ] Registration shows token in backend logs
- [ ] Login shows 200 status in backend logs
- [ ] Protected routes show JWT identity in logs
- [ ] Browser console shows toast notifications

---

**Both windows are now open! Check them for real-time logs as you use the application.**
