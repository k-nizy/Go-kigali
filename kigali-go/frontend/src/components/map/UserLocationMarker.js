/**
 * User Location Marker Component for Google Maps
 */

import React, { useEffect, useRef } from 'react';

const UserLocationMarker = ({
  map,
  position,
  showRadius = true,
  radiusKm = 5,
  radiusColor = '#0D7377',
  onLocationUpdate,
}) => {
  const markerRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    if (!map || !position || !position.lat || !position.lng) {
      return;
    }

    // Create user location marker
    const marker = new window.google.maps.Marker({
      position: {
        lat: position.lat,
        lng: position.lng,
      },
      map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#0D7377',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 3,
      },
      title: 'Your Location',
      zIndex: 1000, // Always on top
    });

    markerRef.current = marker;

    // Create radius circle
    if (showRadius) {
      const circle = new window.google.maps.Circle({
        strokeColor: radiusColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: radiusColor,
        fillOpacity: 0.15,
        map,
        center: {
          lat: position.lat,
          lng: position.lng,
        },
        radius: radiusKm * 1000, // Convert km to meters
      });

      circleRef.current = circle;
    }

    if (onLocationUpdate) {
      onLocationUpdate(position);
    }

    // Cleanup
    return () => {
      if (marker) {
        marker.setMap(null);
      }
      if (circleRef.current) {
        circleRef.current.setMap(null);
      }
    };
  }, [map, position, showRadius, radiusKm, radiusColor, onLocationUpdate]);

  // Update marker position when position changes
  useEffect(() => {
    if (markerRef.current && position && position.lat && position.lng) {
      const newPosition = {
        lat: position.lat,
        lng: position.lng,
      };
      markerRef.current.setPosition(newPosition);

      if (circleRef.current) {
        circleRef.current.setCenter(newPosition);
      }
    }
  }, [position?.lat, position?.lng]);

  return null; // This component doesn't render anything directly
};

export default UserLocationMarker;


