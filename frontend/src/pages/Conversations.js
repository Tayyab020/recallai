import {
  FilterList,
  GraphicEq,
  Mic,
  Pause,
  PlayArrow,
  Psychology,
  RecordVoiceOver,
  Search,
  VolumeUp
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Fab,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Conversations = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [playingAudio, setPlayingAudio] = useState(null);
  const [stats, setStats] = useState({
    totalConversations: 0,
    totalDuration: 0,
    thisWeek: 0,
    withTranscription: 0
  });

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      // Fetch entries that have voice recordings
      const response = await api.get('/api/entries');
      
      // Filter entries that have voice data
      const voiceEntries = response.data.entries.filter(entry => 
        entry.voiceUrl || entry.audioData || entry.transcription
      );

      setConversations(voiceEntries);

      // Calculate stats
      const now = dayjs();
      const weekAgo = now.subtract(7, 'days');

      setStats({
        totalConversations: voiceEntries.length,
        totalDuration: voiceEntries.length * 30, // Estimate 30 seconds per entry
        thisWeek: voiceEntries.filter(e => dayjs(e.createdAt).isAfter(weekAgo)).length,
        withTranscription: voiceEntries.filter(e => e.transcription).length
      });

    } catch (err) {
      console.error('Fetch conversations error:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = (conversationId, audioUrl) => {
    if (playingAudio === conversationId) {
      setPlayingAudio(null);
      // Stop audio playback
    } else {
      setPlayingAudio(conversationId);
      // Start audio playback
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play().catch(console.error);
        audio.onended = () => setPlayingAudio(null);
      }
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

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredConversations = conversations.filter(conv =>
    conv.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv.transcription && conv.transcription.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            Voice Conversations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            All your voice recordings and transcriptions in one place
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Filter Conversations">
            <IconButton color="primary">
              <FilterList />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search conversations and transcriptions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <RecordVoiceOver sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {stats.totalConversations}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Recordings
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <VolumeUp sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'secondary.main' }}>
              {formatDuration(stats.totalDuration)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Duration
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <  GraphicEq  sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
              {stats.thisWeek}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This Week
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Psychology sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
              {stats.withTranscription}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Transcribed
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Conversations List */}
      {filteredConversations.length === 0 ? (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Mic sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm ? 'No conversations match your search' : 'No voice conversations yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Start recording voice entries to see your conversations here.'
              }
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredConversations.map((conversation) => (
            <Grid item xs={12} key={conversation._id}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {/* Avatar */}
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main',
                        width: 56,
                        height: 56
                      }}
                    >
                      <Mic />
                    </Avatar>

                    {/* Content */}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Voice Entry
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {dayjs(conversation.createdAt).format('MMM D, YYYY h:mm A')}
                          </Typography>
                        </Box>
                        
                        {/* Play Button */}
                        <IconButton
                          color="primary"
                          onClick={() => handlePlayAudio(conversation._id, conversation.voiceUrl)}
                          sx={{ 
                            bgcolor: 'primary.light',
                            color: 'white',
                            '&:hover': { bgcolor: 'primary.main' }
                          }}
                        >
                          {playingAudio === conversation._id ? <Pause /> : <PlayArrow />}
                        </IconButton>
                      </Box>

                      {/* Transcription */}
                      {conversation.transcription && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Transcription:
                          </Typography>
                          <Typography variant="body1" sx={{ 
                            bgcolor: 'grey.50', 
                            p: 2, 
                            borderRadius: 2,
                            fontStyle: 'italic'
                          }}>
                            "{conversation.transcription}"
                          </Typography>
                        </Box>
                      )}

                      {/* Original Text */}
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {conversation.text}
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      {/* Tags */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {conversation.mood && (
                          <Chip 
                            label={`${conversation.mood} mood`}
                            color={getMoodColor(conversation.mood)}
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {conversation.transcription && (
                          <Chip 
                            label="Transcribed"
                            color="success"
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {conversation.voiceAnalysis && (
                          <Chip 
                            label="AI Analyzed"
                            color="info"
                            size="small"
                            variant="outlined"
                          />
                        )}
                        <Chip 
                          label="Voice Recording"
                          color="primary"
                          size="small"
                          variant="filled"
                        />
                      </Box>
                    </Box>
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
        aria-label="record conversation"
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
        <Mic />
      </Fab>
    </Container>
  );
};

export default Conversations;

