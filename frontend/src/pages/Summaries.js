import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Grid
} from '@mui/material';
import {
  Summarize,
  CalendarToday,
  TrendingUp,
  Psychology
} from '@mui/icons-material';
import api from '../services/api';
import dayjs from 'dayjs';

const Summaries = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/entries/summary/weekly');
      setSummaries([response.data.summary]);
    } catch (err) {
      console.error('Fetch summaries error:', err);
      setError('Failed to load summaries');
    } finally {
      setLoading(false);
    }
  };

  const generateNewSummary = async () => {
    try {
      setGenerating(true);
      const response = await api.get('/api/entries/summary/weekly');
      setSummaries(prev => [response.data.summary, ...prev]);
    } catch (err) {
      console.error('Generate summary error:', err);
      setError('Failed to generate summary');
    } finally {
      setGenerating(false);
    }
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Weekly Summaries
        </Typography>
        <Button
          variant="contained"
          startIcon={<Summarize />}
          onClick={generateNewSummary}
          disabled={generating}
        >
          {generating ? 'Generating...' : 'Generate New Summary'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {summaries.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <Summarize sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No summaries yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Generate your first weekly summary to see AI-powered insights from your journal entries.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Summarize />}
                onClick={generateNewSummary}
                disabled={generating}
              >
                Generate Summary
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {summaries.map((summary, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">
                      Week of {dayjs().subtract(index * 7, 'days').format('MMM D, YYYY')}
                    </Typography>
                    <Chip
                      label="AI Generated"
                      color="primary"
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                    {summary}
                  </Typography>
                  
                  <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                    <Chip
                      icon={<TrendingUp />}
                      label="Patterns"
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      icon={<Psychology />}
                      label="Emotions"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          How AI Summaries Work
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Our AI analyzes your journal entries to identify patterns, emotional trends, and key themes. 
          Summaries are generated weekly and help you gain insights into your thoughts and experiences. 
          All processing is done securely and your data remains private.
        </Typography>
      </Box>
    </Container>
  );
};

export default Summaries;
