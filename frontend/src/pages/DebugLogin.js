import React, { useState } from 'react';
import { Button, Container, Paper, Typography, Box, TextField, Alert } from '@mui/material';
import api from '../services/api';

const DebugLogin = () => {
  const [testResults, setTestResults] = useState([]);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('testpass123');

  const addResult = (message, type = 'info') => {
    setTestResults(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testHealth = async () => {
    try {
      addResult('Testing health endpoint...', 'info');
      const response = await api.get('/api/health');
      addResult(`✅ Health check passed: ${JSON.stringify(response.data)}`, 'success');
    } catch (error) {
      addResult(`❌ Health check failed: ${error.message}`, 'error');
      addResult(`Error details: ${JSON.stringify(error.response?.data)}`, 'error');
    }
  };

  const testRegister = async () => {
    try {
      addResult('Testing registration...', 'info');
      const response = await api.post('/api/auth/register', {
        email,
        password,
        consentGiven: true
      });
      addResult(`✅ Registration successful: ${JSON.stringify(response.data)}`, 'success');
    } catch (error) {
      addResult(`❌ Registration failed: ${error.message}`, 'error');
      addResult(`Error details: ${JSON.stringify(error.response?.data)}`, 'error');
    }
  };

  const testLogin = async () => {
    try {
      addResult('Testing login...', 'info');
      const response = await api.post('/api/auth/login', {
        email,
        password
      });
      addResult(`✅ Login successful: ${JSON.stringify(response.data)}`, 'success');
    } catch (error) {
      addResult(`❌ Login failed: ${error.message}`, 'error');
      addResult(`Error details: ${JSON.stringify(error.response?.data)}`, 'error');
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    addResult('Starting API tests...', 'info');
    addResult(`API Base URL: ${api.defaults.baseURL}`, 'info');
    
    await testHealth();
    await testRegister();
    await testLogin();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Debug Login Tests
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button variant="contained" onClick={testHealth}>
            Test Health
          </Button>
          <Button variant="contained" onClick={testRegister}>
            Test Register
          </Button>
          <Button variant="contained" onClick={testLogin}>
            Test Login
          </Button>
          <Button variant="contained" color="primary" onClick={runAllTests}>
            Run All Tests
          </Button>
        </Box>

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {testResults.map((result, index) => (
            <Alert 
              key={index} 
              severity={result.type === 'success' ? 'success' : result.type === 'error' ? 'error' : 'info'}
              sx={{ mb: 1 }}
            >
              <Typography variant="body2">
                [{result.timestamp}] {result.message}
              </Typography>
            </Alert>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default DebugLogin;
