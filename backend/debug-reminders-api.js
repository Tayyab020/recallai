// Debug the reminders API to see why it's returning empty array
require('dotenv').config();
const mongoose = require('mongoose');
const Reminder = require('./models/Reminder');
const User = require('./models/User');

async function debugRemindersAPI() {
    console.log('🔍 DEBUGGING REMINDERS API');
    console.log('==========================');

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Database connected');

        // Check all reminders in database
        const allReminders = await Reminder.find({});
        console.log(`📊 Total reminders in database: ${allReminders.length}`);

        if (allReminders.length === 0) {
            console.log('❌ No reminders found in database at all!');
            return;
        }

        // Check all users
        const allUsers = await User.find({});
        console.log(`👥 Total users in database: ${allUsers.length}`);

        // Show user IDs and reminder user IDs
        console.log('\n🔍 USER ANALYSIS:');
        allUsers.forEach((user, index) => {
            console.log(`User ${index + 1}: ${user.email} (ID: ${user._id})`);
        });

        console.log('\n🔍 REMINDER ANALYSIS:');
        const userIdCounts = {};
        allReminders.forEach((reminder, index) => {
            const userId = reminder.userId.toString();
            userIdCounts[userId] = (userIdCounts[userId] || 0) + 1;

            console.log(`Reminder ${index + 1}: "${reminder.title}"`);
            console.log(`   User ID: ${userId}`);
            console.log(`   Created: ${reminder.createdAt}`);
            console.log('');
        });

        console.log('📊 REMINDERS BY USER:');
        Object.entries(userIdCounts).forEach(([userId, count]) => {
            const user = allUsers.find(u => u._id.toString() === userId);
            console.log(`${user ? user.email : 'Unknown User'} (${userId}): ${count} reminders`);
        });

        // Test the API query for each user
        console.log('\n🧪 TESTING API QUERIES:');
        for (const user of allUsers) {
            const userReminders = await Reminder.find({ userId: user._id })
                .sort({
                    isActive: -1,
                    triggerTime: 1
                });

            console.log(`API query for ${user.email}: ${userReminders.length} reminders`);

            if (userReminders.length > 0) {
                userReminders.forEach((reminder, index) => {
                    console.log(`  ${index + 1}. ${reminder.title} (${reminder.isActive ? 'Active' : 'Inactive'})`);
                });
            }
        }

        // Check if there's a user ID mismatch
        console.log('\n🔍 CHECKING FOR USER ID MISMATCHES:');
        const reminderUserIds = [...new Set(allReminders.map(r => r.userId.toString()))];
        const actualUserIds = allUsers.map(u => u._id.toString());

        console.log('Reminder User IDs:', reminderUserIds);
        console.log('Actual User IDs:', actualUserIds);

        const orphanedReminders = reminderUserIds.filter(id => !actualUserIds.includes(id));
        if (orphanedReminders.length > 0) {
            console.log('⚠️ Found orphaned reminders (user doesn\'t exist):');
            orphanedReminders.forEach(id => {
                const count = allReminders.filter(r => r.userId.toString() === id).length;
                console.log(`  User ID ${id}: ${count} reminders`);
            });
        }

    } catch (error) {
        console.error('❌ Debug failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🧹 Disconnected from database');
        process.exit(0);
    }
}

debugRemindersAPI();