import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Report,
  Send,
  CheckCircle,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { useThemeMode } from '../ThemeContext';
import { apiService } from '../services/api';
import { 
  showReportSuccessNotification, 
  showReportErrorNotification 
} from '../utils/reportNotifications';

const ReportsPage = () => {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reportTypes = [
    { value: 'overcharge', label: t('reports.types.overcharge') },
    { value: 'safety', label: t('reports.types.safety') },
    { value: 'service', label: t('reports.types.service') },
    { value: 'other', label: t('reports.types.other') },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.type || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      // Prepare report data with proper field mapping for backend
      const reportData = {
        report_type: formData.type,
        title: `${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Report`,
        description: formData.description,
        address: formData.location?.trim() || undefined,
      };

      console.log('📤 Submitting report:', reportData);

      // Use API service for proper error handling and base URL
      const response = await apiService.reports.create(reportData);

      console.log('✅ Response received:', response);

      // Check if response is successful (status 200-299)
      if (response && response.status >= 200 && response.status < 300) {
        // Show friendly random success notification
        showReportSuccessNotification();
        
        // Update UI state
        setSubmitted(true);
        setFormData({ type: '', description: '', location: '' });
        
        // Hide success banner after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        // Unexpected response
        console.warn('⚠️ Unexpected response:', response);
        showReportErrorNotification();
      }
    } catch (error) {
      // Handle API errors or network issues
      console.error('❌ Error submitting report:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Show friendly error notification
      showReportErrorNotification();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: mode === 'dark'
            ? 'linear-gradient(135deg, #0D7377 0%, #121212 100%)'
            : 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
          py: 8,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#fff', mb: 2 }}>
            {t('reports.title')}
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            {t('reports.subtitle') || 'Help us improve our service by reporting problems'}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md">
        {submitted && (
          <Alert
            icon={<CheckCircle />}
            severity="success"
            sx={{ mb: 3 }}
          >
            {t('reports.success')}
          </Alert>
        )}

        <Paper
          elevation={mode === 'dark' ? 0 : 2}
          sx={{
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Report sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: mode === 'dark' ? '#fff' : '#1A1A1A' }}>
              {t('reports.newReport')}
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label={t('reports.type')}
                  value={formData.type}
                  onChange={handleChange('type')}
                  required
                >
                  {reportTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('reports.location')}
                  value={formData.location}
                  onChange={handleChange('location')}
                  placeholder={t('reports.locationPlaceholder') || 'e.g., Nyabugogo Bus Station'}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label={t('reports.description')}
                  value={formData.description}
                  onChange={handleChange('description')}
                  placeholder={t('reports.descriptionPlaceholder') || 'Please describe the issue in detail...'}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {loading ? t('reports.submitting') : t('reports.submit')}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Info Box */}
        <Paper
          elevation={mode === 'dark' ? 0 : 2}
          sx={{
            p: 3,
            mt: 3,
            bgcolor: mode === 'dark' ? '#282828' : '#F9FAFB',
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: mode === 'dark' ? '#fff' : '#1A1A1A' }}>
            What happens next?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            • Your report will be reviewed by our team within 24 hours
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            • We may contact you for additional information
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • You'll receive updates on the resolution status
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ReportsPage;
