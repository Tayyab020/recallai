import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    Alert,
    CircularProgress,
    Card,
    CardContent
} from '@mui/material';
import {
    Alarm,
    BugReport,
    PlayArrow,
    Speed,
    VolumeUp,
    Notifications
} from '@mui/icons-material';
import api from '../services/api';
import soundService from '../services/soundService';
import notificationService from '../services/notificationService';

const TestReminders = () => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [audioEnabled, setAudioEnabled] = useState(false);

    useEffect(() => {
        // Request permissions on component mount
        const initializeNotifications = async () => {
            await notificationService.requestPermissions();
            setAudioEnabled(true);
        };

        initializeNotifications();
    }, []);

    const addResult = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setResults(prev => [...prev, { message, type, timestamp }]);
    };

    const enableAudio = () => {
        soundService.enableAudio();
        setAudioEnabled(true);
        addResult('✅ Audio enabled! You should now hear alarm sounds.', 'success');
    };

    const testSounds = () => {
        addResult('🔊 Testing all alarm sounds...', 'info');
        soundService.testAllSounds();
        addResult('🎵 Sound test completed. Did you hear the different alarm tones?', 'info');
    };

    const testImmediateReminder = async () => {
        try {
            setLoading(true);
            setError('');
            addResult('Creating immediate test reminder (5 seconds)...', 'info');

            const response = await api.post('/api/reminders/create-immediate-test');
            addResult(`✅ ${response.data.message}`, 'success');
            addResult(`⏰ Trigger time: ${new Date(response.data.triggerTime).toLocaleString()}`, 'info');
            addResult('🔍 Watch browser console, server logs, and LISTEN for alarm sounds!', 'warning');
            addResult('🔊 You should hear a sound alarm in 5 seconds!', 'warning');

        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to create test reminder';
            setError(errorMsg);
            addResult(`❌ ${errorMsg}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const testNormalReminder = async () => {
        try {
            setLoading(true);
            setError('');
            addResult('Creating normal test reminder (30 seconds)...', 'info');

            const response = await api.post('/api/reminders/create-test');
            addResult(`✅ ${response.data.message}`, 'success');
            addResult(`⏰ Trigger time: ${new Date(response.data.reminder.triggerTime).toLocaleString()}`, 'info');
            addResult('🔍 Watch server console and LISTEN for alarm sounds in 30 seconds!', 'warning');

        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to create test reminder';
            setError(errorMsg);
            addResult(`❌ ${errorMsg}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const checkStatus = async () => {
        try {
            setLoading(true);
            setError('');
            addResult('Checking reminder service status...', 'info');

            const response = await api.get('/api/reminders/status');
            addResult(`📊 Active reminders: ${response.data.activeReminders}`, 'info');
            addResult(`🔑 VAPID configured: ${response.data.vapidConfigured ? 'Yes' : 'No'}`, 'info');
            addResult(`📱 Push subscription: ${response.data.userHasPushSubscription ? 'Yes' : 'No'}`, 'info');

        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to check status';
            setError(errorMsg);
            addResult(`❌ ${errorMsg}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const clearResults = () => {
        setResults([]);
        setError('');
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    🧪 Reminder System Test
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Use these tools to test if the reminder alarm system is working correctly.
                    Watch the browser console, server logs, and LISTEN for alarm sounds.
                </Typography>

                {!audioEnabled && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        <Typography variant="body2">
                            🔊 Click "Enable Audio" first to hear alarm sounds!
                        </Typography>
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    {!audioEnabled && (
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<VolumeUp />}
                            onClick={enableAudio}
                        >
                            Enable Audio
                        </Button>
                    )}

                    <Button
                        variant="outlined"
                        color="info"
                        startIcon={<VolumeUp />}
                        onClick={testSounds}
                        disabled={!audioEnabled}
                    >
                        Test Sounds
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        startIcon={loading ? <CircularProgress size={20} /> : <Speed />}
                        onClick={testImmediateReminder}
                        disabled={loading}
                    >
                        Test Immediate (5s)
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={loading ? <CircularProgress size={20} /> : <Alarm />}
                        onClick={testNormalReminder}
                        disabled={loading}
                    >
                        Test Normal (30s)
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={loading ? <CircularProgress size={20} /> : <BugReport />}
                        onClick={checkStatus}
                        disabled={loading}
                    >
                        Check Status
                    </Button>

                    <Button
                        variant="text"
                        onClick={clearResults}
                        disabled={loading}
                    >
                        Clear Results
                    </Button>
                </Box>

                {results.length > 0 && (
                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Test Results
                            </Typography>
                            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                                {results.map((result, index) => (
                                    <Alert
                                        key={index}
                                        severity={result.type}
                                        sx={{ mb: 1 }}
                                    >
                                        <Typography variant="body2">
                                            [{result.timestamp}] {result.message}
                                        </Typography>
                                    </Alert>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                )}

                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        📋 How to Test Alarm Sounds:
                    </Typography>
                    <Typography variant="body2" component="div">
                        1. Click "Enable Audio" first (required by browsers)<br />
                        2. Click "Test Sounds" to hear different alarm tones<br />
                        3. Click "Test Immediate (5s)" for quick testing<br />
                        4. You should hear:<br />
                        &nbsp;&nbsp;• 🔊 Browser sound (from this page)<br />
                        &nbsp;&nbsp;• 🔊 Windows system sound (from server)<br />
                        5. Check server console for "🔊 Playing alarm sound" messages<br />
                        6. Look for "🔔 ALARM TRIGGERED" in server logs
                    </Typography>
                </Box>

                <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        🔊 Sound Types by Priority:
                    </Typography>
                    <Typography variant="body2" component="div">
                        • <strong>High Priority</strong>: Multiple urgent beeps + Windows Critical Stop<br />
                        • <strong>Medium Priority</strong>: Single long beep + Windows Notify<br />
                        • <strong>Low Priority</strong>: Soft beep + Windows Messaging sound
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default TestReminders;