# Google Maps API Setup Guide

## Why You Need This
The map functionality in KigaliGo requires a Google Maps API key to display interactive maps and show vehicle locations in the real-time.

## Steps to Get a Google Maps API Key

### 1. Create a Google Cloud Account
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Sign in with your Google account (or create one if you don't have it)
- You may need to set up billing, but Google provides **$200 free credit per month** for Maps API usage

### 2. Create a New Project
1. Click on the project dropdown at the top
2. Click "New Project"
3. Name it something like "KigaliGo" or "Transport App"
4. Click "Create"

### 3. Enable Required APIs
You need to enable these APIs for the map to work:

1. Go to **"APIs & Services" > "Library"**
2. Search for and enable:
   - **Maps JavaScript API** (for displaying the map)
   - **Places API** (for location search/autocomplete)
   - **Geocoding API** (for address to coordinates conversion)

### 4. Create API Key
1. Go to **"APIs & Services" > "Credentials"**
2. Click **"Create Credentials" > "API Key"**
3. Your API key will be generated
4. **Important:** Click "Restrict Key" to add security restrictions

### 5. Restrict Your API Key (Recommended)
For security, restrict your key:

**Application restrictions:**
- Choose "HTTP referrers (web sites)"
- Add these referrers:
  ```
  http://localhost:3000/*
  http://localhost:5000/*
  https://yourdomain.com/*  (when deploying)
  ```

**API restrictions:**
- Choose "Restrict key"
- Select only the APIs you enabled above

### 6. Add Key to Your Project
1. Open `/home/kevin/G4_ProjectProposal/kigali-go/frontend/.env`
2. Replace the empty value with your API key:
   ```
   REACT_APP_GOOGLE_MAPS_KEY=AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. **Important:** Restart your frontend development server after adding the key

## Testing Your Setup
After adding the key and restarting:
1. Go to http://localhost:3000/map
2. You should now see an interactive Google Map instead of the placeholder
3. The map should show your location and nearby vehicles

## Troubleshooting

### Map still not showing?
- ✓ Make sure you restarted the frontend server after adding the key
- ✓ Check browser console for any Google Maps errors
- ✓ Verify the APIs are enabled in Google Cloud Console
- ✓ Check that the key is correctly copied (no extra spaces)

### "This page can't load Google Maps correctly"?
- This means billing is not set up or you've exceeded the free quota
- Set up billing in Google Cloud Console (free $200/month credit applies)

### API Key Restrictions Error?
- Make sure you've added http://localhost:3000/* to allowed referrers
- Wait a few minutes for restrictions to propagate

## Cost Information
- Google provides **$200 free credit monthly**
- For a small project, this is usually enough
- Maps JavaScript API: $7 per 1,000 loads (covered by free credit)
- You'll need to add a payment method, but won't be charged if you stay under $200/month

## Security Best Practices
⚠️ **NEVER commit your API key to GitHub**
- The `.env` file is in `.gitignore` by default
- Only share the `.env.example` file (without actual keys)
- Use different keys for development and production

## Alternative (Free Option)
If you can't get a Google Maps API key, you can:
1. Use OpenStreetMap with Leaflet.js (completely free, no API key needed)
2. Comment out the Google Maps dependency in the code

Would you like me to implement an OpenStreetMap alternative?
