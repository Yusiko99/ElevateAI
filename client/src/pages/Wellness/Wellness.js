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
  Favorite,
  TrendingUp,
  Restaurant,
  FitnessCenter,
  Psychology,
  LocalHospital,
  Add,
  CheckCircle,
  Info,
  Timeline,
  Assessment,
  School,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const Wellness = () => {
  const theme = useTheme();
  const [wellnessData, setWellnessData] = useState({});
  const [dailyProgress, setDailyProgress] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [workoutPlan, setWorkoutPlan] = useState({});
  const [nutrition, setNutrition] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [progressForm, setProgressForm] = useState({
    goalsCompleted: 0,
    wellnessScore: 0,
    learningMinutes: 0,
    mood: 'neutral',
    energy: 5,
    notes: '',
  });

  const moods = ['excellent', 'good', 'neutral', 'poor', 'terrible'];
  const activityLevels = ['sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extremely-active'];
  const healthGoals = ['weight-loss', 'muscle-gain', 'maintenance', 'energy-boost', 'stress-reduction', 'better-sleep'];

  useEffect(() => {
    fetchWellnessData();
  }, []);

  // Mock data for testing when backend is not available
  const mockWellnessData = {
    wellness: {
      height: 175,
      weight: 70,
      age: 28,
      gender: 'male',
      activityLevel: 'moderately-active',
      healthGoals: ['weight-loss', 'energy-boost'],
      medicalConditions: [],
      allergies: [],
      medications: [],
      emergencyContact: {
        name: 'John Doe',
        relationship: 'Spouse',
        phone: '+1-555-0123'
      }
    },
    dailyProgress: [
      { date: new Date(), wellnessScore: 85, goalsCompleted: 2, energy: 8, mood: 'good', notes: 'Great day!' },
      { date: new Date(Date.now() - 86400000), wellnessScore: 78, goalsCompleted: 1, energy: 6, mood: 'neutral', notes: 'Tired today' },
      { date: new Date(Date.now() - 172800000), wellnessScore: 92, goalsCompleted: 3, energy: 9, mood: 'excellent', notes: 'Very productive' }
    ]
  };

  const mockRecommendations = [
    {
      id: '1',
      type: 'nutrition',
      title: 'Increase Protein Intake',
      description: 'Based on your activity level, consider adding more lean protein to your diet.',
      priority: 'high',
      category: 'nutrition'
    },
    {
      id: '2',
      type: 'exercise',
      title: 'Cardio Training',
      description: 'Add 30 minutes of cardio 3 times per week to improve your fitness.',
      priority: 'medium',
      category: 'exercise'
    },
    {
      id: '3',
      type: 'sleep',
      title: 'Sleep Schedule',
      description: 'Try to maintain a consistent sleep schedule of 7-8 hours per night.',
      priority: 'medium',
      category: 'sleep'
    }
  ];

  const mockAnalytics = {
    wellnessScore: 85,
    weeklyAverage: 82,
    monthlyTrend: 'increasing',
    sleepQuality: 7.5,
    stressLevel: 4,
    energyLevel: 7,
    learningConsistency: 78,
    goalCompletion: 65
  };

  const mockWorkoutPlan = {
    weeklyPlan: [
      { day: 'Monday', workout: 'Cardio + Strength', duration: '45 min' },
      { day: 'Tuesday', workout: 'Yoga', duration: '30 min' },
      { day: 'Wednesday', workout: 'HIIT', duration: '30 min' },
      { day: 'Thursday', workout: 'Rest', duration: '0 min' },
      { day: 'Friday', workout: 'Strength Training', duration: '45 min' },
      { day: 'Saturday', workout: 'Cardio', duration: '30 min' },
      { day: 'Sunday', workout: 'Rest', duration: '0 min' }
    ],
    recommendations: [
      'Focus on compound movements',
      'Include rest days for recovery',
      'Gradually increase intensity'
    ]
  };

  const mockNutrition = {
    dailyCalories: 2000,
    macronutrients: {
      protein: 150,
      carbs: 200,
      fats: 67
    },
    recommendations: [
      'Eat more vegetables',
      'Stay hydrated',
      'Limit processed foods'
    ],
    mealPlan: [
      { meal: 'Breakfast', calories: 400, description: 'Oatmeal with berries and nuts' },
      { meal: 'Lunch', calories: 500, description: 'Grilled chicken salad' },
      { meal: 'Dinner', calories: 600, description: 'Salmon with quinoa and vegetables' },
      { meal: 'Snacks', calories: 200, description: 'Greek yogurt and fruit' }
    ]
  };

  const fetchWellnessData = async () => {
    try {
      setLoading(true);
      const [wellnessResponse, recommendationsResponse, analyticsResponse, workoutResponse, nutritionResponse] = await Promise.all([
        axios.get('/api/wellness'),
        axios.get('/api/wellness/recommendations'),
        axios.get('/api/wellness/analytics'),
        axios.get('/api/wellness/workout-plan'),
        axios.get('/api/wellness/nutrition')
      ]);
      
      setWellnessData(wellnessResponse.data.wellness);
      setDailyProgress(wellnessResponse.data.dailyProgress);
      setRecommendations(recommendationsResponse.data.recommendations);
      setAnalytics(analyticsResponse.data.analytics);
      setWorkoutPlan(workoutResponse.data.workoutPlan);
      setNutrition(nutritionResponse.data.nutrition);
    } catch (error) {
      console.error('Failed to fetch wellness data:', error);
      // Use mock data when backend is not available
      setWellnessData(mockWellnessData.wellness);
      setDailyProgress(mockWellnessData.dailyProgress);
      setRecommendations(mockRecommendations);
      setAnalytics(mockAnalytics);
      setWorkoutPlan(mockWorkoutPlan);
      setNutrition(mockNutrition);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post('/api/wellness/progress', progressForm);
      setShowProgressDialog(false);
      setProgressForm({
        goalsCompleted: 0,
        wellnessScore: 0,
        learningMinutes: 0,
        mood: 'neutral',
        energy: 5,
        notes: '',
      });
      fetchWellnessData();
    } catch (error) {
      console.error('Failed to submit progress:', error);
      setError('Failed to submit progress');
    }
  };

  const handleWellnessUpdate = async (field, value) => {
    try {
      const updateData = { [field]: value };
      await axios.put('/api/wellness', updateData);
      fetchWellnessData();
    } catch (error) {
      console.error('Failed to update wellness data:', error);
      setError('Failed to update wellness data');
    }
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading wellness data...</Typography>
      </Box>
    );
  }

  // Sample data for charts
  const wellnessTrendData = dailyProgress.map(progress => ({
    date: new Date(progress.date).toLocaleDateString(),
    score: progress.wellnessScore,
    energy: progress.energy,
  }));

  const moodDistributionData = Object.entries(analytics.moodDistribution || {}).map(([mood, count]) => ({
    mood: mood.charAt(0).toUpperCase() + mood.slice(1),
    count,
  }));

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Wellness & Health
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Wellness Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Favorite />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {wellnessData.wellnessScore || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Wellness Score
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
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {analytics.averageEnergy?.toFixed(1) || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Energy Level
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
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {analytics.goalsCompletionRate?.toFixed(1) || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Goal Completion Rate
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
                  <School />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {analytics.learningConsistency?.toFixed(1) || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Learning Consistency
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Wellness Profile */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <LocalHospital sx={{ mr: 1 }} />
                Health Profile
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Height (cm)"
                    type="number"
                    value={wellnessData.height || ''}
                    onChange={(e) => handleWellnessUpdate('height', e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Weight (kg)"
                    type="number"
                    value={wellnessData.weight || ''}
                    onChange={(e) => handleWellnessUpdate('weight', e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    value={wellnessData.age || ''}
                    onChange={(e) => handleWellnessUpdate('age', e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={wellnessData.gender || ''}
                      onChange={(e) => handleWellnessUpdate('gender', e.target.value)}
                      label="Gender"
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                      <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Activity Level</InputLabel>
                    <Select
                      value={wellnessData.activityLevel || 'moderately-active'}
                      onChange={(e) => handleWellnessUpdate('activityLevel', e.target.value)}
                      label="Activity Level"
                    >
                      {activityLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Health Goals
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {healthGoals.map((goal) => (
                    <Chip
                      key={goal}
                      label={goal.replace('-', ' ')}
                      onClick={() => {
                        const currentGoals = wellnessData.healthGoals || [];
                        const updatedGoals = currentGoals.includes(goal)
                          ? currentGoals.filter(g => g !== goal)
                          : [...currentGoals, goal];
                        handleWellnessUpdate('healthGoals', updatedGoals);
                      }}
                      color={wellnessData.healthGoals?.includes(goal) ? 'primary' : 'default'}
                      variant={wellnessData.healthGoals?.includes(goal) ? 'filled' : 'outlined'}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Progress Log */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <Timeline sx={{ mr: 1 }} />
                  Daily Progress
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowProgressDialog(true)}
                  size="small"
                >
                  Log Progress
                </Button>
              </Box>

              {dailyProgress.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Info sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No progress logged yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start tracking your daily wellness progress
                  </Typography>
                </Box>
              ) : (
                <List>
                  {dailyProgress.slice(0, 5).map((progress, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getMoodColor(progress.mood) }}>
                          {progress.mood === 'excellent' || progress.mood === 'good' ? (
                            <TrendingUp />
                          ) : (
                            <Psychology />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Wellness Score: ${progress.wellnessScore}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              {new Date(progress.date).toLocaleDateString()} • 
                              Energy: {progress.energy}/10 • 
                              Goals: {progress.goalsCompleted}
                            </Typography>
                            <Chip
                              label={progress.mood}
                              size="small"
                              sx={{ bgcolor: getMoodColor(progress.mood), color: 'white' }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* AI Recommendations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Assessment sx={{ mr: 1 }} />
                AI Recommendations
              </Typography>

              {recommendations.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Complete your health profile to get personalized recommendations.
                </Typography>
              ) : (
                <List>
                  {recommendations.slice(0, 3).map((rec, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: `${getPriorityColor(rec.priority)}.main` }}>
                          {rec.category === 'energy' ? <TrendingUp /> :
                           rec.category === 'mood' ? <Psychology /> :
                           rec.category === 'activity' ? <FitnessCenter /> : <Info />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={rec.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {rec.description}
                            </Typography>
                            {rec.actions && (
                              <Box>
                                {rec.actions.map((action, idx) => (
                                  <Typography key={idx} variant="caption" display="block" color="text.secondary">
                                    • {action}
                                  </Typography>
                                ))}
                              </Box>
                            )}
                          </Box>
                        }
                      />
                      <Chip
                        label={rec.priority}
                        size="small"
                        color={getPriorityColor(rec.priority)}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Analytics Charts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Wellness Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={wellnessTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
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

        {/* Workout Plan */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <FitnessCenter sx={{ mr: 1 }} />
                Personalized Workout Plan
              </Typography>

              {Object.keys(workoutPlan.weekly || {}).length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Complete your health profile to get a personalized workout plan.
                </Typography>
              ) : (
                <Box>
                  {Object.entries(workoutPlan.weekly).map(([day, exercises]) => (
                    exercises.length > 0 && (
                      <Box key={day} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </Typography>
                        <List dense>
                          {exercises.map((exercise, index) => (
                            <ListItem key={index} sx={{ px: 0 }}>
                              <ListItemText primary={exercise} />
                            </ListItem>
                          ))}
                        </List>
                        {day !== Object.keys(workoutPlan.weekly).slice(-1)[0] && <Divider />}
                      </Box>
                    )
                  ))}
                  {workoutPlan.recommendations && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Recommendations
                      </Typography>
                      {workoutPlan.recommendations.map((rec, index) => (
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

        {/* Nutrition Plan */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Restaurant sx={{ mr: 1 }} />
                Nutrition Recommendations
              </Typography>

              {Object.keys(nutrition).length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Complete your health profile to get nutrition recommendations.
                </Typography>
              ) : (
                <Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Daily Calories: {nutrition.dailyCalories}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Protein: {nutrition.macronutrients?.protein} • 
                      Carbs: {nutrition.macronutrients?.carbs} • 
                      Fats: {nutrition.macronutrients?.fats}
                    </Typography>
                  </Box>

                  {nutrition.mealSuggestions && (
                    <Box>
                      {Object.entries(nutrition.mealSuggestions).map(([meal, suggestions]) => (
                        <Box key={meal} sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            {meal.charAt(0).toUpperCase() + meal.slice(1)}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {suggestions.map((suggestion, index) => (
                              <Chip
                                key={index}
                                label={suggestion}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {nutrition.recommendations && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Recommendations
                      </Typography>
                      {nutrition.recommendations.map((rec, index) => (
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
      </Grid>

      {/* Progress Log Dialog */}
      <Dialog
        open={showProgressDialog}
        onClose={() => setShowProgressDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Log Daily Progress
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleProgressSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Goals Completed"
                  type="number"
                  value={progressForm.goalsCompleted}
                  onChange={(e) => setProgressForm({ ...progressForm, goalsCompleted: parseInt(e.target.value) || 0 })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Learning Minutes"
                  type="number"
                  value={progressForm.learningMinutes}
                  onChange={(e) => setProgressForm({ ...progressForm, learningMinutes: parseInt(e.target.value) || 0 })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Mood</InputLabel>
                  <Select
                    value={progressForm.mood}
                    onChange={(e) => setProgressForm({ ...progressForm, mood: e.target.value })}
                    label="Mood"
                  >
                    {moods.map((mood) => (
                      <MenuItem key={mood} value={mood}>
                        {mood.charAt(0).toUpperCase() + mood.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Energy Level: {progressForm.energy}/10
                  </Typography>
                  <Slider
                    value={progressForm.energy}
                    onChange={(_, value) => setProgressForm({ ...progressForm, energy: value })}
                    min={1}
                    max={10}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes (Optional)"
                  multiline
                  rows={3}
                  value={progressForm.notes}
                  onChange={(e) => setProgressForm({ ...progressForm, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowProgressDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleProgressSubmit} variant="contained">
            Log Progress
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Wellness; 