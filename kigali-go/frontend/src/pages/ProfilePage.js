import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
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
import { toast } from 'react-hot-toast';
import { useThemeMode } from '../ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { mode, toggleTheme } = useThemeMode();
  const { user: authUser, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Use real user data from auth, with fallbacks
  const [user, setUser] = useState({
    name: authUser?.name || 'User',
    email: authUser?.email || '',
    phone: '',
    location: '',
    memberSince: authUser?.created_at ? new Date(authUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
    totalTrips: 0,
    favoriteRoute: 'Not set',
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [tripsDialogOpen, setTripsDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });

  // Update user state when authUser changes
  useEffect(() => {
    if (authUser) {
      setUser({
        name: authUser.name || 'User',
        email: authUser.email || '',
        phone: '',
        location: '',
        memberSince: authUser.created_at ? new Date(authUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
        totalTrips: 0,
        favoriteRoute: 'Not set',
      });
    }
  }, [authUser]);

  const recentTrips = [
    { id: 1, from: 'Nyabugogo', to: 'Kimironko', date: '2024-11-01', fare: '500 RWF', time: '08:30 AM' },
    { id: 2, from: 'City Center', to: 'Remera', date: '2024-10-30', fare: '400 RWF', time: '02:15 PM' },
    { id: 3, from: 'Kacyiru', to: 'Gikondo', date: '2024-10-28', fare: '600 RWF', time: '05:45 PM' },
    { id: 4, from: 'Kimironko', to: 'Nyabugogo', date: '2024-10-25', fare: '500 RWF', time: '09:00 AM' },
    { id: 5, from: 'Remera', to: 'Kacyiru', date: '2024-10-22', fare: '350 RWF', time: '11:30 AM' },
  ];

  const handleEditProfile = () => {
    setEditForm({ ...user });
    setEditDialogOpen(true);
  };

  const handleSaveProfile = () => {
    setUser({ ...editForm });
    setEditDialogOpen(false);
    toast.success('Profile updated successfully!');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
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
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
                {user.name}
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                {t('profile.memberSince') || 'Member since'} {user.memberSince}
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
                {t('profile.personalInfo')}
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
                onClick={handleEditProfile}
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
                onClick={() => setTripsDialogOpen(true)}
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
                {t('profile.settings')}
              </Typography>

              <List>
                <ListItem button onClick={() => toast.info('Payment methods coming soon!')}>
                  <ListItemIcon>
                    <Payment color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Payment Methods" />
                </ListItem>
                <Divider />
                <ListItem button onClick={() => setSettingsDialogOpen(true)}>
                  <ListItemIcon>
                    <Settings color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="App Settings" />
                </ListItem>
                <Divider />
                <ListItem button onClick={handleLogout}>
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

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Phone"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              fullWidth
            />
            <TextField
              label="Location"
              value={editForm.location}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveProfile} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* All Trips Dialog */}
      <Dialog open={tripsDialogOpen} onClose={() => setTripsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>All Trips</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
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
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {trip.from} → {trip.to}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {trip.date} at {trip.time}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip label={trip.fare} color="primary" />
                </Box>
              </Paper>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTripsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* App Settings Dialog */}
      <Dialog open={settingsDialogOpen} onClose={() => setSettingsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>App Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={mode === 'dark'}
                  onChange={toggleTheme}
                  color="primary"
                />
              }
              label="Dark Mode"
            />
            <Divider />
            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Notifications
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked color="primary" />}
              label="Trip Updates"
            />
            <FormControlLabel
              control={<Switch defaultChecked color="primary" />}
              label="Promotional Offers"
            />
            <FormControlLabel
              control={<Switch color="primary" />}
              label="Email Notifications"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialogOpen(false)} variant="contained">Done</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
