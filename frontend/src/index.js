import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { PWAProvider } from './contexts/PWAContext';
import './styles/colors.css';
import './styles/responsive.css';
import './styles/navbar-fix.css';

// Modern color values (fallback)
const defaultPrimaryMain = '#6366f1';
const defaultSecondaryMain = '#06b6d4';
const defaultBackgroundDefault = '#f9fafb';
const defaultTextPrimary = '#111827';
const defaultTextSecondary = '#4b5563';

// Use environment variables or default values
const primaryMain = process.env.REACT_APP_PRIMARY_MAIN || defaultPrimaryMain;
const secondaryMain = process.env.REACT_APP_SECONDARY_MAIN || defaultSecondaryMain;
const backgroundDefault = process.env.REACT_APP_BACKGROUND_DEFAULT || defaultBackgroundDefault;
const textPrimary = process.env.REACT_APP_TEXT_PRIMARY || defaultTextPrimary;
const textSecondary = process.env.REACT_APP_TEXT_SECONDARY || defaultTextSecondary;

// Create Material-UI theme - Modern AI Voice App Design System
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryMain,        // Indigo
      light: '#818cf8',         // Light Indigo  
      dark: '#4f46e5',          // Dark Indigo
      contrastText: '#ffffff',
    },
    secondary: {
      main: secondaryMain,      // Cyan
      light: '#67e8f9',         // Light Cyan
      dark: '#0891b2',          // Dark Cyan
      contrastText: '#ffffff',
    },
    background: {
      default: backgroundDefault, // Light background
      paper: '#ffffff',         // Pure White
    },
    text: {
      primary: textPrimary,     // Dark gray text
      secondary: textSecondary, // Medium gray text
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    success: {
      main: '#10b981',      // Emerald Green
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',      // Amber
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',      // Red
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#06b6d4',      // Cyan for info
      light: '#22d3ee',
      dark: '#0891b2',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '2.25rem',
      fontWeight: 600,
      color: '#111827',
    },
    h2: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '1.875rem',
      fontWeight: 600,
      color: '#111827',
    },
    h3: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#111827',
    },
    h4: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#111827',
    },
    h5: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '1.125rem',
      fontWeight: 500,
      color: '#111827',
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '1rem',
      fontWeight: 500,
      color: '#111827',
    },
    body1: {
      fontSize: '1rem',
      color: '#374151',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#6b7280',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontFamily: 'var(--font-family-primary)',
          fontWeight: 500,
          transition: 'var(--transition-normal)',
          '&:focus': {
            outline: '2px solid var(--color-secondary-navy)',
            outlineOffset: '2px',
          },
        },
        contained: {
          backgroundColor: 'var(--color-primary-navy)',
          color: 'var(--color-white)',
          '&:hover': {
            backgroundColor: 'var(--color-secondary-navy)',
          },
        },
        outlined: {
          borderColor: 'var(--color-secondary-navy)',
          color: 'var(--color-secondary-navy)',
          '&:hover': {
            borderColor: 'var(--color-primary-navy)',
            backgroundColor: 'rgba(0, 7, 118, 0.04)',
          },
        },
        text: {
          color: 'var(--color-primary-navy)',
          '&:hover': {
            backgroundColor: 'rgba(0, 7, 118, 0.04)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'var(--transition-normal)',
          '&:focus': {
            outline: '2px solid var(--color-secondary-navy)',
            outlineOffset: '2px',
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 7, 118, 0.04)',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--color-primary-navy)',
          color: 'var(--color-white)',
          transition: 'var(--transition-normal)',
          '&:hover': {
            backgroundColor: 'var(--color-secondary-navy)',
          },
          '&:focus': {
            outline: '2px solid var(--color-secondary-navy)',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-family-primary)',
          transition: 'var(--transition-normal)',
          '&:focus': {
            outline: '2px solid var(--color-secondary-navy)',
            outlineOffset: '2px',
          },
        },
        filled: {
          backgroundColor: 'var(--color-light-gray)',
          color: 'var(--color-tertiary-navy)',
          '&:hover': {
            backgroundColor: 'var(--color-cool-gray)',
          },
        },
        outlined: {
          borderColor: 'var(--color-cool-gray)',
          color: 'var(--color-tertiary-navy)',
          '&:hover': {
            backgroundColor: 'var(--color-light-gray)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          backgroundColor: 'var(--color-white)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            fontFamily: 'var(--font-family-primary)',
            transition: 'var(--transition-normal)',
            '& fieldset': {
              borderColor: 'var(--color-cool-gray)',
            },
            '&:hover fieldset': {
              borderColor: 'var(--color-medium-gray)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--color-primary-navy)',
              borderWidth: '2px',
            },
            '&.Mui-error fieldset': {
              borderColor: '#dc2626',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'var(--color-charcoal-gray)',
            fontFamily: 'var(--font-family-primary)',
            '&.Mui-focused': {
              color: 'var(--color-primary-navy)',
            },
            '&.Mui-error': {
              color: '#dc2626',
            },
          },
          '& .MuiInputBase-input': {
            color: 'var(--color-tertiary-navy)',
            fontFamily: 'var(--font-family-primary)',
          },
          '& .MuiFormHelperText-root': {
            fontFamily: 'var(--font-family-primary)',
            '&.Mui-error': {
              color: '#dc2626',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-cool-gray)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-medium-gray)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-primary-navy)',
            borderWidth: '2px',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiFormLabel-root': {
            color: 'var(--color-charcoal-gray)',
            fontFamily: 'var(--font-family-primary)',
            '&.Mui-focused': {
              color: 'var(--color-primary-navy)',
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'var(--color-cool-gray)',
          transition: 'var(--transition-normal)',
          '&.Mui-checked': {
            color: 'var(--color-primary-navy)',
          },
          '&:focus': {
            outline: '2px solid var(--color-secondary-navy)',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: 'var(--color-cool-gray)',
          transition: 'var(--transition-normal)',
          '&.Mui-checked': {
            color: 'var(--color-primary-navy)',
          },
          '&:focus': {
            outline: '2px solid var(--color-secondary-navy)',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase': {
            '&.Mui-checked': {
              color: 'var(--color-primary-navy)',
              '& + .MuiSwitch-track': {
                backgroundColor: 'var(--color-primary-navy)',
              },
            },
            '&:focus': {
              outline: '2px solid var(--color-secondary-navy)',
              outlineOffset: '2px',
            },
          },
          '& .MuiSwitch-track': {
            backgroundColor: 'var(--color-cool-gray)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--color-primary-navy)',
          color: 'var(--color-white)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--color-white)',
          borderRadius: 12,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'var(--color-white)',
          borderRadius: 12,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'var(--color-white)',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'var(--color-white)',
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <PWAProvider>
            <App />
          </PWAProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
