import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Badge,
  InputBase,
  alpha,
  useScrollTrigger,
  Slide,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Menu as MenuIcon,
  Close as CloseIcon,
  Home,
  Movie,
  Tv,
  Bookmark,
  Settings,
  Logout,
  TrendingUp,
  Star,
  History,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import netflixTheme from '../theme/netflixTheme';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const ModernNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: <Home /> },
    { label: 'Movies', path: '/movies', icon: <Movie /> },
    { label: 'TV Shows', path: '/tv-shows', icon: <Tv /> },
    { label: 'Trending', path: '/trending', icon: <TrendingUp /> },
    { label: 'My List', path: '/my-list', icon: <Bookmark /> },
  ];

  const quickActions = [
    { label: 'Recently Watched', path: '/recent', icon: <History /> },
    { label: 'Favorites', path: '/favorites', icon: <Star /> },
    { label: 'Settings', path: '/settings', icon: <Settings /> },
  ];

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMenuAnchor);

  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        sx: {
          backgroundColor: '#181818',
          border: '1px solid #333333',
          minWidth: 200,
        },
      }}
    >
      <MenuItem 
        onClick={() => { navigate('/profile'); handleMenuClose(); }}
        sx={{ color: 'white', '&:hover': { backgroundColor: '#333333' } }}
      >
        <ListItemIcon sx={{ color: 'white' }}>
          <AccountCircle />
        </ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem 
        onClick={() => { navigate('/settings'); handleMenuClose(); }}
        sx={{ color: 'white', '&:hover': { backgroundColor: '#333333' } }}
      >
        <ListItemIcon sx={{ color: 'white' }}>
          <Settings />
        </ListItemIcon>
        Settings
      </MenuItem>
      <Divider sx={{ backgroundColor: '#333333' }} />
      <MenuItem 
        onClick={() => { navigate('/logout'); handleMenuClose(); }}
        sx={{ color: 'white', '&:hover': { backgroundColor: '#333333' } }}
      >
        <ListItemIcon sx={{ color: 'white' }}>
          <Logout />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchor}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        sx: {
          backgroundColor: '#181818',
          border: '1px solid #333333',
          minWidth: 200,
        },
      }}
    >
      {navItems.map((item) => (
        <MenuItem
          key={item.label}
          onClick={() => {
            navigate(item.path);
            handleMobileMenuClose();
          }}
          sx={{ 
            color: 'white', 
            '&:hover': { backgroundColor: '#333333' },
            backgroundColor: location.pathname === item.path ? '#E50914' : 'transparent',
          }}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            {item.icon}
          </ListItemIcon>
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );

  const drawer = (
    <Box sx={{ width: 280, backgroundColor: '#141414', height: '100%' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #333333' }}>
        <Typography variant="h6" sx={{ color: '#E50914', fontWeight: 700 }}>
          NETFLIX
        </Typography>
      </Box>
      
      <List sx={{ pt: 2 }}>
        {navItems.map((item) => (
          <ListItem
            key={item.label}
            button
            onClick={() => {
              navigate(item.path);
              setMobileDrawerOpen(false);
            }}
            sx={{
              backgroundColor: location.pathname === item.path ? '#E50914' : 'transparent',
              mb: 0.5,
              '&:hover': {
                backgroundColor: location.pathname === item.path ? '#F40612' : '#333333',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} sx={{ color: 'white' }} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ backgroundColor: '#333333', my: 2 }} />

      <List>
        <Typography variant="subtitle2" sx={{ color: '#B3B3B3', px: 2, mb: 1 }}>
          Quick Actions
        </Typography>
        {quickActions.map((action) => (
          <ListItem
            key={action.label}
            button
            onClick={() => {
              navigate(action.path);
              setMobileDrawerOpen(false);
            }}
            sx={{
              '&:hover': { backgroundColor: '#333333' },
            }}
          >
            <ListItemIcon sx={{ color: '#B3B3B3' }}>
              {action.icon}
            </ListItemIcon>
            <ListItemText primary={action.label} sx={{ color: '#B3B3B3' }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={netflixTheme}>
      <HideOnScroll>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.95)' : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            boxShadow: 'none',
            transition: 'all 0.3s ease',
            borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo and Navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  color: '#E50914',
                  fontWeight: 700,
                  fontSize: '1.8rem',
                  cursor: 'pointer',
                  mr: 4,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
                onClick={() => navigate('/dashboard')}
              >
                NETFLIX
              </Typography>

              {/* Desktop Navigation */}
              <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    color="inherit"
                    startIcon={item.icon}
                    sx={{
                      color: location.pathname === item.path ? '#FFFFFF' : '#B3B3B3',
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      '&:hover': {
                        color: '#FFFFFF',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Search and Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Search */}
              <Box component="form" onSubmit={handleSearch}>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search titles, people, genres"
                    inputProps={{ 'aria-label': 'search' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                      '& input': {
                        color: 'white',
                        '&::placeholder': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      },
                    }}
                  />
                </Search>
              </Box>

              {/* Notifications */}
              <IconButton 
                size="large" 
                color="inherit"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Profile */}
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Avatar sx={{ width: 36, height: 36, bgcolor: '#E50914' }}>
                  <AccountCircle />
                </Avatar>
              </IconButton>

              {/* Mobile Menu */}
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
                sx={{ 
                  display: { xs: 'block', lg: 'none' },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            backgroundColor: '#141414',
          },
        }}
      >
        {drawer}
      </Drawer>

      {renderMobileMenu}
      {renderMenu}
    </ThemeProvider>
  );
};

export default ModernNavbar;
