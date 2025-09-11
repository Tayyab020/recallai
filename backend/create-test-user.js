// Create a test user with known credentials
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createTestUser() {
    console.log('👤 CREATING TEST USER');
    console.log('====================');

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Database connected');

        // Delete existing test user if exists
        await User.deleteOne({ email: 'test@example.com' });
        console.log('🧹 Cleaned up existing test user');

        // Create new test user
        const testUser = new User({
            email: 'test@example.com',
            passwordHash: 'password123',
            consentGiven: true
        });

        await testUser.save();
        console.log('✅ Test user created successfully!');
        console.log('');
        console.log('📧 Email: test@example.com');
        console.log('🔑 Password: password123');
        console.log('');
        console.log('🧪 You can now test login with these credentials');

    } catch (error) {
        console.error('❌ Failed to create test user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🧹 Disconnected from database');
        process.exit(0);
    }
}

createTestUser();