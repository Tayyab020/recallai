// Test the reminders API endpoint to see all reminders
const http = require('http');

function testRemindersAPI() {
    console.log('🧪 Testing Reminders API Endpoint');
    console.log('=================================');

    // You'll need to get a valid token first
    console.log('⚠️ Note: You need to get a valid JWT token first');
    console.log('1. Login via frontend or API');
    console.log('2. Copy the token from localStorage or API response');
    console.log('3. Replace TOKEN_HERE below with your actual token');
    console.log('');

    const token = 'TOKEN_HERE'; // Replace with actual token

    if (token === 'TOKEN_HERE') {
        console.log('❌ Please replace TOKEN_HERE with your actual JWT token');
        console.log('💡 You can get it from browser localStorage or login API response');
        return;
    }

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/reminders',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    const req = http.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                console.log(`✅ API returned ${response.reminders.length} reminders`);
                console.log('');

                response.reminders.forEach((reminder, index) => {
                    const triggerTime = new Date(reminder.triggerTime);
                    const isPast = triggerTime <= new Date();
                    const status = reminder.isActive ? '🟢 Active' : '🔴 Inactive';
                    const timeStatus = isPast ? '⏰ Past/Overdue' : '⏳ Future';

                    console.log(`${index + 1}. ${reminder.title}`);
                    console.log(`   Status: ${status}`);
                    console.log(`   Time: ${timeStatus} - ${triggerTime.toLocaleString()}`);
                    console.log(`   Priority: ${reminder.priority}`);
                    console.log('');
                });

            } catch (e) {
                console.log('❌ Invalid JSON response:', data);
            }
        });
    });

    req.on('error', (e) => {
        console.error('❌ Request failed:', e.message);
        if (e.code === 'ECONNREFUSED') {
            console.log('💡 Make sure the backend server is running on port 5000');
        }
    });

    req.end();
}

testRemindersAPI();