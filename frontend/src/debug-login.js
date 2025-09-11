// Debug script to test login functionality
import api from './services/api';

const debugLogin = async () => {
  console.log('=== DEBUG LOGIN TEST ===');
  console.log('API Base URL:', api.defaults.baseURL);
  
  try {
    // Test 1: Health check
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await api.get('/api/health');
    console.log('✅ Health check passed:', healthResponse.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    console.error('Error details:', {
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    });
    return;
  }

  try {
    // Test 2: Try to register a test user
    console.log('\n2. Testing registration...');
    const registerResponse = await api.post('/api/auth/register', {
      email: 'test@example.com',
      password: 'testpass123',
      consentGiven: true
    });
    console.log('✅ Registration successful:', registerResponse.data);
  } catch (error) {
    console.error('❌ Registration failed:', error.message);
    console.error('Registration error details:', {
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    });
  }

  try {
    // Test 3: Try to login with test user
    console.log('\n3. Testing login...');
    const loginResponse = await api.post('/api/auth/login', {
      email: 'test@example.com',
      password: 'testpass123'
    });
    console.log('✅ Login successful:', loginResponse.data);
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    console.error('Login error details:', {
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    });
  }
};

// Run the debug test
debugLogin();
