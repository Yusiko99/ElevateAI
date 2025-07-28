const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  
  // Personal Growth & Goals
  goals: [{
    title: String,
    description: String,
    category: {
      type: String,
      enum: ['health', 'career', 'relationships', 'personal', 'learning', 'beauty'],
      default: 'personal'
    },
    targetDate: Date,
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Wellness Data
  wellness: {
    height: Number,
    weight: Number,
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say']
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extremely-active'],
      default: 'moderately-active'
    },
    healthGoals: [{
      type: String,
      enum: ['weight-loss', 'muscle-gain', 'maintenance', 'energy-boost', 'stress-reduction', 'better-sleep']
    }],
    medicalConditions: [String],
    allergies: [String],
    medications: [String]
  },
  
  // Learning Preferences
  learning: {
    interests: [String],
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    preferredLearningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'kinesthetic', 'reading-writing'],
      default: 'visual'
    },
    availableTimePerDay: {
      type: Number, // in minutes
      default: 30
    },
    completedModules: [{
      moduleId: String,
      title: String,
      completedAt: Date,
      score: Number
    }],
    currentModules: [{
      moduleId: String,
      title: String,
      progress: Number,
      startedAt: Date
    }]
  },
  
  // Beauty & Aesthetics
  beauty: {
    skinType: {
      type: String,
      enum: ['normal', 'dry', 'oily', 'combination', 'sensitive'],
      default: 'normal'
    },
    skinConcerns: [{
      type: String,
      enum: ['acne', 'aging', 'hyperpigmentation', 'dryness', 'sensitivity', 'large-pores', 'dark-circles']
    }],
    skinTone: {
      type: String,
      enum: ['fair', 'light', 'medium', 'olive', 'dark', 'deep']
    },
    facialFeatures: {
      faceShape: {
        type: String,
        enum: ['oval', 'round', 'square', 'heart', 'diamond', 'triangle']
      },
      eyeColor: String,
      hairColor: String,
      hairType: {
        type: String,
        enum: ['straight', 'wavy', 'curly', 'coily']
      }
    },
    beautyGoals: [{
      type: String,
      enum: ['clear-skin', 'anti-aging', 'even-skin-tone', 'reduce-acne', 'brighten-skin', 'reduce-fine-lines']
    }],
    analysisHistory: [{
      date: Date,
      imageUrl: String,
      analysis: Object,
      recommendations: [String]
    }]
  },
  
  // AI Preferences
  aiPreferences: {
    coachingStyle: {
      type: String,
      enum: ['motivational', 'analytical', 'gentle', 'challenging'],
      default: 'motivational'
    },
    notificationFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'bi-weekly', 'monthly'],
      default: 'daily'
    },
    privacyLevel: {
      type: String,
      enum: ['basic', 'detailed', 'comprehensive'],
      default: 'detailed'
    }
  },
  
  // Activity Tracking
  dailyProgress: [{
    date: {
      type: Date,
      default: Date.now
    },
    goalsCompleted: Number,
    wellnessScore: Number,
    learningMinutes: Number,
    mood: {
      type: String,
      enum: ['excellent', 'good', 'neutral', 'poor', 'terrible']
    },
    energy: {
      type: Number,
      min: 1,
      max: 10
    },
    notes: String
  }],
  
  // System Fields
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get user's full name
userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// Calculate wellness score
userSchema.methods.calculateWellnessScore = function() {
  // This would be a complex calculation based on various factors
  // For now, return a placeholder
  return Math.floor(Math.random() * 40) + 60; // 60-100 range
};

module.exports = mongoose.model('User', userSchema); 