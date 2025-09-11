// Simple API test script
import api from './services/api';

const testAPI = async () => {
  try {
    console.log('Testing API connection...');
    console.log('Base URL:', api.defaults.baseURL);
    
    // Test a simple endpoint
    const response = await api.get('/api/health');
    console.log('API Health check response:', response.data);
  } catch (error) {
    console.error('API test failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    });
  }
};

// Test login endpoint specifically
const testLogin = async () => {
  try {
    console.log('Testing login endpoint...');
    const response = await api.post('/api/auth/login', {
      email: 'test@example.com',
      password: 'testpassword123'
    });
    console.log('Login test response:', response.data);
  } catch (error) {
    console.error('Login test failed:', error);
    console.error('Login error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    });
  }
};

export { testAPI, testLogin };
