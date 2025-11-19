/**
 * Google Maps Script Loader Component
 * Loads Google Maps script dynamically
 */

import { useEffect, useState } from 'react';
import { CircularProgress, Box, Alert } from '@mui/material';

const GoogleMapsLoader = ({ children, apiKey }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
        } else {
          setError('Google Maps failed to load');
        }
      });
      existingScript.addEventListener('error', () => {
        setError('Failed to load Google Maps script');
      });
      return;
    }

    // Get API key from environment or prop
    const key = apiKey || process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    // Debug: Log if key is missing (remove in production)
    if (process.env.NODE_ENV === 'development' && !key) {
      console.warn('Google Maps API key not found. Check:', {
        apiKeyProp: !!apiKey,
        envVar: process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? 'Set' : 'Missing',
        allEnvVars: Object.keys(process.env).filter(k => k.includes('GOOGLE')),
      });
    }

    if (!key) {
      setError(
        'Google Maps API key is not configured. ' +
        'Please set REACT_APP_GOOGLE_MAPS_API_KEY in your frontend/.env file and restart the server.'
      );
      return;
    }

    // Create and load script with async loading (best practice)
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places,geometry,drawing&loading=async`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Wait a bit for all constructors to be available
      const checkReady = () => {
        if (
          window.google &&
          window.google.maps &&
          typeof window.google.maps.Map === 'function' &&
          typeof window.google.maps.Marker === 'function'
        ) {
          setIsLoaded(true);
        } else {
          // Retry after a short delay
          setTimeout(checkReady, 50);
        }
      };
      
      // Start checking after a small delay to allow API to fully initialize
      setTimeout(checkReady, 100);
    };

    script.onerror = () => {
      setError('Failed to load Google Maps script. Please check your API key and network connection.');
    };

    document.head.appendChild(script);

    // Cleanup
    return () => {
      // Don't remove script on unmount as it may be used by other components
    };
  }, [apiKey]);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!isLoaded) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};

export default GoogleMapsLoader;

