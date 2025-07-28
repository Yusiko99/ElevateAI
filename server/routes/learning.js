const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get learning data and modules
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const recommendedModules = await getRecommendedModules(user);
    
    res.json({
      learning: user.learning,
      currentModules: user.learning.currentModules,
      completedModules: user.learning.completedModules,
      recommendedModules
    });
  } catch (error) {
    console.error('Learning fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch learning data' });
  }
});

// Update learning preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const {
      interests,
      skillLevel,
      preferredLearningStyle,
      availableTimePerDay
    } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update learning preferences
    if (interests) user.learning.interests = interests;
    if (skillLevel) user.learning.skillLevel = skillLevel;
    if (preferredLearningStyle) user.learning.preferredLearningStyle = preferredLearningStyle;
    if (availableTimePerDay) user.learning.availableTimePerDay = availableTimePerDay;

    await user.save();

    res.json({
      message: 'Learning preferences updated successfully',
      learning: user.learning
    });
  } catch (error) {
    console.error('Learning preferences update error:', error);
    res.status(500).json({ error: 'Failed to update learning preferences' });
  }
});

// Start a new learning module
router.post('/modules/start', auth, async (req, res) => {
  try {
    const { moduleId, title } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if module is already in progress
    const existingModule = user.learning.currentModules.find(m => m.moduleId === moduleId);
    if (existingModule) {
      return res.status(400).json({ error: 'Module already in progress' });
    }

    const newModule = {
      moduleId,
      title,
      progress: 0,
      startedAt: new Date()
    };

    user.learning.currentModules.push(newModule);
    await user.save();

    res.status(201).json({
      message: 'Module started successfully',
      module: newModule
    });
  } catch (error) {
    console.error('Module start error:', error);
    res.status(500).json({ error: 'Failed to start module' });
  }
});

// Update module progress
router.put('/modules/:moduleId/progress', auth, async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { progress, completed } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const module = user.learning.currentModules.find(m => m.moduleId === moduleId);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    module.progress = progress;

    // If module is completed, move to completed modules
    if (completed && progress >= 100) {
      const completedModule = {
        moduleId: module.moduleId,
        title: module.title,
        completedAt: new Date(),
        score: Math.floor(Math.random() * 30) + 70 // Simulated score 70-100
      };

      user.learning.completedModules.push(completedModule);
      user.learning.currentModules = user.learning.currentModules.filter(m => m.moduleId !== moduleId);
    }

    await user.save();

    res.json({
      message: 'Module progress updated successfully',
      module: completed ? null : module,
      completedModule: completed ? completedModule : null
    });
  } catch (error) {
    console.error('Module progress update error:', error);
    res.status(500).json({ error: 'Failed to update module progress' });
  }
});

// Get available learning modules
router.get('/modules/available', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const availableModules = await getAvailableModules(user);
    
    res.json({ availableModules });
  } catch (error) {
    console.error('Available modules fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch available modules' });
  }
});

// Get learning analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const analytics = calculateLearningAnalytics(user);
    
    res.json({ analytics });
  } catch (error) {
    console.error('Learning analytics error:', error);
    res.status(500).json({ error: 'Failed to calculate learning analytics' });
  }
});

// Get personalized learning path
router.get('/path', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const learningPath = await generateLearningPath(user);
    
    res.json({ learningPath });
  } catch (error) {
    console.error('Learning path error:', error);
    res.status(500).json({ error: 'Failed to generate learning path' });
  }
});

// Get recommended modules based on user preferences
async function getRecommendedModules(user) {
  const { interests, skillLevel, completedModules } = user.learning;
  
  // Simulate module database
  const allModules = [
    {
      id: 'python-basics',
      title: 'Python Programming Basics',
      category: 'programming',
      difficulty: 'beginner',
      duration: '4 weeks',
      description: 'Learn the fundamentals of Python programming language',
      tags: ['programming', 'python', 'coding']
    },
    {
      id: 'data-science-intro',
      title: 'Introduction to Data Science',
      category: 'data-science',
      difficulty: 'intermediate',
      duration: '6 weeks',
      description: 'Explore data analysis and machine learning concepts',
      tags: ['data-science', 'analytics', 'machine-learning']
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing Fundamentals',
      category: 'marketing',
      difficulty: 'beginner',
      duration: '3 weeks',
      description: 'Learn modern digital marketing strategies',
      tags: ['marketing', 'digital', 'business']
    },
    {
      id: 'ui-ux-design',
      title: 'UI/UX Design Principles',
      category: 'design',
      difficulty: 'beginner',
      duration: '5 weeks',
      description: 'Master user interface and user experience design',
      tags: ['design', 'ui', 'ux', 'creative']
    },
    {
      id: 'public-speaking',
      title: 'Public Speaking Mastery',
      category: 'communication',
      difficulty: 'beginner',
      duration: '4 weeks',
      description: 'Develop confidence and skills in public speaking',
      tags: ['communication', 'public-speaking', 'confidence']
    }
  ];

  // Filter based on interests and skill level
  let recommended = allModules.filter(module => {
    const matchesInterest = interests.some(interest => 
      module.tags.includes(interest.toLowerCase())
    );
    const matchesLevel = module.difficulty === skillLevel || 
      (skillLevel === 'beginner' && module.difficulty === 'beginner') ||
      (skillLevel === 'intermediate' && ['beginner', 'intermediate'].includes(module.difficulty)) ||
      (skillLevel === 'advanced' && ['beginner', 'intermediate', 'advanced'].includes(module.difficulty));
    
    const notCompleted = !completedModules.find(cm => cm.moduleId === module.id);
    
    return matchesInterest && matchesLevel && notCompleted;
  });

  // Sort by relevance and return top 5
  return recommended.slice(0, 5);
}

