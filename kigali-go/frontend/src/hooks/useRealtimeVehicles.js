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
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const useRealtimeVehicles = ({
  location,
  radius = 5.0,
  vehicleType = null,
  interval = 30000, // 30 seconds default
  enabled = true,
  retryCount = 0,
  onError = null,
  autoSeed = true, // seed vehicles automatically on initial empty state
}) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const seededRef = useRef(false); // ensure we only trigger auto_seed once per mount

  // Cleanup function
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  // Fetch vehicles function with retry logic
  const fetchVehicles = useCallback(async (since = null, retry = 0) => {
    if (!enabled || !location || !location.lat || !location.lng) {
      return;
    }

    // Clean up any pending requests
    cleanup();
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      // Add cache-busting parameter to avoid stale data
      const timestamp = new Date().getTime();
      
      // Build URL with query params
      let url = `/api/v1/realtime/vehicles/realtime?lat=${encodeURIComponent(location.lat)}&lng=${encodeURIComponent(location.lng)}&radius=${encodeURIComponent(radius)}&_=${timestamp}`;
      if (autoSeed && !since && !seededRef.current) {
        url += `&auto_seed=true`;
      }
      
      if (vehicleType) {
        url += `&type=${encodeURIComponent(vehicleType)}`;
      }
      
      if (since) {
        url += `&since=${encodeURIComponent(since)}`;
      }

      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        credentials: 'include', // Ensure cookies are sent
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      const data = await response.json();
      // Mark that we've attempted seeding on the first successful response
      if (autoSeed && !since) {
        seededRef.current = true;
      }

      if (isMountedRef.current) {
        // Reset retry counter on successful response
        setRetryAttempt(0);
        
        // Log only in development
        if (process.env.NODE_ENV === 'development') {
          console.debug('API Response:', {
            vehicleCount: data.vehicles?.length || 0,
            totalCount: data.count || 0,
            timestamp: data.timestamp,
            center: data.center,
            radius: data.radius_km,
          });
        }

        if (data.vehicles) {
          // Update existing vehicles or add new ones
          setVehicles((prevVehicles) => {
            // If this is a fresh fetch (not an update), replace the entire list
            if (!since) {
              return data.vehicles || [];
            }
            
            // Otherwise, merge with existing vehicles
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
      if (isMountedRef.current) {
        // Handle rate limiting (429 errors)
        if (err.status === 429) {
          const retryAfter = (err.data && err.data.retry_after) || 5; // Default to 5 seconds
          console.warn(`Rate limited. Retrying after ${retryAfter} seconds...`);
          
          // Schedule a retry
          retryTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              fetchVehicles(since, retry + 1);
            }
          }, retryAfter * 1000);
          
          setError('Server is busy. Retrying...');
          return;
        }
        
        // Handle other errors with retry logic
        if (retry < MAX_RETRIES) {
          const delay = RETRY_DELAY * Math.pow(2, retry); // Exponential backoff
          console.warn(`Attempt ${retry + 1} failed. Retrying in ${delay}ms...`);
          
          retryTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              fetchVehicles(since, retry + 1);
            }
          }, delay);
          
          setError(`Connection issue. Retrying... (${retry + 1}/${MAX_RETRIES})`);
        } else {
          // Max retries reached
          console.error('Max retries reached. Giving up.');
          setError('Failed to load vehicles. Please check your connection and try again.');
          if (onError) {
            onError(err);
          }
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
    return fetchVehicles(lastTimestampRef.current);
  }, [fetchVehicles]);

  // Set up polling
  useEffect(() => {
    isMountedRef.current = true;
    
    // Initial fetch
    fetchVehicles(lastTimestampRef.current);
    
    // Set up interval for polling
    if (enabled && interval > 0) {
      intervalRef.current = setInterval(() => {
        // Only fetch if not currently loading and no retry is scheduled
        if (!loading && !retryTimeoutRef.current) {
          fetchVehicles(lastTimestampRef.current);
        }
      }, interval);
    }
    
    // Clean up
    return () => {
      isMountedRef.current = false;
      cleanup();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [location, radius, vehicleType, interval, enabled, fetchVehicles, loading, cleanup]);

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
    retryCount: retryAttempt,
  };
};

export default useRealtimeVehicles;
