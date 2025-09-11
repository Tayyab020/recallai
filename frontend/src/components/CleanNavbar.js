import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Badge,
  InputBase,
  alpha,
  useScrollTrigger,
  Slide,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Menu as MenuIcon,
  Home,
  Movie,
  Tv,
  Bookmark,
  Settings,
  Logout,
  TrendingUp,
  Star,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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

const CleanNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

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

  const isMenuOpen = Boolean(anchorEl);

  return (
    <HideOnScroll>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          boxShadow: scrolled ? '0 2px 20px rgba(0, 0, 0, 0.3)' : 'none',
          transition: 'all 0.3s ease',
          borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1.5 }}>
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
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
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
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
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
                position: 'relative',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Badge 
                badgeContent={3} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#E50914',
                    color: 'white',
                    fontWeight: 600,
                  },
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Profile */}
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: '#E50914',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)',
                  },
                }}
              >
                <AccountCircle />
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id="primary-search-account-menu"
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
            minWidth: 220,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #333333' }}>
          <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
            Welcome back!
          </Typography>
          <Typography variant="body2" sx={{ color: '#B3B3B3' }}>
            user@example.com
          </Typography>
        </Box>

        <MenuItem 
          onClick={() => { navigate('/profile'); handleMenuClose(); }}
          sx={{ 
            color: 'white', 
            '&:hover': { backgroundColor: '#333333' },
            py: 1.5,
          }}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <AccountCircle />
          </ListItemIcon>
          Profile
        </MenuItem>

        <MenuItem 
          onClick={() => { navigate('/settings'); handleMenuClose(); }}
          sx={{ 
            color: 'white', 
            '&:hover': { backgroundColor: '#333333' },
            py: 1.5,
          }}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <Settings />
          </ListItemIcon>
          Settings
        </MenuItem>

        <Divider sx={{ backgroundColor: '#333333', my: 1 }} />

        <MenuItem 
          onClick={() => { navigate('/logout'); handleMenuClose(); }}
          sx={{ 
            color: '#E50914', 
            '&:hover': { backgroundColor: 'rgba(229, 9, 20, 0.1)' },
            py: 1.5,
          }}
        >
          <ListItemIcon sx={{ color: '#E50914' }}>
            <Logout />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </HideOnScroll>
  );
};

export default CleanNavbar;
