import React, { useState } from 'react';
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
  Autocomplete,
} from '@mui/material';
import {
  Navigation,
  LocationOn,
  AccessTime,
  DirectionsBus,
  DirectionsCar,
  TwoWheeler,
  SwapVert,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { useThemeMode } from '../ThemeContext';

const PlanTripPage = () => {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);

  const popularLocations = [
    'Nyabugogo', 'City Center', 'Nyamirambo', 'Kimironko', 'Remera',
    'Kacyiru', 'Gikondo', 'Kabeza', 'Kanombe', 'Kicukiro',
    'Kigali International Airport', 'University of Rwanda', 'Kigali Convention Centre',
  ];

  const handlePlanTrip = async () => {
    if (!origin || !destination) {
      toast.error(t('errors.validation'));
      return;
    }

    setLoading(true);
    try {
      // Try API first
      const response = await fetch('/api/v1/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination }),
      });

      if (response.ok) {
        const data = await response.json();
        setRoutes(data.routes || []);
        toast.success(t('plan.searching'));
      } else {
        // Fallback to mock data if API fails (with randomized fares)
        const taxiFare = [7000, 8000, 9000][Math.floor(Math.random() * 3)];
        const motoFare = Math.floor(Math.random() * 1001) + 1000; // 1000-2000
        
        const mockRoutes = [
          {
            vehicle_type: 'bus',
            route_number: '101',
            fare: 500,
            duration: '15-20',
            distance: '5.2',
            stops: [origin, 'Nyabugogo', destination],
          },
          {
            vehicle_type: 'taxi',
            route_number: 'Direct',
            fare: taxiFare,
            duration: '10-15',
            distance: '5.2',
            stops: [origin, destination],
          },
          {
            vehicle_type: 'moto',
            route_number: 'Express',
            fare: motoFare,
            duration: '8-12',
            distance: '5.2',
            stops: [origin, destination],
          },
        ];
        setRoutes(mockRoutes);
        toast.success(t('plan.searching'));
      }
    } catch (error) {
      console.error('Error planning trip:', error);
      // Use mock data on error
      const mockRoutes = [
        {
          vehicle_type: 'bus',
          route_number: '101',
          fare: 500,
          duration: '15-20',
          distance: '5.2',
          stops: [origin, 'Nyabugogo', destination],
        },
        {
          vehicle_type: 'taxi',
          route_number: 'Direct',
          fare: 1200,
          duration: '10-15',
          distance: '5.2',
          stops: [origin, destination],
        },
        {
          vehicle_type: 'moto',
          route_number: 'Express',
          fare: 800,
          duration: '8-12',
          distance: '5.2',
          stops: [origin, destination],
        },
      ];
      setRoutes(mockRoutes);
      toast.success(t('plan.searching'));
    } finally {
      setLoading(false);
    }
  };

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
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
            {t('plan.title')}
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            {t('plan.subtitle') || 'Find the best routes and transportation options'}
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
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: mode === 'dark' ? '#fff' : '#1A1A1A' }}>
                {t('plan.enterDetails') || 'Enter Trip Details'}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Autocomplete
                  freeSolo
                  options={popularLocations}
                  value={origin}
                  onChange={(e, newValue) => setOrigin(newValue || '')}
                  onInputChange={(e, newValue) => setOrigin(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('plan.from')}
                      placeholder={t('plan.selectLocation')}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: <LocationOn sx={{ mr: 1, color: '#0D7377' }} />,
                      }}
                    />
                  )}
                />

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    onClick={swapLocations}
                    sx={{
                      minWidth: 'auto',
                      p: 1,
                      color: 'primary.main',
                    }}
                  >
                    <SwapVert />
                  </Button>
                </Box>

                <Autocomplete
                  freeSolo
                  options={popularLocations}
                  value={destination}
                  onChange={(e, newValue) => setDestination(newValue || '')}
                  onInputChange={(e, newValue) => setDestination(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('plan.to')}
                      placeholder={t('plan.selectLocation')}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: <Navigation sx={{ mr: 1, color: '#E22134' }} />,
                      }}
                    />
                  )}
                />

                <Button
                  variant="contained"
                  size="large"
                  onClick={handlePlanTrip}
                  disabled={loading || !origin || !destination}
                  startIcon={loading ? <CircularProgress size={20} /> : <Navigation />}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {loading ? t('plan.searching') : t('plan.title')}
                </Button>
              </Box>

              {/* Popular Destinations */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                  {t('plan.popularDestinations') || 'Popular Destinations'}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {popularLocations.slice(0, 6).map((location) => (
                    <Chip
                      key={location}
                      label={location}
                      onClick={() => setDestination(location)}
                      sx={{
                        bgcolor: mode === 'dark' ? '#282828' : '#F5F7FA',
                        '&:hover': {
                          bgcolor: mode === 'dark' ? '#333' : '#E5E7EB',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Routes Results */}
          <Grid item xs={12} md={7}>
            {routes.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: mode === 'dark' ? '#fff' : '#1A1A1A' }}>
                  {t('plan.routeOptions.title')}
                </Typography>
                {routes.map((route, index) => (
                  <Card
                    key={index}
                    elevation={mode === 'dark' ? 0 : 2}
                    sx={{
                      bgcolor: 'background.paper',
                      '&:hover': {
                        bgcolor: mode === 'dark' ? '#282828' : '#F9FAFB',
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: getVehicleColor(route.vehicle_type), mr: 2 }}>
                          {getVehicleIcon(route.vehicle_type)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                            {route.vehicle_type || 'Bus'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Route {route.route_number || index + 1}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${route.fare || 500} RWF`}
                          color="primary"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('plan.tripDetails.duration')}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {route.duration || '15-20'} min
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('plan.tripDetails.distance')}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {route.distance || '5.2'} km
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      {route.stops && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="caption" color="text.secondary">
                            {t('plan.tripDetails.steps')}: {route.stops.join(' → ')}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
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
                  {t('plan.selectLocation')}
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PlanTripPage;
