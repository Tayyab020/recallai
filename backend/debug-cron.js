const cron = require('node-cron');

console.log('🧪 Testing cron functionality...');

// Test 1: Simple cron job that runs every 5 seconds
console.log('📅 Creating cron job that runs every 5 seconds...');
const testJob = cron.schedule('*/5 * * * * *', () => {
    console.log('🔔 CRON TEST: Job executed at', new Date().toISOString());
}, {
    scheduled: false
});

testJob.start();
console.log('✅ Cron job started - should see messages every 5 seconds');

// Test 2: Specific time cron job (10 seconds from now)
const futureTime = new Date();
futureTime.setSeconds(futureTime.getSeconds() + 10);

const minute = futureTime.getMinutes();
const hour = futureTime.getHours();
const day = futureTime.getDate();
const month = futureTime.getMonth() + 1;

const cronExpression = `${minute} ${hour} ${day} ${month} *`;
console.log(`📋 Creating specific time cron job: ${cronExpression}`);
console.log(`⏰ Should trigger at: ${futureTime.toISOString()}`);

const specificJob = cron.schedule(cronExpression, () => {
    console.log('🎯 SPECIFIC TIME CRON: Triggered at', new Date().toISOString());
    console.log('✅ Specific time cron job worked!');

    // Clean up and exit
    testJob.destroy();
    specificJob.destroy();
    console.log('🧹 Cleaned up cron jobs');
    process.exit(0);
}, {
    scheduled: false
});

specificJob.start();

// Exit after 30 seconds if nothing happens
setTimeout(() => {
    console.log('❌ Test timed out - cron jobs may not be working');
    testJob.destroy();
    specificJob.destroy();
    process.exit(1);
}, 30000);