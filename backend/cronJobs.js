const cron = require('node-cron');
const Entry = require('./models/Entry');
const Reminder = require('./models/Reminder');
const User = require('./models/User');
const aiController = require('./controllers/aiController');
const webPush = require('web-push');

// Configure web push (only if VAPID keys are properly set)
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  try {
    webPush.setVapidDetails(
      'mailto:your-email@example.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
  } catch (error) {
    console.warn('VAPID keys not properly configured:', error.message);
    console.warn('Push notifications will be disabled until VAPID keys are set up correctly');
  }
} else {
  console.warn('VAPID keys not found in environment variables. Push notifications disabled.');
}

// Weekly summary generation (runs every Sunday at 9 AM)
cron.schedule('0 9 * * 0', async () => {
  console.log('Running weekly summary generation...');
  
  try {
    const users = await User.find({ 
      'preferences.weeklySummaries': true 
    });

    for (const user of users) {
      try {
        const summary = await aiController.generateWeeklySummary(user._id);
        
        // Send push notification with summary
        if (user.pushSubscription && user.preferences.pushNotifications) {
          const payload = JSON.stringify({
            title: 'Weekly Summary Ready',
            body: 'Your weekly journal summary is ready to view',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            data: {
              url: '/summaries',
              summary: summary.substring(0, 200) + '...'
            }
          });

          await webPush.sendNotification(user.pushSubscription, payload);
        }
        
        console.log(`Weekly summary generated for user ${user._id}`);
      } catch (error) {
        console.error(`Error generating summary for user ${user._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Weekly summary generation error:', error);
  }
});

// Reminder processing (runs every hour)
cron.schedule('0 * * * *', async () => {
  console.log('Processing reminders...');
  
  try {
    const now = new Date();
    const reminders = await Reminder.find({
      isActive: true,
      nextTrigger: { $lte: now }
    }).populate('userId');

    for (const reminder of reminders) {
      try {
        const user = reminder.userId;
        
        if (user.pushSubscription && user.preferences.pushNotifications) {
          const payload = JSON.stringify({
            title: reminder.title,
            body: reminder.description || 'Time for your reminder!',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            data: {
              reminderId: reminder._id,
              url: '/reminders'
            }
          });

          await webPush.sendNotification(user.pushSubscription, payload);
        }

        // Update reminder trigger times
        reminder.lastTriggered = new Date();
        reminder.nextTrigger = calculateNextTrigger(reminder.pattern?.frequency || 'daily');
        await reminder.save();
        
        console.log(`Reminder triggered for user ${user._id}: ${reminder.title}`);
      } catch (error) {
        console.error(`Error processing reminder ${reminder._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Reminder processing error:', error);
  }
});

// AI reminder suggestions (runs every Monday at 10 AM)
cron.schedule('0 10 * * 1', async () => {
  console.log('Generating AI reminder suggestions...');
  
  try {
    const users = await User.find({ 
      'preferences.pushNotifications': true 
    });

    for (const user of users) {
      try {
        const suggestions = await aiController.suggestReminders(user._id);
        
        if (suggestions.length > 0) {
          // Create suggested reminders
          for (const suggestion of suggestions.slice(0, 3)) { // Limit to 3 suggestions
            const existingReminder = await Reminder.findOne({
              userId: user._id,
              title: suggestion.title
            });

            if (!existingReminder) {
              const reminder = new Reminder(suggestion);
              await reminder.save();
            }
          }

          // Send notification about new suggestions
          if (user.pushSubscription) {
            const payload = JSON.stringify({
              title: 'New Reminder Suggestions',
              body: `We've found ${suggestions.length} patterns in your journal that might benefit from reminders`,
              icon: '/icons/icon-192x192.png',
              badge: '/icons/badge-72x72.png',
              data: {
                url: '/reminders'
              }
            });

            await webPush.sendNotification(user.pushSubscription, payload);
          }
        }
        
        console.log(`AI suggestions generated for user ${user._id}`);
      } catch (error) {
        console.error(`Error generating suggestions for user ${user._id}:`, error);
      }
    }
  } catch (error) {
    console.error('AI suggestion generation error:', error);
  }
});

// Helper function to calculate next trigger time
function calculateNextTrigger(frequency) {
  const now = new Date();
  
  switch (frequency) {
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case 'monthly':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
}

console.log('Cron jobs initialized');
