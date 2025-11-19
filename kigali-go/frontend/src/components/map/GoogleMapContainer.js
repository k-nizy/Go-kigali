/**
 * Google Maps Container Component
 * Wrapper component for Google Maps integration
 */

import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';

const GoogleMapContainer = ({
  center,
  zoom = 13,
  children,
  onMapLoad,
  onMapClick,
  mapContainerStyle = { height: '100%', width: '100%' },
  mapOptions = {},
  loading = false,
  error = null,
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Check if Google Maps is fully loaded (including Map constructor)
  useEffect(() => {
    const checkGoogleMapsReady = () => {
      return (
        window.google &&
        window.google.maps &&
        typeof window.google.maps.Map === 'function' &&
        typeof window.google.maps.Marker === 'function'
      );
    };

    if (checkGoogleMapsReady()) {
      setIsLoaded(true);
      return;
    }

    // Wait for Google Maps to fully load (including constructors)
    let checkCount = 0;
    const maxChecks = 100; // 10 seconds max (100 * 100ms)
    
    const checkInterval = setInterval(() => {
      checkCount++;
      
      if (checkGoogleMapsReady()) {
        setIsLoaded(true);
        clearInterval(checkInterval);
      } else if (checkCount >= maxChecks) {
        setLoadError('Google Maps failed to load. Please check your API key and network connection.');
        clearInterval(checkInterval);
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return;

    // Double-check that Map constructor is available
    if (!window.google?.maps?.Map || typeof window.google.maps.Map !== 'function') {
      console.warn('Google Maps Map constructor not ready yet, waiting...');
      // Reset loaded state to trigger re-check
      setIsLoaded(false);
      return;
    }

    try {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: center || { lat: -1.9441, lng: 30.0619 },
        zoom: zoom,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        ...mapOptions,
      });

      setMap(mapInstance);

      if (onMapLoad) {
        onMapLoad(mapInstance);
      }

      if (onMapClick) {
        mapInstance.addListener('click', (e) => {
          onMapClick({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          });
        });
      }
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      setLoadError(`Failed to initialize map: ${error.message}`);
    }
  }, [isLoaded, center, zoom, mapOptions, onMapLoad, onMapClick, map]);

  // Update map center when center prop changes
  useEffect(() => {
    if (map && center) {
      map.setCenter(center);
    }
  }, [map, center]);

  // Update map zoom when zoom prop changes
  useEffect(() => {
    if (map && zoom) {
      map.setZoom(zoom);
    }
  }, [map, zoom]);

  if (loadError || error) {
    return (
      <Box
        sx={{
          height: mapContainerStyle.height || '100%',
          width: mapContainerStyle.width || '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <Alert severity="error">
          {loadError || error || 'Failed to load map'}
        </Alert>
      </Box>
    );
  }

  if (!isLoaded || loading) {
    return (
      <Box
        sx={{
          height: mapContainerStyle.height || '100%',
          width: mapContainerStyle.width || '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', ...mapContainerStyle }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      {map && children && React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { map });
        }
        return child;
      })}
    </Box>
  );
};

export default GoogleMapContainer;


