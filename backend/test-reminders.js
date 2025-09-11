require('dotenv').config();
const mongoose = require('mongoose');
const reminderService = require('./services/reminderService');
const User = require('./models/User');

async function testReminderSystem() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find a test user (or create one)
        let testUser = await User.findOne({ email: { $regex: /test/i } });
        if (!testUser) {
            console.log('No test user found, please create a user first');
            process.exit(1);
        }

        console.log(`Using test user: ${testUser.email}`);

        // Create a test reminder that triggers in 5 seconds
        console.log('Creating test reminder...');
        const testReminder = await reminderService.createTestReminder(testUser._id);

        if (testReminder) {
            console.log(`✅ Test reminder created: ${testReminder.title}`);
            console.log(`⏰ Will trigger at: ${testReminder.triggerTime}`);
            console.log('Waiting for alarm to trigger...');

            // Wait 15 seconds to see if it triggers
            setTimeout(() => {
                console.log('Test completed. Check console output above for alarm notifications.');
                process.exit(0);
            }, 15000);
        } else {
            console.log('❌ Failed to create test reminder');
            process.exit(1);
        }

    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

console.log('🧪 Testing Reminder System...');
testReminderSystem();