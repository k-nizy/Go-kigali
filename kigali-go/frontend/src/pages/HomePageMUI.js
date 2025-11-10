import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  IconButton,
  Paper,
  Skeleton,
} from '@mui/material';
import {
  DirectionsBus,
  DirectionsCar,
  TwoWheeler,
  Map as MapIcon,
  Calculate,
  Report,
  TrendingUp,
  People,
  LocationOn,
  PlayArrow,
  ArrowForward,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    vehicles: 0,
    zones: 0,
    trips: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/v1/statistics');
      if (response.ok) {
        const data = await response.json();
        setStats(data.statistics);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const transportModes = [
    {
      icon: <DirectionsBus sx={{ fontSize: 60 }} />,
      title: 'Bus (Tap&Go)',
      description: 'Public transport with contactless payment',
      color: '#2E77D0',
      price: '500 RWF',
      route: '/map',
    },
    {
      icon: <TwoWheeler sx={{ fontSize: 60 }} />,
      title: 'Motorcycle Taxi',
      description: 'Quick and affordable rides around the city',
      color: '#FFA726',
      price: '800 RWF',
      route: '/map',
    },
    {
      icon: <DirectionsCar sx={{ fontSize: 60 }} />,
      title: 'Taxi',
      description: 'Comfortable private rides for longer distances',
      color: '#E22134',
      price: '1,200 RWF',
      route: '/map',
    },
  ];

  const quickActions = [
    {
      icon: <MapIcon />,
      title: 'Live Map',
      description: 'Track vehicles in real-time',
      route: '/map',
      color: '#1DB954',
    },
    {
      icon: <Calculate />,
      title: 'Fare Calculator',
      description: 'Estimate your trip cost',
      route: '/fare-estimator',
      color: '#2E77D0',
    },
    {
      icon: <Report />,
      title: 'Report Issue',
      description: 'Help improve our service',
      route: '/reports',
      color: '#FFA726',
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      {/* Hero Section - Spotify Style */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #1DB954 0%, #121212 100%)',
          pt: 8,
          pb: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 900,
                mb: 2,
                color: '#fff',
                textShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              KigaliGo
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                color: 'rgba(255,255,255,0.9)',
                maxWidth: '600px',
                fontWeight: 400,
              }}
            >
              Your smart transport companion in Kigali
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              onClick={() => navigate('/map')}
              sx={{
                bgcolor: '#fff',
                color: '#000',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                '&:hover': {
                  bgcolor: '#f0f0f0',
                  transform: 'scale(1.04)',
                },
              }}
            >
              Start Your Journey
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -6 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            { icon: <DirectionsBus />, label: 'Active Vehicles', value: stats.vehicles, color: '#2E77D0' },
            { icon: <LocationOn />, label: 'Service Zones', value: stats.zones, color: '#1DB954' },
            { icon: <People />, label: 'Daily Trips', value: stats.trips || '1,200+', color: '#FFA726' },
          ].map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              {loading ? (
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: '#282828',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}
            </Grid>
          ))}
        </Grid>

        {/* Transport Modes Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#fff' }}>
            Choose Your Ride
          </Typography>
          <Grid container spacing={3}>
            {transportModes.map((mode, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    bgcolor: 'background.paper',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: '#282828',
                      transform: 'translateY(-8px)',
                    },
                  }}
                  onClick={() => navigate(mode.route)}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                    <Box
                      sx={{
                        color: mode.color,
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {mode.icon}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#fff' }}>
                      {mode.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                      {mode.description}
                    </Typography>
                    <Chip
                      label={`Starting at ${mode.price}`}
                      sx={{
                        bgcolor: mode.color,
                        color: '#fff',
                        fontWeight: 600,
                      }}
                    />
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button
                      endIcon={<ArrowForward />}
                      sx={{ color: mode.color, fontWeight: 600 }}
                    >
                      Book Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Quick Actions */}
        <Box>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#fff' }}>
            Quick Actions
          </Typography>
          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: '#282828',
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => navigate(action.route)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Avatar
                      sx={{
                        bgcolor: action.color,
                        width: 56,
                        height: 56,
                        mr: 2,
                      }}
                    >
                      {action.icon}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600, color: '#fff' }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {action.description}
                      </Typography>
                    </Box>
                    <IconButton size="small" sx={{ color: action.color }}>
                      <ArrowForward />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
