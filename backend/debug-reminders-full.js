require('dotenv').config();
const mongoose = require('mongoose');
const cron = require('node-cron');

async function debugReminderSystem() {
    console.log('🔍 COMPREHENSIVE REMINDER SYSTEM DEBUG');
    console.log('=====================================');

    try {
        // Test 1: Basic cron functionality
        console.log('\n1️⃣ Testing basic cron functionality...');
        let cronWorked = false;
        const testCron = cron.schedule('*/2 * * * * *', () => {
            console.log('✅ Basic cron is working!', new Date().toISOString());
            cronWorked = true;
            testCron.destroy();
        }, { scheduled: false });

        testCron.start();

        // Wait 5 seconds to see if cron works
        await new Promise(resolve => setTimeout(resolve, 5000));

        if (!cronWorked) {
            console.log('❌ Basic cron is NOT working');
            return;
        }

        // Test 2: Database connection
        console.log('\n2️⃣ Testing database connection...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Database connected successfully');

        // Test 3: Load models
        console.log('\n3️⃣ Loading models...');
        const Reminder = require('./models/Reminder');
        const User = require('./models/User');
        console.log('✅ Models loaded successfully');

        // Test 4: Find or create test user
        console.log('\n4️⃣ Finding test user...');
        let testUser = await User.findOne();
        if (!testUser) {
            console.log('❌ No users found in database. Please create a user first.');
            return;
        }
        console.log(`✅ Using test user: ${testUser.email}`);

        // Test 5: Create test reminder directly
        console.log('\n5️⃣ Creating test reminder directly in database...');
        const testTime = new Date();
        testTime.setSeconds(testTime.getSeconds() + 8); // 8 seconds from now

        const testReminder = new Reminder({
            userId: testUser._id,
            title: 'DEBUG Test Reminder',
            description: 'This is a debug test reminder',
            type: 'ai-suggested',
            priority: 'high',
            category: 'general',
            triggerTime: testTime,
            isActive: true,
            sourceType: 'manual',
            metadata: {
                createdFromVoice: false,
                isTest: true,
                debug: true
            }
        });

        await testReminder.save();
        console.log(`✅ Test reminder created with ID: ${testReminder._id}`);
        console.log(`⏰ Will trigger at: ${testTime.toISOString()}`);
        console.log(`🕐 Current time: ${new Date().toISOString()}`);

        // Test 6: Create cron job manually
        console.log('\n6️⃣ Creating cron job manually...');
        const minute = testTime.getMinutes();
        const hour = testTime.getHours();
        const day = testTime.getDate();
        const month = testTime.getMonth() + 1;
        const cronExpression = `${minute} ${hour} ${day} ${month} *`;

        console.log(`📋 Cron expression: ${cronExpression}`);

        let alarmTriggered = false;
        const reminderCron = cron.schedule(cronExpression, async () => {
            console.log('\n🔔 ALARM TRIGGERED!');
            console.log('🎯 Test reminder alarm fired successfully!');
            console.log(`⏰ Triggered at: ${new Date().toISOString()}`);
            console.log(`📝 Reminder: ${testReminder.title}`);

            alarmTriggered = true;

            // Update reminder
            testReminder.lastTriggered = new Date();
            testReminder.triggerCount = (testReminder.triggerCount || 0) + 1;
            testReminder.isActive = false;
            testReminder.completedAt = new Date();
            await testReminder.save();

            console.log('✅ Reminder updated in database');
            reminderCron.destroy();
        }, { scheduled: false });

        reminderCron.start();
        console.log('✅ Cron job started and waiting...');

        // Test 7: Wait for alarm
        console.log('\n7️⃣ Waiting for alarm to trigger...');
        console.log('⏳ Please wait up to 15 seconds...');

        // Wait up to 15 seconds
        await new Promise(resolve => setTimeout(resolve, 15000));

        if (alarmTriggered) {
            console.log('\n🎉 SUCCESS! The reminder alarm system is working correctly!');
        } else {
            console.log('\n❌ FAILED! The alarm did not trigger. Possible issues:');
            console.log('   - Cron expression might be wrong');
            console.log('   - System time might be off');
            console.log('   - Cron library might not be working');
        }

        // Test 8: Load reminder service
        console.log('\n8️⃣ Testing reminder service...');
        try {
            const reminderService = require('./services/reminderService');
            console.log('✅ Reminder service loaded');

            // Test immediate trigger
            console.log('🧪 Testing immediate trigger...');
            await reminderService.testReminderNow(testReminder._id);
            console.log('✅ Immediate trigger test completed');
        } catch (serviceError) {
            console.log('❌ Reminder service error:', serviceError.message);
        }

    } catch (error) {
        console.error('❌ Debug failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🧹 Disconnected from database');
        console.log('🏁 Debug completed');
        process.exit(0);
    }
}

debugReminderSystem();