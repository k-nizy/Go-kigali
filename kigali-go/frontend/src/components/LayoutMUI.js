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
} from '@mui/icons-material';

const drawerWidth = 240;

const LayoutMUI = ({ children }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langAnchorEl, setLangAnchorEl] = useState(null);

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

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: '#000', display: 'flex', flexDirection: 'column' }}>
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
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
            {t('app.name')}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

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
                color: isActive(item.path) ? '#fff' : '#b3b3b3',
                bgcolor: isActive(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: '#fff',
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
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Button
          fullWidth
          startIcon={<Language />}
          onClick={handleLanguageClick}
          sx={{
            color: '#b3b3b3',
            justifyContent: 'flex-start',
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
              color: '#fff',
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
      {/* App Bar (Mobile) */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            bgcolor: '#000',
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
                bgcolor: '#000',
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
                bgcolor: '#000',
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
          bgcolor: 'background.default',
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
          🇬🇧 English
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
          🇷🇼 Kinyarwanda
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LayoutMUI;
