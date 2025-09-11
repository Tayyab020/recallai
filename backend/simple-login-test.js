// Simple login test using built-in modules
const http = require('http');

function testLogin() {
    console.log('🧪 Testing login endpoint...');

    const postData = JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers:`, res.headers);

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log('Response:', data);
            try {
                const response = JSON.parse(data);
                if (response.token) {
                    console.log('✅ Login successful! Token received.');
                } else {
                    console.log('❌ Login failed:', response.message);
                }
            } catch (e) {
                console.log('❌ Invalid JSON response');
            }
        });
    });

    req.on('error', (e) => {
        console.error('❌ Request failed:', e.message);
        if (e.code === 'ECONNREFUSED') {
            console.log('💡 Make sure the backend server is running on port 5000');
        }
    });

    req.write(postData);
    req.end();
}

testLogin();