import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Fab,
  IconButton,
  Tooltip,
  Paper,
  Divider
} from '@mui/material';
import {
  Add,
  Event,
  Schedule,
  LocationOn,
  Person,
  CalendarToday,
  TrendingUp,
  FilterList,
  Search
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import dayjs from 'dayjs';

const AllEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    todayEvents: 0,
    completedEvents: 0
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Fetch entries that contain events/calendar items
      const response = await api.get('/api/entries');
      
      // Extract events from entries (this would be enhanced with proper event extraction)
      const allEntries = response.data.entries;
      const eventEntries = allEntries.filter(entry => 
        entry.text.toLowerCase().includes('meeting') ||
        entry.text.toLowerCase().includes('appointment') ||
        entry.text.toLowerCase().includes('event') ||
        entry.text.toLowerCase().includes('schedule') ||
        entry.voiceAnalysis?.events?.length > 0
      );

      setEvents(eventEntries);

      // Calculate stats
      const now = dayjs();
      const today = now.startOf('day');
      const tomorrow = today.add(1, 'day');

      setStats({
        totalEvents: eventEntries.length,
        upcomingEvents: eventEntries.filter(e => dayjs(e.createdAt).isAfter(now)).length,
        todayEvents: eventEntries.filter(e => 
          dayjs(e.createdAt).isAfter(today) && dayjs(e.createdAt).isBefore(tomorrow)
        ).length,
        completedEvents: eventEntries.filter(e => dayjs(e.createdAt).isBefore(now)).length
      });

    } catch (err) {
      console.error('Fetch events error:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (entry) => {
    const text = entry.text.toLowerCase();
    if (text.includes('meeting')) return 'primary';
    if (text.includes('appointment')) return 'secondary';
    if (text.includes('deadline')) return 'error';
    if (text.includes('reminder')) return 'warning';
    return 'default';
  };

  const getEventIcon = (entry) => {
    const text = entry.text.toLowerCase();
    if (text.includes('meeting')) return <Person />;
    if (text.includes('appointment')) return <Schedule />;
    if (text.includes('location')) return <LocationOn />;
    return <Event />;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
            All Events
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage all your scheduled events and appointments
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Filter Events">
            <IconButton color="primary">
              <FilterList />
            </IconButton>
          </Tooltip>
          <Tooltip title="Search Events">
            <IconButton color="primary">
              <Search />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <CalendarToday sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {stats.totalEvents}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Events
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
              {stats.upcomingEvents}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upcoming
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Schedule sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
              {stats.todayEvents}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Today
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Event sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'info.main' }}>
              {stats.completedEvents}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Events List */}
      {events.length === 0 ? (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Event sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No events found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start recording voice entries with event information to see them here.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} md={6} lg={4} key={event._id}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: 2, 
                      bgcolor: `${getEventTypeColor(event)}.light`,
                      color: `${getEventTypeColor(event)}.contrastText`,
                      mr: 2
                    }}>
                      {getEventIcon(event)}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {event.text.substring(0, 50)}...
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(event.createdAt).format('MMM D, YYYY h:mm A')}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {event.text.substring(0, 120)}...
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={getEventTypeColor(event)} 
                      color={getEventTypeColor(event)}
                      size="small"
                      variant="outlined"
                    />
                    {event.mood && (
                      <Chip 
                        label={event.mood} 
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add event"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(45deg, #6366f1 30%, #818cf8 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)',
          }
        }}
        onClick={() => navigate('/entry')}
      >
        <Add />
      </Fab>
    </Container>
  );
};

export default AllEvents;

