/**
 * Custom hook for real-time user location tracking
 * Uses browser Geolocation API with configurable update interval
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';

/**
 * Hook for real-time user location tracking
 * @param {Object} options - Configuration options
 * @param {number} options.updateInterval - Update interval in milliseconds (default: 10000 = 10s)
 * @param {boolean} options.enabled - Enable/disable tracking (default: true)
 * @param {boolean} options.highAccuracy - Use high accuracy mode (default: true)
 * @param {number} options.timeout - Geolocation timeout in milliseconds (default: 10000)
 * @param {number} options.maximumAge - Maximum age of cached position in milliseconds (default: 0)
 * @param {boolean} options.autoRequest - Automatically request location on mount (default: true)
 * @returns {Object} - {location, loading, error, permissionStatus, requestLocation, stopTracking}
 */
const useRealtimeLocation = ({
  updateInterval = 10000, // 10 seconds default (configurable 5-15s)
  enabled = true,
  highAccuracy = true,
  timeout = 10000,
  maximumAge = 0,
  autoRequest = true,
} = {}) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const [isTracking, setIsTracking] = useState(false);

  const watchIdRef = useRef(null);
  const intervalIdRef = useRef(null);
  const isMountedRef = useRef(true);
  const lastLocationRef = useRef(null);

  // Check geolocation support
  const isGeolocationSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator;

  // Check permission status
  const checkPermission = useCallback(async () => {
    if (!isGeolocationSupported) {
      setPermissionStatus('unsupported');
      return 'unsupported';
    }

    // Check if Permissions API is available
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        const status = result.state; // 'granted', 'denied', or 'prompt'
        setPermissionStatus(status);
        return status;
      } catch (err) {
        // Permissions API might not be fully supported, fall back to default
        console.warn('Permissions API not fully supported:', err);
        setPermissionStatus('prompt');
        return 'prompt';
      }
    } else {
      // Permissions API not available, assume prompt
      setPermissionStatus('prompt');
      return 'prompt';
    }
  }, [isGeolocationSupported]);

  // Get current position (one-time)
  const getCurrentPosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!isGeolocationSupported) {
        const err = new Error('Geolocation is not supported by your browser');
        reject(err);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          };
          resolve(newLocation);
        },
        (err) => {
          reject(err);
        },
        {
          enableHighAccuracy: highAccuracy,
          timeout,
          maximumAge,
        }
      );
    });
  }, [isGeolocationSupported, highAccuracy, timeout, maximumAge]);

  // Request location (one-time)
  const requestLocation = useCallback(async () => {
    if (!isGeolocationSupported) {
      const err = new Error('Geolocation is not supported by your browser');
      setError(err.message);
      toast.error('Geolocation is not supported by your browser');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const newLocation = await getCurrentPosition();
      
      if (isMountedRef.current) {
        setLocation(newLocation);
        lastLocationRef.current = newLocation;
        setPermissionStatus('granted');
        toast.success('Location found!');
      }
      
      return newLocation;
    } catch (err) {
      if (isMountedRef.current) {
        let errorMessage = 'Could not get your location';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location services in your browser settings.';
            setPermissionStatus('denied');
            toast.error(errorMessage, { duration: 5000 });
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            toast.error(errorMessage);
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            toast.error(errorMessage);
            break;
          default:
            errorMessage = err.message || 'Unknown error occurred';
            toast.error(errorMessage);
        }
        
        setError(errorMessage);
      }
      return null;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [isGeolocationSupported, getCurrentPosition]);

  // Start continuous tracking
  const startTracking = useCallback(() => {
    if (!isGeolocationSupported) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    if (watchIdRef.current !== null) {
      // Already tracking
      return;
    }

    setError(null);
    setIsTracking(true);

    // Use watchPosition for continuous updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        };

        if (isMountedRef.current) {
          // Only update if location changed significantly (optional optimization)
          const lastLoc = lastLocationRef.current;
          if (!lastLoc || 
              Math.abs(newLocation.lat - lastLoc.lat) > 0.0001 || 
              Math.abs(newLocation.lng - lastLoc.lng) > 0.0001) {
            setLocation(newLocation);
            lastLocationRef.current = newLocation;
            setPermissionStatus('granted');
          }
        }
      },
      (err) => {
        if (isMountedRef.current) {
          let errorMessage = 'Location tracking error';
          
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              setPermissionStatus('denied');
              setIsTracking(false);
              toast.error('Location permission denied. Please enable location services.', { duration: 5000 });
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              // Don't show toast for every position unavailable error
              break;
            case err.TIMEOUT:
              errorMessage = 'Location request timed out';
              // Don't show toast for timeout during tracking
              break;
            default:
              errorMessage = err.message || 'Unknown error';
          }
          
          setError(errorMessage);
        }
      },
      {
        enableHighAccuracy: highAccuracy,
        timeout,
        maximumAge,
      }
    );

    // Also set up interval-based updates as a fallback/additional mechanism
    // This ensures updates even if watchPosition doesn't fire frequently enough
    if (updateInterval > 0) {
      intervalIdRef.current = setInterval(async () => {
        try {
          const newLocation = await getCurrentPosition();
          if (isMountedRef.current && newLocation) {
            setLocation(newLocation);
            lastLocationRef.current = newLocation;
          }
        } catch (err) {
          // Silently handle errors during interval updates
          // watchPosition will handle the main error reporting
          console.warn('Interval location update failed:', err);
        }
      }, updateInterval);
    }
  }, [isGeolocationSupported, highAccuracy, timeout, maximumAge, updateInterval, getCurrentPosition]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    
    setIsTracking(false);
  }, []);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  // Auto-request location if enabled
  useEffect(() => {
    if (autoRequest && enabled && permissionStatus === 'prompt' && !location) {
      requestLocation();
    }
  }, [autoRequest, enabled, permissionStatus, location, requestLocation]);

  // Start/stop tracking based on enabled state
  useEffect(() => {
    if (enabled && permissionStatus !== 'denied' && permissionStatus !== 'unsupported') {
      // If we have permission or it's prompt, start tracking
      if (permissionStatus === 'granted' || permissionStatus === 'prompt') {
        startTracking();
      }
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [enabled, permissionStatus, startTracking, stopTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      stopTracking();
    };
  }, [stopTracking]);

  return {
    location,
    loading,
    error,
    permissionStatus,
    isTracking,
    isSupported: isGeolocationSupported,
    requestLocation,
    startTracking,
    stopTracking,
    checkPermission,
  };
};

export default useRealtimeLocation;

