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
    { value: 'vehicle_issue', label: 'Vehicle Issue' },
    { value: 'route_problem', label: 'Route Problem' },
    { value: 'driver_behavior', label: 'Driver Behavior' },
    { value: 'safety_concern', label: 'Safety Concern' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.type || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success('Report submitted successfully!');
        setFormData({ type: '', description: '', location: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        toast.error('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Error submitting report');
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
            Report an Issue
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            Help us improve our service by reporting problems
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
            Thank you! Your report has been submitted successfully.
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
              Submit a Report
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Report Type"
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
                  label="Location (Optional)"
                  value={formData.location}
                  onChange={handleChange('location')}
                  placeholder="e.g., Nyabugogo Bus Station"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Description"
                  value={formData.description}
                  onChange={handleChange('description')}
                  placeholder="Please describe the issue in detail..."
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
                  {loading ? 'Submitting...' : 'Submit Report'}
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
