import React from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const NavbarMenuItem = ({ item, onClose, variant }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate(item.path);
    onClose && onClose();
  };

  if (variant === 'icon') {
    return (
      <IconButton
        key={item.text}
        color="inherit"
        onClick={handleClick}
        sx={{
          backgroundColor: location.pathname === item.path ? 'var(--color-secondary-navy)' : 'transparent',
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
        {item.icon}
      </IconButton>
    );
  }

  return (
    <ListItem
      button
      key={item.text}
      onClick={handleClick}
      selected={location.pathname === item.path}
      sx={{
        '&.Mui-selected': {
          backgroundColor: 'var(--color-light-gray)',
          '& .MuiListItemIcon-root': {
            color: 'var(--color-primary-navy)'
          },
          '& .MuiListItemText-primary': {
            color: 'var(--color-primary-navy)',
            fontWeight: 500
          }
        },
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
      <ListItemIcon sx={{ color: 'var(--color-charcoal-gray)' }}>
        {item.icon}
      </ListItemIcon>
      <ListItemText
        primary={item.text}
        sx={{
          '& .MuiListItemText-primary': {
            fontFamily: 'var(--font-family-primary)',
            color: 'var(--color-tertiary-navy)'
          }
        }}
      />
    </ListItem>
  );
};

export default NavbarMenuItem;