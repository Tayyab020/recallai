// Test the custom remind.mp3 alarm system
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

async function testCustomAlarm() {
    console.log('🎵 TESTING CUSTOM REMIND.MP3 ALARM 🎵');
    console.log('=====================================');

    try {
        // Check if remind.mp3 exists
        const audioPath = path.join(__dirname, '../frontend/public/remind.mp3');
        console.log(`📁 Checking audio file: ${audioPath}`);

        const fs = require('fs');
        if (fs.existsSync(audioPath)) {
            console.log('✅ remind.mp3 file found!');
        } else {
            console.log('❌ remind.mp3 file not found!');
            return;
        }

        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Database connected');

        // Load reminder service
        const reminderService = require('./services/reminderService');
        console.log('✅ Reminder service loaded');

        // Test all priority levels with custom sound
        console.log('\n🔕 Testing LOW priority custom alarm...');
        reminderService.playCustomAlarmSound('low');

        setTimeout(() => {
            console.log('\n🔔 Testing MEDIUM priority custom alarm...');
            reminderService.playCustomAlarmSound('medium');
        }, 5000);

        setTimeout(() => {
            console.log('\n🚨 Testing HIGH priority custom alarm...');
            reminderService.playCustomAlarmSound('high');
        }, 10000);

        // Cleanup
        setTimeout(() => {
            console.log('\n🏁 Custom alarm test completed!');
            console.log('Did you hear the remind.mp3 sound and see message boxes?');
            mongoose.disconnect();
            process.exit(0);
        }, 18000);

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

testCustomAlarm();