// Get available modules
async function getAvailableModules(user) {
  const { skillLevel, completedModules, currentModules } = user.learning;
  
  const allModules = [
    {
      id: 'python-basics',
      title: 'Python Programming Basics',
      category: 'programming',
      difficulty: 'beginner',
      duration: '4 weeks',
      description: 'Learn the fundamentals of Python programming language',
      tags: ['programming', 'python', 'coding'],
      prerequisites: []
    },
    {
      id: 'python-advanced',
      title: 'Advanced Python Programming',
      category: 'programming',
      difficulty: 'advanced',
      duration: '6 weeks',
      description: 'Master advanced Python concepts and frameworks',
      tags: ['programming', 'python', 'advanced'],
      prerequisites: ['python-basics']
    },
    {
      id: 'data-science-intro',
      title: 'Introduction to Data Science',
      category: 'data-science',
      difficulty: 'intermediate',
      duration: '6 weeks',
      description: 'Explore data analysis and machine learning concepts',
      tags: ['data-science', 'analytics', 'machine-learning'],
      prerequisites: ['python-basics']
    }
  ];

  return allModules.filter(module => {
    const notCompleted = !completedModules.find(cm => cm.moduleId === module.id);
    const notInProgress = !currentModules.find(cm => cm.moduleId === module.id);
    const prerequisitesMet = module.prerequisites.every(prereq => 
      completedModules.find(cm => cm.moduleId === prereq)
    );
    
    return notCompleted && notInProgress && prerequisitesMet;
  });
}

// Calculate learning analytics
function calculateLearningAnalytics(user) {
  const { completedModules, currentModules, dailyProgress } = user.learning;
  
  const analytics = {
    totalModulesCompleted: completedModules.length,
    currentModulesCount: currentModules.length,
    averageScore: 0,
    totalLearningTime: 0,
    learningStreak: 0,
    favoriteCategories: {},
    progressTrend: []
  };

  // Calculate average score
  if (completedModules.length > 0) {
    analytics.averageScore = completedModules.reduce((sum, m) => sum + m.score, 0) / completedModules.length;
  }

  // Calculate total learning time from daily progress
  analytics.totalLearningTime = dailyProgress.reduce((sum, p) => sum + p.learningMinutes, 0);

  // Calculate learning streak
  let currentStreak = 0;
  const sortedProgress = dailyProgress.sort((a, b) => b.date - a.date);
  for (let i = 0; i < sortedProgress.length; i++) {
    if (sortedProgress[i].learningMinutes > 0) {
      currentStreak++;
    } else {
      break;
    }
  }
  analytics.learningStreak = currentStreak;

  return analytics;
}

// Generate personalized learning path
async function generateLearningPath(user) {
  const { interests, skillLevel, completedModules } = user.learning;
  
  const learningPath = {
    shortTerm: [], // Next 1-2 months
    mediumTerm: [], // Next 3-6 months
    longTerm: [], // Next 6-12 months
    recommendations: []
  };

  // Generate path based on interests and current level
  if (interests.includes('programming')) {
    if (skillLevel === 'beginner') {
      learningPath.shortTerm.push('python-basics');
      learningPath.mediumTerm.push('data-science-intro');
      learningPath.longTerm.push('python-advanced');
    }
  }

  if (interests.includes('design')) {
    learningPath.shortTerm.push('ui-ux-design');
  }

  if (interests.includes('communication')) {
    learningPath.shortTerm.push('public-speaking');
  }

  learningPath.recommendations.push('Focus on one module at a time for better retention');
  learningPath.recommendations.push('Practice regularly with small daily sessions');

  return learningPath;
}

module.exports = router; 