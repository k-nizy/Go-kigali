import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark'); // 'dark' or 'light'

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
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
            default: mode === 'dark' ? '#121212' : '#F5F7FA',
            paper: mode === 'dark' ? '#181818' : '#FFFFFF',
          },
          text: {
            primary: mode === 'dark' ? '#FFFFFF' : '#1A1A1A',
            secondary: mode === 'dark' ? '#B3B3B3' : '#6B7280',
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
            main: '#0D7377',
          },
          divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
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
                borderRadius: 500,
                padding: '12px 32px',
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
              },
              contained: {
                boxShadow: mode === 'dark' ? 'none' : '0 2px 8px rgba(13, 115, 119, 0.2)',
                '&:hover': {
                  boxShadow: mode === 'dark' ? 'none' : '0 4px 12px rgba(13, 115, 119, 0.3)',
                  transform: 'scale(1.04)',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                backgroundColor: mode === 'dark' ? '#181818' : '#FFFFFF',
                transition: 'all 0.3s ease',
                boxShadow: mode === 'dark' 
                  ? 'none' 
                  : '0 2px 8px rgba(0, 0, 0, 0.08)',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? '#282828' : '#F9FAFB',
                  boxShadow: mode === 'dark' 
                    ? 'none' 
                    : '0 4px 16px rgba(0, 0, 0, 0.12)',
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? '#000000' : '#FFFFFF',
                backgroundImage: 'none',
                boxShadow: mode === 'dark' 
                  ? 'none' 
                  : '0 1px 3px rgba(0, 0, 0, 0.1)',
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === 'dark' ? '#000000' : '#FFFFFF',
                borderRight: mode === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
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
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
