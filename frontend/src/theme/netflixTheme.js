import { createTheme } from '@mui/material/styles';

const netflixTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#E50914', // Netflix red
      dark: '#B81D13',
      light: '#F40612',
    },
    secondary: {
      main: '#FFFFFF',
      dark: '#B3B3B3',
      light: '#FFFFFF',
    },
    background: {
      default: '#141414', // Very dark background
      paper: '#181818', // Slightly lighter for cards
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
      disabled: '#666666',
    },
    divider: '#333333',
    grey: {
      50: '#F5F5F5',
      100: '#E0E0E0',
      200: '#CCCCCC',
      300: '#B3B3B3',
      400: '#999999',
      500: '#808080',
      600: '#666666',
      700: '#4D4D4D',
      800: '#333333',
      900: '#1A1A1A',
    },
  },
  typography: {
    fontFamily: '"Netflix Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#141414',
          color: '#FFFFFF',
          fontFamily: '"Netflix Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
        },
        '*': {
          boxSizing: 'border-box',
        },
        '::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: '#141414',
        },
        '::-webkit-scrollbar-thumb': {
          background: '#333333',
          borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: '#555555',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#181818',
          border: '1px solid #333333',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#181818',
          border: '1px solid #333333',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          fontWeight: 600,
          textTransform: 'none',
          padding: '8px 16px',
          fontSize: '1rem',
        },
        containedPrimary: {
          backgroundColor: '#E50914',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#F40612',
            boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)',
          },
          '&:active': {
            backgroundColor: '#B81D13',
          },
        },
        outlined: {
          borderColor: '#666666',
          color: '#FFFFFF',
          '&:hover': {
            borderColor: '#E50914',
            backgroundColor: 'rgba(229, 9, 20, 0.1)',
          },
        },
        text: {
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '& fieldset': {
              borderColor: '#666666',
            },
            '&:hover fieldset': {
              borderColor: '#E50914',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#E50914',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#B3B3B3',
            '&.Mui-focused': {
              color: '#E50914',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#333333',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#555555',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        primary: {
          backgroundColor: '#E50914',
          '&:hover': {
            backgroundColor: '#F40612',
            boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: '#333333',
        },
        bar: {
          backgroundColor: '#E50914',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: '#181818',
          border: '1px solid #333333',
        },
        standardError: {
          backgroundColor: 'rgba(229, 9, 20, 0.1)',
          border: '1px solid #E50914',
        },
        standardSuccess: {
          backgroundColor: 'rgba(0, 150, 0, 0.1)',
          border: '1px solid #00AA00',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #333333',
        },
        indicator: {
          backgroundColor: '#E50914',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#B3B3B3',
          '&.Mui-selected': {
            color: '#FFFFFF',
          },
          '&:hover': {
            color: '#FFFFFF',
          },
        },
      },
    },
  },
});

export default netflixTheme;
