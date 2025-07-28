const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/beauty';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Analyze facial features and provide beauty recommendations
router.post('/analyze', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const imageUrl = `/uploads/beauty/${req.file.filename}`;
    
    // Simulate AI analysis (in a real app, this would use TensorFlow or external AI service)
    const analysis = await performFacialAnalysis(req.file.path);
    
    // Generate personalized recommendations
    const recommendations = await generateBeautyRecommendations(analysis, user.beauty);
    
    // Save analysis to user's history
    user.beauty.analysisHistory.push({
      date: new Date(),
      imageUrl,
      analysis,
      recommendations
    });
    
    await user.save();

    res.json({
      message: 'Analysis completed successfully',
      analysis,
      recommendations,
      imageUrl
    });
  } catch (error) {
    console.error('Beauty analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Get beauty analysis history
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      history: user.beauty.analysisHistory.sort((a, b) => b.date - a.date)
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Update beauty preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const {
      skinType,
      skinConcerns,
      skinTone,
      facialFeatures,
      beautyGoals
    } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update beauty preferences
    if (skinType) user.beauty.skinType = skinType;
    if (skinConcerns) user.beauty.skinConcerns = skinConcerns;
    if (skinTone) user.beauty.skinTone = skinTone;
    if (facialFeatures) user.beauty.facialFeatures = { ...user.beauty.facialFeatures, ...facialFeatures };
    if (beautyGoals) user.beauty.beautyGoals = beautyGoals;

    await user.save();

    res.json({
      message: 'Beauty preferences updated successfully',
      beauty: user.beauty
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Get personalized beauty routine
router.get('/routine', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const routine = await generateBeautyRoutine(user.beauty);
    
    res.json({
      routine,
      userPreferences: user.beauty
    });
  } catch (error) {
    console.error('Routine generation error:', error);
    res.status(500).json({ error: 'Failed to generate routine' });
  }
});

// Simulate facial analysis (replace with actual AI implementation)
async function performFacialAnalysis(imagePath) {
  // This would integrate with TensorFlow.js or external AI service
  // For now, return simulated analysis
  return {
    faceShape: ['oval', 'round', 'square', 'heart', 'diamond', 'triangle'][Math.floor(Math.random() * 6)],
    skinTone: ['fair', 'light', 'medium', 'olive', 'dark', 'deep'][Math.floor(Math.random() * 6)],
    skinConcerns: {
      acne: Math.random() > 0.7,
      aging: Math.random() > 0.6,
      hyperpigmentation: Math.random() > 0.8,
      dryness: Math.random() > 0.5,
      sensitivity: Math.random() > 0.9,
      largePores: Math.random() > 0.7,
      darkCircles: Math.random() > 0.6
    },
    facialFeatures: {
      eyeColor: ['brown', 'blue', 'green', 'hazel'][Math.floor(Math.random() * 4)],
      hairColor: ['black', 'brown', 'blonde', 'red'][Math.floor(Math.random() * 4)],
      faceWidth: Math.random() * 100 + 120,
      faceHeight: Math.random() * 100 + 140
    },
    confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
  };
}

// Generate beauty recommendations based on analysis
async function generateBeautyRecommendations(analysis, userPreferences) {
  const recommendations = [];
  
  // Skin care recommendations
  if (analysis.skinConcerns.acne) {
    recommendations.push({
      category: 'skincare',
      title: 'Acne Treatment',
      description: 'Consider using salicylic acid cleanser and benzoyl peroxide spot treatment',
      priority: 'high'
    });
  }
  
  if (analysis.skinConcerns.aging) {
    recommendations.push({
      category: 'skincare',
      title: 'Anti-Aging Care',
      description: 'Incorporate retinol and vitamin C into your routine',
      priority: 'medium'
    });
  }
  
  // Makeup recommendations based on face shape
  const makeupRecommendations = {
    oval: 'Your oval face shape is versatile. You can experiment with various makeup styles.',
    round: 'Try contouring to add definition and elongate your face.',
    square: 'Soft, rounded makeup techniques will complement your angular features.',
    heart: 'Focus on balancing your forehead with your chin using strategic highlighting.',
    diamond: 'Emphasize your cheekbones and soften your angular features.',
    triangle: 'Balance your jawline with attention to your upper face.'
  };
  
  recommendations.push({
    category: 'makeup',
    title: 'Face Shape Styling',
    description: makeupRecommendations[analysis.faceShape] || 'Consider consulting with a makeup artist for personalized advice.',
    priority: 'medium'
  });
  
  return recommendations;
}

// Generate personalized beauty routine
async function generateBeautyRoutine(beautyPreferences) {
  const routines = {
    morning: [
      'Gentle cleanser',
      'Vitamin C serum',
      'Moisturizer with SPF',
      'Eye cream'
    ],
    evening: [
      'Double cleanse',
      'Toner',
      'Treatment serum',
      'Moisturizer',
      'Face oil (optional)'
    ]
  };
  
  // Customize based on skin type
  if (beautyPreferences.skinType === 'oily') {
    routines.morning.splice(2, 0, 'Oil-control primer');
  } else if (beautyPreferences.skinType === 'dry') {
    routines.morning.splice(3, 0, 'Hydrating serum');
  }
  
  return routines;
}

module.exports = router; 