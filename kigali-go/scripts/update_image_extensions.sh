#!/bin/bash

# Update image file extensions from .svg to .jpg in React components

echo "========================================"
echo "Updating Image Extensions"
echo "========================================"
echo ""

cd "$(dirname "$0")/../frontend/src" || exit

echo "Searching for .svg references in React files..."
echo ""

# Find all .js files and update .svg to .jpg
find . -name "*.js" -type f | while read -r file; do
    if grep -q '\.svg' "$file"; then
        echo "Updating: $file"
        sed -i 's/hero-illustration\.svg/hero-illustration.jpg/g' "$file"
        sed -i 's/transport-bus\.svg/transport-bus.jpg/g' "$file"
        sed -i 's/transport-moto\.svg/transport-moto.jpg/g' "$file"
        sed -i 's/transport-taxi\.svg/transport-taxi.jpg/g' "$file"
        sed -i 's/route-planning\.svg/route-planning.jpg/g' "$file"
        sed -i 's/fare-calculator\.svg/fare-calculator.jpg/g' "$file"
        sed -i 's/map-illustration\.svg/map-illustration.jpg/g' "$file"
        sed -i 's/safety-illustration\.svg/safety-illustration.jpg/g' "$file"
    fi
done

echo ""
echo "✓ Image extensions updated!"
echo ""
echo "NOTE: Keep logo.svg as SVG (it's optimized)"
echo ""
echo "Next steps:"
echo "1. Clear browser cache (Ctrl+Shift+R)"
echo "2. Restart dev server"
echo "3. Check if images load correctly"
