import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person,
  Settings,
  Security,
  Notifications,
  Edit,
  Save,
  Cancel,
  Star,
  Psychology,
  TrendingUp,
  CalendarToday,
  Flag,
  School,
  Favorite,
  Face,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const Profile = () => {
  const theme = useTheme();
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    avatar: '',
  });
  const [aiPreferences, setAiPreferences] = useState({
    coachingStyle: 'motivational',
    notificationFrequency: 'daily',
    privacyLevel: 'detailed',
  });
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const coachingStyles = [
    { value: 'motivational', label: 'Motivational', description: 'Encouraging and uplifting' },
    { value: 'analytical', label: 'Analytical', description: 'Data-driven and objective' },
    { value: 'gentle', label: 'Gentle', description: 'Supportive and understanding' },
    { value: 'challenging', label: 'Challenging', description: 'Direct and challenging' },
  ];

  const notificationFrequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const privacyLevels = [
    { value: 'basic', label: 'Basic', description: 'Minimal data collection' },
    { value: 'detailed', label: 'Detailed', description: 'Standard data collection' },
    { value: 'comprehensive', label: 'Comprehensive', description: 'Full data collection for better AI insights' },
  ];

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Mock data for testing when backend is not available
  const mockProfileData = {
    firstName: 'Test',
    lastName: 'User',
    avatar: '',
  };

  const mockAiPreferences = {
    coachingStyle: 'motivational',
    notificationFrequency: 'daily',
    privacyLevel: 'detailed',
  };

  const mockStats = {
    totalGoals: 5,
    completedGoals: 2,
    wellnessScore: 85,
    learningModules: 3,
    beautyAnalyses: 2,
    daysActive: 45,
    streakDays: 7
  };

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [profileResponse, statsResponse] = await Promise.all([
        axios.get('/api/auth/profile'),
        axios.get('/api/user/stats')
      ]);
      
      const userData = profileResponse.data.user;
      setProfileData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        avatar: userData.avatar || '',
      });
      setAiPreferences(userData.aiPreferences || aiPreferences);
      setStats(statsResponse.data.stats);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      // Use mock data when backend is not available
      setProfileData(mockProfileData);
      setAiPreferences(mockAiPreferences);
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await axios.put('/api/auth/profile', profileData);
      updateUser(response.data.user);
      setSuccess('Profile updated successfully');
      setEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile');
    }
  };

  const handleAiPreferencesUpdate = async () => {
    try {
      await axios.put('/api/user/ai-preferences', aiPreferences);
      setSuccess('AI preferences updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to update AI preferences:', error);
      setError('Failed to update AI preferences');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await axios.put('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setShowPasswordDialog(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSuccess('Password changed successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to change password:', error);
      setError(error.response?.data?.error || 'Failed to change password');
    }
  };

  const getCoachingStyleIcon = (style) => {
    switch (style) {
      case 'motivational':
        return <TrendingUp />;
      case 'analytical':
        return <Psychology />;
      case 'gentle':
        return <Person />;
      case 'challenging':
        return <Star />;
      default:
        return <Person />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Profile & Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1 }} />
                  Profile Information
                </Typography>
                <Button
                  startIcon={editing ? <Save /> : <Edit />}
                  onClick={editing ? handleProfileUpdate : () => setEditing(true)}
                  variant={editing ? 'contained' : 'outlined'}
                  size="small"
                >
                  {editing ? 'Save' : 'Edit'}
                </Button>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    mr: 2,
                  }}
                >
                  {profileData.firstName?.charAt(0) || user?.firstName?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {user?.fullName || `${profileData.firstName} ${profileData.lastName}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    disabled={!editing}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    disabled={!editing}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Avatar URL (Optional)"
                    value={profileData.avatar}
                    onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                    disabled={!editing}
                    size="small"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </Grid>
              </Grid>

              {editing && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => {
                      setEditing(false);
                      setProfileData({
                        firstName: user?.firstName || '',
                        lastName: user?.lastName || '',
                        avatar: user?.avatar || '',
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Account Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ mr: 1 }} />
                Account Statistics
              </Typography>

              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <CalendarToday />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${stats.accountAge || 0} days`}
                    secondary="Account Age"
                  />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <Flag />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${stats.totalGoals || 0} goals`}
                    secondary="Total Goals Created"
                  />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      <School />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${stats.learningModules || 0} modules`}
                    secondary="Learning Modules Completed"
                  />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <Face />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${stats.beautyAnalyses || 0} analyses`}
                    secondary="Beauty Analyses"
                  />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <Favorite />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${stats.streakDays || 0} days`}
                    secondary="Current Streak"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Psychology sx={{ mr: 1 }} />
                AI Preferences
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Coaching Style</InputLabel>
                    <Select
                      value={aiPreferences.coachingStyle}
                      onChange={(e) => setAiPreferences({ ...aiPreferences, coachingStyle: e.target.value })}
                      label="Coaching Style"
                    >
                      {coachingStyles.map((style) => (
                        <MenuItem key={style.value} value={style.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getCoachingStyleIcon(style.value)}
                            <Box sx={{ ml: 1 }}>
                              <Typography variant="body2">{style.label}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {style.description}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Notification Frequency</InputLabel>
                    <Select
                      value={aiPreferences.notificationFrequency}
                      onChange={(e) => setAiPreferences({ ...aiPreferences, notificationFrequency: e.target.value })}
                      label="Notification Frequency"
                    >
                      {notificationFrequencies.map((freq) => (
                        <MenuItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Privacy Level</InputLabel>
                    <Select
                      value={aiPreferences.privacyLevel}
                      onChange={(e) => setAiPreferences({ ...aiPreferences, privacyLevel: e.target.value })}
                      label="Privacy Level"
                    >
                      {privacyLevels.map((level) => (
                        <MenuItem key={level.value} value={level.value}>
                          <Box>
                            <Typography variant="body2">{level.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {level.description}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleAiPreferencesUpdate}
                  startIcon={<Save />}
                >
                  Update AI Preferences
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Settings sx={{ mr: 1 }} />
                Account Settings
              </Typography>

              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Security />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Change Password"
                    secondary="Update your account password"
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowPasswordDialog(true)}
                  >
                    Change
                  </Button>
                </ListItem>

                <Divider sx={{ my: 1 }} />

                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      <Notifications />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Notification Settings"
                    secondary="Manage your notification preferences"
                  />
                  <Chip
                    label={aiPreferences.notificationFrequency}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </ListItem>

                <Divider sx={{ my: 1 }} />

                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <Psychology />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Privacy Settings"
                    secondary="Control your data privacy level"
                  />
                  <Chip
                    label={aiPreferences.privacyLevel}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog
        open={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Change Password
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile; 