const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all goals for user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      goals: user.goals.sort((a, b) => b.createdAt - a.createdAt)
    });
  } catch (error) {
    console.error('Goals fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// Create new goal
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, targetDate } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newGoal = {
      title,
      description,
      category: category || 'personal',
      targetDate: targetDate ? new Date(targetDate) : null,
      progress: 0,
      status: 'active',
      createdAt: new Date()
    };

    user.goals.push(newGoal);
    await user.save();

    res.status(201).json({
      message: 'Goal created successfully',
      goal: newGoal
    });
  } catch (error) {
    console.error('Goal creation error:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// Update goal
router.put('/:goalId', auth, async (req, res) => {
  try {
    const { title, description, category, targetDate, progress, status } = req.body;
    const { goalId } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const goal = user.goals.id(goalId);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    // Update fields
    if (title) goal.title = title;
    if (description) goal.description = description;
    if (category) goal.category = category;
    if (targetDate) goal.targetDate = new Date(targetDate);
    if (progress !== undefined) goal.progress = progress;
    if (status) goal.status = status;

    await user.save();

    res.json({
      message: 'Goal updated successfully',
      goal
    });
  } catch (error) {
    console.error('Goal update error:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// Delete goal
router.delete('/:goalId', auth, async (req, res) => {
  try {
    const { goalId } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const goal = user.goals.id(goalId);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    goal.remove();
    await user.save();

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Goal deletion error:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

// Get goals by category
router.get('/category/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const filteredGoals = user.goals.filter(goal => goal.category === category);
    
    res.json({
      goals: filteredGoals.sort((a, b) => b.createdAt - a.createdAt),
      category
    });
  } catch (error) {
    console.error('Category goals fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch category goals' });
  }
});

// Get goals statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = {
      total: user.goals.length,
      active: user.goals.filter(g => g.status === 'active').length,
      completed: user.goals.filter(g => g.status === 'completed').length,
      paused: user.goals.filter(g => g.status === 'paused').length,
      byCategory: {}
    };

    // Calculate stats by category
    const categories = ['health', 'career', 'relationships', 'personal', 'learning', 'beauty'];
    categories.forEach(category => {
      const categoryGoals = user.goals.filter(g => g.category === category);
      stats.byCategory[category] = {
        total: categoryGoals.length,
        active: categoryGoals.filter(g => g.status === 'active').length,
        completed: categoryGoals.filter(g => g.status === 'completed').length,
        averageProgress: categoryGoals.length > 0 
          ? categoryGoals.reduce((sum, g) => sum + g.progress, 0) / categoryGoals.length 
          : 0
      };
    });

    res.json({ stats });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch goal statistics' });
  }
});

module.exports = router; 