// Create a real reminder that will trigger with the custom remind.mp3 sound
require('dotenv').config();
const mongoose = require('mongoose');

async function testRealReminderWithMP3() {
    console.log('🎵 TESTING REAL REMINDER WITH CUSTOM MP3 🎵');
    console.log('==========================================');

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

        // Create immediate test reminder (5 seconds from now)
        const testTime = new Date();
        testTime.setSeconds(testTime.getSeconds() + 5);

        const testReminder = new Reminder({
            userId: user._id,
            title: 'MP3 ALARM TEST',
            description: 'Testing custom remind.mp3 alarm sound',
            type: 'ai-suggested',
            priority: 'medium', // Will play remind.mp3 + show message box
            category: 'general',
            triggerTime: testTime,
            isActive: true,
            sourceType: 'manual',
            metadata: {
                createdFromVoice: false,
                isTest: true,
                customSound: true
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

        console.log('\n🎵 CUSTOM MP3 ALARM WILL TRIGGER IN 5 SECONDS!');
        console.log('👂 Listen for your custom remind.mp3 sound!');
        console.log('👀 Watch for message box popup!');
        console.log('🎶 You should hear your custom remind.mp3 file playing!');

        // Keep process alive to let alarm trigger
        setTimeout(() => {
            console.log('\n🏁 Real reminder test completed!');
            console.log('Did you hear your custom remind.mp3 alarm sound?');
            console.log('This is exactly how your reminders will sound now! 🎵');
            mongoose.disconnect();
            process.exit(0);
        }, 12000);

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

testRealReminderWithMP3();