import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Mic,
  Stop,
  PlayArrow,
  Save,
  Cancel
} from '@mui/icons-material';
import api from '../services/api';

const EntryForm = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const startRecording = async () => {
    try {
      // Check if MediaRecorder is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Audio recording is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.');
        return;
      }

      if (!window.MediaRecorder) {
        setError('MediaRecorder is not supported in this browser. Please use a modern browser.');
        return;
      }

      // Request high-quality audio for better transcription
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
          channelCount: 1
        }
      });

      // Try different MIME types based on browser support
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'audio/wav';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
              mimeType = ''; // Let browser choose
            }
          }
        }
      }

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType || 'audio/webm'
        });

        // Basic validation - just check if we have audio data
        if (blob.size === 0) {
          setError('Recording failed - no audio data captured');
          return;
        }

        if (blob.size > 10 * 1024 * 1024) { // 10MB limit
          setError('Recording is too large (max 10MB)');
          return;
        }

        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());

        // Clear any previous errors and show success message
        setError('');
        const formatInfo = blob.type ? blob.type.split(';')[0] : 'browser default';
        setSuccess(`Audio recorded successfully! Format: ${formatInfo}, Size: ${(blob.size / 1024).toFixed(1)}KB`);
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error starting recording:', err);
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone permissions and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else {
        setError('Failed to start recording. Please check your microphone and try again.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
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

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const transcribeAudio = async () => {
    if (!audioBlob) {
      setError('No audio recording to transcribe');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const base64Audio = await blobToBase64(audioBlob);

      // Send audio to Gemini for transcription and analysis
      const response = await api.post('/api/ai/transcribe', {
        audioData: base64Audio,
        mimeType: audioBlob.type || 'audio/webm'
      });

      if (response.data.transcription) {
        setTranscription(response.data.transcription);

        let successMessage = 'Audio transcribed and analyzed successfully!';

        // Show analysis results if available
        if (response.data.analysis) {
          const { analysis } = response.data;
          successMessage += '\n\n🎤 Voice Analysis Results:';

          if (analysis.events && analysis.events.length > 0) {
            successMessage += `\n📅 Found ${analysis.events.length} events:`;
            analysis.events.forEach(event => {
              successMessage += `\n• ${event.title} (${event.priority} priority)`;
            });
          }

          if (analysis.tasks && analysis.tasks.length > 0) {
            successMessage += `\n✅ Found ${analysis.tasks.length} tasks:`;
            analysis.tasks.forEach(task => {
              successMessage += `\n• ${task.title} (${task.priority} priority)`;
            });
          }

          if (analysis.deadlines && analysis.deadlines.length > 0) {
            successMessage += `\n⏰ Found ${analysis.deadlines.length} deadlines:`;
            analysis.deadlines.forEach(deadline => {
              successMessage += `\n• ${deadline.title} (${deadline.priority} priority)`;
            });
          }

          if (analysis.notes && analysis.notes.length > 0) {
            successMessage += `\n📝 Found ${analysis.notes.length} notes:`;
            analysis.notes.forEach(note => {
              successMessage += `\n• ${note}`;
            });
          }

          if (analysis.summary && analysis.summary.hourly) {
            successMessage += `\n\n📊 ${analysis.summary.hourly}`;
          }
        }

        setSuccess(successMessage);
      } else {
        setError('No transcription received from the server');
      }
    } catch (err) {
      console.error('Transcription error:', err);
      setError('Failed to transcribe audio. Please try again or add a description manually.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate that we have either audio or description
    if (!audioBlob && !description.trim()) {
      setError('Please record audio or add a description');
      return;
    }

    try {
      setLoading(true);

      const entryData = {
        text: transcription || description || 'Voice entry',
        description: description,
        voiceUrl: audioUrl
      };

      // Include audio data for voice analysis if available
      if (audioBlob && audioUrl) {
        const audioData = await blobToBase64(audioBlob);
        entryData.audioData = audioData;
        entryData.mimeType = audioBlob.type || 'audio/webm';
      }

      console.log('Sending entry data:', {
        hasAudio: !!entryData.audioData,
        hasDescription: !!description,
        hasTranscription: !!transcription
      });

      const response = await api.post('/api/entries', entryData);

      let successMessage = 'Entry saved successfully!';

      // Add voice analysis results to success message
      if (response.data.voiceAnalysis) {
        const { voiceAnalysis, createdReminders } = response.data;
        if (voiceAnalysis.success) {
          successMessage += `\n\n🎤 Voice Analysis Results:`;
          if (voiceAnalysis.eventsFound > 0) {
            successMessage += `\n• Found ${voiceAnalysis.eventsFound} events`;
          }
          if (voiceAnalysis.remindersFound > 0) {
            successMessage += `\n• Found ${voiceAnalysis.remindersFound} reminders`;
          }
          if (createdReminders > 0) {
            successMessage += `\n✅ Created ${createdReminders} automatic reminders!`;
          }
        }
      }

      setSuccess(successMessage);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2500); // Longer timeout to show voice analysis results

    } catch (err) {
      console.error('Save entry error:', err);
      setError(err.response?.data?.message || 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          New Voice Entry
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Record your thoughts, experiences, or reminders. The AI will automatically analyze your voice for important events and tasks.
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

        <Box component="form" onSubmit={handleSubmit}>
          {/* Voice Recording Section */}
          <Box sx={{ mb: 3, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Voice Recording
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <IconButton
                color={isRecording ? 'error' : 'primary'}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={loading}
                title={isRecording ? 'Stop recording' : 'Start recording'}
                size="large"
              >
                {isRecording ? <Stop /> : <Mic />}
              </IconButton>

              {audioUrl && (
                <>
                  <IconButton
                    color="primary"
                    onClick={playRecording}
                    disabled={loading}
                    title="Play recording"
                  >
                    <PlayArrow />
                  </IconButton>
                  <Button
                    variant="outlined"
                    onClick={transcribeAudio}
                    disabled={loading || !audioBlob}
                    startIcon={<Mic />}
                  >
                    Transcribe & Analyze
                  </Button>
                </>
              )}

              {isRecording && (
                <Typography variant="body2" color="error">
                  Recording... Click stop when finished
                </Typography>
              )}
            </Box>

            {audioUrl && (
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                controls
                style={{ width: '100%', marginTop: 8 }}
              />
            )}

            {transcription && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Transcription:</strong> {transcription}
                </Typography>
              </Alert>
            )}
          </Box>

          {/* Optional Description */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description (Optional)"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Add any additional notes or context..."
            helperText={`${description.length}/500 characters`}
            inputProps={{ maxLength: 500 }}
            sx={{ mb: 3 }}
          />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
              startIcon={<Cancel />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              disabled={loading || (!audioBlob && !description.trim())}
            >
              {loading ? 'Saving...' : 'Save Entry'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EntryForm;
