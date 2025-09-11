import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Paper
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications,
  Psychology,
  Mic,
  Summarize,
  Security,
  Download,
  Upload
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { usePWA } from '../contexts/PWAContext';
import api from '../services/api';

const Settings = () => {
  const { user, updatePreferences, updatePushSubscription } = useAuth();
  const { installApp, requestNotificationPermission, subscribeToPush, isInstalled } = usePWA();
  
  const [preferences, setPreferences] = useState({
    voiceEnabled: true,
    emotionDetection: true,
    weeklySummaries: true,
    pushNotifications: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences);
    }
  }, [user]);

  const handlePreferenceChange = async (preference, value) => {
    try {
      setLoading(true);
      setError('');
      
      const newPreferences = { ...preferences, [preference]: value };
      setPreferences(newPreferences);
      
      const result = await updatePreferences(newPreferences);
      if (result.success) {
        setSuccess('Preferences updated successfully');
      } else {
        setError(result.message);
        setPreferences(preferences); // Revert on error
      }
    } catch (err) {
      console.error('Update preferences error:', err);
      setError('Failed to update preferences');
      setPreferences(preferences); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  const handleInstallApp = async () => {
    const result = await installApp();
    if (result.success) {
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
  };

  const handleEnableNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      
      const permissionResult = await requestNotificationPermission();
      if (!permissionResult.success) {
        setError(permissionResult.message);
        return;
      }

      const subscriptionResult = await subscribeToPush();
      if (!subscriptionResult.success) {
        setError(subscriptionResult.message);
        return;
      }

      await updatePushSubscription(subscriptionResult.subscription);
      setSuccess('Push notifications enabled successfully');
    } catch (err) {
      console.error('Enable notifications error:', err);
      setError('Failed to enable notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/entries?limit=1000');
      
      const data = {
        user: {
          email: user.email,
          preferences: user.preferences,
          createdAt: user.createdAt
        },
        entries: response.data.entries.map(entry => ({
          text: entry.text,
          mood: entry.mood,
          tags: entry.tags,
          createdAt: entry.createdAt
        })),
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recall-ai-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess('Data exported successfully');
    } catch (err) {
      console.error('Export data error:', err);
      setError('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete('/api/auth/account');
      setSuccess('Account deleted successfully');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      console.error('Delete account error:', err);
      setError('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* App Preferences */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            App Preferences
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText
                primary="Voice Recording"
                secondary="Enable voice recording and transcription features"
                primaryTypographyProps={{ variant: 'subtitle1' }}
              />
              <ListItemSecondaryAction>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.voiceEnabled}
                      onChange={(e) => handlePreferenceChange('voiceEnabled', e.target.checked)}
                      disabled={loading}
                    />
                  }
                  label=""
                />
              </ListItemSecondaryAction>
            </ListItem>

            <Divider />

            <ListItem>
              <ListItemText
                primary="Emotion Detection"
                secondary="Automatically detect emotions in your journal entries"
                primaryTypographyProps={{ variant: 'subtitle1' }}
              />
              <ListItemSecondaryAction>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.emotionDetection}
                      onChange={(e) => handlePreferenceChange('emotionDetection', e.target.checked)}
                      disabled={loading}
                    />
                  }
                  label=""
                />
              </ListItemSecondaryAction>
            </ListItem>

            <Divider />

            <ListItem>
              <ListItemText
                primary="Weekly Summaries"
                secondary="Generate AI-powered weekly summaries of your entries"
                primaryTypographyProps={{ variant: 'subtitle1' }}
              />
              <ListItemSecondaryAction>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.weeklySummaries}
                      onChange={(e) => handlePreferenceChange('weeklySummaries', e.target.checked)}
                      disabled={loading}
                    />
                  }
                  label=""
                />
              </ListItemSecondaryAction>
            </ListItem>

            <Divider />

            <ListItem>
              <ListItemText
                primary="Push Notifications"
                secondary="Receive reminders and notifications"
                primaryTypographyProps={{ variant: 'subtitle1' }}
              />
              <ListItemSecondaryAction>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.pushNotifications}
                      onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                      disabled={loading}
                    />
                  }
                  label=""
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* PWA Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <Download sx={{ mr: 1, verticalAlign: 'middle' }} />
            App Installation
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Install Recall.AI as a Progressive Web App on your device for a native app experience.
            </Typography>
            
            {!isInstalled ? (
              <Button
                variant="contained"
                onClick={handleInstallApp}
                disabled={loading}
              >
                Install App
              </Button>
            ) : (
              <Chip label="App Installed" color="success" />
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Enable Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Allow push notifications for reminders and updates.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Notifications />}
              onClick={handleEnableNotifications}
              disabled={loading}
            >
              Enable Notifications
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
            Data Management
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Export Data
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Download a copy of all your journal entries and settings.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExportData}
              disabled={loading}
            >
              Export Data
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="subtitle1" gutterBottom color="error">
              Delete Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Permanently delete your account and all associated data. This action cannot be undone.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteAccount}
              disabled={loading}
            >
              Delete Account
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Privacy Information */}
      <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          Privacy & Security
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <strong>Data Encryption:</strong> All your journal entries are encrypted end-to-end using industry-standard encryption.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <strong>AI Processing:</strong> AI features like emotion detection and summarization are processed securely and your data is never shared with third parties.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Your Control:</strong> You can disable any AI features at any time and export or delete your data whenever you want.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Settings;
