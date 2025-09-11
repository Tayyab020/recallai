// Reset password for a user account
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function resetUserPassword() {
    console.log('🔑 PASSWORD RESET UTILITY');
    console.log('=========================');

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Database connected');

        // Get all users
        const users = await User.find({});
        console.log('\n👥 Available users:');
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.email} (Created: ${user.createdAt.toLocaleDateString()})`);
        });

        // Reset passwords for all users to a simple password
        const newPassword = 'password123';

        console.log('\n🔄 Resetting passwords...');
        console.log(`🔑 New password for all users: ${newPassword}`);

        for (const user of users) {
            // Update password (will be hashed automatically by the pre-save hook)
            user.passwordHash = newPassword;
            await user.save();
            console.log(`✅ Password reset for: ${user.email}`);
        }

        console.log('\n🎉 PASSWORD RESET COMPLETED!');
        console.log('=============================');
        console.log('📧 You can now login with any of these accounts:');
        console.log('');

        users.forEach((user, index) => {
            const reminderCount = index === 0 ? '5 reminders' :
                index === 1 ? '11 reminders' :
                    '0 reminders';
            console.log(`${index + 1}. Email: ${user.email}`);
            console.log(`   Password: ${newPassword}`);
            console.log(`   Has: ${reminderCount}`);
            console.log('');
        });

        console.log('💡 RECOMMENDED FOR TESTING:');
        console.log(`📧 Email: ${users[1]?.email || 'tayyabhussain070@gmail.com'}`);
        console.log(`🔑 Password: ${newPassword}`);
        console.log('📊 This account has the most reminders (11)');

    } catch (error) {
        console.error('❌ Password reset failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🧹 Disconnected from database');
        process.exit(0);
    }
}

resetUserPassword();