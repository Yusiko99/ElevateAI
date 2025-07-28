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
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Alert,
  LinearProgress,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Divider,
} from '@mui/material';
import {
  School,
  PlayArrow,
  CheckCircle,
  Schedule,
  TrendingUp,
  Book,
  Add,
  Info,
  Assessment,
  Timeline,
  Star,
  AccessTime,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const Learning = () => {
  const theme = useTheme();
  const [learningData, setLearningData] = useState({});
  const [currentModules, setCurrentModules] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);
  const [availableModules, setAvailableModules] = useState([]);
  const [recommendedModules, setRecommendedModules] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [learningPath, setLearningPath] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModuleDialog, setShowModuleDialog] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [progressForm, setProgressForm] = useState({
    progress: 0,
    completed: false,
  });

  const skillLevels = ['beginner', 'intermediate', 'advanced'];
  const learningStyles = ['visual', 'auditory', 'kinesthetic', 'reading-writing'];
  const interests = ['programming', 'design', 'marketing', 'data-science', 'communication', 'business'];

  useEffect(() => {
    fetchLearningData();
  }, []);

  // Mock data for testing when backend is not available
  const mockLearningData = {
    skillLevel: 'intermediate',
    learningStyle: 'visual',
    interests: ['programming', 'design'],
    preferredDuration: 30,
    weeklyGoal: 5,
    timezone: 'UTC-5'
  };

  const mockCurrentModules = [
    {
      id: 'react-basics',
      title: 'React Fundamentals',
      description: 'Learn the basics of React development',
      difficulty: 'beginner',
      progress: 75,
      estimatedTime: 120,
      category: 'programming'
    },
    {
      id: 'advanced-js',
      title: 'Advanced JavaScript',
      description: 'Master advanced JavaScript concepts',
      difficulty: 'intermediate',
      progress: 45,
      estimatedTime: 180,
      category: 'programming'
    }
  ];

  const mockCompletedModules = [
    {
      id: 'html-css',
      title: 'HTML & CSS Basics',
      description: 'Learn web development fundamentals',
      difficulty: 'beginner',
      completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      category: 'programming'
    }
  ];

  const mockAvailableModules = [
    {
      id: 'react-advanced',
      title: 'Advanced React',
      description: 'Learn advanced React patterns and hooks',
      difficulty: 'intermediate',
      estimatedTime: 240,
      category: 'programming'
    },
    {
      id: 'ui-design',
      title: 'UI Design Principles',
      description: 'Learn modern UI design principles',
      difficulty: 'beginner',
      estimatedTime: 180,
      category: 'design'
    }
  ];

  const mockRecommendedModules = [
    {
      id: 'react-advanced',
      title: 'Advanced React',
      description: 'Perfect for your skill level',
      difficulty: 'intermediate',
      estimatedTime: 240,
      category: 'programming',
      matchScore: 95
    }
  ];

  const mockAnalytics = {
    totalModules: 3,
    completedModules: 1,
    totalTimeSpent: 180,
    averageScore: 85,
    weeklyProgress: 75,
    monthlyTrend: 'increasing',
    favoriteCategory: 'programming'
  };

  const mockLearningPath = {
    currentPhase: 'intermediate',
    nextMilestone: 'Advanced React',
    estimatedCompletion: '2 months',
    recommendations: [
      'Focus on React patterns',
      'Practice with real projects',
      'Join coding communities'
    ]
  };

  const fetchLearningData = async () => {
    try {
      setLoading(true);
      const [learningResponse, availableResponse, recommendationsResponse, analyticsResponse, pathResponse] = await Promise.all([
        axios.get('/api/learning'),
        axios.get('/api/learning/modules/available'),
        axios.get('/api/learning'),
        axios.get('/api/learning/analytics'),
        axios.get('/api/learning/path')
      ]);
      
      setLearningData(learningResponse.data.learning);
      setCurrentModules(learningResponse.data.currentModules);
      setCompletedModules(learningResponse.data.completedModules);
      setAvailableModules(availableResponse.data.availableModules);
      setRecommendedModules(learningResponse.data.recommendedModules);
      setAnalytics(analyticsResponse.data.analytics);
      setLearningPath(pathResponse.data.learningPath);
    } catch (error) {
      console.error('Failed to fetch learning data:', error);
      // Use mock data when backend is not available
      setLearningData(mockLearningData);
      setCurrentModules(mockCurrentModules);
      setCompletedModules(mockCompletedModules);
      setAvailableModules(mockAvailableModules);
      setRecommendedModules(mockRecommendedModules);
      setAnalytics(mockAnalytics);
      setLearningPath(mockLearningPath);
    } finally {
      setLoading(false);
    }
  };

  const handleStartModule = async (module) => {
    try {
      await axios.post('/api/learning/modules/start', {
        moduleId: module.id,
        title: module.title
      });
      fetchLearningData();
    } catch (error) {
      console.error('Failed to start module:', error);
      setError('Failed to start module');
    }
  };

  const handleProgressUpdate = async (moduleId, progress, completed = false) => {
    try {
      await axios.put(`/api/learning/modules/${moduleId}/progress`, {
        progress,
        completed
      });
      fetchLearningData();
    } catch (error) {
      console.error('Failed to update progress:', error);
      setError('Failed to update progress');
    }
  };

  const handlePreferenceUpdate = async (field, value) => {
    try {
      await axios.put('/api/learning/preferences', { [field]: value });
      fetchLearningData();
    } catch (error) {
      console.error('Failed to update preferences:', error);
      setError('Failed to update preferences');
    }
  };

  const handleInterestToggle = async (interest) => {
    const currentInterests = learningData.interests || [];
    const updatedInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    
    await handlePreferenceUpdate('interests', updatedInterests);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return theme.palette.success.main;
    if (progress >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading learning data...</Typography>
      </Box>
    );
  }

  // Sample data for charts
  const learningTrendData = [
    { day: 'Mon', minutes: 30 },
    { day: 'Tue', minutes: 45 },
    { day: 'Wed', minutes: 20 },
    { day: 'Thu', minutes: 60 },
    { day: 'Fri', minutes: 35 },
    { day: 'Sat', minutes: 25 },
    { day: 'Sun', minutes: 40 },
  ];

  const categoryData = [
    { name: 'Programming', value: 40, color: '#6366f1' },
    { name: 'Design', value: 25, color: '#ec4899' },
    { name: 'Business', value: 20, color: '#10b981' },
    { name: 'Other', value: 15, color: '#f59e0b' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Learning & Development
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Learning Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Book />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {currentModules.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Modules
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {completedModules.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {analytics.averageScore?.toFixed(1) || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Score
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <AccessTime />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {analytics.learningStreak || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Day Streak
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Learning Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <School sx={{ mr: 1 }} />
                Learning Preferences
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Skill Level</InputLabel>
                    <Select
                      value={learningData.skillLevel || 'beginner'}
                      onChange={(e) => handlePreferenceUpdate('skillLevel', e.target.value)}
                      label="Skill Level"
                    >
                      {skillLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Learning Style</InputLabel>
                    <Select
                      value={learningData.preferredLearningStyle || 'visual'}
                      onChange={(e) => handlePreferenceUpdate('preferredLearningStyle', e.target.value)}
                      label="Learning Style"
                    >
                      {learningStyles.map((style) => (
                        <MenuItem key={style} value={style}>
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Available Time Per Day (minutes)"
                    type="number"
                    value={learningData.availableTimePerDay || 30}
                    onChange={(e) => handlePreferenceUpdate('availableTimePerDay', parseInt(e.target.value) || 30)}
                    size="small"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Learning Interests
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {interests.map((interest) => (
                    <Chip
                      key={interest}
                      label={interest.replace('-', ' ')}
                      onClick={() => handleInterestToggle(interest)}
                      color={learningData.interests?.includes(interest) ? 'primary' : 'default'}
                      variant={learningData.interests?.includes(interest) ? 'filled' : 'outlined'}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Modules */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <PlayArrow sx={{ mr: 1 }} />
                Current Modules
              </Typography>

              {currentModules.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Info sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No active modules
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start a new module to begin learning
                  </Typography>
                </Box>
              ) : (
                <List>
                  {currentModules.map((module) => (
                    <ListItem key={module.moduleId} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getProgressColor(module.progress) }}>
                          <Book />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={module.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              Started: {new Date(module.startedAt).toLocaleDateString()}
                            </Typography>
                            <Box sx={{ mb: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Progress
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  {module.progress}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={module.progress}
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                            </Box>
                          </Box>
                        }
                      />
                      <Button
                        size="small"
                        onClick={() => {
                          setSelectedModule(module);
                          setProgressForm({ progress: module.progress, completed: false });
                          setShowModuleDialog(true);
                        }}
                      >
                        Update Progress
                      </Button>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recommended Modules */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Star sx={{ mr: 1 }} />
                Recommended for You
              </Typography>

              {recommendedModules.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Complete your learning preferences to get personalized recommendations.
                </Typography>
              ) : (
                <List>
                  {recommendedModules.map((module) => (
                    <ListItem key={module.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: `${getDifficultyColor(module.difficulty)}.main` }}>
                          <Book />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={module.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {module.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip
                                label={module.difficulty}
                                size="small"
                                color={getDifficultyColor(module.difficulty)}
                                variant="outlined"
                              />
                              <Chip
                                label={module.duration}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                label={module.category}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        }
                      />
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleStartModule(module)}
                      >
                        Start
                      </Button>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Learning Analytics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Learning Analytics
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={learningTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="minutes"
                    stroke={theme.palette.primary.main}
                    strokeWidth={3}
                    dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Learning Path */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Timeline sx={{ mr: 1 }} />
                Your Learning Path
              </Typography>

              {Object.keys(learningPath).length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Complete your learning preferences to get a personalized learning path.
                </Typography>
              ) : (
                <Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Short Term (1-2 months)
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {learningPath.shortTerm?.map((moduleId, index) => (
                        <Chip
                          key={index}
                          label={moduleId}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Medium Term (3-6 months)
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {learningPath.mediumTerm?.map((moduleId, index) => (
                        <Chip
                          key={index}
                          label={moduleId}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Long Term (6-12 months)
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {learningPath.longTerm?.map((moduleId, index) => (
                        <Chip
                          key={index}
                          label={moduleId}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  {learningPath.recommendations && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Recommendations
                      </Typography>
                      {learningPath.recommendations.map((rec, index) => (
                        <Typography key={index} variant="body2" color="text.secondary">
                          • {rec}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Available Modules */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Assessment sx={{ mr: 1 }} />
                Available Modules
              </Typography>

              {availableModules.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No modules available at the moment.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {availableModules.map((module) => (
                    <Grid item xs={12} sm={6} md={4} key={module.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                            {module.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {module.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                            <Chip
                              label={module.difficulty}
                              size="small"
                              color={getDifficultyColor(module.difficulty)}
                              variant="outlined"
                            />
                            <Chip
                              label={module.duration}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={module.category}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<PlayArrow />}
                            onClick={() => handleStartModule(module)}
                          >
                            Start Module
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress Update Dialog */}
      <Dialog
        open={showModuleDialog}
        onClose={() => setShowModuleDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Update Module Progress
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedModule && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedModule.title}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Progress: {progressForm.progress}%
                </Typography>
                <Slider
                  value={progressForm.progress}
                  onChange={(_, value) => setProgressForm({ ...progressForm, progress: value })}
                  min={0}
                  max={100}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[0, 25, 50, 75, 100].map((progress) => (
                  <Button
                    key={progress}
                    size="small"
                    variant={progressForm.progress === progress ? 'contained' : 'outlined'}
                    onClick={() => setProgressForm({ ...progressForm, progress })}
                  >
                    {progress}%
                  </Button>
                ))}
              </Box>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="success"
                  fullWidth
                  onClick={() => {
                    setProgressForm({ ...progressForm, progress: 100, completed: true });
                  }}
                  disabled={progressForm.progress === 100}
                >
                  Mark as Completed
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModuleDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleProgressUpdate(selectedModule.moduleId, progressForm.progress, progressForm.completed);
              setShowModuleDialog(false);
            }}
            variant="contained"
          >
            Update Progress
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Learning; 