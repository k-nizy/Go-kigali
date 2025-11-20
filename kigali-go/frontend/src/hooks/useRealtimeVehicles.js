/**
 * Custom hook for real-time vehicle tracking
 * Uses long-polling to fetch vehicle updates
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { apiService } from '../services/api';
import { toast } from 'react-hot-toast';

/**
 * Hook for real-time vehicle tracking
 * @param {Object} options - Configuration options
 * @param {Object} options.location - User location {lat, lng}
 * @param {number} options.radius - Search radius in km (default: 5)
 * @param {string} options.vehicleType - Filter by vehicle type (optional)
 * @param {number} options.interval - Polling interval in milliseconds (default: 20000 = 20s)
 * @param {boolean} options.enabled - Enable/disable polling (default: true)
 * @returns {Object} - {vehicles, loading, error, lastUpdate, refresh}
 */
const useRealtimeVehicles = ({
  location,
  radius = 5.0,
  vehicleType = null,
  interval = 30000, // 30 seconds default (reduced to avoid rate limits)
  enabled = true,
}) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [lastTimestamp, setLastTimestamp] = useState(null);
  
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);
  const lastTimestampRef = useRef(null); // Use ref to avoid dependency issues

  // Fetch vehicles function
  const fetchVehicles = useCallback(async (since = null) => {
    if (!location || !location.lat || !location.lng) {
      return;
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      // Build URL with query params
      let url = `/api/v1/realtime/vehicles/realtime?lat=${encodeURIComponent(location.lat)}&lng=${encodeURIComponent(location.lng)}&radius=${encodeURIComponent(radius)}`;
      
      if (vehicleType) {
        url += `&type=${encodeURIComponent(vehicleType)}`;
      }
      
      if (since) {
        url += `&since=${encodeURIComponent(since)}`;
      }

      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log('API Response:', {
        vehicleCount: data.vehicles?.length || 0,
        totalCount: data.count || 0,
        hasVehicles: !!(data.vehicles && data.vehicles.length > 0),
        timestamp: data.timestamp,
        center: data.center,
        radius: data.radius_km,
      });

      if (isMountedRef.current) {
        if (since && data.vehicles) {
          // Update existing vehicles or add new ones
          setVehicles((prevVehicles) => {
            const vehicleMap = new Map();
            
            // Add existing vehicles to map
            prevVehicles.forEach((v) => {
              vehicleMap.set(v.id, v);
            });
            
            // Update or add new vehicles
            data.vehicles.forEach((v) => {
              vehicleMap.set(v.id, v);
            });
            
            // Convert back to array and sort by distance
            const sorted = Array.from(vehicleMap.values()).sort(
              (a, b) => (a.distance_km || 0) - (b.distance_km || 0)
            );
            console.log('Updated vehicles:', sorted.length);
            return sorted;
          });
        } else {
          // Initial load or full refresh
          const vehiclesList = data.vehicles || [];
          console.log('Setting vehicles:', vehiclesList.length, vehiclesList);
          setVehicles(vehiclesList);
        }
        
        setLastUpdate(new Date());
        setLastTimestamp(data.timestamp);
        lastTimestampRef.current = data.timestamp; // Update ref as well
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // Request was cancelled, ignore
        return;
      }
      
      if (isMountedRef.current) {
        // Handle rate limiting (429 errors)
        if (err.message && err.message.includes('429')) {
          console.warn('Rate limited, backing off...');
          setError('Too many requests. Please wait a moment.');
          // Don't retry immediately on rate limit
          return;
        }
        
        console.error('Error fetching real-time vehicles:', err);
        setError(err.message);
        // Don't show toast for every error to avoid spam
        if (!since) {
          // Only show error on initial load
          toast.error('Failed to load vehicles');
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [location, radius, vehicleType]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchVehicles(null); // Full refresh
  }, [fetchVehicles]);

  // Set up polling
  useEffect(() => {
    if (!enabled || !location || !location.lat || !location.lng) {
      console.log('useRealtimeVehicles: Not enabled or no location', { enabled, location });
      // Clear interval if disabled
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    console.log('useRealtimeVehicles: Starting polling', { location, interval, enabled });

    // Initial fetch immediately
    fetchVehicles(null);

    // Set up interval for polling
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (isMountedRef.current && location && location.lat && location.lng && enabled) {
        console.log('useRealtimeVehicles: Polling update', { lastTimestamp: lastTimestampRef.current });
        // Use ref to get the latest timestamp without causing re-renders
        fetchVehicles(lastTimestampRef.current);
      }
    }, interval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [enabled, location?.lat, location?.lng, interval, fetchVehicles]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    vehicles,
    loading,
    error,
    lastUpdate,
    refresh,
  };
};

export default useRealtimeVehicles;


