// Test login API endpoint directly
require('dotenv').config();
const axios = require('axios');

async function testLoginAPI() {
    console.log('🌐 TESTING LOGIN API ENDPOINT');
    console.log('=============================');

    const baseURL = 'http://localhost:5000';

    try {
        // Test 1: Check if server is running
        console.log('1️⃣ Checking if server is running...');
        try {
            const response = await axios.get(`${baseURL}/api/auth/me`, {
                timeout: 5000
            });
            console.log('✅ Server is running and responding');
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                console.log('❌ Server is not running!');
                console.log('💡 Please start the backend server with: npm start');
                return;
            } else if (error.response?.status === 401) {
                console.log('✅ Server is running (401 expected without token)');
            } else {
                console.log('⚠️ Server responded with error:', error.response?.status || error.message);
            }
        }

        // Test 2: Try to register a test user
        console.log('\n2️⃣ Testing user registration...');
        try {
            const registerResponse = await axios.post(`${baseURL}/api/auth/register`, {
                email: 'testuser@example.com',
                password: 'password123',
                consentGiven: true
            });

            console.log('✅ Registration successful');
            console.log('📧 Email: testuser@example.com');
            console.log('🔑 Password: password123');
            console.log('🎫 Token received:', registerResponse.data.token ? 'Yes' : 'No');

        } catch (error) {
            if (error.response?.data?.message === 'User already exists') {
                console.log('ℹ️ Test user already exists, proceeding with login test');
            } else {
                console.log('❌ Registration failed:', error.response?.data?.message || error.message);
            }
        }

        // Test 3: Try to login
        console.log('\n3️⃣ Testing user login...');
        try {
            const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
                email: 'testuser@example.com',
                password: 'password123'
            });

            console.log('✅ Login successful!');
            console.log('🎫 Token received:', loginResponse.data.token ? 'Yes' : 'No');
            console.log('👤 User data:', loginResponse.data.user ? 'Yes' : 'No');

            // Test 4: Test authenticated endpoint
            console.log('\n4️⃣ Testing authenticated endpoint...');
            const token = loginResponse.data.token;
            const meResponse = await axios.get(`${baseURL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('✅ Authenticated request successful!');
            console.log('👤 User email:', meResponse.data.user.email);

        } catch (error) {
            console.log('❌ Login failed:', error.response?.data?.message || error.message);

            if (error.response?.data?.errors) {
                console.log('📋 Validation errors:', error.response.data.errors);
            }
        }

        // Test 5: Try login with existing user
        console.log('\n5️⃣ Testing with existing user...');
        try {
            const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
                email: 'tayyab@gmail.com',
                password: 'password123' // This might not work, just testing
            });

            console.log('✅ Existing user login successful!');

        } catch (error) {
            console.log('ℹ️ Existing user login failed (expected if password is different)');
            console.log('📝 Error:', error.response?.data?.message || error.message);
        }

        console.log('\n🏁 API test completed!');
        console.log('\n📋 Summary:');
        console.log('- If registration/login worked, the API is functioning correctly');
        console.log('- If login failed, check the password for existing users');
        console.log('- Frontend login should work if API tests pass');

    } catch (error) {
        console.error('❌ API test failed:', error.message);
    }
}

testLoginAPI();