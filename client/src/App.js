import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Goals from './pages/Goals/Goals';
import Wellness from './pages/Wellness/Wellness';
import Learning from './pages/Learning/Learning';
import Beauty from './pages/Beauty/Beauty';
import Profile from './pages/Profile/Profile';
import LoadingScreen from './components/Common/LoadingScreen';

function App() {
  const { user, loading } = useAuth();

  // For testing - bypass authentication
  const isAuthenticated = true; // Force authentication to true
  const testUser = {
    id: 'test-user-id',
    firstName: 'Test',
    lastName: 'User',
    fullName: 'Test User',
    email: 'test@example.com'
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Routes>
        {/* Redirect root to dashboard for testing */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Protected routes - now accessible without login */}
        <Route
          path="/"
          element={<Layout />}
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="goals" element={<Goals />} />
          <Route path="wellness" element={<Wellness />} />
          <Route path="learning" element={<Learning />} />
          <Route path="beauty" element={<Beauty />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Box>
  );
}

export default App; 