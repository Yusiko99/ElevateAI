const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get wellness data
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      wellness: user.wellness,
      dailyProgress: user.dailyProgress.slice(-7) // Last 7 days
    });
  } catch (error) {
    console.error('Wellness fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch wellness data' });
  }
});

// Update wellness data
router.put('/', auth, async (req, res) => {
  try {
    const {
      height,
      weight,
      age,
      gender,
      activityLevel,
      healthGoals,
      medicalConditions,
      allergies,
      medications
    } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update wellness data
    if (height !== undefined) user.wellness.height = height;
    if (weight !== undefined) user.wellness.weight = weight;
    if (age !== undefined) user.wellness.age = age;
    if (gender) user.wellness.gender = gender;
    if (activityLevel) user.wellness.activityLevel = activityLevel;
    if (healthGoals) user.wellness.healthGoals = healthGoals;
    if (medicalConditions) user.wellness.medicalConditions = medicalConditions;
    if (allergies) user.wellness.allergies = allergies;
    if (medications) user.wellness.medications = medications;

    await user.save();

    res.json({
      message: 'Wellness data updated successfully',
      wellness: user.wellness
    });
  } catch (error) {
    console.error('Wellness update error:', error);
    res.status(500).json({ error: 'Failed to update wellness data' });
  }
});

// Add daily progress entry
router.post('/progress', auth, async (req, res) => {
  try {
    const { goalsCompleted, wellnessScore, learningMinutes, mood, energy, notes } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const progressEntry = {
      date: new Date(),
      goalsCompleted: goalsCompleted || 0,
      wellnessScore: wellnessScore || user.calculateWellnessScore(),
      learningMinutes: learningMinutes || 0,
      mood: mood || 'neutral',
      energy: energy || 5,
      notes: notes || ''
    };

    user.dailyProgress.push(progressEntry);
    await user.save();

    res.status(201).json({
      message: 'Progress entry added successfully',
      progress: progressEntry
    });
  } catch (error) {
    console.error('Progress entry error:', error);
    res.status(500).json({ error: 'Failed to add progress entry' });
  }
});

// Get AI wellness recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const recommendations = await generateWellnessRecommendations(user);
    
    res.json({
      recommendations,
      userData: {
        wellness: user.wellness,
        recentProgress: user.dailyProgress.slice(-3)
      }
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Get wellness analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const analytics = calculateWellnessAnalytics(user);
    
    res.json({ analytics });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to calculate analytics' });
  }
});

// Get personalized workout plan
router.get('/workout-plan', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const workoutPlan = await generateWorkoutPlan(user);
    
    res.json({ workoutPlan });
  } catch (error) {
    console.error('Workout plan error:', error);
    res.status(500).json({ error: 'Failed to generate workout plan' });
  }
});

// Get nutrition recommendations
router.get('/nutrition', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const nutrition = await generateNutritionPlan(user);
    
    res.json({ nutrition });
  } catch (error) {
    console.error('Nutrition error:', error);
    res.status(500).json({ error: 'Failed to generate nutrition plan' });
  }
});

// Generate wellness recommendations based on user data
async function generateWellnessRecommendations(user) {
  const recommendations = [];
  
  // Analyze recent progress
  const recentProgress = user.dailyProgress.slice(-7);
  const averageEnergy = recentProgress.reduce((sum, p) => sum + p.energy, 0) / recentProgress.length;
  const averageMood = recentProgress.reduce((sum, p) => {
    const moodScores = { excellent: 5, good: 4, neutral: 3, poor: 2, terrible: 1 };
    return sum + moodScores[p.mood];
  }, 0) / recentProgress.length;

  // Energy recommendations
  if (averageEnergy < 6) {
    recommendations.push({
      category: 'energy',
      title: 'Boost Your Energy',
      description: 'Consider improving sleep quality, hydration, and incorporating energizing foods.',
      priority: 'high',
      actions: [
        'Aim for 7-9 hours of quality sleep',
        'Stay hydrated throughout the day',
        'Include protein and complex carbs in meals'
      ]
    });
  }

  // Mood recommendations
  if (averageMood < 3.5) {
    recommendations.push({
      category: 'mood',
      title: 'Improve Your Mood',
      description: 'Focus on activities that boost serotonin and reduce stress.',
      priority: 'high',
      actions: [
        'Practice daily gratitude',
        'Engage in physical activity',
        'Spend time in nature',
        'Connect with loved ones'
      ]
    });
  }

  // Activity level recommendations
  if (user.wellness.activityLevel === 'sedentary') {
    recommendations.push({
      category: 'activity',
      title: 'Increase Physical Activity',
      description: 'Start with gentle exercises and gradually build up.',
      priority: 'medium',
      actions: [
        'Take 10-minute walks 3 times daily',
        'Try gentle yoga or stretching',
        'Use stairs instead of elevators'
      ]
    });
  }

  return recommendations;
}

