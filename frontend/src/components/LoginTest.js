import React, { useState } from 'react';
import {
    Container,
    Paper,
    Button,
    Typography,
    Alert,
    Box,
    TextField,
    CircularProgress
} from '@mui/material';
import api from '../services/api';

const LoginTest = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('test@example.com');
    const [password, setPassword] = useState('password123');

    const testDirectAPI = async () => {
        setLoading(true);
        setResult(null);

        try {
            console.log('🧪 Testing direct API call...');
            console.log('📧 Email:', email);
            console.log('🔑 Password:', password);

            const response = await api.post('/api/auth/login', {
                email,
                password
            });

            console.log('✅ API Response:', response.data);

            setResult({
                success: true,
                message: 'Login successful!',
                data: response.data
            });

        } catch (error) {
            console.error('❌ API Error:', error);
            console.error('📊 Error Response:', error.response?.data);
            console.error('📊 Error Status:', error.response?.status);

            setResult({
                success: false,
                message: error.response?.data?.message || error.message,
                error: error.response?.data || error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const testAuthContext = async () => {
        setLoading(true);
        setResult(null);

        try {
            console.log('🧪 Testing AuthContext login...');

            // Import AuthContext dynamically
            const { useAuth } = await import('../contexts/AuthContext');

            setResult({
                success: false,
                message: 'Cannot test AuthContext from this component. Use the main login page instead.',
            });

        } catch (error) {
            console.error('❌ AuthContext Error:', error);
            setResult({
                success: false,
                message: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const checkAPIConnection = async () => {
        setLoading(true);
        setResult(null);

        try {
            console.log('🌐 Testing API connection...');

            // Test basic connection
            const response = await api.get('/api/auth/me');

            setResult({
                success: false,
                message: 'API connection works (401 expected without token)',
                data: response.data
            });

        } catch (error) {
            if (error.response?.status === 401) {
                setResult({
                    success: true,
                    message: 'API connection works! (401 Unauthorized is expected)',
                    data: error.response.data
                });
            } else {
                setResult({
                    success: false,
                    message: `API connection failed: ${error.message}`,
                    error: error.response?.data || error.message
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    🧪 Login Debug Test
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Test login functionality to debug issues
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        onClick={testDirectAPI}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        Test Direct API
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={checkAPIConnection}
                        disabled={loading}
                    >
                        Check API Connection
                    </Button>
                </Box>

                {result && (
                    <Alert
                        severity={result.success ? 'success' : 'error'}
                        sx={{ mb: 2 }}
                    >
                        <Typography variant="body2">
                            <strong>Result:</strong> {result.message}
                        </Typography>

                        {result.data && (
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" component="div">
                                    <strong>Data:</strong>
                                </Typography>
                                <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                                    {JSON.stringify(result.data, null, 2)}
                                </pre>
                            </Box>
                        )}

                        {result.error && (
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" component="div">
                                    <strong>Error:</strong>
                                </Typography>
                                <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                                    {JSON.stringify(result.error, null, 2)}
                                </pre>
                            </Box>
                        )}
                    </Alert>
                )}

                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        📋 Debug Steps:
                    </Typography>
                    <Typography variant="body2" component="div">
                        1. Check API Connection - Tests if backend is reachable<br />
                        2. Test Direct API - Tests login endpoint directly<br />
                        3. Check browser console for detailed error logs<br />
                        4. Verify network tab in DevTools for failed requests
                    </Typography>
                </Box>

                <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        🔧 Test Credentials:
                    </Typography>
                    <Typography variant="body2">
                        Email: test@example.com<br />
                        Password: password123<br />
                        (These credentials were created for testing)
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginTest;