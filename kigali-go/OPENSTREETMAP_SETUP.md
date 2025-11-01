# OpenStreetMap Setup (Free Alternative to Google Maps)

## ✅ What We're Using

**OpenStreetMap** with **Leaflet.js** - completely free and open source!

- ✅ **No API key required**
- ✅ **No billing setup needed**
- ✅ **No usage limits**
- ✅ **Community-driven map data**

## What Was Changed

### 1. Dependencies Added
```json
"leaflet": "^1.9.4",
"react-leaflet": "^4.2.1"
```

### 2. Files Modified
- ✅ `frontend/package.json` - Added Leaflet dependencies
- ✅ `frontend/src/pages/MapPage.js` - Implemented OpenStreetMap
- ✅ `frontend/public/index.html` - Removed Google Maps, added Leaflet CSS
- ✅ `frontend/.env.example` - Updated to reflect no API key needed

### 3. Removed
- ❌ Google Maps API script
- ❌ Google Maps dependencies
- ❌ API key requirement

## Installation Steps

### 1. Install Dependencies
```bash
cd /home/kevin/G4_ProjectProposal/kigali-go/frontend
npm install
```

### 2. Start the Development Server
```bash
npm start
```

### 3. Test the Map
- Navigate to http://localhost:3000/map
- You should see a fully interactive OpenStreetMap
- Click "Current Location" to center on your position
- Vehicle markers will appear on the map with custom icons

## Features

### ✨ What's Working
- 📍 **Interactive map** with zoom and pan
- 📌 **Your location marker** with blue circle radius
- 🚌 **Vehicle markers** with custom emoji icons (🚌 🚗 🏍️)
- 💬 **Popups** showing vehicle details
- 🎨 **Color-coded** by vehicle type
- 🔄 **Real-time updates** from backend API
- 📱 **Responsive** design for mobile and desktop

### 🎨 Custom Features
- Vehicle markers use emoji icons for better visibility
- 5km radius circle around your location
- Smooth animations and transitions
- Dark mode compatible
- Tailwind CSS styling

## Map Customization

### Changing Map Style
You can use different OpenStreetMap tile providers:

**Current (Default):**
```javascript
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
```

**Alternative Styles:**

1. **Dark Mode:**
```javascript
url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
```

2. **Light/Pastel:**
```javascript
url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
```

3. **Transport Focus:**
```javascript
url="https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png"
// Note: Thunderforest requires free API key for production
```

4. **Satellite (MapBox):**
```javascript
url="https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token={accessToken}"
// Note: Requires free MapBox API key
```

To change the style, edit `/frontend/src/pages/MapPage.js` at line ~153.

## Troubleshooting

### Map not displaying?
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Marker icons not showing?
The Leaflet marker icon fix is already implemented in the code:
```javascript
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({...});
```

### "Cannot find module 'leaflet'"?
```bash
npm install leaflet react-leaflet
```

### Map tiles not loading?
- Check your internet connection
- OpenStreetMap tiles are loaded from external servers
- Try a different tile provider (see customization section)

## Comparison: OpenStreetMap vs Google Maps

| Feature | OpenStreetMap | Google Maps |
|---------|--------------|-------------|
| API Key | ❌ Not required | ✅ Required |
| Cost | 🆓 Free | 💰 $200 free/month, then paid |
| Setup Time | ⚡ 5 minutes | ⏱️ 15-30 minutes |
| Billing | ❌ Not required | ✅ Required |
| Usage Limits | ♾️ Unlimited | 📊 Limited by quota |
| Customization | ✅ Full control | ⚠️ Limited |
| Offline Support | ✅ Possible | ❌ Limited |
| Community | 👥 Open source | 🏢 Corporate |

## Benefits for Development

1. **Faster Setup** - No account creation or API key management
2. **No Billing Worries** - Develop and test freely
3. **Better for Demos** - Works immediately for presentations
4. **Learning Friendly** - Great for educational projects
5. **Production Ready** - Can scale to production without cost concerns

## Going to Production

OpenStreetMap is production-ready! However, for heavy traffic, consider:

1. **Self-hosting tiles** - Download and host your own tile server
2. **Commercial providers** - MapBox, Thunderforest offer enhanced features
3. **CDN** - Use a CDN for better performance worldwide

For your Kigali transport project, the default OpenStreetMap setup is perfect!

## Additional Resources

- [Leaflet Documentation](https://leafletjs.com/)
- [React-Leaflet Documentation](https://react-leaflet.js.org/)
- [OpenStreetMap Wiki](https://wiki.openstreetmap.org/)
- [Alternative Tile Providers](https://leaflet-extras.github.io/leaflet-providers/preview/)

## Need Help?

The map is fully functional now! If you encounter any issues:
1. Check the browser console for errors
2. Verify npm install completed successfully
3. Make sure the backend API is running
4. Test with sample vehicle data

**Enjoy your free, open-source map! 🗺️**
