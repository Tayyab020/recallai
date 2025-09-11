import React, { useState } from 'react';
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
  CircularProgress,
  Fade,
  Slide,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import netflixTheme from '../theme/netflixTheme';
import { useAuth } from '../contexts/AuthContext';
import { useFormValidation } from '../hooks/useFormValidation';
import { validateEmail, validatePassword, validateConfirmPassword } from '../utils/validation';

const NetflixLogin = () => {
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
      if (tabValue === 1) {
        return validateConfirmPassword(values.password, value);
      }
      return { isValid: true, message: '' };
    },
    consentGiven: (value) => {
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    if (newValue === 0) {
      handleChange('confirmPassword', '');
      handleChange('consentGiven', false);
    } else {
      handleChange('password', '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateAll()) {
      return;
    }

    setLoading(true);

    try {
      let result;
      if (tabValue === 0) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.email, formData.password, formData.consentGiven);
      }

      if (result.success) {
        navigate('/dashboard');
      } else {
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
    <ThemeProvider theme={netflixTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://images.unsplash.com/photo-1489599808426-2a0b0b5b0b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container component="main" maxWidth="sm">
          <Fade in timeout={1000}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Netflix Logo */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: '#E50914',
                    fontWeight: 700,
                    fontSize: '2.5rem',
                    mb: 1,
                  }}
                >
                  NETFLIX
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {tabValue === 0 ? 'Sign in to your account' : 'Create your account'}
                </Typography>
              </Box>

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  centered
                  variant="fullWidth"
                  sx={{
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#E50914',
                    },
                  }}
                >
                  <Tab
                    label="Sign In"
                    sx={{
                      color: tabValue === 0 ? '#E50914' : '#B3B3B3',
                      fontWeight: tabValue === 0 ? 600 : 400,
                    }}
                  />
                  <Tab
                    label="Sign Up"
                    sx={{
                      color: tabValue === 1 ? '#E50914' : '#B3B3B3',
                      fontWeight: tabValue === 1 ? 600 : 400,
                    }}
                  />
                </Tabs>
              </Box>

              {/* Error Alert */}
              {error && (
                <Slide direction="down" in={!!error} timeout={300}>
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      backgroundColor: 'rgba(229, 9, 20, 0.1)',
                      border: '1px solid #E50914',
                      color: '#E50914',
                    }}
                  >
                    {error}
                  </Alert>
                </Slide>
              )}

              {/* Form */}
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
                  placeholder="Enter your email"
                  helperText={errors.email || "We'll never share your email"}
                  error={touched.email && !!errors.email}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& fieldset': {
                        borderColor: '#666666',
                      },
                      '&:hover fieldset': {
                        borderColor: '#E50914',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#E50914',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#B3B3B3',
                      '&.Mui-focused': {
                        color: '#E50914',
                      },
                    },
                  }}
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
                  helperText={errors.password || "Must be at least 6 characters"}
                  error={touched.password && !!errors.password}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& fieldset': {
                        borderColor: '#666666',
                      },
                      '&:hover fieldset': {
                        borderColor: '#E50914',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#E50914',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#B3B3B3',
                      '&.Mui-focused': {
                        color: '#E50914',
                      },
                    },
                  }}
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& fieldset': {
                          borderColor: '#666666',
                        },
                        '&:hover fieldset': {
                          borderColor: '#E50914',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#E50914',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#B3B3B3',
                        '&.Mui-focused': {
                          color: '#E50914',
                        },
                      },
                    }}
                  />
                )}

                {tabValue === 1 && (
                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="consentGiven"
                          checked={formData.consentGiven}
                          onChange={(e) => handleChange(e.target.name, e.target.checked)}
                          onBlur={(e) => handleBlur(e.target.name)}
                          required
                          sx={{
                            color: '#E50914',
                            '&.Mui-checked': {
                              color: '#E50914',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" color="text.secondary">
                          I agree to the Terms of Service and Privacy Policy
                        </Typography>
                      }
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
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    backgroundColor: '#E50914',
                    '&:hover': {
                      backgroundColor: '#F40612',
                      boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)',
                    },
                    '&:disabled': {
                      backgroundColor: '#666666',
                    },
                  }}
                  disabled={loading || (tabValue === 1 && !formData.consentGiven)}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    tabValue === 0 ? 'Sign In' : 'Sign Up'
                  )}
                </Button>
              </Box>

              {/* Footer */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {tabValue === 0 ? "Don't have an account? " : "Already have an account? "}
                  <Button
                    variant="text"
                    onClick={() => setTabValue(tabValue === 0 ? 1 : 0)}
                    sx={{
                      color: '#E50914',
                      textTransform: 'none',
                      fontWeight: 600,
                      p: 0,
                      minWidth: 'auto',
                    }}
                  >
                    {tabValue === 0 ? 'Sign up now' : 'Sign in now'}
                  </Button>
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default NetflixLogin;
