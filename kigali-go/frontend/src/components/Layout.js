import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Avatar,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Home,
  Map,
  Navigation,
  Report,
  Person,
  Menu as MenuIcon,
  Language,
  DirectionsBus,
  LightMode,
  DarkMode,
  Login,
  PersonAdd,
  Logout,
} from '@mui/icons-material';
import { useThemeMode } from '../ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

const LayoutMUI = ({ children }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const { user, isAuthenticated, signOut } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);

  const navigationItems = [
    { path: '/', icon: <Home />, label: t('navigation.home') },
    { path: '/map', icon: <Map />, label: t('navigation.map') },
    { path: '/plan', icon: <Navigation />, label: t('navigation.plan') },
    { path: '/reports', icon: <Report />, label: t('navigation.reports') },
    { path: '/profile', icon: <Person />, label: t('navigation.profile') },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLanguageClick = (event) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLangAnchorEl(null);
  };

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    handleLanguageClose();
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    await signOut();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      bgcolor: mode === 'dark' ? '#000' : '#FFFFFF',
      display: 'flex', 
      flexDirection: 'column',
      borderRight: mode === 'dark' ? 'none' : '1px solid rgba(0,0,0,0.12)',
    }}>
      {/* Logo */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
              mr: 2,
            }}
          >
            <DirectionsBus />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, color: mode === 'dark' ? '#fff' : '#1A1A1A' }}>
            {t('app.name')}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)' }} />

      {/* Navigation */}
      <List sx={{ px: 2, pt: 2 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 1,
                color: isActive(item.path) 
                  ? (mode === 'dark' ? '#fff' : '#0D7377')
                  : (mode === 'dark' ? '#b3b3b3' : '#6B7280'),
                bgcolor: isActive(item.path) 
                  ? (mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(13,115,119,0.1)')
                  : 'transparent',
                '&:hover': {
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(13,115,119,0.08)',
                  color: mode === 'dark' ? '#fff' : '#0D7377',
                },
                transition: 'all 0.2s',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive(item.path) ? 700 : 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Bottom section */}
      <Box sx={{ mt: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} placement="right">
          <Button
            fullWidth
            startIcon={mode === 'dark' ? <LightMode /> : <DarkMode />}
            onClick={toggleTheme}
            sx={{
              color: mode === 'dark' ? '#b3b3b3' : '#4B5563',
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(15, 23, 42, 0.08)',
                color: mode === 'dark' ? '#fff' : '#1F2937',
              },
            }}
          >
            {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </Tooltip>
        <Button
          fullWidth
          startIcon={<Language />}
          onClick={handleLanguageClick}
          sx={{
            color: mode === 'dark' ? '#b3b3b3' : '#4B5563',
            justifyContent: 'flex-start',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(15, 23, 42, 0.08)',
              color: mode === 'dark' ? '#fff' : '#1F2937',
            },
          }}
        >
          {i18n.language === 'en' ? 'English' : 'Kinyarwanda'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bars removed - cleaner look */}

      {/* Mobile App Bar (Mobile) */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            bgcolor: '#0D7377',
            boxShadow: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 32,
                  height: 32,
                  mr: 1.5,
                }}
              >
                <DirectionsBus sx={{ fontSize: 20 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t('app.name')}
              </Typography>
            </Box>
            
            {/* Auth Buttons in Mobile AppBar */}
            {isAuthenticated && user ? (
              <IconButton
                onClick={handleUserMenuOpen}
                sx={{ color: '#fff' }}
                aria-label="User menu"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                </Avatar>
              </IconButton>
            ) : null}
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                bgcolor: '#0D7377',
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                bgcolor: '#0D7377',
                borderRight: 'none',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: '#0D7377',
          pt: isMobile ? 8 : 0,
        }}
      >
        {children}
      </Box>

      {/* Language Menu */}
      <Menu
        anchorEl={langAnchorEl}
        open={Boolean(langAnchorEl)}
        onClose={handleLanguageClose}
        PaperProps={{
          sx: {
            bgcolor: '#282828',
            minWidth: 200,
          },
        }}
      >
        <MenuItem
          onClick={() => handleLanguageChange('en')}
          selected={i18n.language === 'en'}
          sx={{
            '&.Mui-selected': {
              bgcolor: 'rgba(29, 185, 84, 0.2)',
              '&:hover': {
                bgcolor: 'rgba(29, 185, 84, 0.3)',
              },
            },
          }}
        >
          English
        </MenuItem>
        <MenuItem
          onClick={() => handleLanguageChange('rw')}
          selected={i18n.language === 'rw'}
          sx={{
            '&.Mui-selected': {
              bgcolor: 'rgba(29, 185, 84, 0.2)',
              '&:hover': {
                bgcolor: 'rgba(29, 185, 84, 0.3)',
              },
            },
          }}
        >
          Kinyarwanda
        </MenuItem>
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchorEl}
        open={Boolean(userMenuAnchorEl)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            bgcolor: mode === 'dark' ? '#282828' : '#fff',
            minWidth: 200,
            mt: 1,
          },
        }}
      >
        <MenuItem onClick={() => { handleUserMenuClose(); navigate('/profile'); }}>
          <ListItemIcon>
            <Person fontSize="small" sx={{ color: mode === 'dark' ? '#fff' : '#000' }} />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: mode === 'dark' ? '#fff' : '#000' }} />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LayoutMUI;
