import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Fab,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
  Fade,
  Slide,
  Zoom,
  Avatar,
  Divider
} from '@mui/material';
import {
    Add,
    TrendingUp,
    Psychology,
    Notifications,
    CalendarToday,
    Mood,
    Mic,
    Stop,
    PlayArrow,
    Pause,
    VolumeUp,
    Event,
    RecordVoiceOver,
    AutoAwesome,
    Insights,
    Timeline,
    WavingHand
} from '@mui/icons-material';
import api from '../services/api';
import dayjs from 'dayjs';
// App uses global theme from `src/theme.js`

// Using app-wide Gumroad-inspired theme from `../theme`

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
    totalEntries: 0,
    thisWeekEntries: 0,
    avgMood: 'neutral',
    activeReminders: 0
  });
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchDashboardData();
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch data in parallel
      const [entriesResponse, totalEntriesResponse, remindersResponse] = await Promise.all([
        api.get('/api/entries?limit=5'),
        api.get('/api/entries?limit=1000'),
        api.get('/api/reminders')
      ]);

      setRecentEntries(entriesResponse.data.entries);

      const totalEntries = totalEntriesResponse.data.entries;

      // Calculate this week entries
      const thisWeekEntries = totalEntries.filter(entry =>
        dayjs(entry.createdAt).isAfter(dayjs().subtract(7, 'days'))
      );

      // Calculate average mood
      const moods = totalEntries.map(entry => entry.mood);
      const moodCounts = moods.reduce((acc, mood) => {
        acc[mood] = (acc[mood] || 0) + 1;
        return acc;
      }, {});
      const avgMood = Object.keys(moodCounts).reduce((a, b) =>
        moodCounts[a] > moodCounts[b] ? a : b, 'neutral'
      );

      // Calculate active reminders
      const activeReminders = remindersResponse.data.reminders.filter(r => r.isActive).length;

      setStats({
        totalEntries: totalEntries.length,
        thisWeekEntries: thisWeekEntries.length,
        avgMood,
        activeReminders
      });

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getMoodColor = (mood) => {
    const colors = {
      happy: 'success',
      sad: 'error',
      angry: 'error',
      anxious: 'warning',
      calm: 'info',
      excited: 'secondary',
      neutral: 'default'
    };
    return colors[mood] || 'default';
  };

  const getMoodIcon = (mood) => {
    const icons = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      anxious: '😰',
      calm: '😌',
      excited: '🤩',
      neutral: '😐'
    };
    return icons[mood] || '😐';
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
          channelCount: 1
        }
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playRecording = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const saveVoiceEntry = async () => {
    if (!audioBlob) return;

    try {
      setTranscribing(true);
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1];
        
        try {
          const entryData = {
            text: 'Voice entry',
            audioData: base64Audio,
            mimeType: audioBlob.type || 'audio/webm'
          };

          await api.post('/api/entries', entryData);
          
          // Reset recording state
          setAudioBlob(null);
          setAudioUrl(null);
          setRecordingTime(0);
          
          // Refresh dashboard data
          fetchDashboardData();
          
        } catch (err) {
          console.error('Save entry error:', err);
          setError('Failed to save voice entry');
        } finally {
          setTranscribing(false);
        }
      };
      reader.readAsDataURL(audioBlob);
      
    } catch (err) {
      console.error('Voice entry error:', err);
      setError('Failed to process voice entry');
      setTranscribing(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, letterSpacing: '-0.4px' }}>
            Welcome back 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Record your thoughts, track your mood, and stay organized with AI.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Voice Recording Section - Primary action */}
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          position: 'relative'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
            🎤 Quick voice entry
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Capture a thought and let AI organize it for you.
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <IconButton
              onClick={isRecording ? stopRecording : startRecording}
              disabled={transcribing}
              sx={{
                width: 80,
                height: 80,
                bgcolor: isRecording ? 'error.main' : 'primary.main',
                color: 'primary.contrastText',
                border: '1px solid',
                borderColor: isRecording ? 'error.main' : 'primary.main',
                '&:hover': { filter: 'brightness(1.08)' },
                transition: 'all 0.2s ease'
              }}
            >
              {isRecording ? <Stop sx={{ fontSize: 40 }} /> : <Mic sx={{ fontSize: 40 }} />}
            </IconButton>

            <Box sx={{ flex: 1 }}>
              {isRecording && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Recording... {formatTime(recordingTime)}
                  </Typography>
                  <LinearProgress sx={{ height: 8, borderRadius: 1 }} />
                </Box>
              )}

              {audioUrl && !isRecording && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    onClick={playRecording}
                    sx={{ color: 'text.primary', border: '1px solid', borderColor: 'divider' }}
                  >
                    {isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>
                  <Typography variant="body1">
                    Recording ready • {formatTime(recordingTime)}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={saveVoiceEntry}
                    disabled={transcribing}
                  >
                    {transcribing ? 'Processing...' : 'Save Entry'}
                  </Button>
                </Box>
              )}

              {!isRecording && !audioUrl && (
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Tap the microphone to start recording
                </Typography>
              )}
            </Box>
          </Box>

          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              style={{ display: 'none' }}
            />
          )}
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={6} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <CalendarToday sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {stats.totalEntries}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Entries
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {stats.thisWeekEntries}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This Week
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Mood sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {getMoodIcon(stats.avgMood)} {stats.avgMood}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average Mood
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Notifications sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {stats.activeReminders}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Reminders
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<Notifications />}
                    onClick={() => navigate('/reminders')}
                    sx={{ mb: 2, py: 1.5, borderRadius: 2 }}
                  >
                    Reminders
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Event />}
                    onClick={() => navigate('/events')}
                    sx={{ mb: 2, py: 1.5, borderRadius: 2 }}
                  >
                    All Events
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<RecordVoiceOver />}
                    onClick={() => navigate('/conversations')}
                    sx={{ borderRadius: 2, py: 1.5 }}
                  >
                    Conversations
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => navigate('/entry')}
                    sx={{ borderRadius: 2, py: 1.5 }}
                  >
                    Full Editor
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Entries */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                Recent Entries
              </Typography>
              {recentEntries.length > 0 ? (
                <List>
                  {recentEntries.map((entry) => (
                    <ListItem key={entry._id} divider>
                      <ListItemIcon>
                        <Chip
                          label={getMoodIcon(entry.mood)}
                          color={getMoodColor(entry.mood)}
                          size="small"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={entry.text.substring(0, 100) + (entry.text.length > 100 ? '...' : '')}
                        secondary={dayjs(entry.createdAt).format('MMM D, YYYY h:mm A')}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="textSecondary" align="center">
                  No entries yet. Create your first entry!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="record voice"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24
        }}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? <Stop /> : <Mic />}
      </Fab>
    </Container>
  );
};

export default Dashboard;
