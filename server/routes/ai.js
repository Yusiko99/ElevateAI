const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get AI insights and recommendations
router.get('/insights', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const insights = await generateAIInsights(user);
    
    res.json({ insights });
  } catch (error) {
    console.error('AI insights error:', error);
    res.status(500).json({ error: 'Failed to generate AI insights' });
  }
});

// Get personalized coaching message
router.get('/coaching', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const coachingMessage = await generateCoachingMessage(user);
    
    res.json({ coachingMessage });
  } catch (error) {
    console.error('Coaching message error:', error);
    res.status(500).json({ error: 'Failed to generate coaching message' });
  }
});

// Get AI-powered suggestions
router.get('/suggestions', auth, async (req, res) => {
  try {
    const { category } = req.query;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const suggestions = await generateSuggestions(user, category);
    
    res.json({ suggestions });
  } catch (error) {
    console.error('AI suggestions error:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

// Generate AI insights based on user data
async function generateAIInsights(user) {
  const insights = [];
  
  // Analyze goal completion patterns
  const completedGoals = user.goals.filter(g => g.status === 'completed');
  const activeGoals = user.goals.filter(g => g.status === 'active');
  
  if (completedGoals.length > 0) {
    insights.push({
      type: 'achievement',
      title: 'Goal Achievement Pattern',
      message: `You've successfully completed ${completedGoals.length} goals. Your most successful category is ${getMostSuccessfulCategory(completedGoals)}.`,
      confidence: 0.85
    });
  }
  
  // Analyze wellness trends
  const recentProgress = user.dailyProgress.slice(-7);
  if (recentProgress.length > 0) {
    const averageEnergy = recentProgress.reduce((sum, p) => sum + p.energy, 0) / recentProgress.length;
    const averageMood = recentProgress.reduce((sum, p) => {
      const moodScores = { excellent: 5, good: 4, neutral: 3, poor: 2, terrible: 1 };
      return sum + moodScores[p.mood];
    }, 0) / recentProgress.length;
    
    if (averageEnergy < 6) {
      insights.push({
        type: 'wellness',
        title: 'Energy Level Insight',
        message: 'Your energy levels have been below optimal. Consider reviewing your sleep patterns and stress management.',
        confidence: 0.78
      });
    }
    
    if (averageMood < 3.5) {
      insights.push({
        type: 'wellness',
        title: 'Mood Pattern',
        message: 'Your mood has been trending downward. This might be a good time to focus on self-care activities.',
        confidence: 0.82
      });
    }
  }
  
  // Learning insights
  const learningProgress = user.learning.currentModules;
  if (learningProgress.length > 0) {
    const averageProgress = learningProgress.reduce((sum, m) => sum + m.progress, 0) / learningProgress.length;
    
    if (averageProgress < 30) {
      insights.push({
        type: 'learning',
        title: 'Learning Progress',
        message: 'Your learning modules are progressing slowly. Consider setting aside dedicated time for focused study.',
        confidence: 0.75
      });
    }
  }
  
  return insights;
}

// Generate personalized coaching message
async function generateCoachingMessage(user) {
  const { coachingStyle } = user.aiPreferences;
  const recentProgress = user.dailyProgress.slice(-3);
  
  let message = '';
  let tone = '';
  
  switch (coachingStyle) {
    case 'motivational':
      tone = 'encouraging and uplifting';
      message = `Hey ${user.firstName}! 🌟 You're doing amazing work on your personal growth journey. Every small step counts, and I can see your dedication shining through. Keep pushing forward - you've got this!`;
      break;
      
    case 'analytical':
      tone = 'data-driven and objective';
      message = `Hello ${user.firstName}. Based on your recent activity patterns, I've identified several optimization opportunities. Your goal completion rate is ${calculateGoalCompletionRate(recentProgress)}%, which suggests room for improvement in your daily planning.`;
      break;
      
    case 'gentle':
      tone = 'supportive and understanding';
      message = `Hi ${user.firstName} 💙 I want you to know that it's perfectly okay to take things at your own pace. Personal growth isn't a race - it's a journey. I'm here to support you every step of the way.`;
      break;
      
    case 'challenging':
      tone = 'direct and challenging';
      message = `Listen up, ${user.firstName}! 💪 You have incredible potential, but I'm seeing some missed opportunities. Your goals are waiting for you to take action. What's holding you back from giving 100% today?`;
      break;
      
    default:
      tone = 'balanced and supportive';
      message = `Hello ${user.firstName}! I'm here to support your growth journey. Let's work together to achieve your goals and unlock your full potential.`;
  }
  
  return {
    message,
    tone,
    timestamp: new Date().toISOString(),
    coachingStyle
  };
}

// Generate AI suggestions
async function generateSuggestions(user, category) {
  const suggestions = [];
  
  if (!category || category === 'general') {
    // General suggestions based on user patterns
    const activeGoals = user.goals.filter(g => g.status === 'active');
    if (activeGoals.length === 0) {
      suggestions.push({
        type: 'goal-setting',
        title: 'Set Your First Goal',
        description: 'Start your journey by setting a meaningful goal that excites you.',
        priority: 'high'
      });
    }
    
    const recentProgress = user.dailyProgress.slice(-7);
    if (recentProgress.length === 0) {
      suggestions.push({
        type: 'tracking',
        title: 'Start Daily Tracking',
        description: 'Begin tracking your daily progress to see patterns and improvements.',
        priority: 'high'
      });
    }
  }
  
  if (category === 'wellness' || !category) {
    // Wellness suggestions
    if (user.wellness.activityLevel === 'sedentary') {
      suggestions.push({
        type: 'wellness',
        title: 'Start Moving',
        description: 'Begin with 10-minute daily walks to gradually increase your activity level.',
        priority: 'medium'
      });
    }
  }
  
  if (category === 'learning' || !category) {
    // Learning suggestions
    if (user.learning.currentModules.length === 0) {
      suggestions.push({
        type: 'learning',
        title: 'Explore Learning Modules',
        description: 'Discover personalized learning content based on your interests.',
        priority: 'medium'
      });
    }
  }
  
  if (category === 'beauty' || !category) {
    // Beauty suggestions
    if (user.beauty.analysisHistory.length === 0) {
      suggestions.push({
        type: 'beauty',
        title: 'Try Beauty Analysis',
        description: 'Get personalized beauty recommendations through our AI analysis.',
        priority: 'low'
      });
    }
  }
  
  return suggestions;
}

// Helper functions
function getMostSuccessfulCategory(completedGoals) {
  const categories = {};
  completedGoals.forEach(goal => {
    categories[goal.category] = (categories[goal.category] || 0) + 1;
  });
  
  return Object.keys(categories).reduce((a, b) => 
    categories[a] > categories[b] ? a : b
  );
}

function calculateGoalCompletionRate(recentProgress) {
  if (recentProgress.length === 0) return 0;
  
  const totalGoals = recentProgress.reduce((sum, p) => sum + p.goalsCompleted, 0);
  return Math.round((totalGoals / recentProgress.length) * 100);
}

module.exports = router; 