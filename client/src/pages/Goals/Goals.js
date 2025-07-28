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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Fab,
  useTheme,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Flag,
  CheckCircle,
  Schedule,
  Pause,
  TrendingUp,
  Category,
  CalendarToday,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const Goals = () => {
  const theme = useTheme();
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    targetDate: null,
    progress: 0,
  });

  const categories = [
    { value: 'health', label: 'Health & Fitness', color: 'success' },
    { value: 'career', label: 'Career', color: 'primary' },
    { value: 'relationships', label: 'Relationships', color: 'secondary' },
    { value: 'personal', label: 'Personal Growth', color: 'info' },
    { value: 'learning', label: 'Learning', color: 'warning' },
    { value: 'beauty', label: 'Beauty & Aesthetics', color: 'error' },
  ];

  const statusColors = {
    active: 'primary',
    completed: 'success',
    paused: 'warning',
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Mock data for testing when backend is not available
  const mockGoals = [
    {
      id: '1',
      title: 'Learn React',
      description: 'Master React fundamentals and build a portfolio project',
      category: 'learning',
      status: 'active',
      progress: 75,
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      priority: 'high'
    },
    {
      id: '2',
      title: 'Exercise Daily',
      description: 'Build a consistent workout routine',
      category: 'health',
      status: 'active',
      progress: 60,
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Read More Books',
      description: 'Read 12 books this year',
      category: 'personal',
      status: 'completed',
      progress: 100,
      targetDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      priority: 'low'
    }
  ];

  const mockStats = {
    total: 5,
    active: 3,
    completed: 2,
    byCategory: {
      health: 2,
      career: 1,
      learning: 1,
      personal: 1
    },
    byStatus: {
      active: 3,
      completed: 2,
      paused: 0
    }
  };

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const [goalsResponse, statsResponse] = await Promise.all([
        axios.get('/api/goals'),
        axios.get('/api/goals/stats')
      ]);
      
      setGoals(goalsResponse.data.goals);
      setStats(statsResponse.data.stats);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      // Use mock data when backend is not available
      setGoals(mockGoals);
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingGoal) {
        await axios.put(`/api/goals/${editingGoal._id}`, formData);
      } else {
        await axios.post('/api/goals', formData);
      }
      
      setShowAddDialog(false);
      setEditingGoal(null);
      resetForm();
      fetchGoals();
    } catch (error) {
      console.error('Failed to save goal:', error);
      setError('Failed to save goal');
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      targetDate: goal.targetDate ? new Date(goal.targetDate) : null,
      progress: goal.progress,
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      await axios.delete(`/api/goals/${goalId}`);
      fetchGoals();
    } catch (error) {
      console.error('Failed to delete goal:', error);
      setError('Failed to delete goal');
    }
  };

  const handleProgressUpdate = async (goalId, newProgress) => {
    try {
      await axios.put(`/api/goals/${goalId}`, { progress: newProgress });
      fetchGoals();
    } catch (error) {
      console.error('Failed to update progress:', error);
      setError('Failed to update progress');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'personal',
      targetDate: null,
      progress: 0,
    });
  };

  const filteredGoals = goals.filter(goal => 
    selectedCategory === 'all' || goal.category === selectedCategory
  );

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : 'default';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle />;
      case 'paused':
        return <Pause />;
      default:
        return <Schedule />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading goals...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Goals & Aspirations
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

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
                    {stats.total || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Goals
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
                    {stats.completed || 0}
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
                    {stats.active || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active
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
                  <Pause />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.paused || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Paused
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Filter by Category
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label="All Categories"
            onClick={() => setSelectedCategory('all')}
            color={selectedCategory === 'all' ? 'primary' : 'default'}
            variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
          />
          {categories.map((category) => (
            <Chip
              key={category.value}
              label={category.label}
              onClick={() => setSelectedCategory(category.value)}
              color={selectedCategory === category.value ? category.color : 'default'}
              variant={selectedCategory === category.value ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      {/* Goals List */}
      <Grid container spacing={3}>
        {filteredGoals.map((goal) => (
          <Grid item xs={12} md={6} key={goal._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {goal.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {goal.description}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(goal)}
                      sx={{ color: 'primary.main' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(goal._id)}
                      sx={{ color: 'error.main' }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={categories.find(c => c.value === goal.category)?.label}
                    size="small"
                    color={getCategoryColor(goal.category)}
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    icon={getStatusIcon(goal.status)}
                    label={goal.status}
                    size="small"
                    color={statusColors[goal.status]}
                    variant="outlined"
                  />
                </Box>

                {goal.targetDate && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {goal.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={goal.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[0, 25, 50, 75, 100].map((progress) => (
                    <Button
                      key={progress}
                      size="small"
                      variant={goal.progress === progress ? 'contained' : 'outlined'}
                      onClick={() => handleProgressUpdate(goal._id, progress)}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      {progress}%
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredGoals.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Flag sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            {selectedCategory === 'all' ? 'No goals yet' : `No ${selectedCategory} goals`}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start by creating your first goal to begin your journey
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowAddDialog(true)}
          >
            Create Your First Goal
          </Button>
        </Box>
      )}

      {/* Add/Edit Goal Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          setEditingGoal(null);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {editingGoal ? 'Edit Goal' : 'Create New Goal'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Goal Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              sx={{ mb: 3 }}
            />

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Target Date (Optional)"
                    value={formData.targetDate}
                    onChange={(date) => setFormData({ ...formData, targetDate: date })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Initial Progress: {formData.progress}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={formData.progress}
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[0, 25, 50, 75, 100].map((progress) => (
                  <Button
                    key={progress}
                    size="small"
                    variant={formData.progress === progress ? 'contained' : 'outlined'}
                    onClick={() => setFormData({ ...formData, progress })}
                  >
                    {progress}%
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowAddDialog(false);
              setEditingGoal(null);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.title.trim()}
          >
            {editingGoal ? 'Update Goal' : 'Create Goal'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add goal"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => setShowAddDialog(true)}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default Goals; 