// Assign existing reminders to a specific user
require('dotenv').config();
const mongoose = require('mongoose');
const Reminder = require('./models/Reminder');
const User = require('./models/User');

async function assignRemindersToUser() {
    console.log('🔄 ASSIGNING REMINDERS TO USER');
    console.log('==============================');

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Database connected');

        // Get all users
        const users = await User.find({});
        console.log('\n👥 Available users:');
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.email} (ID: ${user._id})`);
        });

        // Get all reminders
        const allReminders = await Reminder.find({});
        console.log(`\n📊 Total reminders: ${allReminders.length}`);

        // Find the user with most reminders
        const userWithReminders = users.find(u => u.email === 'tayyabhussain070@gmail.com');

        if (!userWithReminders) {
            console.log('❌ User tayyabhussain070@gmail.com not found');
            return;
        }

        console.log(`\n🎯 Target user: ${userWithReminders.email}`);

        // Check current reminders for this user
        const currentReminders = await Reminder.find({ userId: userWithReminders._id });
        console.log(`📊 Current reminders for ${userWithReminders.email}: ${currentReminders.length}`);

        if (currentReminders.length > 0) {
            console.log('✅ User already has reminders!');
            console.log('\n📋 Current reminders:');
            currentReminders.forEach((reminder, index) => {
                console.log(`  ${index + 1}. ${reminder.title} (${reminder.isActive ? 'Active' : 'Inactive'})`);
            });
        } else {
            console.log('⚠️ User has no reminders. This might be why the API returns empty.');

            // Option: Create a test reminder for this user
            console.log('\n🆕 Creating a test reminder for this user...');

            const testReminder = new Reminder({
                userId: userWithReminders._id,
                title: 'Welcome Test Reminder',
                description: 'This is a test reminder to verify the system is working',
                type: 'manual',
                priority: 'medium',
                category: 'general',
                triggerTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
                isActive: true,
                sourceType: 'manual',
                metadata: {
                    createdFromVoice: false,
                    isTest: true
                }
            });

            await testReminder.save();
            console.log('✅ Test reminder created successfully!');
        }

        // Show login instructions
        console.log('\n🔑 TO SEE REMINDERS IN FRONTEND:');
        console.log('================================');
        console.log('1. Make sure you are logged in as: tayyabhussain070@gmail.com');
        console.log('2. If not, logout and login with this email');
        console.log('3. Go to /reminders page');
        console.log('4. You should see the reminders');
        console.log('');
        console.log('💡 If you want to login as a different user, let me know!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🧹 Disconnected from database');
        process.exit(0);
    }
}

assignRemindersToUser();