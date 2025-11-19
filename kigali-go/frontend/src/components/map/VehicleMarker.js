/**
 * Vehicle Marker Component for Google Maps
 */

import React, { useEffect, useRef, useState } from 'react';
import { createVehicleIcon, getVehicleColor } from '../../utils/googleMapsUtils';

const VehicleMarker = ({
  map,
  vehicle,
  onClick,
  onInfoWindowClose,
  showInfoWindow = true,
}) => {
  const markerRef = useRef(null);
  const infoWindowRef = useRef(null);
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);

  useEffect(() => {
    if (!map || !vehicle || vehicle.current_lat == null || vehicle.current_lng == null) {
      return;
    }

    // Validate coordinates
    if (isNaN(vehicle.current_lat) || isNaN(vehicle.current_lng)) {
      return;
    }

    // Don't recreate if marker already exists
    if (markerRef.current) {
      return;
    }

    // Create marker
    const position = {
      lat: parseFloat(vehicle.current_lat),
      lng: parseFloat(vehicle.current_lng),
    };

    const icon = createVehicleIcon(vehicle.vehicle_type, getVehicleColor(vehicle.vehicle_type));

    const marker = new window.google.maps.Marker({
      position,
      map,
      icon,
      title: `${vehicle.vehicle_type} - ${vehicle.registration}`,
      animation: window.google.maps.Animation.DROP,
    });

    markerRef.current = marker;

    // Create info window content
    const infoWindowContent = `
      <div style="padding: 8px; min-width: 200px; font-family: 'Inter', sans-serif;">
        <div style="font-weight: 600; font-size: 16px; margin-bottom: 8px; text-transform: capitalize; color: #1A1A1A;">
          ${vehicle.vehicle_type}
        </div>
        <div style="font-size: 14px; color: #6B7280; margin-bottom: 4px;">
          <strong>Registration:</strong> ${vehicle.registration}
        </div>
        ${vehicle.operator ? `
          <div style="font-size: 14px; color: #6B7280; margin-bottom: 4px;">
            <strong>Operator:</strong> ${vehicle.operator}
          </div>
        ` : ''}
        ${vehicle.distance_km ? `
          <div style="font-size: 14px; color: #6B7280; margin-bottom: 4px;">
            <strong>Distance:</strong> ${vehicle.distance_km.toFixed(1)} km
          </div>
        ` : ''}
        ${vehicle.eta_minutes ? `
          <div style="font-size: 14px; color: #0D7377; margin-bottom: 4px; font-weight: 500;">
            <strong>ETA:</strong> ${vehicle.eta_minutes.toFixed(0)} min
          </div>
        ` : ''}
        ${vehicle.route_name ? `
          <div style="font-size: 14px; color: #6B7280; margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
            <strong>Route:</strong> ${vehicle.route_name}
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
        setIsInfoWindowOpen(true);
      }
      if (onClick) {
        onClick(vehicle, marker);
      }
    });

    // Handle info window close
    infoWindow.addListener('closeclick', () => {
      setIsInfoWindowOpen(false);
      if (onInfoWindowClose) {
        onInfoWindowClose(vehicle);
      }
    });

    // Cleanup
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
    };
  }, [map, vehicle?.id]); // Only depend on map and vehicle ID to prevent infinite re-renders

  // Update marker position if vehicle location changes
  useEffect(() => {
    if (markerRef.current && vehicle && vehicle.current_lat && vehicle.current_lng) {
      const newPosition = {
        lat: vehicle.current_lat,
        lng: vehicle.current_lng,
      };
      markerRef.current.setPosition(newPosition);

      // Update icon if vehicle type changed
      if (vehicle.vehicle_type) {
        const icon = createVehicleIcon(vehicle.vehicle_type, getVehicleColor(vehicle.vehicle_type));
        markerRef.current.setIcon(icon);
      }
    }
  }, [vehicle?.current_lat, vehicle?.current_lng, vehicle?.vehicle_type]);

  // Open info window programmatically
  useEffect(() => {
    if (isInfoWindowOpen && markerRef.current && infoWindowRef.current && map) {
      infoWindowRef.current.open(map, markerRef.current);
    }
  }, [isInfoWindowOpen, map]);

  return null; // This component doesn't render anything directly
};

export default VehicleMarker;


