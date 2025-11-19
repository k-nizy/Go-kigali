import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  CircularProgress,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Navigation,
  LocationOn,
  AccessTime,
  DirectionsBus,
  DirectionsCar,
  TwoWheeler,
  SwapVert,
  ExpandMore,
  Home,
  Work,
  Star,
  StarBorder,
  Map as MapIcon,
  Route as RouteIcon,
  CompareArrows,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { useThemeMode } from '../ThemeContext';
import GoogleMapsLoader from '../components/map/GoogleMapsLoader';
import GoogleMapContainer from '../components/map/GoogleMapContainer';
import PlacesAutocomplete from '../components/map/PlacesAutocomplete';
import RoutePolyline from '../components/map/RoutePolyline';
import { apiService } from '../services/api';

const PlanTripPageAdvanced = () => {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  
  // Form state
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originLocation, setOriginLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  
  // Route state
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [sortBy, setSortBy] = useState('duration');
  
  // Map state
  const [map, setMap] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -1.9441, lng: 30.0619 }); // Kigali center
  const [mapZoom, setMapZoom] = useState(12);
  
  // Saved locations
  const [savedLocations, setSavedLocations] = useState([]);
  const [loadingSavedLocations, setLoadingSavedLocations] = useState(false);
  
  // Vehicle type filter
  const [selectedModes, setSelectedModes] = useState(['bus', 'taxi', 'moto']);

  // Load saved locations
  useEffect(() => {
    loadSavedLocations();
  }, []);

  // Format currency (RWF)
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0 RWF';
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('RWF', 'RWF');
  };

  const loadSavedLocations = async () => {
    try {
      setLoadingSavedLocations(true);
      const response = await apiService.savedLocations.getAll();
      if (response.data) {
        setSavedLocations(response.data.locations || []);
      }
    } catch (error) {
      console.error('Error loading saved locations:', error);
    } finally {
      setLoadingSavedLocations(false);
    }
  };

  const handleOriginSelect = (location) => {
    setOriginLocation(location);
    setOrigin(location.address || location.name || '');
    if (location.lat && location.lng) {
      setMapCenter({ lat: location.lat, lng: location.lng });
      setMapZoom(14);
    }
  };

  const handleDestinationSelect = (location) => {
    setDestinationLocation(location);
    setDestination(location.address || location.name || '');
  };

  const handlePlanTrip = async () => {
    if (!originLocation || !destinationLocation) {
      toast.error('Please select both origin and destination');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.tripPlanning.plan({
        origin: {
          lat: originLocation.lat,
          lng: originLocation.lng,
        },
        destination: {
          lat: destinationLocation.lat,
          lng: destinationLocation.lng,
        },
        modes: selectedModes,
      });

      if (response.data && response.data.routes) {
        setRoutes(response.data.routes);
        
        // Center map on route
        if (response.data.origin && response.data.destination) {
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(new window.google.maps.LatLng(
            response.data.origin.lat,
            response.data.origin.lng
          ));
          bounds.extend(new window.google.maps.LatLng(
            response.data.destination.lat,
            response.data.destination.lng
          ));
          
          if (map) {
            map.fitBounds(bounds);
          }
        }
        
        toast.success(`Found ${response.data.routes.length} route options`);
      } else {
        toast.error('No routes found');
      }
    } catch (error) {
      console.error('Error planning trip:', error);
      toast.error(error.response?.data?.error || 'Failed to plan trip');
    } finally {
      setLoading(false);
    }
  };

  const swapLocations = () => {
    const tempOrigin = origin;
    const tempOriginLoc = originLocation;
    
    setOrigin(destination);
    setOriginLocation(destinationLocation);
    setDestination(tempOrigin);
    setDestinationLocation(tempOriginLoc);
  };

  const handleSavedLocationClick = (location) => {
    if (!originLocation) {
      setOrigin(location.address || location.name || '');
      setOriginLocation({
        lat: location.lat,
        lng: location.lng,
        address: location.address,
        name: location.name,
      });
    } else if (!destinationLocation) {
      setDestination(location.address || location.name || '');
      setDestinationLocation({
        lat: location.lat,
        lng: location.lng,
        address: location.address,
        name: location.name,
      });
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'bus': return <DirectionsBus />;
      case 'taxi': return <DirectionsCar />;
      case 'moto': return <TwoWheeler />;
      default: return <DirectionsBus />;
    }
  };

  const getVehicleColor = (type) => {
    switch (type) {
      case 'bus': return '#2E77D0';
      case 'taxi': return '#E22134';
      case 'moto': return '#FFA726';
      default: return '#0D7377';
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}min`;
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    
    // Center map on route
    if (originLocation && destinationLocation && map) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(new window.google.maps.LatLng(originLocation.lat, originLocation.lng));
      bounds.extend(new window.google.maps.LatLng(destinationLocation.lat, destinationLocation.lng));
      map.fitBounds(bounds);
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    const sorted = [...routes].sort((a, b) => {
      if (event.target.value === 'duration') {
        return a.duration_minutes - b.duration_minutes;
      } else if (event.target.value === 'fare') {
        return a.estimated_fare - b.estimated_fare;
      } else {
        return a.distance_km - b.distance_km;
      }
    });
    setRoutes(sorted);
  };

  return (
    <GoogleMapsLoader>
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
              {t('plan.title') || 'Advanced Trip Planning'}
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              {t('plan.subtitle') || 'Find the best routes with real-time directions'}
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Trip Planning Form */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={mode === 'dark' ? 0 : 2}
                sx={{
                  p: 4,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  position: 'sticky',
                  top: 20,
                }}
              >
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  {t('plan.enterDetails') || 'Enter Trip Details'}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Origin */}
                  <PlacesAutocomplete
                    value={origin}
                    onChange={setOrigin}
                    onPlaceSelect={handleOriginSelect}
                    label={t('plan.from') || 'From'}
                    placeholder={t('plan.selectLocation') || 'Select origin'}
                    startIcon={<LocationOn sx={{ mr: 1, color: '#0D7377' }} />}
                  />

                  {/* Swap Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <IconButton
                      onClick={swapLocations}
                      sx={{
                        color: 'primary.main',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <SwapVert />
                    </IconButton>
                  </Box>

                  {/* Destination */}
                  <PlacesAutocomplete
                    value={destination}
                    onChange={setDestination}
                    onPlaceSelect={handleDestinationSelect}
                    label={t('plan.to') || 'To'}
                    placeholder={t('plan.selectLocation') || 'Select destination'}
                    startIcon={<Navigation sx={{ mr: 1, color: '#E22134' }} />}
                  />

                  {/* Vehicle Type Filter */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Transport Modes
                    </Typography>
                    <ToggleButtonGroup
                      value={selectedModes}
                      onChange={(e, newModes) => {
                        if (newModes.length > 0) {
                          setSelectedModes(newModes);
                        }
                      }}
                      aria-label="transport modes"
                      size="small"
                    >
                      <ToggleButton value="bus" aria-label="bus">
                        <DirectionsBus sx={{ mr: 1 }} /> Bus
                      </ToggleButton>
                      <ToggleButton value="taxi" aria-label="taxi">
                        <DirectionsCar sx={{ mr: 1 }} /> Taxi
                      </ToggleButton>
                      <ToggleButton value="moto" aria-label="moto">
                        <TwoWheeler sx={{ mr: 1 }} /> Moto
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>

                  {/* Plan Trip Button */}
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handlePlanTrip}
                    disabled={loading || !originLocation || !destinationLocation}
                    startIcon={loading ? <CircularProgress size={20} /> : <Navigation />}
                    sx={{ py: 1.5, fontSize: '1rem', fontWeight: 600 }}
                  >
                    {loading ? t('plan.searching') || 'Searching...' : t('plan.title') || 'Plan Trip'}
                  </Button>
                </Box>

                {/* Saved Locations */}
                {savedLocations.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Saved Locations
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {savedLocations.map((location) => (
                        <Button
                          key={location.id}
                          startIcon={
                            location.location_type === 'home' ? <Home /> :
                            location.location_type === 'work' ? <Work /> :
                            <StarBorder />
                          }
                          onClick={() => handleSavedLocationClick(location)}
                          sx={{
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            bgcolor: mode === 'dark' ? '#282828' : '#F5F7FA',
                            '&:hover': {
                              bgcolor: mode === 'dark' ? '#333' : '#E5E7EB',
                            },
                          }}
                        >
                          {location.name}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Routes Results */}
            <Grid item xs={12} md={7}>
              {routes.length > 0 ? (
                <Box>
                  {/* Sort Controls */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {routes.length} Route Options
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Sort by</InputLabel>
                      <Select
                        value={sortBy}
                        label="Sort by"
                        onChange={handleSortChange}
                      >
                        <MenuItem value="duration">Duration</MenuItem>
                        <MenuItem value="fare">Fare</MenuItem>
                        <MenuItem value="distance">Distance</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Route Cards */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {routes.map((route, index) => (
                      <Card
                        key={index}
                        elevation={selectedRoute === route ? 4 : (mode === 'dark' ? 0 : 2)}
                        onClick={() => handleRouteSelect(route)}
                        sx={{
                          bgcolor: 'background.paper',
                          cursor: 'pointer',
                          border: selectedRoute === route ? '2px solid' : 'none',
                          borderColor: selectedRoute === route ? 'primary.main' : 'transparent',
                          '&:hover': {
                            bgcolor: mode === 'dark' ? '#282828' : '#F9FAFB',
                          },
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ bgcolor: getVehicleColor(route.mode), mr: 2 }}>
                              {getVehicleIcon(route.mode)}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                {route.mode}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {route.summary || 'Direct route'}
                              </Typography>
                            </Box>
                            <Chip
                              label={formatCurrency(route.estimated_fare || 0)}
                              color="primary"
                              sx={{ fontWeight: 600, mr: 1 }}
                            />
                            {selectedRoute === route && (
                              <IconButton size="small" color="primary">
                                <Star />
                              </IconButton>
                            )}
                          </Box>

                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={4}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccessTime sx={{ fontSize: 20, color: 'text.secondary' }} />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Duration
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {formatDuration(route.duration_minutes)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <RouteIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Distance
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {route.distance_km} km
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CompareArrows sx={{ fontSize: 20, color: 'text.secondary' }} />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Fare
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {formatCurrency(route.estimated_fare)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>

                          {/* Step-by-step Instructions */}
                          {route.steps && route.steps.length > 0 && (
                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle2">
                                  Step-by-step Directions ({route.steps.length} steps)
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <List dense>
                                  {route.steps.map((step, stepIndex) => (
                                    <React.Fragment key={stepIndex}>
                                      <ListItem>
                                        <ListItemIcon>
                                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: 12 }}>
                                            {stepIndex + 1}
                                          </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={step.instruction}
                                          secondary={`${step.distance} • ${step.duration}`}
                                        />
                                      </ListItem>
                                      {stepIndex < route.steps.length - 1 && <Divider />}
                                    </React.Fragment>
                                  ))}
                                </List>
                              </AccordionDetails>
                            </Accordion>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Paper
                  elevation={mode === 'dark' ? 0 : 2}
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                  }}
                >
                  <Navigation sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    {t('plan.noResults') || 'Plan your trip to see available routes'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('plan.selectLocation') || 'Select origin and destination to get started'}
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>

          {/* Map with Route Visualization */}
          {routes.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Paper
                elevation={mode === 'dark' ? 0 : 2}
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Route Map
                </Typography>
                <Box sx={{ height: '400px', borderRadius: 1, overflow: 'hidden' }}>
                  <GoogleMapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    onMapLoad={setMap}
                  >
                    {/* Origin Marker */}
                    {originLocation && (
                      <Box>
                        {/* Marker will be added via Google Maps API */}
                      </Box>
                    )}
                    
                    {/* Destination Marker */}
                    {destinationLocation && (
                      <Box>
                        {/* Marker will be added via Google Maps API */}
                      </Box>
                    )}
                    
                    {/* Route Polylines */}
                    {selectedRoute && selectedRoute.polyline && (
                      <RoutePolyline
                        map={map}
                        polyline={selectedRoute.polyline}
                        color={getVehicleColor(selectedRoute.mode)}
                        strokeWeight={5}
                      />
                    )}
                  </GoogleMapContainer>
                </Box>
              </Paper>
            </Box>
          )}
        </Container>
      </Box>
    </GoogleMapsLoader>
  );
};

export default PlanTripPageAdvanced;

