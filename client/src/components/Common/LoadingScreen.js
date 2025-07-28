import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: 'primary.main',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #6366f1, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            E
          </Typography>
        </Box>
      </Box>
      
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(45deg, #6366f1, #ec4899)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
        }}
      >
        ElevateAI
      </Typography>
      
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: 'center' }}
      >
        Loading your personalized experience...
      </Typography>
    </Box>
  );
};

export default LoadingScreen; 