#!/bin/bash

# KigaliGo Image Download Helper Script
# This script helps you download and optimize images for the app

echo "========================================"
echo "KigaliGo Image Setup Helper"
echo "========================================"
echo ""

# Set colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to images directory
cd "$(dirname "$0")/../frontend/public/images" || exit

echo -e "${BLUE}Current directory: $(pwd)${NC}"
echo ""

# Backup existing SVGs
echo -e "${YELLOW}Step 1: Backing up existing SVG files...${NC}"
mkdir -p svg_backup
cp *.svg svg_backup/ 2>/dev/null && echo "✓ SVGs backed up to svg_backup/" || echo "⚠ No SVGs to backup"
echo ""

# Instructions for manual download
echo -e "${GREEN}========================================"
echo "DOWNLOAD INSTRUCTIONS"
echo "========================================${NC}"
echo ""
echo "Please download these images manually:"
echo ""
echo "1. HERO IMAGE (Kigali cityscape):"
echo "   → Open: https://unsplash.com/s/photos/kigali-rwanda"
echo "   → Download any modern cityscape (1920x1080)"
echo "   → Save as: hero-illustration.jpg"
echo ""
echo "2. BUS IMAGE:"
echo "   → Open: https://www.pexels.com/search/public%20bus/"
echo "   → Download side view of modern blue bus"
echo "   → Save as: transport-bus.jpg"
echo ""
echo "3. MOTORCYCLE TAXI:"
echo "   → Open: https://www.pexels.com/search/motorcycle%20taxi/"
echo "   → Download motorcycle with rider"
echo "   → Save as: transport-moto.jpg"
echo ""
echo "4. TAXI CAR:"
echo "   → Open: https://unsplash.com/s/photos/green-taxi"
echo "   → Download green or white taxi"
echo "   → Save as: transport-taxi.jpg"
echo ""
echo "5. PHONE WITH MAP:"
echo "   → Open: https://unsplash.com/s/photos/phone-navigation"
echo "   → Download hand holding phone with map"
echo "   → Save as: route-planning.jpg"
echo ""
echo "6. MOBILE PAYMENT:"
echo "   → Open: https://www.pexels.com/search/mobile%20payment/"
echo "   → Download phone showing payment app"
echo "   → Save as: fare-calculator.jpg"
echo ""
echo -e "${YELLOW}After downloading, save all images to:${NC}"
echo "$(pwd)"
echo ""
echo -e "${GREEN}Press Enter when you've downloaded the images...${NC}"
read -r

# Check which images were downloaded
echo ""
echo -e "${BLUE}Checking downloaded images...${NC}"
echo ""

declare -a images=(
    "hero-illustration.jpg"
    "transport-bus.jpg"
    "transport-moto.jpg"
    "transport-taxi.jpg"
    "route-planning.jpg"
    "fare-calculator.jpg"
)

found=0
missing=0

for img in "${images[@]}"; do
    if [ -f "$img" ]; then
        size=$(du -h "$img" | cut -f1)
        echo -e "✓ ${GREEN}Found: $img ($size)${NC}"
        ((found++))
    else
        echo -e "✗ ${YELLOW}Missing: $img${NC}"
        ((missing++))
    fi
done

echo ""
echo "Found: $found/$((found + missing)) images"
echo ""

if [ $found -gt 0 ]; then
    echo -e "${GREEN}========================================"
    echo "NEXT STEPS"
    echo "========================================${NC}"
    echo ""
    echo "1. Optimize images (RECOMMENDED):"
    echo "   → Visit: https://tinypng.com/"
    echo "   → Upload your downloaded images"
    echo "   → Download compressed versions"
    echo "   → Replace the images in this folder"
    echo ""
    echo "2. Or continue with current images (they may be large)"
    echo ""
    echo "3. Update code to use .jpg instead of .svg:"
    echo "   Run: bash scripts/update_image_extensions.sh"
    echo ""
    echo "4. Test the app:"
    echo "   Run: bash scripts/run_project.sh"
    echo ""
else
    echo -e "${YELLOW}No images found. Please download the images first.${NC}"
fi

echo ""
echo -e "${BLUE}Script completed!${NC}"
