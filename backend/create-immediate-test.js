// Create an immediate test reminder to trigger the enhanced alarm
require('dotenv').config();
const mongoose = require('mongoose');

async function createImmediateTest() {
    console.log('🧪 CREATING IMMEDIATE TEST REMINDER');
    console.log('===================================');

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Database connected');

        const Reminder = require('./models/Reminder');
        const User = require('./models/User');

        // Find user
        const user = await User.findOne();
        if (!user) {
            console.log('❌ No user found. Please register first.');
            return;
        }

        console.log(`✅ Using user: ${user.email}`);

        // Create immediate test reminder (3 seconds from now)
        const testTime = new Date();
        testTime.setSeconds(testTime.getSeconds() + 3);

        const testReminder = new Reminder({
            userId: user._id,
            title: 'IMMEDIATE SOUND TEST',
            description: 'Testing enhanced alarm system with multiple sound methods',
            type: 'ai-suggested',
            priority: 'medium', // Will use enhanced medium priority alarm
            category: 'general',
            triggerTime: testTime,
            isActive: true,
            sourceType: 'manual',
            metadata: {
                createdFromVoice: false,
                isTest: true,
                enhanced: true
            }
        });

        await testReminder.save();
        console.log(`✅ Test reminder created with ID: ${testReminder._id}`);
        console.log(`⏰ Will trigger at: ${testTime.toISOString()}`);
        console.log(`🕐 Current time: ${new Date().toISOString()}`);

        // Load and initialize reminder service
        const reminderService = require('./services/reminderService');

        // Schedule the reminder
        reminderService.scheduleReminder(testReminder);

        console.log('\n🔊 ENHANCED ALARM WILL TRIGGER IN 3 SECONDS!');
        console.log('👂 Listen for multiple sounds and watch for message box!');
        console.log('🎵 You should hear:');
        console.log('   - Console beeps');
        console.log('   - Windows notification sounds');
        console.log('   - Ascending beep sequence');
        console.log('👀 You should see:');
        console.log('   - Message box popup');

        // Keep process alive to let alarm trigger
        setTimeout(() => {
            console.log('\n🏁 Test completed. Did you hear the enhanced alarm?');
            mongoose.disconnect();
            process.exit(0);
        }, 10000);

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

createImmediateTest();