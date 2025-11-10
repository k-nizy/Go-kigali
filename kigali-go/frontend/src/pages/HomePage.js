import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../ThemeContext';
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
  const { mode } = useThemeMode();
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
      title: t('fare.modes.bus'),
      description: t('home.transportModes.bus') || 'Affordable public transport across Kigali',
      color: '#2E77D0',
      price: '200-500 RWF',
      route: '/map',
    },
    {
      icon: <TwoWheeler sx={{ fontSize: 60 }} />,
      title: t('fare.modes.moto'),
      description: t('home.transportModes.moto') || 'Quick and flexible rides through traffic',
      color: '#FFA726',
      price: '500-1,000 RWF',
      route: '/map',
    },
    {
      icon: <DirectionsCar sx={{ fontSize: 60 }} />,
      title: t('fare.modes.taxi'),
      description: t('home.transportModes.taxi') || 'Comfortable private rides for longer distances',
      color: '#E22134',
      price: '1,200 RWF',
      route: '/map',
    },
  ];

  const quickActions = [
    {
      icon: <MapIcon />,
      title: t('home.quickActions.viewMap'),
      description: t('home.features.realtime.description'),
      route: '/map',
      color: '#0D7377',
    },
    {
      icon: <Calculate />,
      title: t('home.quickActions.estimateFare'),
      description: t('fare.title'),
      route: '/fare-estimator',
      color: '#2E77D0',
    },
    {
      icon: <Report />,
      title: t('home.quickActions.reportIssue'),
      description: t('reports.title'),
      route: '/reports',
      color: '#FFA726',
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      {/* Hero Section - Modern Teal Style */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #0D7377 0%, #121212 100%)',
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
              {t('home.subtitle')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              onClick={() => navigate('/map')}
              sx={{
                bgcolor: mode === 'dark' ? '#fff' : '#0D7377',
                color: mode === 'dark' ? '#000' : '#fff',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                '&:hover': {
                  bgcolor: mode === 'dark' ? '#f0f0f0' : '#0A5A5D',
                  transform: 'scale(1.04)',
                },
              }}
            >
              {t('home.startJourney') || 'Start Your Journey'}
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            { icon: <DirectionsBus />, label: t('home.stats.vehicles'), value: stats.vehicles, color: '#2E77D0' },
            { icon: <LocationOn />, label: t('home.stats.zones'), value: stats.zones, color: '#0D7377' },
            { icon: <People />, label: t('home.stats.trips'), value: stats.trips || '1,200+', color: '#FFA726' },
          ].map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              {loading ? (
                <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
              ) : (
                <Paper
                  elevation={mode === 'dark' ? 0 : 2}
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    border: mode === 'dark' ? 'none' : '1px solid rgba(0,0,0,0.08)',
                    '&:hover': {
                      bgcolor: mode === 'dark' ? '#282828' : '#F9FAFB',
                      transform: 'translateY(-4px)',
                      boxShadow: mode === 'dark' 
                        ? 'none' 
                        : '0 8px 24px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: stat.color, 
                        mr: 2,
                        width: 56,
                        height: 56,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 700, 
                          color: mode === 'dark' ? '#fff' : '#1A1A1A',
                          mb: 0.5,
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          fontWeight: 500,
                        }}
                      >
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
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: mode === 'dark' ? '#fff' : '#1A1A1A' }}>
            {t('home.chooseRide') || 'Choose Your Ride'}
          </Typography>
          <Grid container spacing={3}>
            {transportModes.map((transportMode, index) => (
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
                      bgcolor: mode === 'dark' ? '#282828' : '#F9FAFB',
                      transform: 'translateY(-8px)',
                    },
                  }}
                  onClick={() => navigate(transportMode.route)}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                    <Box
                      sx={{
                        color: transportMode.color,
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {transportMode.icon}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: mode === 'dark' ? '#fff' : '#1A1A1A' }}>
                      {transportMode.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                      {transportMode.description}
                    </Typography>
                    <Chip
                      label={`Starting at ${transportMode.price}`}
                      sx={{
                        bgcolor: transportMode.color,
                        color: '#fff',
                        fontWeight: 600,
                      }}
                    />
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button
                      endIcon={<ArrowForward />}
                      sx={{ color: transportMode.color, fontWeight: 600 }}
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
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: mode === 'dark' ? '#fff' : '#1A1A1A' }}>
            Quick Actions
          </Typography>
          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={mode === 'dark' ? 0 : 2}
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: mode === 'dark' ? 'none' : '1px solid rgba(0,0,0,0.08)',
                    '&:hover': {
                      bgcolor: mode === 'dark' ? '#282828' : '#F9FAFB',
                      transform: 'translateY(-4px)',
                      boxShadow: mode === 'dark' 
                        ? 'none' 
                        : '0 8px 24px rgba(0,0,0,0.12)',
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
                      <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600, color: mode === 'dark' ? '#fff' : '#1A1A1A' }}>
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
