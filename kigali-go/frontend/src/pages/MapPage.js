/**
 * Map Page with Google Maps Integration
 * Displays vehicles, stops, and user location on Google Maps
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Avatar,
  Chip,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  MyLocation,
  Refresh,
  DirectionsBus,
  DirectionsCar,
  TwoWheeler,
  LocationOn,
  FilterList,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { useThemeMode } from '../ThemeContext';
import GoogleMapsLoader from '../components/map/GoogleMapsLoader';
import GoogleMapContainer from '../components/map/GoogleMapContainer';
import VehicleMarker from '../components/map/VehicleMarker';
import StopMarker from '../components/map/StopMarker';
import UserLocationMarker from '../components/map/UserLocationMarker';
import { apiService } from '../services/api';
import { getDefaultMapCenter, getVehicleColor } from '../utils/googleMapsUtils';
import useRealtimeVehicles from '../hooks/useRealtimeVehicles';
import useRealtimeLocation from '../hooks/useRealtimeLocation';

const MapPage = () => {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const [map, setMap] = useState(null);
  const [stops, setStops] = useState([]);
  const [mapCenter, setMapCenter] = useState(getDefaultMapCenter());
  const [stopsLoading, setStopsLoading] = useState(false);
  const [showStops, setShowStops] = useState(true);
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds default (reduced to avoid rate limits)
  const [vehiclesState, setVehiclesState] = useState([]); // Local state for vehicles
  const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(true);
  const [autoCenterMap, setAutoCenterMap] = useState(false); // Don't auto-center by default to avoid jarring movements
  const [locationUpdateInterval, setLocationUpdateInterval] = useState(10000); // 10 seconds default

  // Real-time location tracking hook
  const {
    location: userLocation,
    loading: locationLoading,
    error: locationError,
    permissionStatus,
    isTracking,
    isSupported: isLocationSupported,
    requestLocation,
    startTracking,
    stopTracking,
  } = useRealtimeLocation({
    updateInterval: locationUpdateInterval,
    enabled: locationTrackingEnabled,
    highAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
    autoRequest: true,
  });

  // Always use a valid location (userLocation or mapCenter)
  const currentLocation = userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : mapCenter;

  // Real-time vehicle tracking hook
  const {
    vehicles: hookVehicles,
    loading: vehiclesLoading,
    error: vehiclesError,
    lastUpdate,
    refresh: refreshVehicles,
  } = useRealtimeVehicles({
    location: currentLocation,
    radius: 5.0,
    vehicleType: vehicleTypeFilter !== 'all' ? vehicleTypeFilter : null,
    interval: refreshInterval,
    enabled: realtimeEnabled && !!(currentLocation?.lat && currentLocation?.lng),
  });

  // Merge hook vehicles with local state (hook takes priority)
  // Only use local state if hook hasn't loaded anything yet
  const vehicles = hookVehicles.length > 0 ? hookVehicles : (vehiclesState.length > 0 ? vehiclesState : []);

  // Remove duplicate initial load - the hook handles this
  // The useRealtimeVehicles hook will fetch vehicles automatically when enabled

  // Debug: Log vehicles state
  useEffect(() => {
    const vehiclesWithCoords = vehicles.filter(v => v && v.current_lat != null && v.current_lng != null);
    console.log('Vehicles state:', {
      total: vehicles.length,
      withCoords: vehiclesWithCoords.length,
      loading: vehiclesLoading,
      error: vehiclesError,
      location: currentLocation,
      realtimeEnabled,
      mapReady: !!map,
    });
    if (vehiclesWithCoords.length > 0 && map) {
      console.log('Vehicles ready for rendering:', vehiclesWithCoords.map(v => ({
        id: v.id,
        type: v.vehicle_type,
        lat: v.current_lat,
        lng: v.current_lng
      })));
    }
  }, [vehicles, vehiclesLoading, vehiclesError, currentLocation, realtimeEnabled, map]);

  // Handle manual location request
  const getCurrentLocation = useCallback(async () => {
    const location = await requestLocation();
    if (location && map) {
      setMapCenter({ lat: location.lat, lng: location.lng });
      map.setCenter({ lat: location.lat, lng: location.lng });
      map.setZoom(14);
    }
  }, [map, requestLocation]);

  // Update map center when user location changes (if auto-center is enabled)
  useEffect(() => {
    if (autoCenterMap && userLocation && map) {
      map.setCenter({ lat: userLocation.lat, lng: userLocation.lng });
    }
  }, [autoCenterMap, userLocation, map]);

  // Update map center when location is first obtained
  useEffect(() => {
    if (userLocation && map && !mapCenter.lat && !mapCenter.lng) {
      // First time getting location, center the map
      const location = { lat: userLocation.lat, lng: userLocation.lng };
      setMapCenter(location);
      map.setCenter(location);
      map.setZoom(14);
    }
  }, [userLocation, map, mapCenter]);

  // Manual refresh function (for button click)
  const handleManualRefresh = useCallback(async () => {
    console.log('Manual refresh triggered', { currentLocation, realtimeEnabled, vehiclesCount: vehicles.length });

    // Force refresh even if realtime is disabled
    if (currentLocation?.lat && currentLocation?.lng) {
      try {
        let url = `/api/v1/realtime/vehicles/realtime?lat=${encodeURIComponent(currentLocation.lat)}&lng=${encodeURIComponent(currentLocation.lng)}&radius=5&auto_seed=true`;
        if (vehicleTypeFilter && vehicleTypeFilter !== 'all') {
          url += `&type=${encodeURIComponent(vehicleTypeFilter)}`;
        }
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log('Manual refresh loaded:', data.vehicles?.length || 0, 'vehicles');
          if (data.meta && data.meta.seed && data.meta.seed.created > 0) {
            toast.success(`Seeded ${data.meta.seed.created} demo vehicles`);
          }
          if (data.vehicles && data.vehicles.length > 0) {
            setVehiclesState(data.vehicles);
          } else {
            setVehiclesState([]);
          }
        }
      } catch (err) {
        console.error('Manual refresh failed:', err);
      }
    }

    refreshVehicles();
    if (showStops) {
      fetchStops();
    }
  }, [refreshVehicles, showStops, currentLocation, realtimeEnabled, vehicles.length]);

  // Fetch nearby stops with ETA
  const fetchStops = useCallback(async (radius = 5.0, retryWithLargerRadius = true) => {
    const location = userLocation || mapCenter;
    if (!location || !location.lat || !location.lng) {
      console.warn('No location available for fetching stops', { userLocation, mapCenter });
      toast.error('Please enable location to see stops');
      return;
    }

    console.log('Fetching stops for location:', location, 'with radius:', radius);
    // Only set loading on initial call, not retries
    if (radius === 5.0) {
      setStopsLoading(true);
    }

    try {
      // Use stops with ETA endpoint for real-time data
      const response = await apiService.stops.getWithETA(
        location.lat,
        location.lng,
        radius
      );

      console.log('Stops API response:', response.data);

      if (response.data && response.data.stops) {
        const foundStops = response.data.stops;
        setStops(foundStops);
        if (foundStops.length === 0) {
          console.log('No stops found in radius:', radius);
          // Automatically retry with larger radius if enabled
          if (retryWithLargerRadius && radius < 10.0) {
            console.log('Retrying with larger radius:', radius * 2);
            await fetchStops(radius * 2, true);
            return;
          } else {
            // Only show toast if we've exhausted retries
            toast('No stops found nearby. The search radius has been increased automatically.', {
              icon: 'ℹ️',
              duration: 3000,
            });
            setStopsLoading(false);
          }
        } else {
          console.log(`Loaded ${foundStops.length} stops within ${radius}km`);
          setStopsLoading(false);
        }
      } else {
        console.warn('No stops data in response', response);
        setStops([]);
        setStopsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching stops with ETA:', error);

      // Handle rate limiting (429 errors) - don't retry immediately
      if (error.response?.status === 429) {
        console.warn('Rate limited on stops endpoint, skipping retry');
        setStopsLoading(false);
        return;
      }

      // Fallback to regular stops endpoint if ETA endpoint fails
      try {
        const fallbackResponse = await apiService.stops.getNearby(
          location.lat,
          location.lng,
          radius
        );
        if (fallbackResponse.data && fallbackResponse.data.stops) {
          const foundStops = fallbackResponse.data.stops;
          setStops(foundStops);
          if (foundStops.length === 0 && retryWithLargerRadius && radius < 10.0) {
            console.log('Retrying fallback with larger radius:', radius * 2);
            await fetchStops(radius * 2, true);
            return;
          }
          console.log(`Loaded ${foundStops.length} stops from fallback endpoint`);
          setStopsLoading(false);
        } else {
          console.warn('No stops found in fallback response');
          if (retryWithLargerRadius && radius < 10.0) {
            await fetchStops(radius * 2, true);
            return;
          }
          setStops([]);
          setStopsLoading(false);
        }
      } catch (fallbackError) {
        console.error('Fallback stops fetch failed:', fallbackError);
        const errorMsg = fallbackError.response?.data?.error || fallbackError.message || 'Unknown error';
        console.error('Error details:', {
          message: errorMsg,
          status: fallbackError.response?.status,
          location: location,
        });
        // Only show error toast if it's not a simple "no stops found" case
        if (fallbackError.response?.status !== 404) {
          toast.error(`Failed to load stops: ${errorMsg}`);
        }
        setStops([]);
        setStopsLoading(false);
      }
    }
  }, [userLocation, mapCenter]);

  // Initial load
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // Fetch stops when location changes or when toggled on (with debounce to avoid rate limits)
  useEffect(() => {
    if ((userLocation || mapCenter) && showStops) {
      // Debounce stop fetching to avoid rate limits
      const timer = setTimeout(() => {
        fetchStops();
      }, 2000); // Wait 2 seconds before fetching
      return () => clearTimeout(timer);
    } else if (!showStops) {
      // Clear stops when toggled off
      setStops([]);
    }
  }, [userLocation, mapCenter, showStops, fetchStops]);

  // Handle map load
  const handleMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    if (userLocation) {
      mapInstance.setCenter(userLocation);
      mapInstance.setZoom(14);
    }
  }, [userLocation]);

  // Handle vehicle marker click
  const handleVehicleClick = useCallback((vehicle, marker) => {
    setSelectedVehicle(vehicle);
  }, []);

  // Handle stop marker click
  const handleStopClick = useCallback((stop, marker) => {
    // Could show stop details in a sidebar or modal
    console.log('Stop clicked:', stop);
  }, []);

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'bus':
        return <DirectionsBus />;
      case 'taxi':
        return <DirectionsCar />;
      case 'moto':
        return <TwoWheeler />;
      default:
        return <LocationOn />;
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (!v) return false;
    if (vehicleTypeFilter === 'all') return true;
    return v.vehicle_type === vehicleTypeFilter;
  });

  // Debug: Log filtered vehicles for list rendering
  useEffect(() => {
    console.log('Vehicle list state:', {
      totalVehicles: vehicles.length,
      filteredVehicles: filteredVehicles.length,
      vehicleTypeFilter,
      loading: vehiclesLoading,
      error: vehiclesError,
    });
    if (filteredVehicles.length > 0) {
      console.log('Vehicles to display in list:', filteredVehicles.map(v => ({
        id: v.id,
        type: v.vehicle_type,
        registration: v.registration,
        hasCoords: !!(v.current_lat && v.current_lng)
      })));
    }
  }, [vehicles.length, filteredVehicles.length, vehicleTypeFilter, vehiclesLoading, vehiclesError]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            mode === 'dark'
              ? 'linear-gradient(135deg, #0D7377 0%, #121212 100%)'
              : 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
          py: 4,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
            {t('map.title') || 'Live Transport Map'}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            {userLocation
              ? t('map.showingVehicles') || 'Showing vehicles and stops near your location'
              : t('map.noLocation') || 'Enable location to see nearby transport'}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Map Container */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper
              elevation={mode === 'dark' ? 0 : 2}
              sx={{
                overflow: 'hidden',
                borderRadius: 2,
                height: 600,
                position: 'relative',
              }}
            >
              <GoogleMapsLoader>
                <GoogleMapContainer
                  center={mapCenter}
                  zoom={userLocation ? 14 : 13}
                  onMapLoad={handleMapLoad}
                  mapOptions={{
                    styles: mode === 'dark' ? [
                      { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
                      { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
                      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
                    ] : [],
                  }}
                >
                  {/* User Location Marker */}
                  {userLocation && (
                    <UserLocationMarker
                      map={map}
                      position={userLocation}
                      showRadius={true}
                      radiusKm={5}
                      accuracy={userLocation.accuracy}
                      heading={userLocation.heading}
                      animated={true}
                    />
                  )}

                  {/* Vehicle Markers */}
                  {map && filteredVehicles.length > 0 && filteredVehicles
                    .filter(v => v && v.current_lat != null && v.current_lng != null && !isNaN(v.current_lat) && !isNaN(v.current_lng))
                    .map((vehicle) => (
                      <VehicleMarker
                        key={`vehicle-${vehicle.id}`}
                        map={map}
                        vehicle={vehicle}
                        onClick={handleVehicleClick}
                        showInfoWindow={true}
                      />
                    ))}

                  {/* Stop Markers */}
                  {showStops &&
                    stops.map((stop) => (
                      <StopMarker
                        key={stop.id}
                        map={map}
                        stop={stop}
                        onClick={handleStopClick}
                        showInfoWindow={true}
                      />
                    ))}
                </GoogleMapContainer>
              </GoogleMapsLoader>

              {/* Map Controls Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  zIndex: 1000,
                }}
              >
                <IconButton
                  onClick={getCurrentLocation}
                  disabled={locationLoading || !isLocationSupported}
                  sx={{
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.paper' },
                    boxShadow: 2,
                    ...(isTracking && {
                      color: 'primary.main',
                    }),
                    ...(permissionStatus === 'denied' && {
                      color: 'error.main',
                    }),
                  }}
                  title={
                    permissionStatus === 'denied'
                      ? 'Location permission denied. Click to request again.'
                      : isTracking
                        ? 'Location tracking active'
                        : 'Get my location'
                  }
                >
                  {locationLoading ? <CircularProgress size={24} /> : <MyLocation />}
                </IconButton>
                <IconButton
                  onClick={handleManualRefresh}
                  disabled={vehiclesLoading}
                  sx={{
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.paper' },
                    boxShadow: 2,
                  }}
                  title={lastUpdate ? `Last updated: ${new Date(lastUpdate).toLocaleTimeString()}` : 'Refresh'}
                >
                  {vehiclesLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Refresh />
                  )}
                </IconButton>
              </Box>
            </Paper>

            {/* Map Controls */}
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Vehicle Type</InputLabel>
                <Select
                  value={vehicleTypeFilter}
                  label="Vehicle Type"
                  onChange={(e) => setVehicleTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="bus">Bus</MenuItem>
                  <MenuItem value="taxi">Taxi</MenuItem>
                  <MenuItem value="moto">Motorcycle</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant={showStops ? 'contained' : 'outlined'}
                color={showStops ? 'primary' : 'default'}
                onClick={() => {
                  const newValue = !showStops;
                  setShowStops(newValue);
                  // Fetch stops when toggled on
                  if (newValue && currentLocation) {
                    fetchStops();
                  } else if (!newValue) {
                    setStops([]);
                  }
                }}
                size="small"
                startIcon={<LocationOn />}
                sx={{ mr: 1 }}
              >
                {showStops ? 'Hide Stops' : 'Show Stops'}
              </Button>
              <Button
                variant={realtimeEnabled ? 'contained' : 'outlined'}
                color={realtimeEnabled ? 'success' : 'default'}
                onClick={() => {
                  const newValue = !realtimeEnabled;
                  setRealtimeEnabled(newValue);
                  if (newValue) {
                    toast.success('Real-time tracking enabled');
                  } else {
                    toast('Real-time tracking disabled');
                  }
                }}
                size="small"
                startIcon={<Refresh />}
              >
                {realtimeEnabled ? 'Realtime ON' : 'Realtime OFF'}
              </Button>

              <Button
                variant={locationTrackingEnabled ? 'contained' : 'outlined'}
                color={locationTrackingEnabled ? 'primary' : 'default'}
                onClick={() => {
                  const newValue = !locationTrackingEnabled;
                  setLocationTrackingEnabled(newValue);
                  if (newValue) {
                    startTracking();
                    toast.success('Location tracking enabled');
                  } else {
                    stopTracking();
                    toast('Location tracking disabled');
                  }
                }}
                size="small"
                startIcon={<MyLocation />}
                disabled={!isLocationSupported || permissionStatus === 'denied'}
              >
                {locationTrackingEnabled ? 'Location ON' : 'Location OFF'}
              </Button>

              <Button
                variant={autoCenterMap ? 'contained' : 'outlined'}
                color={autoCenterMap ? 'info' : 'default'}
                onClick={() => setAutoCenterMap(!autoCenterMap)}
                size="small"
                startIcon={<MyLocation />}
                title="Auto-center map on your location"
              >
                {autoCenterMap ? 'Auto-Center ON' : 'Auto-Center OFF'}
              </Button>

              {realtimeEnabled && lastUpdate && (
                <Chip
                  label={`Updated ${new Date(lastUpdate).toLocaleTimeString()}`}
                  size="small"
                  color="success"
                  sx={{ ml: 1 }}
                />
              )}

              {isTracking && userLocation && (
                <Chip
                  label={`Location: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`}
                  size="small"
                  color="primary"
                  sx={{ ml: 1 }}
                />
              )}

              {permissionStatus === 'denied' && (
                <Chip
                  label="Location permission denied"
                  size="small"
                  color="error"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
          </Grid>

          {/* Vehicle List Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper
              elevation={mode === 'dark' ? 0 : 2}
              sx={{
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                maxHeight: 600,
                overflow: 'auto',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('map.nearbyVehicles') || 'Nearby Vehicles'}
                </Typography>
                <Chip
                  label={filteredVehicles.length}
                  size="small"
                  color="primary"
                />
              </Box>

              {vehiclesLoading && vehicles.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : vehiclesError ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="error" sx={{ mb: 2 }} variant="body2">
                    Error: {vehiclesError}
                  </Typography>
                  <Button variant="outlined" onClick={refreshVehicles} size="small">
                    Retry
                  </Button>
                </Box>
              ) : filteredVehicles.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {filteredVehicles.slice(0, 10).map((vehicle) => (
                    <Paper
                      key={vehicle.id}
                      elevation={0}
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        if (map && vehicle.current_lat && vehicle.current_lng) {
                          map.setCenter({
                            lat: vehicle.current_lat,
                            lng: vehicle.current_lng,
                          });
                          map.setZoom(15);
                        }
                      }}
                      sx={{
                        p: 2,
                        bgcolor: mode === 'dark' ? '#282828' : '#F9FAFB',
                        borderRadius: 1,
                        border:
                          selectedVehicle?.id === vehicle.id
                            ? '2px solid #0D7377'
                            : mode === 'dark'
                              ? 'none'
                              : '1px solid rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: mode === 'dark' ? '#333' : '#F5F7FA',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: getVehicleColor(vehicle.vehicle_type) }}>
                          {getVehicleIcon(vehicle.vehicle_type)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              color: mode === 'dark' ? '#fff' : '#1A1A1A',
                            }}
                          >
                            {vehicle.vehicle_type}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {vehicle.registration}
                          </Typography>
                          {vehicle.operator && (
                            <Typography variant="caption" color="text.secondary">
                              {vehicle.operator}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          {vehicle.distance_km && (
                            <Chip
                              label={`${vehicle.distance_km.toFixed(1)} km`}
                              size="small"
                              sx={{ mb: 0.5, display: 'block' }}
                            />
                          )}
                          {vehicle.eta_minutes && (
                            <Chip
                              label={`${vehicle.eta_minutes.toFixed(0)} min`}
                              size="small"
                              color="primary"
                            />
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <LocationOn sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No vehicles nearby
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {userLocation
                      ? `No vehicles found within ${5}km of your location. Try refreshing or check if vehicles are active.`
                      : 'Enable location services to see nearby vehicles.'}
                  </Typography>
                  <Button variant="outlined" onClick={handleManualRefresh} sx={{ mt: 2 }}>
                    <Refresh sx={{ mr: 1, fontSize: 18 }} />
                    Refresh
                  </Button>
                  {lastUpdate && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                      Last updated: {new Date(lastUpdate).toLocaleTimeString()}
                    </Typography>
                  )}
                </Box>
              )}
            </Paper>

            {/* Legend */}
            <Paper
              elevation={mode === 'dark' ? 0 : 2}
              sx={{
                p: 3,
                mt: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Vehicle Types
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  { type: 'bus', label: 'Bus', color: '#2E77D0' },
                  { type: 'taxi', label: 'Taxi', color: '#E22134' },
                  { type: 'moto', label: 'Motorcycle', color: '#FFA726' },
                ].map((item) => (
                  <Box key={item.type} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: item.color,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MapPage;