// Calculate wellness analytics
function calculateWellnessAnalytics(user) {
  const recentProgress = user.dailyProgress.slice(-30); // Last 30 days
  
  const analytics = {
    averageWellnessScore: 0,
    averageEnergy: 0,
    moodDistribution: {},
    goalsCompletionRate: 0,
    learningConsistency: 0,
    trends: {
      wellnessScore: [],
      energy: [],
      mood: []
    }
  };

  if (recentProgress.length > 0) {
    analytics.averageWellnessScore = recentProgress.reduce((sum, p) => sum + p.wellnessScore, 0) / recentProgress.length;
    analytics.averageEnergy = recentProgress.reduce((sum, p) => sum + p.energy, 0) / recentProgress.length;
    
    // Mood distribution
    recentProgress.forEach(p => {
      analytics.moodDistribution[p.mood] = (analytics.moodDistribution[p.mood] || 0) + 1;
    });
    
    // Goals completion rate
    const totalGoals = recentProgress.reduce((sum, p) => sum + p.goalsCompleted, 0);
    analytics.goalsCompletionRate = totalGoals / recentProgress.length;
    
    // Learning consistency
    const learningDays = recentProgress.filter(p => p.learningMinutes > 0).length;
    analytics.learningConsistency = (learningDays / recentProgress.length) * 100;
  }

  return analytics;
}

// Generate personalized workout plan
async function generateWorkoutPlan(user) {
  const { activityLevel, healthGoals, age } = user.wellness;
  
  const workoutPlan = {
    weekly: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    },
    recommendations: []
  };

  // Basic workout structure based on activity level
  if (activityLevel === 'sedentary') {
    workoutPlan.weekly.monday = ['10-minute walk', 'Gentle stretching'];
    workoutPlan.weekly.wednesday = ['15-minute walk', 'Basic yoga poses'];
    workoutPlan.weekly.friday = ['20-minute walk', 'Light strength training'];
    workoutPlan.recommendations.push('Start slow and gradually increase intensity');
  } else if (activityLevel === 'moderately-active') {
    workoutPlan.weekly.monday = ['30-minute cardio', 'Strength training'];
    workoutPlan.weekly.tuesday = ['Yoga or Pilates'];
    workoutPlan.weekly.thursday = ['30-minute cardio', 'Strength training'];
    workoutPlan.weekly.saturday = ['Long walk or hike'];
    workoutPlan.recommendations.push('Mix cardio and strength training for optimal results');
  }

  return workoutPlan;
}

// Generate nutrition plan
async function generateNutritionPlan(user) {
  const { healthGoals, activityLevel, age, weight, height } = user.wellness;
  
  const nutrition = {
    dailyCalories: 2000, // Placeholder - would calculate based on BMR and activity
    macronutrients: {
      protein: '20-25%',
      carbs: '45-55%',
      fats: '20-35%'
    },
    mealSuggestions: {
      breakfast: ['Oatmeal with berries', 'Greek yogurt with nuts', 'Whole grain toast with avocado'],
      lunch: ['Grilled chicken salad', 'Quinoa bowl with vegetables', 'Turkey sandwich on whole grain'],
      dinner: ['Salmon with vegetables', 'Lean beef stir-fry', 'Vegetarian pasta'],
      snacks: ['Apple with almond butter', 'Carrot sticks with hummus', 'Mixed nuts']
    },
    recommendations: []
  };

  if (healthGoals.includes('weight-loss')) {
    nutrition.recommendations.push('Create a moderate calorie deficit of 300-500 calories per day');
    nutrition.recommendations.push('Focus on high-protein foods to maintain muscle mass');
  }

  if (healthGoals.includes('muscle-gain')) {
    nutrition.recommendations.push('Increase protein intake to 1.6-2.2g per kg of body weight');
    nutrition.recommendations.push('Eat in a slight calorie surplus');
  }

  return nutrition;
}

module.exports = router; 