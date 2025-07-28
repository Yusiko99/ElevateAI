import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Button,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  Flag,
  School,
  Favorite,
  Face,
  CheckCircle,
  Schedule,
  TrendingDown,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const Dashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for testing when backend is not available
  const mockDashboardData = {
    user: {
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      fullName: 'Test User',
      avatar: ''
    },
    goals: {
      total: 5,
      active: 3,
      completed: 2,
      recent: [
        { title: 'Learn React', progress: 75, status: 'active', category: 'learning' },
        { title: 'Exercise Daily', progress: 60, status: 'active', category: 'health' },
        { title: 'Read More Books', progress: 100, status: 'completed', category: 'personal' }
      ]
    },
    wellness: {
      score: 85,
      recentProgress: [
        { date: new Date(), wellnessScore: 85, goalsCompleted: 2, energy: 8, mood: 'good' },
        { date: new Date(Date.now() - 86400000), wellnessScore: 78, goalsCompleted: 1, energy: 6, mood: 'neutral' },
        { date: new Date(Date.now() - 172800000), wellnessScore: 92, goalsCompleted: 3, energy: 9, mood: 'excellent' }
      ]
    },
    learning: {
      currentModules: 2,
      completedModules: 3,
      recentActivity: [
        { moduleId: 'react-basics', title: 'React Fundamentals', progress: 75 },
        { moduleId: 'advanced-js', title: 'Advanced JavaScript', progress: 45 }
      ]
    },
    beauty: {
      analysisCount: 2,
      recentAnalysis: [
        { date: new Date(), imageUrl: '/sample-image.jpg' }
      ]
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user/dashboard');
      setDashboardData(response.data.dashboardData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Use mock data when backend is not available
      setDashboardData(mockDashboardData);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return theme.palette.success.main;
    if (progress >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getMoodColor = (mood) => {
    const colors = {
      excellent: theme.palette.success.main,
      good: theme.palette.info.main,
      neutral: theme.palette.warning.main,
      poor: theme.palette.error.main,
      terrible: theme.palette.error.dark,
    };
    return colors[mood] || theme.palette.grey[500];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Failed to load dashboard data</Typography>
      </Box>
    );
  }

  // Sample data for charts
  const wellnessData = [
    { name: 'Mon', score: 75 },
    { name: 'Tue', score: 82 },
    { name: 'Wed', score: 78 },
    { name: 'Thu', score: 85 },
    { name: 'Fri', score: 90 },
    { name: 'Sat', score: 88 },
    { name: 'Sun', score: 92 },
  ];

  const goalProgressData = [
    { name: 'Health', value: 65, color: '#6366f1' },
    { name: 'Career', value: 45, color: '#ec4899' },
    { name: 'Learning', value: 80, color: '#10b981' },
    { name: 'Personal', value: 30, color: '#f59e0b' },
  ];

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back, {user?.firstName}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your personalized overview for today
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Flag />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {dashboardData.goals.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Goals
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(dashboardData.goals.completed / dashboardData.goals.total) * 100}
                sx={{ height: 6, borderRadius: 3 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {dashboardData.goals.completed} completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Favorite />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {dashboardData.wellness.score}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Wellness Score
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                <Typography variant="caption" color="success.main">
                  +5% this week
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <School />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {dashboardData.learning.currentModules}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Modules
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {dashboardData.learning.completedModules} completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <Face />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {dashboardData.beauty.analysisCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Beauty Analyses
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Last: {dashboardData.beauty.recentAnalysis[0]?.date ? new Date(dashboardData.beauty.recentAnalysis[0].date).toLocaleDateString() : 'Never'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Wellness Score Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={wellnessData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={theme.palette.primary.main}
                    strokeWidth={3}
                    dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Goal Progress by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={goalProgressData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {goalProgressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                {goalProgressData.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: item.color,
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {item.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Recent Goals
              </Typography>
              <List>
                {dashboardData.goals.recent.map((goal, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getProgressColor(goal.progress) }}>
                        {goal.status === 'completed' ? <CheckCircle /> : <Schedule />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={goal.title}
                      secondary={`${goal.progress}% complete • ${goal.category}`}
                    />
                    <Chip
                      label={goal.status}
                      size="small"
                      color={goal.status === 'completed' ? 'success' : 'default'}
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => window.location.href = '/goals'}
              >
                View All Goals
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Recent Wellness Activity
              </Typography>
              <List>
                {dashboardData.wellness.recentProgress.map((progress, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getMoodColor(progress.mood) }}>
                        {progress.mood === 'excellent' || progress.mood === 'good' ? (
                          <TrendingUp />
                        ) : (
                          <TrendingDown />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`Wellness Score: ${progress.wellnessScore}`}
                      secondary={`${progress.goalsCompleted} goals completed • Energy: ${progress.energy}/10`}
                    />
                    <Chip
                      label={progress.mood}
                      size="small"
                      sx={{ bgcolor: getMoodColor(progress.mood), color: 'white' }}
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => window.location.href = '/wellness'}
              >
                View Wellness Details
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 