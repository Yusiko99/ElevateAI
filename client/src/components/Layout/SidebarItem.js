import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';

const SidebarItem = ({ text, icon, path, onClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === path;

  const handleClick = () => {
    navigate(path);
    if (onClick) onClick();
  };

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={handleClick}
        sx={{
          mx: 2,
          mb: 1,
          borderRadius: 2,
          bgcolor: isActive ? 'primary.main' : 'transparent',
          color: isActive ? 'white' : 'text.primary',
          '&:hover': {
            bgcolor: isActive ? 'primary.dark' : 'action.hover',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <ListItemIcon
          sx={{
            color: isActive ? 'white' : 'inherit',
            minWidth: 40,
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          sx={{
            '& .MuiListItemText-primary': {
              fontWeight: isActive ? 600 : 500,
            },
          }}
        />
        {isActive && (
          <Box
            sx={{
              position: 'absolute',
              right: 8,
              width: 4,
              height: 4,
              borderRadius: '50%',
              bgcolor: 'white',
            }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );
};

export default SidebarItem; 