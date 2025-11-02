# Quick Image Setup - Use Real Photos

## 🚀 Fast Track: Get Professional Images in 10 Minutes

### Step 1: Download These Specific Images (5 minutes)

#### 1. Hero Image - Kigali Cityscape
Visit: https://unsplash.com/s/photos/kigali
- Download any modern cityscape photo (1920x1080)
- Save as: `hero-illustration.jpg`

**Alternative Search Terms:
- "Rwanda city"
- "African modern city"
- "Urban africa buildings"

#### 2. Bus Photo
Visit: https://www.pexels.com/search/public%20bus/
- Download side view of modern bus
- Save as: `transport-bus.jpg`

#### 3. Motorcycle Taxi
Visit: https://www.pexels.com/search/motorcycle%20taxi/
- Download motorcycle with rider
- Save as: `transport-moto.jpg`

**Alternative**: Search "boda boda" or "moto taxi africa"

#### 4. Taxi Car
Visit: https://unsplash.com/s/photos/taxi
- Download green or white taxi
- Save as: `transport-taxi.jpg`

#### 5. Phone with Map
Visit: https://unsplash.com/s/photos/phone-map
- Download hand holding phone with navigation
- Save as: `route-planning.jpg`

#### 6. Mobile Payment
Visit: https://www.pexels.com/search/mobile%20payment/
- Download phone showing payment interface
- Save as: `fare-calculator.jpg`

---

### Step 2: Optimize Images (3 minutes)

1. Go to: https://tinypng.com/
2. Upload all 6 images
3. Download compressed versions
4. Each should be under 500KB

---

### Step 3: Replace Files (2 minutes)

```bash
# Navigate to images folder
cd /home/kevin/G4_ProjectProposal/kigali-go/frontend/public/images/

# Remove old SVGs (backup first)
mkdir old_svgs
mv *.svg old_svgs/ 2>/dev/null || true

# Move your downloaded images here
# Make sure filenames match:
# - hero-illustration.jpg
# - transport-bus.jpg
# - transport-moto.jpg
# - transport-taxi.jpg
# - route-planning.jpg
# - fare-calculator.jpg
```

---

### Step 4: Update Code to Use JPG (if needed)

If images don't show up, update extensions in your components:

```javascript
// In HomePage.js, change:
<img src="/images/hero-illustration.svg" />
// To:
<img src="/images/hero-illustration.jpg" />
```

Or use this find-replace:
```bash
cd /home/kevin/G4_ProjectProposal/kigali-go/frontend/src
find . -name "*.js" -exec sed -i 's/\.svg/.jpg/g' {} \;
```

---

## 🎨 Even Better: Use Professional Illustration Pack

### Option: unDraw (My Recommendation)

Why?
- ✅ Consistent modern style
- ✅ Small file sizes (SVG)
- ✅ Customizable colors
- ✅ Free commercial use

How to Use:

1. Visit: https://undraw.co/illustrations
2. Set primary color to: `#3B82F6` (KigaliGo blue)
3. Download these illustrations:

| Search Term | Use For | Save As |
|-------------|---------|---------|
| "city" | Hero section | `hero-illustration.svg` |
| "navigator" | Route planning | `route-planning.svg` |
| "mobile payments" | Fare calculator | `fare-calculator.svg` |
| "map" | Map feature | `map-illustration.svg` |
| "secure" | Safety | `safety-illustration.svg` |
| "profile" | User profile | `user-profile.svg` |

4. Download SVG format
5. Place in `/frontend/public/images/`
6. Done! They'll match your brand colors automatically.

---

## ⚡ Ultra-Fast: Use What I Created

I've already created a modern hero image for you:

```bash
cd /home/kevin/G4_ProjectProposal/kigali-go/frontend/public/images/

# Use the new modern hero I created
mv hero-modern.svg hero-illustration.svg
```

It's optimized, modern, and loads instantly!

---

## 🔍 My Top Recommendation

### Use This Combo:

1. **Hero**: Real Kigali photo from Unsplash
2. **Transport modes**: Keep current SVGs (they're good)
3. **Features**: Use unDraw illustrations

Why?
- Authentic (real Kigali photo)
- Fast loading (SVGs for icons)
- Professional (consistent illustrations)
- Optimized (small file sizes)

---

## 📊 Compare Loading Times

| Image Type | File Size | Load Time | Quality |
|------------|-----------|-----------|---------|
| My SVGs | 5-20KB | < 50ms | ⭐⭐⭐⭐ |
| Optimized JPG | 200-500KB | ~500ms | ⭐⭐⭐⭐⭐ |
| Uncompressed JPG | 2-5MB | 2-5s | ⭐⭐⭐⭐⭐ |
| unDraw SVG | 10-30KB | < 100ms | ⭐⭐⭐⭐ |

Recommendation: Use optimized JPG (< 500KB) or SVG

---

## ✅ Checklist

- [ ] Downloaded images from Unsplash/Pexels
- [ ] Compressed images using TinyPNG
- [ ] Renamed files correctly
- [ ] Placed in `/frontend/public/images/`
- [ ] Tested that images load in browser
- [ ] Checked mobile responsiveness
- [ ] Verified load times (< 1s per image)

---

## 🆘 **Having Issues?**

### **Images not showing?**

1. Check file names match exactly
2. Clear browser cache (Ctrl+Shift+R)
3. Check browser console for errors
4. Verify files are in correct directory

### **Images too slow?**

1. Compress more using TinyPNG
2. Reduce dimensions (max 1920px wide)
3. Convert to WebP format
4. Consider using SVG alternatives

### **Want my help choosing?**

Tell me your preference:
- **A**: Real photos (most realistic)
- **B**: Illustrations (most consistent)
- **C**: Hybrid (photos + illustrations)

And I'll give you exact URLs to download!

---

**Quick Start**: Just visit https://undraw.co/, download 5-6 illustrations in 10 minutes, and you're done! 🎉
