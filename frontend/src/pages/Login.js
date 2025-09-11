import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useFormValidation } from '../hooks/useFormValidation';
import { validateEmail, validatePassword, validateConfirmPassword } from '../utils/validation';

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
    consentGiven: false,
  };

  const validators = {
    email: validateEmail,
    password: validatePassword,
    confirmPassword: (value, values) => {
      // Only validate confirmPassword on register tab
      if (tabValue === 1) {
        return validateConfirmPassword(values.password, value);
      }
      return { isValid: true, message: '' };
    },
    consentGiven: (value) => {
      // Only validate consentGiven on register tab
      if (tabValue === 1) {
        return {
          isValid: value,
          message: 'You must accept the terms and conditions',
        };
      }
      return { isValid: true, message: '' };
    },
  };

  const { values: formData, errors, touched, handleChange, handleBlur, validateAll } = useFormValidation(
    initialValues,
    validators
  );

  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
    setError('');
    // Reset fields specific to the other tab for a clean switch
    if (newValue === 0) {
      // switching to Login
      handleChange('confirmPassword', '');
      handleChange('consentGiven', false);
    } else {
      // switching to Register
      handleChange('password', '');
    }
  }, [handleChange]);

  const handleSubmit = async (e) => {
    console.log('Form submitted!', e);
    e.preventDefault();
    setError('');

    console.log('Form data:', formData);
    console.log('Tab value:', tabValue);

    if (!validateAll()) {
      console.log('Validation failed');
      console.log('Current errors:', errors);
      console.log('Form values:', formData);
      return;
    }

    console.log('Validation passed, starting auth...');
    setLoading(true);

    try {
      let result;
      if (tabValue === 0) {
        console.log('Attempting login...');
        result = await login(formData.email, formData.password);
        console.log('Login result:', result);
      } else {
        console.log('Attempting registration...');
        result = await register(formData.email, formData.password, formData.consentGiven);
        console.log('Registration result:', result);
      }

      if (result.success) {
        console.log('Auth successful, navigating to dashboard');
        navigate('/dashboard');
      } else {
        console.log('Auth failed:', result.message);
        setError(result.message);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 6 }}>
      <Box
        sx={{
          mt: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom sx={{ fontWeight: 800, letterSpacing: '-0.3px' }}>
            Sign in to Recall
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
            Welcome back. Let’s get you creating.
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered variant="fullWidth">
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              onBlur={(e) => handleBlur(e.target.name)}
              placeholder="user@example.com"
              helperText={errors.email || "Please enter a valid email address"}
              error={touched.email && !!errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              onBlur={(e) => handleBlur(e.target.name)}
              helperText={errors.password || "Password must be at least 6 characters long"}
              error={touched.password && !!errors.password}
            />
            {tabValue === 1 && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                onBlur={(e) => handleBlur(e.target.name)}
                helperText={errors.confirmPassword || "Please confirm your password"}
                error={touched.confirmPassword && !!errors.confirmPassword}
              />
            )}

            {tabValue === 1 && (
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="consentGiven"
                      checked={formData.consentGiven}
                      onChange={(e) => handleChange(e.target.name, e.target.checked)}
                      onBlur={(e) => handleBlur(e.target.name)}
                      required
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I consent to the collection and processing of my data for AI-powered features,
                      including emotion detection, summarization, and personalized reminders.
                      I understand that my data is encrypted and can be deleted at any time.
                    </Typography>
                  }
                  sx={{ mt: 2, mb: 1 }}
                />
                {touched.consentGiven && errors.consentGiven && (
                  <Typography variant="caption" color="error" sx={{ ml: 4, display: 'block' }}>
                    {errors.consentGiven}
                  </Typography>
                )}
              </Box>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, py: 1.25, fontWeight: 700 }}
              disabled={loading || (tabValue === 1 && !formData.consentGiven)}
              onClick={(e) => {
                console.log('Button clicked!', e);
                console.log('Button disabled?', loading || (tabValue === 1 && !formData.consentGiven));
              }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                tabValue === 0 ? 'Login' : 'Register'
              )}
            </Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" align="center" display="block">
              Privacy & Security: Your journal entries are encrypted end-to-end. AI processing is secure and your data is never shared.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;