// Test login functionality
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testLogin() {
    console.log('🧪 TESTING LOGIN FUNCTIONALITY');
    console.log('==============================');

    try {
        // Connect to database
        console.log('1️⃣ Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Database connected successfully');

        // Check if any users exist
        console.log('\n2️⃣ Checking existing users...');
        const userCount = await User.countDocuments();
        console.log(`📊 Found ${userCount} users in database`);

        if (userCount === 0) {
            console.log('\n3️⃣ Creating test user...');
            const testUser = new User({
                email: 'test@example.com',
                passwordHash: 'password123',
                consentGiven: true
            });

            await testUser.save();
            console.log('✅ Test user created successfully');
            console.log('📧 Email: test@example.com');
            console.log('🔑 Password: password123');
        } else {
            console.log('\n3️⃣ Using existing users...');
            const users = await User.find({}, 'email createdAt').limit(3);
            users.forEach((user, index) => {
                console.log(`👤 User ${index + 1}: ${user.email} (created: ${user.createdAt.toLocaleDateString()})`);
            });
        }

        // Test password comparison
        console.log('\n4️⃣ Testing password comparison...');
        const testUser = await User.findOne();
        if (testUser) {
            console.log(`🔍 Testing with user: ${testUser.email}`);

            // Test with correct password (if it's the test user)
            if (testUser.email === 'test@example.com') {
                const isValidPassword = await testUser.comparePassword('password123');
                console.log(`✅ Password comparison test: ${isValidPassword ? 'PASSED' : 'FAILED'}`);
            } else {
                console.log('ℹ️ Skipping password test for existing user (unknown password)');
            }
        }

        // Check environment variables
        console.log('\n5️⃣ Checking environment variables...');
        console.log(`📊 MONGO_URI: ${process.env.MONGO_URI ? '✅ Set' : '❌ Missing'}`);
        console.log(`🔐 JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
        console.log(`🔑 ENCRYPTION_KEY: ${process.env.ENCRYPTION_KEY ? '✅ Set' : '❌ Missing'}`);

        // Test JWT secret
        if (!process.env.JWT_SECRET) {
            console.log('⚠️ WARNING: JWT_SECRET is missing! This will cause login to fail.');
            console.log('💡 Add JWT_SECRET=your-secret-key to your .env file');
        }

        console.log('\n🏁 Login test completed!');
        console.log('\n📋 To test login:');
        console.log('1. Start the backend server: npm start');
        console.log('2. Start the frontend: npm start');
        console.log('3. Try logging in with: test@example.com / password123');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🧹 Disconnected from database');
        process.exit(0);
    }
}

testLogin();