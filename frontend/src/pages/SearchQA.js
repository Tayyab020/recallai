import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import {
  Search,
  QuestionAnswer,
  Psychology,
  CalendarToday,
  TrendingUp
} from '@mui/icons-material';
import api from '../services/api';
import dayjs from 'dayjs';
import { validateSearchQuery } from '../utils/validation';

const SearchQA = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [qaAnswer, setQaAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [queryError, setQueryError] = useState('');
  const [activeTab, setActiveTab] = useState('search');

  const validateQuery = () => {
    const validation = validateSearchQuery(query);
    setQueryError(validation.isValid ? '' : validation.message);
    return validation.isValid;
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setQueryError('');
  };

  const handleSearch = async () => {
    if (!validateQuery()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await api.post('/api/entries/search', {
        query: query.trim(),
        filters: {}
      });

      setSearchResults(response.data.results);
      setActiveTab('search');
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQA = async () => {
    if (!validateQuery()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await api.post('/api/ai/qa', {
        question: query.trim(),
        context: []
      });

      setQaAnswer(response.data.answer);
      setActiveTab('qa');
    } catch (err) {
      console.error('Q&A error:', err);
      setError(err.response?.data?.message || 'Failed to answer question');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (activeTab === 'search') {
        handleSearch();
      } else {
        handleQA();
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search & Q&A
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Search through your journal entries or ask questions about your past experiences.
      </Typography>

      {/* Search Input */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Search entries or ask a question"
              value={query}
              onChange={handleQueryChange}
              onKeyPress={handleKeyPress}
              placeholder="e.g., 'work stress' or 'What did I do last weekend?'"
              disabled={loading}
              helperText={queryError || `${query.length}/200 characters`}
              error={!!queryError}
            />
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={handleSearch}
              disabled={loading || !query.trim() || !!queryError}
              sx={{ minWidth: 120 }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              startIcon={<QuestionAnswer />}
              onClick={handleQA}
              disabled={loading || !query.trim() || !!queryError}
              sx={{ minWidth: 120 }}
            >
              Ask AI
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label="Search Entries"
              color={activeTab === 'search' ? 'primary' : 'default'}
              onClick={() => setActiveTab('search')}
              clickable
            />
            <Chip
              label="Ask Questions"
              color={activeTab === 'qa' ? 'primary' : 'default'}
              onClick={() => setActiveTab('qa')}
              clickable
            />
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Search Results */}
      {activeTab === 'search' && searchResults.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Search Results ({searchResults.length})
            </Typography>
            
            <List>
              {searchResults.map((entry, index) => (
                <React.Fragment key={entry._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip
                            label={getMoodIcon(entry.mood)}
                            color={getMoodColor(entry.mood)}
                            size="small"
                          />
                          <Typography variant="body2" color="text.secondary">
                            {dayjs(entry.createdAt).format('MMM D, YYYY h:mm A')}
                          </Typography>
                          {entry.relevance && (
                            <Chip
                              label={`${Math.round(entry.relevance * 100)}% match`}
                              variant="outlined"
                              size="small"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            {entry.excerpt || entry.text}
                          </Typography>
                          {entry.tags && entry.tags.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {entry.tags.map((tag, tagIndex) => (
                                <Chip
                                  key={tagIndex}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < searchResults.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Q&A Answer */}
      {activeTab === 'qa' && qaAnswer && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              AI Answer
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {qaAnswer}
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {!loading && activeTab === 'search' && searchResults.length === 0 && query && (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <Search sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No results found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try different keywords or ask a question using the AI feature.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          How to Use Search & Q&A
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              <Search sx={{ mr: 1, verticalAlign: 'middle' }} />
              Search Entries
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search for specific topics, emotions, or events in your journal entries. 
              Use keywords like "work", "family", "stress", or "happy" to find relevant entries.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              <QuestionAnswer sx={{ mr: 1, verticalAlign: 'middle' }} />
              Ask Questions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ask natural language questions about your past entries. 
              Examples: "What did I do last weekend?", "When did I feel most stressed?", 
              "What are my recurring themes?"
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SearchQA;
