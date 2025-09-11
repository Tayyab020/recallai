import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import localStorageService from '../services/localStorageService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Token is automatically handled by the API interceptor

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorageService.getItem('token');
      if (token) {
        try {
          const response = await api.get('/api/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorageService.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      localStorageService.setItem('token', token);
      setUser(user);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle validation errors more specifically
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        const validationErrors = error.response.data.errors;
        const emailError = validationErrors.find(err => err.path === 'email');
        
        if (emailError) {
          return { 
            success: false, 
            message: 'Invalid email format. Please use a valid email address.'
          };
        }
      }
      
      // Handle specific error messages
      if (error.response?.data?.message === 'Invalid credentials') {
        return {
          success: false,
          message: 'Invalid email or password. Please try again.'
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (email, password, consentGiven) => {
    try {
      const response = await api.post('/api/auth/register', {
        email,
        password,
        consentGiven
      });

      const { token, user } = response.data;
      localStorageService.setItem('token', token);
      setUser(user);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle validation errors more specifically
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        const validationErrors = error.response.data.errors;
        const emailError = validationErrors.find(err => err.path === 'email');
        const passwordError = validationErrors.find(err => err.path === 'password');
        
        if (emailError) {
          return { 
            success: false, 
            message: 'Invalid email format. Please use a valid email address.'
          };
        } else if (passwordError) {
          return { 
            success: false, 
            message: 'Password must be at least 6 characters long.'
          };
        }
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorageService.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updatePreferences = async (preferences) => {
    try {
      const response = await api.put('/api/auth/preferences', {
        preferences
      });

      setUser(prev => ({
        ...prev,
        preferences: response.data.preferences
      }));

      return { success: true };
    } catch (error) {
      console.error('Update preferences error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Update failed' 
      };
    }
  };

  const updatePushSubscription = async (subscription) => {
    try {
      await api.put('/api/auth/push-subscription', {
        subscription
      });

      return { success: true };
    } catch (error) {
      console.error('Update push subscription error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Update failed' 
      };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updatePreferences,
    updatePushSubscription,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

