import { createTheme } from '@mui/material/styles';

// Modern dark theme with unique Deep Teal branding
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0D7377', // Deep Teal Blue - Unique KigaliGo brand color
      light: '#14FFEC', // Bright cyan for highlights
      dark: '#0A5A5D', // Deeper teal for hover states
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2E77D0', // Blue for buses
      light: '#4A90E2',
      dark: '#1E5BA8',
    },
    background: {
      default: '#121212',
      paper: '#181818',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
    error: {
      main: '#E22134',
    },
    warning: {
      main: '#FFA726',
    },
    info: {
      main: '#29B6F6',
    },
    success: {
      main: '#0D7377', // Use teal for success states too
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Circular Std", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 500, // Spotify's pill-shaped buttons
          padding: '12px 32px',
          fontSize: '0.875rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            transform: 'scale(1.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#181818',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: '#282828',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000',
          borderRight: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
  },
});

export default theme;
