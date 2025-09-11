// Check all reminders in database including old ones
require('dotenv').config();
const mongoose = require('mongoose');
const Reminder = require('./models/Reminder');

async function checkAllReminders() {
    console.log('📋 CHECKING ALL REMINDERS IN DATABASE');
    console.log('====================================');

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Database connected');

        // Get all reminders without any filters
        const allReminders = await Reminder.find({}).sort({ createdAt: -1 });

        console.log(`📊 Total reminders found: ${allReminders.length}`);
        console.log('');

        if (allReminders.length === 0) {
            console.log('❌ No reminders found in database');
            return;
        }

        // Categorize reminders
        const now = new Date();
        const activeReminders = allReminders.filter(r => r.isActive);
        const inactiveReminders = allReminders.filter(r => !r.isActive);
        const futureReminders = allReminders.filter(r => new Date(r.triggerTime) > now);
        const pastReminders = allReminders.filter(r => new Date(r.triggerTime) <= now);

        console.log('📈 REMINDER STATISTICS:');
        console.log(`   Active: ${activeReminders.length}`);
        console.log(`   Inactive: ${inactiveReminders.length}`);
        console.log(`   Future: ${futureReminders.length}`);
        console.log(`   Past/Overdue: ${pastReminders.length}`);
        console.log('');

        console.log('📋 ALL REMINDERS:');
        console.log('=================');

        allReminders.forEach((reminder, index) => {
            const triggerTime = new Date(reminder.triggerTime);
            const isPast = triggerTime <= now;
            const status = reminder.isActive ? '🟢 Active' : '🔴 Inactive';
            const timeStatus = isPast ? '⏰ Past/Overdue' : '⏳ Future';

            console.log(`${index + 1}. ${reminder.title}`);
            console.log(`   ID: ${reminder._id}`);
            console.log(`   Status: ${status}`);
            console.log(`   Time: ${timeStatus} - ${triggerTime.toLocaleString()}`);
            console.log(`   Priority: ${reminder.priority}`);
            console.log(`   Category: ${reminder.category || 'general'}`);
            console.log(`   Created: ${new Date(reminder.createdAt).toLocaleString()}`);
            console.log(`   Last Triggered: ${reminder.lastTriggered ? new Date(reminder.lastTriggered).toLocaleString() : 'Never'}`);
            console.log(`   Trigger Count: ${reminder.triggerCount || 0}`);
            console.log('');
        });

        // Check what the API endpoint would return
        console.log('🔍 TESTING API ENDPOINT LOGIC:');
        console.log('==============================');

        // Simulate the API call for a specific user
        const firstReminder = allReminders[0];
        if (firstReminder) {
            const userReminders = await Reminder.find({ userId: firstReminder.userId })
                .sort({ nextTrigger: 1 });

            console.log(`📊 API would return ${userReminders.length} reminders for user ${firstReminder.userId}`);

            userReminders.forEach((reminder, index) => {
                const triggerTime = new Date(reminder.triggerTime);
                const isPast = triggerTime <= now;
                console.log(`   ${index + 1}. ${reminder.title} - ${isPast ? 'PAST' : 'FUTURE'} - ${triggerTime.toLocaleString()}`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🧹 Disconnected from database');
        process.exit(0);
    }
}

checkAllReminders();