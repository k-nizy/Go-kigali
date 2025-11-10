import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Edit,
  History,
  Payment,
  Settings,
  Logout,
  DirectionsBus,
  Star,
} from '@mui/icons-material';
import { useThemeMode } from '../ThemeContext';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const [user] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+250 788 123 456',
    location: 'Kigali, Rwanda',
    memberSince: 'January 2024',
    totalTrips: 45,
    favoriteRoute: 'Nyabugogo - Kimironko',
  });

  const recentTrips = [
    { id: 1, from: 'Nyabugogo', to: 'Kimironko', date: '2024-11-01', fare: '500 RWF' },
    { id: 2, from: 'City Center', to: 'Remera', date: '2024-10-30', fare: '400 RWF' },
    { id: 3, from: 'Kacyiru', to: 'Gikondo', date: '2024-10-28', fare: '600 RWF' },
  ];

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: '#fff',
                color: '#0D7377',
                fontSize: '2.5rem',
                fontWeight: 700,
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
                {user.name}
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Member since {user.memberSince}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Profile Info */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={mode === 'dark' ? 0 : 2}
              sx={{
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: mode === 'dark' ? '#fff' : '#1A1A1A' }}>
                Profile Information
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={user.email}
                    secondaryTypographyProps={{
                      sx: { color: 'text.secondary' }
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={user.phone}
                    secondaryTypographyProps={{
                      sx: { color: 'text.secondary' }
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Location"
                    secondary={user.location}
                    secondaryTypographyProps={{
                      sx: { color: 'text.secondary' }
                    }}
                  />
                </ListItem>
              </List>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<Edit />}
                sx={{ mt: 2 }}
              >
                Edit Profile
              </Button>
            </Paper>

            {/* Quick Stats */}
            <Paper
              elevation={mode === 'dark' ? 0 : 2}
              sx={{
                p: 3,
                mt: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: mode === 'dark' ? '#fff' : '#1A1A1A' }}>
                Quick Stats
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Trips
                  </Typography>
                  <Chip label={user.totalTrips} color="primary" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Favorite Route
                  </Typography>
                  <Chip
                    icon={<Star />}
                    label={user.favoriteRoute}
                    size="small"
                    sx={{ bgcolor: mode === 'dark' ? '#282828' : '#F5F7FA' }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={mode === 'dark' ? 0 : 2}
              sx={{
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: mode === 'dark' ? '#fff' : '#1A1A1A' }}>
                Recent Trips
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentTrips.map((trip) => (
                  <Paper
                    key={trip.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: mode === 'dark' ? '#282828' : '#F9FAFB',
                      borderRadius: 1,
                      border: mode === 'dark' ? 'none' : '1px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <DirectionsBus />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: mode === 'dark' ? '#fff' : '#1A1A1A' }}>
                            {trip.from} → {trip.to}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {trip.date}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip label={trip.fare} color="primary" />
                    </Box>
                  </Paper>
                ))}
              </Box>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<History />}
                sx={{ mt: 3 }}
              >
                View All Trips
              </Button>
            </Paper>

            {/* Settings */}
            <Paper
              elevation={mode === 'dark' ? 0 : 2}
              sx={{
                p: 3,
                mt: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: mode === 'dark' ? '#fff' : '#1A1A1A' }}>
                Settings
              </Typography>

              <List>
                <ListItem button>
                  <ListItemIcon>
                    <Payment color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Payment Methods" />
                </ListItem>
                <Divider />
                <ListItem button>
                  <ListItemIcon>
                    <Settings color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="App Settings" />
                </ListItem>
                <Divider />
                <ListItem button>
                  <ListItemIcon>
                    <Logout sx={{ color: '#E22134' }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" sx={{ color: '#E22134' }} />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage;
