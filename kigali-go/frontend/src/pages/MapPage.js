import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, Typography, Paper, Button, Grid, Avatar, Chip, CircularProgress } from '@mui/material';
import { MyLocation, Refresh, DirectionsBus, DirectionsCar, TwoWheeler, LocationOn } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { toast } from 'react-hot-toast';
import { useThemeMode } from '../ThemeContext';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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

const MapPage = () => {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter] = useState({ lat: -1.9441, lng: 30.0619 });

  const getVehicleColor = (type) => {
    switch (type) {
      case 'bus': return '#2E77D0';
      case 'taxi': return '#E22134';
      case 'moto': return '#FFA726';
      default: return '#6B7280';
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'bus': return <DirectionsBus />;
      case 'taxi': return <DirectionsCar />;
      case 'moto': return <TwoWheeler />;
      default: return <LocationOn />;
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success('Location found!');
        },
        () => {
          toast.error('Could not get your location');
        }
      );
    }
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/vehicles');
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles || []);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    getCurrentLocation();
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: mode === 'dark' 
            ? 'linear-gradient(135deg, #0D7377 0%, #121212 100%)'
            : 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
          py: 8,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#fff', mb: 2 }}>
            {t('map.title')}
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            {userLocation ? t('map.showingVehicles') || 'Showing vehicles near your location' : t('map.noLocation')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Map Container */}
          <Grid item xs={12} lg={8}>
            <Paper
              elevation={mode === 'dark' ? 0 : 2}
              sx={{
                overflow: 'hidden',
                borderRadius: 2,
                height: 600,
              }}
            >
              <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {userLocation && (
                  <>
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                      <Popup>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Your Location
                        </Typography>
                      </Popup>
                    </Marker>
                    <Circle
                      center={[userLocation.lat, userLocation.lng]}
                      radius={5000}
                      pathOptions={{ color: '#0D7377', fillColor: '#0D7377', fillOpacity: 0.1 }}
                    />
                  </>
                )}
                
                {vehicles.filter(v => v.current_lat && v.current_lng).map((vehicle) => (
                  <Marker
                    key={vehicle.id}
                    position={[vehicle.current_lat, vehicle.current_lng]}
                    icon={createVehicleIcon(vehicle.vehicle_type, getVehicleColor(vehicle.vehicle_type))}
                  >
                    <Popup>
                      <Box sx={{ p: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                          {vehicle.vehicle_type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {vehicle.registration}
                        </Typography>
                      </Box>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Paper>
            
            {/* Map Controls */}
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<MyLocation />}
                onClick={getCurrentLocation}
              >
                My Location
              </Button>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={16} /> : <Refresh />}
                onClick={fetchVehicles}
                disabled={loading}
              >
                Refresh
              </Button>
            </Box>
          </Grid>

          {/* Vehicle List */}
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={mode === 'dark' ? 0 : 2}
              sx={{
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: mode === 'dark' ? '#fff' : '#1A1A1A' }}>
                {t('map.nearbyVehicles')}
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[1, 2, 3].map((i) => (
                    <Box key={i} sx={{ height: 80, bgcolor: mode === 'dark' ? '#282828' : '#F5F7FA', borderRadius: 1 }} />
                  ))}
                </Box>
              ) : vehicles.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {vehicles.slice(0, 10).map((vehicle) => (
                    <Paper
                      key={vehicle.id}
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: mode === 'dark' ? '#282828' : '#F9FAFB',
                        borderRadius: 1,
                        border: mode === 'dark' ? 'none' : '1px solid rgba(0,0,0,0.08)',
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
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'capitalize', color: mode === 'dark' ? '#fff' : '#1A1A1A' }}>
                            {vehicle.vehicle_type}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {vehicle.registration}
                          </Typography>
                        </Box>
                        {vehicle.distance_km && (
                          <Chip
                            label={`${vehicle.distance_km.toFixed(1)} km`}
                            size="small"
                            sx={{ bgcolor: mode === 'dark' ? '#181818' : '#fff' }}
                          />
                        )}
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <LocationOn sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary">
                    No vehicles nearby
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={fetchVehicles}
                    sx={{ mt: 2 }}
                  >
                    Refresh
                  </Button>
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
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: mode === 'dark' ? '#fff' : '#1A1A1A' }}>
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
