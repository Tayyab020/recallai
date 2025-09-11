import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Event,
  Notifications,
  Chat,
  CalendarToday,
  AccessTime,
  Mood
} from '@mui/icons-material';
import api from '../services/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const TabView = () => {
  const [tabValue, setTabValue] = useState(0);
  const [entries, setEntries] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all data in parallel
      const [entriesResponse, remindersResponse, conversationsResponse] = await Promise.all([
        api.get('/api/entries?limit=20'),
        api.get('/api/reminders'),
        api.get('/api/entries?type=conversation&limit=20')
      ]);

      setEntries(entriesResponse.data.entries || []);
      setReminders(remindersResponse.data.reminders || []);
      
      // For conversations, we're using entries with a filter
      // In a real implementation, you might have a dedicated endpoint
      setConversations(conversationsResponse.data.entries || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getMoodIcon = (mood) => {
    switch (mood?.toLowerCase()) {
      case 'happy':
        return '😊';
      case 'sad':
        return '😢';
      case 'angry':
        return '😠';
      case 'neutral':
        return '😐';
      default:
        return '📝';
    }
  };

  const getMoodColor = (mood) => {
    switch (mood?.toLowerCase()) {
      case 'happy':
        return 'success';
      case 'sad':
        return 'info';
      case 'angry':
        return 'error';
      case 'neutral':
        return 'default';
      default:
        return 'default';
    }
  };

  const renderAllEvents = () => (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        All Events & Tasks
      </Typography>
      {entries.length > 0 ? (
        <List>
          {entries.map((entry) => (
            <React.Fragment key={entry._id}>
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <Chip 
                    icon={<Event />}
                    label={getMoodIcon(entry.mood)}
                    color={getMoodColor(entry.mood)}
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={entry.text.substring(0, 100) + (entry.text.length > 100 ? '...' : '')}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {dayjs(entry.createdAt).format('MMM D, YYYY h:mm A')}
                      </Typography>
                      {entry.tags && entry.tags.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {entry.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      )}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography color="textSecondary" align="center">
          No events or tasks found.
        </Typography>
      )}
    </Paper>
  );

  const renderReminders = () => (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Reminders with Alarms
      </Typography>
      {reminders.length > 0 ? (
        <List>
          {reminders.map((reminder) => (
            <React.Fragment key={reminder._id}>
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <Chip 
                    icon={<Notifications />}
                    label={reminder.isActive ? 'Active' : 'Inactive'}
                    color={reminder.isActive ? 'primary' : 'default'}
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={reminder.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {reminder.description}
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                        <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          {dayjs(reminder.triggerTime).format('MMM D, YYYY h:mm A')}
                        </Typography>
                      </Box>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography color="textSecondary" align="center">
          No reminders found.
        </Typography>
      )}
    </Paper>
  );

  const renderConversations = () => (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Conversation History
      </Typography>
      {conversations.length > 0 ? (
        <List>
          {conversations.map((conversation) => (
            <React.Fragment key={conversation._id}>
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <Chip 
                    icon={<Chat />}
                    label={conversation.tags?.[0] || 'Chat'}
                    color="secondary"
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={conversation.text.substring(0, 100) + (conversation.text.length > 100 ? '...' : '')}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {dayjs(conversation.createdAt).format('MMM D, YYYY h:mm A')}
                      </Typography>
                      {conversation.transcription && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {conversation.transcription.substring(0, 150)}
                            {conversation.transcription.length > 150 ? '...' : ''}
                          </Typography>
                        </Box>
                      )}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography color="textSecondary" align="center">
          No conversations found.
        </Typography>
      )}
    </Paper>
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ width: '100%', mt: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Activity Overview
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="activity tabs"
            variant="fullWidth"
          >
            <Tab icon={<Event />} label="All Events" />
            <Tab icon={<Notifications />} label="Reminders" />
            <Tab icon={<Chat />} label="Conversations" />
          </Tabs>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            {tabValue === 0 && renderAllEvents()}
            {tabValue === 1 && renderReminders()}
            {tabValue === 2 && renderConversations()}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default TabView;