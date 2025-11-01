# High-Quality Image Resources for KigaliGo

## 🎯 **Using Real Photos Instead of SVG Illustrations**

Replace the current SVG files with these high-quality, optimized images from free stock photo sites.

---

## 📥 **How to Download and Use**

1. Visit the URLs below
2. Download images (choose "Medium" or "Large" size)
3. Optimize them using TinyPNG.com (compress to ~200-500KB)
4. Save to `/frontend/public/images/` with the same filenames
5. Images will automatically replace SVG files

---

## 🖼️ **Recommended Images by Section**

### **1. Hero Section (`hero-illustration.svg` replacement)**

**Best Options:**

**Option A - Kigali Cityscape:**
- **Unsplash**: https://unsplash.com/s/photos/kigali-rwanda
- Search: "Kigali city" or "Rwanda urban"
- **Recommended**: Modern Kigali skyline with buildings and roads
- **Size**: 1920x1080px (landscape)

**Option B - African City Transport:**
- **Pexels**: https://www.pexels.com/search/african%20bus/
- Search: "African public transport" or "city bus Africa"
- **Alternative**: https://www.pexels.com/search/rwanda/

**Direct Download Links (Pexels - Free to use):**
```
Bus in African city:
https://www.pexels.com/photo/bus-on-road-in-city-12345678/

Kigali streets:
https://www.pexels.com/search/kigali%20streets/
```

---

### **2. Transport Mode Images**

#### **Bus (`transport-bus.svg` replacement)**
**Sources:**
- **Unsplash**: https://unsplash.com/s/photos/public-bus
- **Keywords**: "city bus side view", "modern bus", "tap and go bus"
- **Ideal**: Clean side view of a blue/modern bus
- **Size**: 800x600px

**Recommended Free Images:**
```
Option 1: Modern city bus
https://unsplash.com/photos/[search: blue-bus-public-transport]

Option 2: African bus
https://www.pexels.com/search/african%20bus/
```

#### **Motorcycle Taxi (`transport-moto.svg` replacement)**
**Sources:**
- **Pexels**: https://www.pexels.com/search/motorcycle%20taxi/
- **Keywords**: "motorcycle taxi Africa", "boda boda", "moto rider"
- **Ideal**: Motorcycle with rider, side or 3/4 view
- **Size**: 800x600px

**Direct Links:**
```
Motorcycle taxi:
https://www.pexels.com/search/motorcycle%20taxi%20rwanda/

Boda boda (similar):
https://www.pexels.com/search/boda%20boda/
```

#### **Taxi (`transport-taxi.svg` replacement)**
**Sources:**
- **Unsplash**: https://unsplash.com/s/photos/green-taxi
- **Keywords**: "green taxi", "African taxi", "cab"
- **Ideal**: Green or white taxi, side view
- **Size**: 800x600px

---

### **3. Feature Illustrations**

#### **Route Planning (`route-planning.svg` replacement)**
**Sources:**
- **Unsplash**: https://unsplash.com/s/photos/phone-map-app
- **Keywords**: "phone navigation app", "mobile map", "GPS on phone"
- **Ideal**: Hand holding phone with map app visible
- **Size**: 600x800px (portrait)

**Recommended:**
```
Phone with map:
https://unsplash.com/photos/[search: smartphone-map-navigation]

Google Maps style:
https://www.pexels.com/search/phone%20gps/
```

#### **Fare Calculator (`fare-calculator.svg` replacement)**
**Sources:**
- **Freepik**: https://www.freepik.com/free-photos-vectors/payment-phone
- **Keywords**: "mobile payment", "phone money app", "calculator app"
- **Ideal**: Phone showing payment/money interface
- **Size**: 600x800px

#### **Map Illustration (`map-illustration.svg` replacement)**
**Sources:**
- **Unsplash**: https://unsplash.com/s/photos/city-map
- **Keywords**: "GPS map", "navigation", "location pins"
- **Ideal**: Digital map with route and pins
- **Size**: 800x600px

#### **Safety Illustration (`safety-illustration.svg` replacement)**
**Sources:**
- **Pexels**: https://www.pexels.com/search/safe%20travel/
- **Keywords**: "safe travel", "security shield", "passenger safety"
- **Ideal**: People traveling safely or security concept
- **Size**: 600x600px

---

### **4. Logo (`logo.svg` replacement)**

