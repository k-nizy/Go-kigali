/**
 * User Location Marker Component for Google Maps
 * Displays user's current location with optional radius circle
 */

import React, { useEffect, useRef } from 'react';

const UserLocationMarker = ({
  map,
  position,
  showRadius = true,
  radiusKm = 5,
  radiusColor = '#0D7377',
  onLocationUpdate,
  accuracy = null, // Accuracy in meters
  heading = null, // Heading in degrees (0-360)
  animated = true, // Smooth animation when position changes
}) => {
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const accuracyCircleRef = useRef(null);
  const headingLineRef = useRef(null);
  const previousPositionRef = useRef(null);

  // Create marker icon with better visual design
  const createMarkerIcon = () => {
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 12,
      fillColor: '#0D7377',
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 3,
      // Add pulsing effect with outer circle
    };
  };

  // Initialize marker and circle
  useEffect(() => {
    if (!map || !window.google?.maps) {
      return;
    }

    if (!position || !position.lat || !position.lng) {
      // Clear markers if no position
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.setMap(null);
        accuracyCircleRef.current = null;
      }
      if (headingLineRef.current) {
        headingLineRef.current.setMap(null);
        headingLineRef.current = null;
      }
      return;
    }

    const mapPosition = {
      lat: position.lat,
      lng: position.lng,
    };

    // Create or update user location marker
    if (!markerRef.current) {
      markerRef.current = new window.google.maps.Marker({
        position: mapPosition,
        map,
        icon: createMarkerIcon(),
        title: 'Your Location',
        zIndex: 1000, // Always on top
        optimized: false, // Disable optimization for smooth updates
      });
    } else {
      // Smoothly animate position change
      if (animated && previousPositionRef.current) {
        const prevPos = previousPositionRef.current;
        const steps = 10;
        let step = 0;
        
        const animate = () => {
          if (step <= steps && markerRef.current) {
            const lat = prevPos.lat + (mapPosition.lat - prevPos.lat) * (step / steps);
            const lng = prevPos.lng + (mapPosition.lng - prevPos.lng) * (step / steps);
            markerRef.current.setPosition({ lat, lng });
            step++;
            requestAnimationFrame(animate);
          }
        };
        animate();
      } else {
        markerRef.current.setPosition(mapPosition);
      }
    }

    // Create or update radius circle
    if (showRadius) {
      if (!circleRef.current) {
        circleRef.current = new window.google.maps.Circle({
          strokeColor: radiusColor,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: radiusColor,
          fillOpacity: 0.15,
          map,
          center: mapPosition,
          radius: radiusKm * 1000, // Convert km to meters
          zIndex: 1,
        });
      } else {
        circleRef.current.setCenter(mapPosition);
      }
    }

    // Create accuracy circle if accuracy is provided
    if (accuracy && accuracy > 0) {
      if (!accuracyCircleRef.current) {
        accuracyCircleRef.current = new window.google.maps.Circle({
          strokeColor: '#666666',
          strokeOpacity: 0.5,
          strokeWeight: 1,
          fillColor: '#666666',
          fillOpacity: 0.1,
          map,
          center: mapPosition,
          radius: accuracy, // Accuracy in meters
          zIndex: 0,
        });
      } else {
        accuracyCircleRef.current.setCenter(mapPosition);
        accuracyCircleRef.current.setRadius(accuracy);
      }
    } else if (accuracyCircleRef.current) {
      accuracyCircleRef.current.setMap(null);
      accuracyCircleRef.current = null;
    }

    // Create heading indicator if heading is provided
    if (heading !== null && heading !== undefined && !isNaN(heading)) {
      const headingRad = (heading * Math.PI) / 180;
      const lineLength = 50; // meters
      const endLat = mapPosition.lat + (lineLength / 111320) * Math.cos(headingRad);
      const endLng = mapPosition.lng + (lineLength / (111320 * Math.cos(mapPosition.lat * Math.PI / 180))) * Math.sin(headingRad);

      if (!headingLineRef.current) {
        headingLineRef.current = new window.google.maps.Polyline({
          path: [mapPosition, { lat: endLat, lng: endLng }],
          geodesic: true,
          strokeColor: '#0D7377',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          map,
          zIndex: 999,
        });
      } else {
        headingLineRef.current.setPath([mapPosition, { lat: endLat, lng: endLng }]);
      }
    } else if (headingLineRef.current) {
      headingLineRef.current.setMap(null);
      headingLineRef.current = null;
    }

    // Store previous position for animation
    previousPositionRef.current = mapPosition;

    // Callback for location update
    if (onLocationUpdate) {
      onLocationUpdate(position);
    }

    // Cleanup
    return () => {
      // Don't clean up on every render, only on unmount
    };
  }, [map, position, showRadius, radiusKm, radiusColor, onLocationUpdate, accuracy, heading, animated]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.setMap(null);
        accuracyCircleRef.current = null;
      }
      if (headingLineRef.current) {
        headingLineRef.current.setMap(null);
        headingLineRef.current = null;
      }
    };
  }, []);

  return null; // This component doesn't render anything directly
};

export default UserLocationMarker;


