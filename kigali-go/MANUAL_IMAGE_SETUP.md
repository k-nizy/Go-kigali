# Manual Image Setup Guide - Step by Step

Since I cannot download images directly, here's exactly what YOU need to do:

## 📋 **Quick Checklist (15 minutes total)**

- [ ] Download 6 images from provided links
- [ ] Compress images using TinyPNG
- [ ] Move to correct folder
- [ ] Update file extensions in code
- [ ] Test the app

---

## 🔽 **Step 1: Download Images ( in 10 minutes)**

### **Open these links in your browser and download:**

#### **Image 1: Hero/Banner (Kigali cityscape)**
1. **Open this link:** https://unsplash.com/s/photos/kigali-rwanda
2. Click on any modern city photo you like
3. Click "Download" button (choose "Medium" size - ~2MB)
4. Save as: `hero-illustration.jpg`

**Alternative if Kigali photos are limited:**
- https://unsplash.com/s/photos/african-city
- https://unsplash.com/s/photos/modern-african-architecture

---

#### **Image 2: Public Bus**
1. **Open this link:** https://www.pexels.com/search/public%20bus/
2. Find a modern bus (preferably blue or city bus)
3. Click "Download" → Choose "Large" 
4. Save as: `transport-bus.jpg`

**Direct alternatives:**
- https://www.pexels.com/search/city%20bus/
- https://unsplash.com/s/photos/public-transport-bus

---

#### **Image 3: Motorcycle Taxi**
1. **Open this link:** https://www.pexels.com/search/motorcycle%20taxi/
2. Find a motorcycle with rider (preferably in African/urban setting)
3. Download "Large" size
4. Save as: `transport-moto.jpg`

**Alternatives:**
- Search "boda boda" (East African term)
- https://www.pexels.com/search/motorcycle%20rider/

---

#### **Image 4: Taxi Car**
1. **Open this link:** https://unsplash.com/s/photos/taxi
2. Find a green or white taxi (side view is best)
3. Download "Medium" size
4. Save as: `transport-taxi.jpg`

**Alternatives:**
- https://www.pexels.com/search/taxi%20car/
- https://unsplash.com/s/photos/cab

---

#### **Image 5: Phone with Navigation/Map**
1. **Open this link:** https://unsplash.com/s/photos/phone-map-navigation
2. Find hand holding phone showing map/GPS
3. Download "Medium" size
4. Save as: `route-planning.jpg`

**Alternatives:**
- https://www.pexels.com/search/phone%20gps/
- https://unsplash.com/s/photos/mobile-navigation

---

#### **Image 6: Mobile Payment**
1. **Open this link:** https://www.pexels.com/search/mobile%20payment/
2. Find phone showing payment/money app
3. Download "Large" size
4. Save as: `fare-calculator.jpg`

**Alternatives:**
- https://unsplash.com/s/photos/mobile-wallet
- https://www.pexels.com/search/phone%20money/

---

## 🗜️ **Step 2: Compress Images (3 minutes)**

1. **Open this link:** https://tinypng.com/
2. Drag and drop ALL 6 images at once
3. Wait for compression (usually 50-70% smaller)
4. Click "Download all" button
5. Extract the ZIP file

**Target sizes:**
- Each image should be under 500KB
- Total for all 6: under 2.5MB

---

## 📁 **Step 3: Move Images to Correct Folder (1 minute)**

```bash
# Open terminal and run:
cd /home/kevin/G4_ProjectProposal/kigali-go/frontend/public/images/

# Move your downloaded compressed images here
# You can drag and drop them into this folder using your file manager
```

**Or using File Manager:**
1. Open file manager
2. Navigate to: `/home/kevin/G4_ProjectProposal/kigali-go/frontend/public/images/`
3. Drag your 6 compressed images into this folder
4. Make sure filenames match exactly (hero-illustration.jpg, etc.)

---

## ⚙️ **Step 4: The Run Helper Script (1 minute)**

