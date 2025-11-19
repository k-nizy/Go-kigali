/**
 * Route Polyline Component for Google Maps
 * Displays route path on map using encoded polyline
 */

import React, { useEffect, useRef } from 'react';

const RoutePolyline = ({
  map,
  polyline,
  color = '#0D7377',
  strokeWeight = 4,
  strokeOpacity = 0.8,
  zIndex = 1,
  onClick,
}) => {
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!map || !polyline) {
      return;
    }

    // Decode polyline
    if (typeof polyline === 'string') {
      try {
        // Decode polyline using Google Maps geometry library
        if (!window.google?.maps?.geometry?.encoding) {
          console.error('Google Maps geometry library not loaded. Ensure "geometry" is included in libraries.');
          return;
        }
        
        const decodedPath = window.google.maps.geometry.encoding.decodePath(polyline);
        
        const routePolyline = new window.google.maps.Polyline({
          path: decodedPath,
          geodesic: true,
          strokeColor: color,
          strokeOpacity: strokeOpacity,
          strokeWeight: strokeWeight,
          zIndex: zIndex,
          map: map,
        });

        polylineRef.current = routePolyline;

        if (onClick) {
          routePolyline.addListener('click', onClick);
        }
      } catch (error) {
        console.error('Error decoding polyline:', error);
      }
    } else if (Array.isArray(polyline)) {
      // If polyline is already an array of coordinates
      const routePolyline = new window.google.maps.Polyline({
        path: polyline.map(p => ({ lat: p.lat, lng: p.lng })),
        geodesic: true,
        strokeColor: color,
        strokeOpacity: strokeOpacity,
        strokeWeight: strokeWeight,
        zIndex: zIndex,
        map: map,
      });

      polylineRef.current = routePolyline;

      if (onClick) {
        routePolyline.addListener('click', onClick);
      }
    }

    // Cleanup
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, polyline, color, strokeOpacity, strokeWeight, zIndex, onClick]);

  // Update polyline when props change
  useEffect(() => {
    if (polylineRef.current && color) {
      polylineRef.current.setOptions({
        strokeColor: color,
        strokeOpacity: strokeOpacity,
        strokeWeight: strokeWeight,
      });
    }
  }, [color, strokeOpacity, strokeWeight]);

  return null; // This component doesn't render anything directly
};

export default RoutePolyline;

