# Frontend API Connection Fix

## Problem
The "Nearby Vehicles" panel was showing a connection error: **"Connection issue. Retrying... (1/3)"** even though the backend API was working correctly on Vercel.

## Root Cause
The frontend React app was making API calls using **relative URLs** (`/api/v1/realtime/vehicles/realtime`) which resolved to the local development server (`http://localhost:3000`) instead of the Vercel backend (`https://go-kigali.vercel.app`).

## Solution Applied

### 1. Fixed `useRealtimeVehicles.js` Hook
**File:** `kigali-go/frontend/src/hooks/useRealtimeVehicles.js`

**Changes:**
- Added `API_BASE_URL` constant from environment variables
- Updated the fetch URL to use the full URL: `${API_BASE_URL}/api/v1/realtime/vehicles/realtime`

**Before:**
```javascript
let url = `/api/v1/realtime/vehicles/realtime?lat=...`;
```

**After:**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || '';
let url = `${API_BASE_URL}/api/v1/realtime/vehicles/realtime?lat=...`;
```

### 2. Created Environment Configuration
**File:** `kigali-go/frontend/.env.local`

```
REACT_APP_API_URL=https://go-kigali.vercel.app
```

This tells the React app to make API calls to the Vercel-deployed backend.

### 3. Created Example Environment File
**File:** `kigali-go/frontend/.env.example`

Provides a template for other developers to configure their API URL.

## How to Use

### For Deployed Vercel App (Production)
**No configuration needed!** 

Since both the frontend and backend are deployed to the same Vercel project (`go-kigali.vercel.app`), the frontend uses **relative URLs** automatically.

- Frontend: `https://go-kigali.vercel.app/`
- Backend: `https://go-kigali.vercel.app/api/...`

The `REACT_APP_API_URL` should be **empty** or **not set** in Vercel environment variables, so it defaults to relative URLs.

### For Local Development with Vercel Backend
1. The `.env.local` file is already created with the Vercel URL
2. Restart the React development server:
   ```bash
   cd kigali-go/frontend
   npm start
   ```
3. The frontend will now connect to the Vercel backend

### For Local Development with Local Backend
1. Update `.env.local`:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```
2. Start both the backend and frontend servers

## Vercel Environment Variables

In your Vercel project settings, **do NOT set** `REACT_APP_API_URL` or set it to an empty string:

```
REACT_APP_API_URL=
```

This ensures the deployed frontend uses relative URLs like `/api/v1/realtime/vehicles/realtime` which Vercel rewrites to the backend.

## Testing
After restarting the frontend:
1. Open the app in your browser
2. The "Nearby Vehicles" panel should now show vehicles
3. No more "Connection issue" errors
4. You should see 60 vehicles listed (or however many are in the database)

## Technical Details
- The `REACT_APP_API_URL` environment variable is read at **build time** by Create React App
- Any changes to `.env.local` require a **restart** of the development server
- The `.env.local` file is gitignored to prevent committing sensitive URLs
