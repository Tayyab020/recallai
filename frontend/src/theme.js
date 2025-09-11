import { createTheme } from '@mui/material/styles';

// Gumroad-inspired dark, bold, minimalist theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#18171d', // deep charcoal with a hint of purple
      paper: '#1e1b22',
    },
    primary: {
      main: '#FF3399', // vibrant magenta / hot pink
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9b84ff',
    },
    text: {
      primary: '#e1e1e1',
      secondary: '#b8b8b8',
      disabled: '#8a8a8a',
    },
    divider: '#333333',
  },
  typography: {
    fontFamily: 'Inter, Manrope, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol',
    h1: { fontWeight: 800, letterSpacing: -0.5 },
    h2: { fontWeight: 800, letterSpacing: -0.4 },
    h3: { fontWeight: 700, letterSpacing: -0.2 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    body1: { fontSize: 14, lineHeight: 1.6 },
    body2: { fontSize: 13, lineHeight: 1.6, color: '#b8b8b8' },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: 0 },
  },
  shape: {
    borderRadius: 6, // sharp-ish corners
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#18171d',
          color: '#e1e1e1',
        },
        '*, *::before, *::after': {
          boxSizing: 'border-box',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #333333', // subtle divider
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1b22',
          border: '1px solid #333333',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 700,
        },
        containedPrimary: {
          backgroundColor: '#FF3399',
          color: '#ffffff',
          '&:hover': {
            filter: 'brightness(1.08)',
            backgroundColor: '#FF3399',
          },
        },
        outlined: {
          borderColor: '#333333',
          color: '#e1e1e1',
          '&:hover': {
            borderColor: '#FF3399',
            backgroundColor: 'rgba(255, 51, 153, 0.06)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#333333' },
            '&:hover fieldset': { borderColor: '#FF3399' },
            '&.Mui-focused fieldset': { borderColor: '#FF3399' },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#333333' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
    MuiFab: {
      styleOverrides: {
        primary: {
          backgroundColor: '#FF3399',
          '&:hover': { backgroundColor: '#FF3399', filter: 'brightness(1.08)' },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { backgroundColor: '#2a2930' },
        bar: { backgroundColor: '#FF3399' },
      },
    },
  },
});

export default theme;



