import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Button,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard,
  Event,
  RecordVoiceOver,
  Notifications,
  Settings,
  Logout,
  GetApp,
  PhoneAndroid
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { usePWA } from '../contexts/PWAContext';
import NavbarMenuItem from './NavbarMenuItem';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { deferredPrompt, isInstalled, installApp } = usePWA();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const handleInstallApp = async () => {
    const result = await installApp();
    setSnackbar({
      open: true,
      message: result.message,
      severity: result.success ? 'success' : 'error'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const menuItems = [
    { text: 'Home', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Reminders', icon: <Notifications />, path: '/reminders' },
    { text: 'All Events', icon: <Event />, path: '/events' },
    { text: 'Conversations', icon: <RecordVoiceOver />, path: '/conversations' },
    { text: 'Settings', icon: <Settings />, path: '/settings' }
  ];

  const drawer = (
    <Box sx={{ backgroundColor: 'background.paper' }}>
      <Toolbar sx={{ 
        background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
        color: 'white'
      }}>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            color: 'white'
          }}
        >
          🎤 AI Voice
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <NavbarMenuItem item={item} onClose={handleDrawerToggle} />
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
          color: 'white',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                '&:focus': {
                  outline: '2px solid white',
                  outlineOffset: '2px'
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
              color: 'white'
            }}
          >
            🎤 AI Voice
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {menuItems.map((item) => (
                <NavbarMenuItem item={item} variant="icon" />
              ))}
            </Box>
          )}

          {/* Install App Button */}
          {deferredPrompt && !isInstalled && (
            <Tooltip title="Install App on your device">
              <Button
                color="inherit"
                startIcon={<GetApp />}
                onClick={handleInstallApp}
                sx={{
                  mr: 1,
                  textTransform: 'none',
                  fontFamily: 'var(--font-family-primary)',
                  border: '1px solid var(--color-white)',
                  borderRadius: '8px',
                  transition: 'var(--transition-normal)',
                  '&:hover': {
                    backgroundColor: 'var(--color-secondary-navy)',
                    borderColor: 'var(--color-white)'
                  },
                  '&:focus': {
                    outline: '2px solid var(--color-white)',
                    outlineOffset: '2px'
                  }
                }}
              >
                {isMobile ? '' : 'Install App'}
              </Button>
            </Tooltip>
          )}

          {/* Show installed indicator */}
          {isInstalled && (
            <Tooltip title="App is installed">
              <IconButton
                color="inherit"
                disabled
                sx={{
                  '&.Mui-disabled': {
                    color: 'var(--color-cool-gray)'
                  }
                }}
              >
                <PhoneAndroid />
              </IconButton>
            </Tooltip>
          )}

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{
              transition: 'var(--transition-normal)',
              '&:hover': {
                backgroundColor: 'var(--color-secondary-navy)'
              },
              '&:focus': {
                outline: '2px solid var(--color-white)',
                outlineOffset: '2px'
              }
            }}
          >
            <AccountCircle />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: 'var(--color-white)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }
            }}
          >
            <MenuItem
              onClick={() => { navigate('/settings'); handleClose(); }}
              sx={{
                fontFamily: 'var(--font-family-primary)',
                color: 'var(--color-tertiary-navy)',
                '&:hover': {
                  backgroundColor: 'var(--color-light-gray)'
                },
                '&:focus': {
                  outline: '2px solid var(--color-secondary-navy)',
                  outlineOffset: '2px'
                },
                transition: 'var(--transition-normal)'
              }}
            >
              <ListItemIcon>
                <Settings fontSize="small" sx={{ color: 'var(--color-charcoal-gray)' }} />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{
                fontFamily: 'var(--font-family-primary)',
                color: 'var(--color-tertiary-navy)',
                '&:hover': {
                  backgroundColor: 'var(--color-light-gray)'
                },
                '&:focus': {
                  outline: '2px solid var(--color-secondary-navy)',
                  outlineOffset: '2px'
                },
                transition: 'var(--transition-normal)'
              }}
            >
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: 'var(--color-charcoal-gray)' }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Install App Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;