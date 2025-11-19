/**
 * Stop Marker Component for Google Maps
 */

import React, { useEffect, useRef } from 'react';
import { createStopIcon } from '../../utils/googleMapsUtils';

const StopMarker = ({
  map,
  stop,
  onClick,
  onInfoWindowClose,
  showInfoWindow = true,
}) => {
  const markerRef = useRef(null);
  const infoWindowRef = useRef(null);

  useEffect(() => {
    if (!map || !stop || !stop.lat || !stop.lng) {
      return;
    }

    // Create marker
    const position = {
      lat: stop.lat,
      lng: stop.lng,
    };

    const icon = createStopIcon(stop.stop_type);

    const marker = new window.google.maps.Marker({
      position,
      map,
      icon,
      title: stop.name,
      animation: window.google.maps.Animation.DROP,
    });

    markerRef.current = marker;

    // Create info window content
    const infoWindowContent = `
      <div style="padding: 8px; min-width: 200px; font-family: 'Inter', sans-serif;">
        <div style="font-weight: 600; font-size: 16px; margin-bottom: 8px; color: #1A1A1A;">
          ${stop.name}
        </div>
        ${stop.code ? `
          <div style="font-size: 14px; color: #6B7280; margin-bottom: 4px;">
            <strong>Code:</strong> ${stop.code}
          </div>
        ` : ''}
        <div style="font-size: 14px; color: #6B7280; margin-bottom: 4px; text-transform: capitalize;">
          <strong>Type:</strong> ${stop.stop_type}
        </div>
        ${stop.zone_name ? `
          <div style="font-size: 14px; color: #6B7280; margin-bottom: 4px;">
            <strong>Zone:</strong> ${stop.zone_name}
          </div>
        ` : ''}
        ${stop.distance_km ? `
          <div style="font-size: 14px; color: #0D7377; margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB; font-weight: 500;">
            <strong>Distance:</strong> ${stop.distance_km.toFixed(1)} km
          </div>
        ` : ''}
        ${stop.nearest_vehicle ? `
          <div style="font-size: 14px; color: #0D7377; margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB; font-weight: 600;">
            <strong>Nearest ${stop.nearest_vehicle.type}:</strong> ${stop.nearest_vehicle.registration}<br/>
            <strong>ETA:</strong> ${stop.nearest_vehicle.eta_minutes.toFixed(0)} min (${stop.nearest_vehicle.distance_km.toFixed(1)} km away)
          </div>
        ` : ''}
        ${stop.operating_hours ? `
          <div style="font-size: 12px; color: #9CA3AF; margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
            <strong>Hours:</strong> ${stop.operating_hours}
          </div>
        ` : ''}
      </div>
    `;

    const infoWindow = new window.google.maps.InfoWindow({
      content: infoWindowContent,
    });

    infoWindowRef.current = infoWindow;

    // Handle marker click
    marker.addListener('click', () => {
      if (showInfoWindow) {
        infoWindow.open(map, marker);
      }
      if (onClick) {
        onClick(stop, marker);
      }
    });

    // Handle info window close
    infoWindow.addListener('closeclick', () => {
      if (onInfoWindowClose) {
        onInfoWindowClose(stop);
      }
    });

    // Cleanup
    return () => {
      if (marker) {
        marker.setMap(null);
      }
      if (infoWindow) {
        infoWindow.close();
      }
    };
  }, [map, stop, onClick, onInfoWindowClose, showInfoWindow]);

  return null; // This component doesn't render anything directly
};

export default StopMarker;

