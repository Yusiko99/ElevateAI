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
  CircularProgress,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CloudUpload,
  Face,
  History,
  Settings,
  CheckCircle,
  Info,
  Upload,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const Beauty = () => {
  const theme = useTheme();
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [beautyPreferences, setBeautyPreferences] = useState({
    skinType: 'normal',
    skinConcerns: [],
    skinTone: '',
    facialFeatures: {
      faceShape: '',
      eyeColor: '',
      hairColor: '',
      hairType: 'straight',
    },
    beautyGoals: [],
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [error, setError] = useState('');

  const skinTypes = ['normal', 'dry', 'oily', 'combination', 'sensitive'];
  const skinTones = ['fair', 'light', 'medium', 'olive', 'dark', 'deep'];
  const faceShapes = ['oval', 'round', 'square', 'heart', 'diamond', 'triangle'];
  const hairTypes = ['straight', 'wavy', 'curly', 'coily'];
  const skinConcerns = [
    'acne', 'aging', 'hyperpigmentation', 'dryness', 'sensitivity', 'large-pores', 'dark-circles'
  ];
  const beautyGoals = [
    'clear-skin', 'anti-aging', 'even-skin-tone', 'reduce-acne', 'brighten-skin', 'reduce-fine-lines'
  ];

  useEffect(() => {
    fetchBeautyData();
  }, []);

  // Mock data for testing when backend is not available
  const mockAnalysisHistory = [
    {
      id: '1',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      imageUrl: '/sample-image-1.jpg',
      analysis: {
        skinType: 'normal',
        skinTone: 'medium',
        faceShape: 'oval',
        recommendations: [
          { title: 'Use gentle cleanser', description: 'A gentle cleanser helps maintain skin balance.', priority: 'medium' },
          { title: 'Apply SPF daily', description: 'Protect your skin from UV damage.', priority: 'high' },
          { title: 'Consider vitamin C serum', description: 'Brightens skin and reduces pigmentation.', priority: 'medium' }
        ]
      }
    },
    {
      id: '2',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      imageUrl: '/sample-image-2.jpg',
      analysis: {
        skinType: 'combination',
        skinTone: 'medium',
        faceShape: 'oval',
        recommendations: [
          { title: 'Use oil-free moisturizer', description: 'Prevents excess oil and hydrates skin.', priority: 'medium' },
          { title: 'Exfoliate twice weekly', description: 'Removes dead skin cells and unclogs pores.', priority: 'medium' },
          { title: 'Consider retinol treatment', description: 'Improves skin texture and reduces fine lines.', priority: 'high' }
        ]
      }
    }
  ];

  const mockBeautyPreferences = {
    skinType: 'normal',
    skinConcerns: ['aging', 'dark-circles'],
    skinTone: 'medium',
    facialFeatures: {
      faceShape: 'oval',
      eyeColor: 'brown',
      hairColor: 'brown',
      hairType: 'wavy',
    },
    beautyGoals: ['anti-aging', 'clear-skin'],
  };

  const fetchBeautyData = async () => {
    try {
      setLoading(true);
      const [historyResponse, preferencesResponse] = await Promise.all([
        axios.get('/api/beauty/history'),
        axios.get('/api/wellness')
      ]);
      
      setAnalysisHistory(historyResponse.data.history);
      if (preferencesResponse.data.wellness) {
        setBeautyPreferences(preferencesResponse.data.wellness.beauty || beautyPreferences);
      }
    } catch (error) {
      console.error('Failed to fetch beauty data:', error);
      // Use mock data when backend is not available
      setAnalysisHistory(mockAnalysisHistory);
      setBeautyPreferences(mockBeautyPreferences);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      setError('');
      
      const response = await axios.post('/api/beauty/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAnalysisResult(response.data);
      setShowAnalysisDialog(true);
      fetchBeautyData(); // Refresh history
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error.response?.data?.error || 'Analysis failed');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handlePreferenceChange = async (field, value) => {
    const updatedPreferences = { ...beautyPreferences };
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updatedPreferences[parent] = { ...updatedPreferences[parent], [child]: value };
    } else {
      updatedPreferences[field] = value;
    }

    setBeautyPreferences(updatedPreferences);

    try {
      await axios.put('/api/beauty/preferences', updatedPreferences);
    } catch (error) {
      console.error('Failed to update preferences:', error);
      setError('Failed to update preferences');
    }
  };

  const handleConcernToggle = async (concern) => {
    const updatedConcerns = beautyPreferences.skinConcerns.includes(concern)
      ? beautyPreferences.skinConcerns.filter(c => c !== concern)
      : [...beautyPreferences.skinConcerns, concern];

    await handlePreferenceChange('skinConcerns', updatedConcerns);
  };

  const handleGoalToggle = async (goal) => {
    const updatedGoals = beautyPreferences.beautyGoals.includes(goal)
      ? beautyPreferences.beautyGoals.filter(g => g !== goal)
      : [...beautyPreferences.beautyGoals, goal];

    await handlePreferenceChange('beautyGoals', updatedGoals);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Beauty & Aesthetics
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Facial Analysis Upload */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Face sx={{ mr: 1 }} />
                AI Facial Analysis
              </Typography>

              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'grey.300',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: isDragActive ? 'primary.light' : 'grey.50',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.light',
                  },
                }}
              >
                <input {...getInputProps()} />
                {uploading ? (
                  <Box>
                    <CircularProgress size={40} sx={{ mb: 2 }} />
                    <Typography>Analyzing your image...</Typography>
                  </Box>
                ) : (
                  <Box>
                    <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {isDragActive ? 'Drop your image here' : 'Upload a photo for analysis'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Drag & drop or click to select an image
                    </Typography>
                    <Button variant="outlined" startIcon={<Upload />}>
                      Choose File
                    </Button>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Supports: JPG, PNG, WebP (max 10MB)
                    </Typography>
                  </Box>
                )}
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Our AI will analyze your facial features and provide personalized beauty recommendations.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Beauty Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Settings sx={{ mr: 1 }} />
                Beauty Preferences
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Skin Type</InputLabel>
                    <Select
                      value={beautyPreferences.skinType}
                      onChange={(e) => handlePreferenceChange('skinType', e.target.value)}
                      label="Skin Type"
                    >
                      {skinTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Skin Tone</InputLabel>
                    <Select
                      value={beautyPreferences.skinTone}
                      onChange={(e) => handlePreferenceChange('skinTone', e.target.value)}
                      label="Skin Tone"
                    >
                      {skinTones.map((tone) => (
                        <MenuItem key={tone} value={tone}>
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Face Shape</InputLabel>
                    <Select
                      value={beautyPreferences.facialFeatures.faceShape}
                      onChange={(e) => handlePreferenceChange('facialFeatures.faceShape', e.target.value)}
                      label="Face Shape"
                    >
                      {faceShapes.map((shape) => (
                        <MenuItem key={shape} value={shape}>
                          {shape.charAt(0).toUpperCase() + shape.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Hair Type</InputLabel>
                    <Select
                      value={beautyPreferences.facialFeatures.hairType}
                      onChange={(e) => handlePreferenceChange('facialFeatures.hairType', e.target.value)}
                      label="Hair Type"
                    >
                      {hairTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Eye Color"
                    value={beautyPreferences.facialFeatures.eyeColor}
                    onChange={(e) => handlePreferenceChange('facialFeatures.eyeColor', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Hair Color"
                    value={beautyPreferences.facialFeatures.hairColor}
                    onChange={(e) => handlePreferenceChange('facialFeatures.hairColor', e.target.value)}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Skin Concerns
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {skinConcerns.map((concern) => (
                    <Chip
                      key={concern}
                      label={concern.replace('-', ' ')}
                      onClick={() => handleConcernToggle(concern)}
                      color={beautyPreferences.skinConcerns.includes(concern) ? 'primary' : 'default'}
                      variant={beautyPreferences.skinConcerns.includes(concern) ? 'filled' : 'outlined'}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Beauty Goals
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {beautyGoals.map((goal) => (
                    <Chip
                      key={goal}
                      label={goal.replace('-', ' ')}
                      onClick={() => handleGoalToggle(goal)}
                      color={beautyPreferences.beautyGoals.includes(goal) ? 'primary' : 'default'}
                      variant={beautyPreferences.beautyGoals.includes(goal) ? 'filled' : 'outlined'}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Analysis History */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <History sx={{ mr: 1 }} />
                Analysis History
              </Typography>

              {analysisHistory.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Info sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No analyses yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upload your first photo to get started with AI-powered beauty analysis
                  </Typography>
                </Box>
              ) : (
                <List>
                  {analysisHistory.map((analysis, index) => (
                    <ListItem key={index} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2 }}>
                      <ListItemAvatar>
                        <Avatar src={analysis.imageUrl} alt="Analysis" />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Analysis on ${new Date(analysis.date).toLocaleDateString()}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              Face Shape: {analysis.analysis.faceShape} • 
                              Skin Tone: {analysis.analysis.skinTone}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {analysis.analysis.recommendations.slice(0, 2).map((rec, idx) => (
                                <Chip
                                  key={idx}
                                  label={rec.title}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </Box>
                        }
                      />
                      <Button
                        size="small"
                        onClick={() => {
                          setAnalysisResult(analysis);
                          setShowAnalysisDialog(true);
                        }}
                      >
                        View Details
                      </Button>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Analysis Result Dialog */}
      <Dialog
        open={showAnalysisDialog}
        onClose={() => setShowAnalysisDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            AI Analysis Results
          </Typography>
        </DialogTitle>
        <DialogContent>
          {analysisResult && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Facial Analysis
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Face Shape:</strong> {analysisResult.analysis.faceShape}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Skin Tone:</strong> {analysisResult.analysis.skinTone}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Eye Color:</strong> {analysisResult.analysis.facialFeatures.eyeColor}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Hair Color:</strong> {analysisResult.analysis.facialFeatures.hairColor}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Confidence:</strong> {Math.round(analysisResult.analysis.confidence * 100)}%
                  </Typography>
                </Box>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Skin Concerns Detected:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {Object.entries(analysisResult.analysis.skinConcerns)
                    .filter(([_, detected]) => detected)
                    .map(([concern, _]) => (
                      <Chip
                        key={concern}
                        label={concern.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    ))}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Personalized Recommendations
                </Typography>
                <List dense>
                  {analysisResult.recommendations.map((rec, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: rec.priority === 'high' ? 'error.main' : 'primary.main' }}>
                          <CheckCircle />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={rec.title}
                        secondary={rec.description}
                      />
                      <Chip
                        label={rec.priority}
                        size="small"
                        color={rec.priority === 'high' ? 'error' : 'primary'}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAnalysisDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Beauty; 