```bash
cd /home/kevin/G4_ProjectProposal/kigali-go/

# Make script executable
chmod +x scripts/download_images.sh

# Run helper script
bash scripts/download_images.sh
```

This will:
- Backup your old SVGs
- Check which images you've downloaded
- Give you next steps

---

## 🔄 **Step 5: Update Code to Use JPG (30 seconds)**

```bash
cd /home/kevin/G4_ProjectProposal/kigali-go/

# Make update script executable
chmod +x scripts/update_image_extensions.sh

# Run the update script
bash scripts/update_image_extensions.sh
```

This automatically updates all `.svg` references to `.jpg` in your React components.

---

## ✅ **Step 6: Test the App**

```bash
# Restart your development server
bash scripts/run_project.sh

# Open browser to: http://localhost:3000

# Force refresh (to clear cache): Ctrl + Shift + R
```

---

## 🎯 **Expected Result**

Your app should now show:
- ✅ Real photo of Kigali as hero image
- ✅ Professional bus photo in transport section
- ✅ Motorcycle taxi in transport section
- ✅ Taxi car in transport section
- ✅ Phone with map for route planning
- ✅ Payment app screenshot for fare calculator

---

## 🆘 **Troubleshooting**

### **Images not showing?**

1. Check filenames match exactly:
```bash
cd /home/kevin/G4_ProjectProposal/kigali-go/frontend/public/images/
ls -lh *.jpg
```

2. Clear browser cache: `Ctrl + Shift + R`

3. Check browser console (F12) for errors

4. Verify file extensions were updated:
```bash
grep -r "\.jpg" /home/kevin/G4_ProjectProposal/kigali-go/frontend/src/pages/
```

### **Images too large/slow?**

1. Re-compress using TinyPNG
2. Resize to smaller dimensions:
```bash
# If you have imagemagick installed:
mogrify -resize 1920x1080\> *.jpg
```

3. Convert to WebP (better compression):
```bash
# If you have webp tools:
for img in *.jpg; do cwebp "$img" -o "${img%.jpg}.webp"; done
```

### **Want to revert to SVGs?**

```bash
cd /home/kevin/G4_ProjectProposal/kigali-go/frontend/public/images/
cp svg_backup/*.svg .
```

---

## 📊 **File Size Check**

After setup, verify sizes:

```bash
cd /home/kevin/G4_ProjectProposal/kigali-go/frontend/public/images/
du -h *.jpg
```

**Good:**
- Each image: 200-500KB ✓
- Total: < 2.5MB ✓

**Too large:**
- Any image > 1MB ✗
- Total > 5MB ✗
→ Re-compress using TinyPNG

---

## 🚀 **Super Fast Alternative: Use unDraw**

If downloading photos is taking too long, use illustrations instead:

1. Visit: https://undraw.co/illustrations
2. Click "Color" and set to: `3B82F6`
3. Search and download these (SVG format):
   - "city" → Save as `hero-illustration.svg`
   - "ride" → Save as `transport-bus.svg`
   - "navigator" → Save as `route-planning.svg`
   - "mobile payments" → Save as `fare-calculator.svg`

4. Place in `/frontend/public/images/`
5. Done! (No compression needed, SVGs are already tiny)

**Benefits:**
- ✅ Instant download (small SVG files)
- ✅ Consistent style
- ✅ Customized to your brand colors
- ✅ No compression needed
- ✅ Perfect for web (scalable)

---

## ✨ **Pro Tips**

1. **Mix photos and illustrations:**
   - Use real Kigali photo for hero
   - Use illustrations for feature explanations
   - Best of both worlds!

2. **License safety:**
   - Unsplash: Free for commercial use ✓
   - Pexels: Free for commercial use ✓
   - unDraw: Free for any use ✓

3. **Performance:**
   - Lazy load images below the fold
   - Use WebP format with JPG fallback
   - Compress everything under 500KB

---

**Ready to start? Begin with Step 1 above!** 🎯