**Option A - Keep Current SVG** (it's already optimized)

**Option B - Create PNG from SVG:**
```bash
# Convert SVG to PNG (if you have imagemagick)
convert -background none -size 512x512 logo.svg logo.png
```

**Option C - Professional Logo Design:**
- **Canva**: https://www.canva.com (create custom logo)
- **Figma**: https://www.figma.com (design vector logo)

---

## 🎨 **Alternative: Use Illustration Libraries**

### **Professional Illustration Packs (Free)**

#### **1. unDraw** (SVG, customizable colors)
- Website: https://undraw.co/illustrations
- Search terms: "map", "transport", "city", "mobile"
- **Benefits**: 
  - Customizable colors (match KigaliGo brand)
  - SVG format (scalable, small file size)
  - Modern, professional style

**Recommended Illustrations:**
```
City connections: https://undraw.co/search (search: "city")
Mobile app: https://undraw.co/search (search: "mobile")
Map/navigation: https://undraw.co/search (search: "map")
```

#### **2. Storyset** (Animated, customizable)
- Website: https://storyset.com/
- Categories: Transport, Technology, City
- **Benefits**:
  - Can animate for web
  - Customizable colors
  - High quality

**Recommended Sets:**
```
Transport: https://storyset.com/transportation
City: https://storyset.com/city
Mobile: https://storyset.com/mobile
```

#### **3. Streamline Icons** (Free tier)
- Website: https://www.streamlinehq.com/
- Search: "transport", "map", "payment"

---

## 📦 **Optimized Image Specifications**

### **File Format Guidelines:**

| Use Case | Format | Max Size | Compression |
|----------|--------|----------|-------------|
| Hero images | WebP or JPG | 500KB | 80% quality |
| Transport icons | PNG or WebP | 200KB | Transparent BG |
| Feature screenshots | PNG | 300KB | High quality |
| Logo | SVG or PNG | 50KB | Lossless |
| Background patterns | SVG | 20KB | Minified |

### **Image Dimensions:**

```
Hero section: 1920x1080px (landscape)
Transport modes: 800x600px (4:3 ratio)
Feature cards: 600x400px
Logo: 512x512px (square)
Icons: 256x256px
```

---

## 🔧 **Optimization Tools**

### **Compression:**
1. **TinyPNG**: https://tinypng.com/ (best for PNG/JPG)
2. **Squoosh**: https://squoosh.app/ (Google's tool, supports WebP)
3. **ImageOptim**: https://imageoptim.com/ (Mac app)

### **Conversion:**
1. **CloudConvert**: https://cloudconvert.com/ (any format to any format)
2. **Convertio**: https://convertio.co/image-converter/

### **Editing:**
1. **Photopea**: https://www.photopea.com/ (free Photoshop alternative)
2. **Remove.bg**: https://www.remove.bg/ (remove backgrounds)
3. **Canva**: https://www.canva.com/ (resize, add text, filters)

---

## 🚀 **Quick Setup Instructions**

### **Step 1: Download Images**
```bash
# Navigate to images directory
cd /home/kevin/G4_ProjectProposal/kigali-go/frontend/public/images/

# Create backup of current SVGs
mkdir svg_backup
cp *.svg svg_backup/
```

### **Step 2: Download from Unsplash/Pexels**
- Visit recommended URLs above
- Download "Medium" size (1000-2000px wide)
- Save with original names (e.g., `hero-illustration.jpg`)

### **Step 3: Optimize**
- Upload to TinyPNG.com
- Compress (usually 50-70% reduction)
- Download optimized versions

### **Step 4: Replace Files**
```bash
# Rename downloaded files to match app requirements
mv downloaded-hero.jpg hero-illustration.jpg
mv downloaded-bus.png transport-bus.png
# etc.

# Update references in code if needed (jpg instead of svg)
```

### **Step 5: Update Code (if changing from SVG to JPG/PNG)**
```javascript
// In your React components, update image paths if needed
// From:
<img src="/images/hero-illustration.svg" />

// To:
<img src="/images/hero-illustration.jpg" />
// or better yet, use WebP with fallback:
<picture>
  <source srcset="/images/hero-illustration.webp" type="image/webp" />
  <img src="/images/hero-illustration.jpg" alt="Hero" />
</picture>
```

---

## 📋 **Recommended Complete Image Set**

### **Option 1: Real Photos (Most Realistic)**

Download these and you're set:

1. **Hero**: Kigali cityscape from Unsplash
2. **Bus**: Modern public bus from Pexels
3. **Moto**: Motorcycle taxi from Pexels
4. **Taxi**: Green taxi from Unsplash
5. **Route Planning**: Phone with map from Unsplash
6. **Fare**: Phone with payment app from Pexels
7. **Map**: Digital navigation map from Unsplash
8. **Safety**: People traveling safely from Pexels

### **Option 2: Professional Illustrations (Most Cohesive)**

Use unDraw for all:

1. **Hero**: "City" illustration from unDraw
2. **Transport**: "Ride" illustration from unDraw
3. **Map**: "Navigation" illustration from unDraw
4. **Payment**: "Mobile payments" from unDraw
5. **Safety**: "Secure" illustration from unDraw

**Benefits of Option 2:**
- All images have consistent style
- Customizable to KigaliGo brand colors
- Small file sizes (SVG)
- Scalable without quality loss
- Modern, clean aesthetic

---

## 🎯 **My Recommendation: Hybrid Approach**

**Best of both worlds:**

1. **Real photos for context**: Use actual Kigali photos for hero section
2. **Illustrations for features**: Use unDraw for feature explanations
3. **Keep SVG icons**: Current transport mode SVGs are fine

**Why?**
- Real photos show authentic Kigali
- Illustrations explain concepts clearly
- SVG icons load instantly
- Professional, modern look
- Optimized performance

---

## 📞 **Need Help?**

### **Quick Links:**
- Unsplash: https://unsplash.com/ (free high-quality photos)
- Pexels: https://www.pexels.com/ (free stock photos & videos)
- unDraw: https://undraw.co/ (customizable illustrations)
- TinyPNG: https://tinypng.com/ (image compression)

### **License Info:**
- **Unsplash**: Free to use, no attribution required
- **Pexels**: Free to use, no attribution required
- **unDraw**: Free to use, attribution appreciated
- **Always check license** before using in commercial project

---

## ✅ **Action Items**

- [ ] Choose image strategy (real photos vs illustrations)
- [ ] Download images from recommended sources
- [ ] Compress all images using TinyPNG
- [ ] Replace files in `/frontend/public/images/`
- [ ] Test loading performance
- [ ] Update any hard-coded file extensions in code
- [ ] Clear browser cache and verify images load
- [ ] Check mobile responsiveness

---

**Last Updated**: 2025-10-20
**Status**: Ready to implement
