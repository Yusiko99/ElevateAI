const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate dashboard metrics
    const dashboardData = {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.getFullName(),
        avatar: user.avatar
      },
      goals: {
        total: user.goals.length,
        active: user.goals.filter(g => g.status === 'active').length,
        completed: user.goals.filter(g => g.status === 'completed').length,
        recent: user.goals.slice(0, 3)
      },
      wellness: {
        score: user.calculateWellnessScore(),
        recentProgress: user.dailyProgress.slice(-3)
      },
      learning: {
        currentModules: user.learning.currentModules.length,
        completedModules: user.learning.completedModules.length,
        recentActivity: user.learning.currentModules.slice(0, 2)
      },
      beauty: {
        analysisCount: user.beauty.analysisHistory.length,
        recentAnalysis: user.beauty.analysisHistory.slice(0, 1)
      }
    };

    res.json({ dashboardData });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Update AI preferences
router.put('/ai-preferences', auth, async (req, res) => {
  try {
    const { coachingStyle, notificationFrequency, privacyLevel } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update AI preferences
    if (coachingStyle) user.aiPreferences.coachingStyle = coachingStyle;
    if (notificationFrequency) user.aiPreferences.notificationFrequency = notificationFrequency;
    if (privacyLevel) user.aiPreferences.privacyLevel = privacyLevel;

    await user.save();

    res.json({
      message: 'AI preferences updated successfully',
      aiPreferences: user.aiPreferences
    });
  } catch (error) {
    console.error('AI preferences update error:', error);
    res.status(500).json({ error: 'Failed to update AI preferences' });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = {
      accountAge: Math.floor((new Date() - user.createdAt) / (1000 * 60 * 60 * 24)), // days
      totalGoals: user.goals.length,
      completedGoals: user.goals.filter(g => g.status === 'completed').length,
      wellnessScore: user.calculateWellnessScore(),
      learningModules: user.learning.completedModules.length,
      beautyAnalyses: user.beauty.analysisHistory.length,
      streakDays: calculateStreakDays(user.dailyProgress)
    };

    res.json({ stats });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

// Calculate streak days
function calculateStreakDays(dailyProgress) {
  if (dailyProgress.length === 0) return 0;
  
  let streak = 0;
  const sortedProgress = dailyProgress.sort((a, b) => b.date - a.date);
  
  for (let i = 0; i < sortedProgress.length; i++) {
    const entry = sortedProgress[i];
    const hasActivity = entry.goalsCompleted > 0 || entry.learningMinutes > 0 || entry.wellnessScore > 0;
    
    if (hasActivity) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

module.exports = router; 