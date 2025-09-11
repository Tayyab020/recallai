// Test the enhanced alarm system with multiple methods
require('dotenv').config();
const mongoose = require('mongoose');

async function testEnhancedAlarms() {
    console.log('🚨 TESTING ENHANCED ALARM SYSTEM 🚨');
    console.log('===================================');

    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Database connected');

        // Load reminder service
        const reminderService = require('./services/reminderService');
        console.log('✅ Reminder service loaded');

        // Test medium priority alarm
        console.log('\n🔔 Testing MEDIUM priority alarm (should be loud and visible)...');
        console.log('👀 Watch for message box popup!');
        reminderService.playMediumPriorityAlarm();

        // Wait and test high priority
        setTimeout(() => {
            console.log('\n🚨 Testing HIGH priority alarm (should be very loud and urgent)...');
            console.log('👀 Watch for urgent message box popup!');
            reminderService.playHighPriorityAlarm();
        }, 8000);

        // Cleanup
        setTimeout(() => {
            console.log('\n🏁 Enhanced alarm test completed!');
            console.log('Did you hear sounds and see message boxes?');
            mongoose.disconnect();
            process.exit(0);
        }, 16000);

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

testEnhancedAlarms();