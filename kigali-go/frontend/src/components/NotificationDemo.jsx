/**
 * Notification Demo Component
 * 
 * A testing/demo component to showcase the report notification system.
 * Useful for development, testing, and demonstrating the notification UX.
 * 
 * @component
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Refresh,
  PlayArrow,
} from '@mui/icons-material';
import {
  showReportSuccessNotification,
  showReportErrorNotification,
  notifyReportSuccess,
  notifyReportError,
  SUCCESS_MESSAGES,
} from '../utils/reportNotifications';

/**
 * NotificationDemo Component
 * 
 * Provides buttons to trigger different notification types for testing.
 * Shows all available messages and allows testing of custom notifications.
 */
const NotificationDemo = () => {
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  const handleSuccessClick = () => {
    showReportSuccessNotification();
    setSuccessCount(prev => prev + 1);
  };

  const handleErrorClick = () => {
    showReportErrorNotification();
    setErrorCount(prev => prev + 1);
  };

  const handleCustomSuccess = () => {
    notifyReportSuccess("🎉 Custom success message with extra celebration!");
  };

  const handleCustomError = () => {
    notifyReportError("⚠️ Custom error: This is a test error message.");
  };

  const handleMultipleNotifications = () => {
    // Show 3 notifications in sequence
    setTimeout(() => showReportSuccessNotification(), 0);
    setTimeout(() => showReportSuccessNotification(), 500);
    setTimeout(() => showReportSuccessNotification(), 1000);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          🎉 Notification System Demo
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Test the friendly report notification system. Each success notification
          randomly selects from {SUCCESS_MESSAGES.length} unique messages.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Statistics */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <Chip
            icon={<CheckCircle />}
            label={`Success: ${successCount}`}
            color="success"
            variant="outlined"
          />
          <Chip
            icon={<Error />}
            label={`Error: ${errorCount}`}
            color="error"
            variant="outlined"
          />
        </Box>

        {/* Main Test Buttons */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              size="large"
              startIcon={<CheckCircle />}
              onClick={handleSuccessClick}
              sx={{ py: 2 }}
            >
              Show Random Success Message
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              size="large"
              startIcon={<Error />}
              onClick={handleErrorClick}
              sx={{ py: 2 }}
            >
              Show Error Message
            </Button>
          </Grid>
        </Grid>

        {/* Advanced Test Buttons */}
        <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Advanced Tests
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<PlayArrow />}
              onClick={handleCustomSuccess}
            >
              Custom Success
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<PlayArrow />}
              onClick={handleCustomError}
            >
              Custom Error
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Refresh />}
              onClick={handleMultipleNotifications}
            >
              Multiple (3x)
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* All Messages List */}
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          📝 All Success Messages ({SUCCESS_MESSAGES.length})
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          The system randomly selects one of these messages on each submission:
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
          {SUCCESS_MESSAGES.map((message, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 2,
                bgcolor: 'success.light',
                color: 'success.contrastText',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Chip
                label={index + 1}
                size="small"
                sx={{
                  bgcolor: 'success.main',
                  color: 'white',
                  fontWeight: 700,
                  minWidth: 32,
                }}
              />
              <Typography variant="body1" sx={{ flex: 1 }}>
                {message}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Paper>

      {/* Usage Instructions */}
      <Paper elevation={3} sx={{ p: 4, mt: 4, bgcolor: 'info.light' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          💡 How to Use
        </Typography>
        <Typography variant="body2" component="div">
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            <li>Click "Show Random Success Message" to see a random notification</li>
            <li>Click multiple times to see different messages</li>
            <li>Click "Show Error Message" to test error notifications</li>
            <li>Try "Multiple (3x)" to see how stacked notifications look</li>
            <li>Check the counter to track how many you've triggered</li>
          </ol>
        </Typography>
      </Paper>
    </Box>
  );
};

export default NotificationDemo;
