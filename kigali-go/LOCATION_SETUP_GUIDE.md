# 📍 Location Setup Guide - KigaliGo

## Issue: "Unable to get location. Using map center."

This message appears when your browser blocks location access. Follow the steps below to fix it.

---

## ✅ How to Enable Location Access

### **Google Chrome / Chromium / Brave**

1. **Look at the address bar** (where it says `localhost:3000/map`)
2. **Click the 🔒 lock icon** (or ⓘ info icon) on the left side
3. You'll see a dropdown menu
4. Find **"Location"** in the permissions list
5. Change it from **"Block"** to **"Allow"**
6. **Refresh the page** (press F5 or Ctrl+R)

**Visual Guide:**
```
🔒 localhost:3000/map
   ↓ Click here
   
   Permissions for this site:
   Location: [Block ▼] → Change to [Allow ▼]
   ✓ Done!
```

---

### **Firefox**

1. Click the **🔒 lock icon** in the address bar
2. Click **"Connection secure"** → **"More information"**
3. Go to the **"Permissions"** tab
4. Find **"Access Your Location"**
5. Uncheck **"Use Default"**
6. Select **"Allow"**
7. **Refresh the page**

---

### **Safari (macOS)**

1. Go to **Safari** → **Settings** (or Preferences)
2. Click the **"Websites"** tab
3. Select **"Location"** from the left sidebar
4. Find `localhost` in the list
5. Change to **"Allow"**
6. **Refresh the page**

---

### **Microsoft Edge**

1. Click the **🔒 lock icon** in the address bar
2. Click **"Permissions for this site"**
3. Find **"Location"**
4. Change to **"Allow"**
5. **Refresh the page**

---

## 🔄 Alternative Method: Browser Settings

If the above doesn't work, try this:

### Chrome/Chromium/Brave:
1. Go to **Settings** → **Privacy and security** → **Site settings**
2. Click **"Location"**
3. Make sure **"Sites can ask to use your location"** is enabled
4. Under **"Not allowed to use your location"**, find `localhost:3000`
5. Click the **trash icon** to remove it
6. **Refresh the map page** - it will ask for permission again

### Firefox:
1. Go to **Settings** → **Privacy & Security**
2. Scroll to **"Permissions"** → **"Location"** → **"Settings"**
3. Find `localhost:3000` and change to **"Allow"**
4. **Refresh the page**

---

## 📱 Mobile Devices

### Android (Chrome):
1. Tap the **🔒 lock icon** in address bar
2. Tap **"Permissions"**
3. Enable **"Location"**
4. Refresh the page

### iOS (Safari):
1. Go to **Settings** → **Safari** → **Location**
2. Change to **"Ask"** or **"Allow"**
3. Go back to the app and refresh

---

## ✨ What Happens After Enabling?

Once location is enabled, you'll see:

✅ **"📍 Location tracking enabled!"** message
✅ **Blue marker** on the map showing your position
✅ **Nearby vehicles** (buses, taxis, motos) displayed
✅ **Real-time updates** as you move
✅ **Accurate distances** to each vehicle

---

## 🔒 Privacy & Security

**Your location is:**
- ✅ Only used while the map page is open
- ✅ NOT stored on any server
- ✅ NOT shared with third parties
- ✅ Only used to show nearby vehicles
- ✅ Stops tracking when you close the page

---

## 🐛 Still Having Issues?

### Check These:

1. **GPS/Location Services Enabled?**
   - Make sure your device's GPS is turned on
   - Check system location settings

2. **Using HTTPS or localhost?**
   - Location only works on secure connections
   - `localhost` is considered secure

3. **Browser Console Errors?**
   - Press **F12** to open Developer Tools
   - Check the **Console** tab for errors
   - Look for permission or geolocation errors

4. **Try a Different Browser**
   - Test in Chrome, Firefox, or Edge
   - Some browsers handle permissions differently

5. **Clear Browser Cache**
   - Sometimes cached permissions cause issues
   - Clear site data and try again

---

## 📞 Need More Help?

If you're still seeing the error:

1. **Check browser console** (F12) for specific error messages
2. **Try incognito/private mode** to test without extensions
3. **Disable browser extensions** that might block location
4. **Update your browser** to the latest version

---

## 🎯 Quick Test

After enabling location, you should see in the browser console:
```
Geolocation permission status: granted
User location: {lat: -1.xxxx, lng: 30.xxxx}
Location updated: {lat: -1.xxxx, lng: 30.xxxx}
```

If you see this, location is working! 🎉

---

## 📝 Summary

**The error message means:** Your browser blocked location access

**To fix it:** 
1. Click 🔒 in address bar
2. Allow location
3. Refresh page

**Result:** Map shows your real location with nearby vehicles!
