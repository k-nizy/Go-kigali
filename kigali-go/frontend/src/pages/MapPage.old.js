import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, Container, Typography, Paper, Button, Grid, Avatar, Skeleton, Chip } from '@mui/material';
import { MyLocation, Refresh, DirectionsBus, DirectionsCar, TwoWheeler, LocationOn } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { useThemeMode } from '../ThemeContext';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons for different vehicle types
const createVehicleIcon = (type, color) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
      <span style="color: white; font-size: 16px;">${type === 'bus' ? '🚌' : type === 'taxi' ? '🚗' : '🏍️'}</span>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Component to recenter map
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  return null;
}

const MapPage = () => {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -1.9441, lng: 30.0619 }); // Kigali center
  const [watchId, setWatchId] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let locationWatchId = null;
    let hasShownError = false;
    
    const initTracking = async () => {
      if (navigator.geolocation) {
        // Check permission status first (if supported)
        if (navigator.permissions) {
          try {
            const permission = await navigator.permissions.query({ name: 'geolocation' });
            console.log('Geolocation permission status:', permission.state);
            
            if (permission.state === 'denied') {
              console.log('Location permission denied, using default center');
              setMapCenter({ lat: -1.9441, lng: 30.0619 });
              return;
            }
          } catch (err) {
            console.log('Permission API not supported');
          }
        }
        
        // Strategy: Try fast network-based location first
        let locationObtained = false;
        
        // Hybrid Strategy: Try GPS first, fall back to network if it fails
        console.log('🔍 Attempting GPS location (high accuracy)...');
        
        // First try: High accuracy GPS
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (!locationObtained) {
              locationObtained = true;
              const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              console.log('✅ GPS Location obtained:', location);
              console.log('   Accuracy:', Math.round(position.coords.accuracy), 'meters');
              
              setUserLocation(location);
              setMapCenter(location);
              
              const accuracy = Math.round(position.coords.accuracy);
              if (accuracy < 100) {
                toast.success(`📍 GPS locked! (±${accuracy}m)`, { 
                  id: 'location-success',
                  duration: 3000 
                });
              } else {
                toast.success(`📍 Location found (±${accuracy}m)`, { 
                  id: 'location-success',
                  duration: 3000 
                });
              }
            }
          },
          (error) => {
            console.log('⚠️ GPS failed (code ' + error.code + '), trying network location...');
            
            // Fallback: Try network-based location
            if (!locationObtained) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  locationObtained = true;
                  const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  };
                  console.log('✅ Network location obtained:', location);
                  console.log('   Accuracy:', Math.round(position.coords.accuracy), 'meters');
                  
                  setUserLocation(location);
                  setMapCenter(location);
                  
                  toast.success('📍 Location found (network-based)', { 
                    id: 'location-success',
                    duration: 3000 
                  });
                },
                (networkError) => {
                  console.log('❌ Network location also failed:', networkError.code);
                  console.log('📍 Using default Kigali center');
                  setMapCenter({ lat: -1.9441, lng: 30.0619 });
                  toast('Using default location. Enable location permissions for accuracy.', {
                    icon: '📍',
                    duration: 4000
                  });
                },
                {
                  enableHighAccuracy: false,
                  timeout: 10000,
                  maximumAge: 60000
                }
              );
            }
          },
          {
            enableHighAccuracy: true,   // Try GPS first
            timeout: 15000,             // Wait 15 seconds for GPS
            maximumAge: 0               // Fresh location
          }
        );
        
        // Continuously track location changes (tries GPS, falls back to network)
        locationWatchId = navigator.geolocation.watchPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(location);
            // Only recenter if accuracy is good
            if (position.coords.accuracy < 1000) {
              setMapCenter(location);
            }
            console.log('📍 Live location updated:', location);
            console.log('   Accuracy:', Math.round(position.coords.accuracy), 'meters');
          },
          (error) => {
            // Silently log errors
            console.log('Watch position error (code ' + error.code + ') - continuing...');
          },
          {
            enableHighAccuracy: true,   // Prefer GPS
            timeout: 20000,             // Generous timeout
            maximumAge: 10000           // Accept location up to 10 seconds old
          }
        );
        setWatchId(locationWatchId);
      } else {
        toast.error('Geolocation is not supported by your browser', { id: 'geo-support' });
      }
    };
    
    initTracking();
    fetchNearbyVehicles();
    
    // Refresh vehicles every 30 seconds
    const intervalId = setInterval(() => {
      fetchNearbyVehicles();
    }, 30000);
    
    return () => {
      // Cleanup: stop watching location and clear interval
      if (locationWatchId) {
        navigator.geolocation.clearWatch(locationWatchId);
      }
      clearInterval(intervalId);
    };
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      toast.loading('Getting precise GPS location...', { id: 'location-loading' });
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setMapCenter(location);
          toast.success(`📍 Location updated! (±${Math.round(position.coords.accuracy)}m)`, { 
            id: 'location-loading', 
            duration: 3000 
          });
          fetchNearbyVehicles(); // Refresh vehicles with new location
        },
        (error) => {
          console.log('Manual location request failed:', error.code);
          toast.error('Unable to get precise location', { 
            id: 'location-loading',
            duration: 3000 
          });
        },
        {
          enableHighAccuracy: true,   // Use GPS for accuracy
          timeout: 30000,             // Wait for GPS
          maximumAge: 0               // Get fresh location
        }
      );
    } else {
      toast.error('Geolocation not supported');
    }
  };

  const fetchNearbyVehicles = async () => {
    try {
      setLoading(true);
      const lat = userLocation?.lat || mapCenter.lat;
      const lng = userLocation?.lng || mapCenter.lng;
      
      const response = await fetch(`/api/v1/vehicles/nearby?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&radius=5.0`);
      if (response.ok) {
        const data = await response.json();
        const validVehicles = (data.vehicles || []).filter(v => v.current_lat && v.current_lng);
        console.log(`Loaded ${validVehicles.length} vehicles with valid coordinates`);
        setVehicles(validVehicles);
      } else {
        toast.error(t('errors.network'));
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error(t('errors.network'));
    } finally {
      setLoading(false);
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'bus':
        return <Bus className="w-4 h-4" />;
      case 'taxi':
        return <Car className="w-4 h-4" />;
      case 'moto':
        return <Bike className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getVehicleColorClass = (type) => {
    switch (type) {
      case 'bus':
        return 'bg-bus';
      case 'taxi':
        return 'bg-taxi';
      case 'moto':
        return 'bg-moto';
      default:
        return 'bg-neutral-500';
    }
  };

  const getVehicleColor = (type) => {
    switch (type) {
      case 'bus': return '#3B82F6'; // blue
      case 'taxi': return '#10B981'; // green
      case 'moto': return '#F59E0B'; // yellow
      default: return '#6B7280'; // gray
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-heading font-bold text-white mb-3 drop-shadow-lg">
                {t('map.title')}
              </h1>
              <p className="text-white/90 text-lg">
                {userLocation ? 'Showing vehicles near your location' : 'Enable location to see nearby vehicles'}
              </p>
            </div>
            <div className="hidden md:block">
              <img 
                src="/images/map-illustration.svg" 
                alt="Map View" 
                className="w-64 h-64 mx-auto drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="card p-0 overflow-hidden">
              <div className="h-[600px] w-full relative">
                <MapContainer
                  center={[mapCenter.lat, mapCenter.lng]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  ref={mapRef}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  <RecenterMap center={mapCenter} />
                  
                  {/* User location marker */}
                  {userLocation && (
                    <>
                      <Marker position={[userLocation.lat, userLocation.lng]}>
                        <Popup>
                          <div className="text-center">
                            <strong>Your Location</strong>
                          </div>
                        </Popup>
                      </Marker>
                      <Circle
                        center={[userLocation.lat, userLocation.lng]}
                        radius={5000}
                        pathOptions={{ color: '#3B82F6', fillColor: '#3B82F6', fillOpacity: 0.1 }}
                      />
                    </>
                  )}
                  
                  {/* Vehicle markers */}
                  {vehicles
                    .filter(vehicle => vehicle.current_lat && vehicle.current_lng)
                    .map((vehicle) => (
                      <Marker
                        key={vehicle.id}
                        position={[vehicle.current_lat, vehicle.current_lng]}
                        icon={createVehicleIcon(vehicle.vehicle_type, getVehicleColor(vehicle.vehicle_type))}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold capitalize mb-1">{vehicle.vehicle_type}</h3>
                            <p className="text-sm text-gray-600 mb-1">{vehicle.registration}</p>
                            {vehicle.operator && (
                              <p className="text-xs text-gray-500">Operator: {vehicle.operator}</p>
                            )}
                            {vehicle.distance_km !== undefined && (
                              <p className="text-xs text-gray-500 mt-1">
                                Distance: {vehicle.distance_km?.toFixed(2)} km
                              </p>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                </MapContainer>
              </div>
              
              {/* Map Controls */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex justify-between items-center">
                  <button
                    onClick={getCurrentLocation}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <MapPin size={16} />
                    <span>Current Location</span>
                  </button>
                  
                  <button
                    onClick={fetchNearbyVehicles}
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle List */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white">
                {t('map.nearbyVehicles')}
              </h2>
              
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton h-16 rounded-lg"></div>
                  ))}
                </div>
              ) : vehicles.length > 0 ? (
                <div className="space-y-3">
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-8 h-8 ${getVehicleColorClass(vehicle.vehicle_type)} rounded-full flex items-center justify-center text-white`}>
                          {getVehicleIcon(vehicle.vehicle_type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-900 dark:text-white capitalize">
                            {vehicle.vehicle_type}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-300">
                            {vehicle.registration}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-neutral-500 dark:text-neutral-400">Distance:</span>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {vehicle.distance_km} km
                          </p>
                        </div>
                        <div>
                          <span className="text-neutral-500 dark:text-neutral-400">ETA:</span>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {vehicle.eta_minutes} min
                          </p>
                        </div>
                      </div>
                      
                      {vehicle.operator && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
                          Operator: {vehicle.operator}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 dark:text-neutral-300">
                    {t('map.noVehicles')}
                  </p>
                  <button
                    onClick={fetchNearbyVehicles}
                    className="btn-outline mt-4"
                  >
                    Refresh
                  </button>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
                {t('map.legend.title')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-bus rounded-full flex items-center justify-center">
                    <Bus className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">{t('map.legend.bus')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-taxi rounded-full flex items-center justify-center">
                    <Car className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">{t('map.legend.taxi')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-moto rounded-full flex items-center justify-center">
                    <Bike className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">{t('map.legend.moto')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
