/**
 * Google Maps utility functions
 */

/* global google */

/**
 * Create custom marker icon for vehicles
 * @param {string} vehicleType - 'bus', 'taxi', or 'moto'
 * @param {string} color - Hex color code
 * @returns {object} Google Maps icon configuration
 */
export const createVehicleIcon = (vehicleType, color) => {
  const icons = {
    bus: '🚌',
    taxi: '🚗',
    moto: '🏍️',
  };

  const emoji = icons[vehicleType] || '📍';

  // Check if Google Maps is loaded
  if (typeof google === 'undefined' || !google.maps) {
    throw new Error('Google Maps API is not loaded');
  }

  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
    label: {
      text: emoji,
      fontSize: '16px',
      fontWeight: 'bold',
    },
  };
};

/**
 * Create custom marker icon for stops
 * @param {string} stopType - 'bus', 'taxi', 'moto', or 'combined'
 * @returns {object} Google Maps icon configuration
 */
export const createStopIcon = (stopType) => {
  const colors = {
    bus: '#2E77D0',
    taxi: '#E22134',
    moto: '#FFA726',
    combined: '#6B7280',
  };

  const color = colors[stopType] || '#6B7280';

  // Check if Google Maps is loaded
  if (typeof google === 'undefined' || !google.maps) {
    throw new Error('Google Maps API is not loaded');
  }

  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 6,
    fillColor: color,
    fillOpacity: 0.8,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
  };
};

/**
 * Get vehicle color by type
 * @param {string} vehicleType - 'bus', 'taxi', or 'moto'
 * @returns {string} Hex color code
 */
export const getVehicleColor = (vehicleType) => {
  const colors = {
    bus: '#2E77D0',
    taxi: '#E22134',
    moto: '#FFA726',
  };
  return colors[vehicleType] || '#6B7280';
};

/**
 * Calculate distance between two points (Haversine formula)
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Format distance for display
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distanceKm) => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
};

/**
 * Format ETA for display
 * @param {number} etaMinutes - Estimated time in minutes
 * @returns {string} Formatted ETA string
 */
export const formatETA = (etaMinutes) => {
  if (etaMinutes < 1) {
    return '< 1 min';
  }
  if (etaMinutes < 60) {
    return `${Math.round(etaMinutes)} min`;
  }
  const hours = Math.floor(etaMinutes / 60);
  const minutes = Math.round(etaMinutes % 60);
  return `${hours}h ${minutes}m`;
};

/**
 * Get default map center (Kigali)
 * @returns {object} {lat, lng}
 */
export const getDefaultMapCenter = () => ({
  lat: -1.9441,
  lng: 30.0619,
});

/**
 * Get default map zoom level
 * @returns {number} Zoom level
 */
export const getDefaultZoom = () => 13;

/**
 * Create circle options for user location radius
 * @param {number} radiusKm - Radius in kilometers
 * @param {string} color - Hex color code
 * @returns {object} Circle options
 */
export const createRadiusCircleOptions = (radiusKm = 5, color = '#0D7377') => {
  return {
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color,
    fillOpacity: 0.15,
    radius: radiusKm * 1000, // Convert km to meters
  };
};

