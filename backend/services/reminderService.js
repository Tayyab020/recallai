const Reminder = require('../models/Reminder');
const cron = require('node-cron');
const webpush = require('web-push');

class ReminderService {
  constructor() {
    this.activeReminders = new Map();
    this.initialized = false;
    this.initializeWebPush();
    this.initialize();
  }

  async initialize() {
    try {
      console.log('🚀 Initializing Reminder Service...');
      await this.loadActiveReminders();
      this.initialized = true;
      console.log('✅ Reminder Service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Reminder Service:', error);
    }
  }

  initializeWebPush() {
    if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      try {
        webpush.setVapidDetails(
          'mailto:your-email@example.com',
          process.env.VAPID_PUBLIC_KEY,
          process.env.VAPID_PRIVATE_KEY
        );
        console.log('✅ WebPush VAPID details configured successfully');
      } catch (error) {
        console.error('❌ Error setting WebPush VAPID details:', error);
      }
    } else {
      console.warn('⚠️ VAPID keys not found in environment variables. Push notifications disabled.');
    }
  }

  /**
   * Test a reminder immediately (for debugging)
   * @param {string} reminderId - Reminder ID
   */
  async testReminderNow(reminderId) {
    console.log(`🧪 Testing reminder ${reminderId} immediately...`);
    const reminder = await Reminder.findById(reminderId);
    await this.triggerReminder(reminder);
  }

  /**
   * Create reminders from voice analysis results
   * @param {string} userId - User ID
   * @param {Object} analysisResult - Analysis result from voice service
   * @param {string} entryId - Associated journal entry ID
   * @returns {Array} Created reminders
   */
  async createRemindersFromAnalysis(userId, analysisResult, entryId = null) {
    try {
      const createdReminders = [];
      const { events = [], tasks = [], deadlines = [], reminders = [] } = analysisResult;

      // Process events
      for (const event of events) {
        const reminder = await this.createReminderFromAnalysisItem(userId, event, 'event', entryId);
        if (reminder) {
          createdReminders.push(reminder);
        }
      }

      // Process tasks
      for (const task of tasks) {
        const reminder = await this.createReminderFromAnalysisItem(userId, task, 'task', entryId);
        if (reminder) {
          createdReminders.push(reminder);
        }
      }

      // Process deadlines
      for (const deadline of deadlines) {
        const reminder = await this.createReminderFromAnalysisItem(userId, deadline, 'deadline', entryId);
        if (reminder) {
          createdReminders.push(reminder);
        }
      }

      // Process reminders (legacy format support)
      for (const reminderItem of reminders) {
        const reminder = await this.createReminderFromAnalysisItem(userId, reminderItem, 'reminder', entryId);
        if (reminder) {
          createdReminders.push(reminder);
        }
      }

      console.log(`Created ${createdReminders.length} reminders from voice analysis`);
      return createdReminders;

    } catch (error) {
      console.error('Error creating reminders from analysis:', error);
      return [];
    }
  }

  /**
   * Create a single reminder from analysis item
   * @param {string} userId - User ID
   * @param {Object} item - Analysis item (event or reminder)
   * @param {string} type - Type (event or reminder)
   * @param {string} entryId - Associated journal entry ID
   * @returns {Object} Created reminder
   */
  async createReminderFromAnalysisItem(userId, item, type, entryId) {
    try {
      // Parse suggested date/time from new JSON structure
      let triggerTime = null;

      // Handle new JSON structure (datetime, due_time, reminder_time)
      if (item.datetime) {
        triggerTime = new Date(item.datetime);
      } else if (item.due_time) {
        triggerTime = new Date(item.due_time);
      } else if (item.reminder_time) {
        triggerTime = new Date(item.reminder_time);
      } else if (item.suggestedDateTime) {
        // Legacy format support
        triggerTime = new Date(item.suggestedDateTime);
      } else {
        // Default to 1 hour from now if no time specified
        triggerTime = new Date();
        triggerTime.setHours(triggerTime.getHours() + 1);
      }

      // If the suggested time is in the past, schedule for tomorrow at the same time
      if (triggerTime < new Date()) {
        triggerTime.setDate(triggerTime.getDate() + 1);
      }

      const reminderData = {
        userId,
        title: item.title,
        description: item.description || '',
        type: 'ai-suggested',
        priority: item.priority || 'medium',
        category: item.category || 'general',
        triggerTime,
        isActive: true,
        sourceType: 'voice-analysis',
        sourceEntryId: entryId,
        metadata: {
          originalAnalysis: item,
          analysisType: type,
          createdFromVoice: true
        }
      };

      const reminder = new Reminder(reminderData);
      await reminder.save();

      // Schedule the reminder
      this.scheduleReminder(reminder);

      console.log(`Created ${type} reminder:`, {
        id: reminder._id,
        title: reminder.title,
        triggerTime: reminder.triggerTime
      });

      return reminder;

    } catch (error) {
      console.error('Error creating reminder from analysis item:', error);
      return null;
    }
  }

  /**
   * Schedule a reminder for execution
   * @param {Object} reminder - Reminder document
   */
  scheduleReminder(reminder) {
    try {
      const now = new Date();
      const triggerTime = new Date(reminder.triggerTime);

      console.log(`📅 Scheduling reminder "${reminder.title}"`);
      console.log(`⏰ Current time: ${now.toISOString()}`);
      console.log(`🎯 Trigger time: ${triggerTime.toISOString()}`);

      // Check if time has passed
      if (triggerTime <= now) {
        console.log(`⚠️ Reminder time has passed, triggering immediately: ${reminder.title}`);
        // Trigger immediately if time has passed
        setTimeout(() => this.triggerReminder(reminder._id), 1000);
        return;
      }

      // Create cron expression for the specific time
      const cronExpression = this.createCronExpression(triggerTime);
      console.log(`📋 Cron expression: ${cronExpression}`);

      const task = cron.schedule(cronExpression, async () => {
        console.log(`🔔 Cron job executing for reminder: ${reminder.title}`);
        await this.triggerReminder(reminder._id);
        // Remove from active reminders after triggering
        this.activeReminders.delete(reminder._id.toString());
        task.destroy();
      }, {
        scheduled: false
        // Use system timezone instead of UTC
      });

      task.start();
      this.activeReminders.set(reminder._id.toString(), task);

      console.log(`✅ Reminder "${reminder.title}" scheduled successfully`);
      console.log(`📊 Total active reminders: ${this.activeReminders.size}`);

    } catch (error) {
      console.error('❌ Error scheduling reminder:', error);
    }
  }

    /**
     * Calculate next trigger time for recurring reminders
     * @param {Date} currentTrigger - Current trigger time
     * @param {Object} pattern - Recurrence pattern
     * @returns {Date} Next trigger time
     */
    calculateNextTrigger(currentTrigger, pattern) {
        const next = new Date(currentTrigger);

        switch (pattern.frequency) {
            case 'daily':
                next.setDate(next.getDate() + 1);
                break;
            case 'weekly':
                next.setDate(next.getDate() + 7);
                break;
            case 'monthly':
                next.setMonth(next.getMonth() + 1);
                break;
            case 'yearly':
                next.setFullYear(next.getFullYear() + 1);
                break;
            default:
                // Default to daily if unknown frequency
                next.setDate(next.getDate() + 1);
        }

        return next;
    }

    /**
     * Play system sound for alarm
     * @param {string} priority - Reminder priority (high, medium, low)
     */
    playSystemSound(priority = 'medium') {
        try {
            console.log(`🔊 Playing ${priority} priority alarm sound...`);

            // Play custom remind.mp3 file
            this.playCustomAlarmSound(priority);

        } catch (error) {
            console.error('Error playing system sound:', error);
        }
    }

    /**
     * Play custom alarm sound using remind.mp3
     * @param {string} priority - Reminder priority
     */
    playCustomAlarmSound(priority = 'medium') {
        const { exec } = require('child_process');
        const path = require('path');

        // Path to the custom remind.mp3 file
        const audioPath = path.join(__dirname, '../../frontend/public/remind.mp3');

        console.log(`🎵 Playing custom remind.mp3 alarm for ${priority} priority...`);
        console.log(`📁 Audio file path: ${audioPath}`);

        // Method 1: Play using Windows Media Player
        const wmplayerCommand = `powershell -c "Start-Process 'wmplayer.exe' -ArgumentList '${audioPath}' -WindowStyle Hidden"`;

        exec(wmplayerCommand, (error) => {
            if (error) {
                console.log('⚠️ Windows Media Player failed, trying alternative...');
                this.playAlternativeSound(audioPath, priority);
            } else {
                console.log('✅ Custom remind.mp3 played with Windows Media Player');
            }
        });

        // Method 2: Also show visual alert based on priority
        setTimeout(() => {
            this.showVisualAlert(priority);
        }, 500);

        // Method 3: Play additional beeps for high priority
        if (priority === 'high') {
            setTimeout(() => {
                exec('powershell -c "for($i=0; $i -lt 3; $i++) { [console]::beep(1200,400); Start-Sleep -Milliseconds 300 }"');
            }, 1000);
        }
    }

    /**
     * Play alternative sound methods if MP3 fails
     */
    playAlternativeSound(audioPath, priority) {
        const { exec } = require('child_process');

        // Try PowerShell with SoundPlayer for MP3
        const psCommand = `powershell -c "
            try {
                Add-Type -AssemblyName presentationCore;
                $mediaPlayer = New-Object system.windows.media.mediaplayer;
                $mediaPlayer.open('${audioPath}');
                $mediaPlayer.Play();
                Start-Sleep -Seconds 3;
                $mediaPlayer.Stop();
                Write-Host 'MP3 played successfully';
            } catch {
                Write-Host 'MP3 failed, using beep fallback';
                [console]::beep(800,1000);
                [console]::beep(1000,1000);
                [console]::beep(800,1000);
            }
        "`;

        exec(psCommand, (error, stdout, stderr) => {
            if (error) {
                console.log('⚠️ MP3 playback failed, using console beep fallback');
                exec('powershell -c "[console]::beep(800,1000); [console]::beep(1000,1000); [console]::beep(800,1000);"');
            } else {
                console.log('✅ Custom remind.mp3 played with PowerShell MediaPlayer');
                console.log('📊 Output:', stdout.trim());
            }
        });
    }

    /**
     * Show visual alert based on priority
     */
    showVisualAlert(priority) {
        const { exec } = require('child_process');

        let title, message, icon;

        switch (priority) {
            case 'high':
                title = '🚨 URGENT REMINDER ALERT';
                message = 'High priority reminder is active!\\n\\nPlease check your reminders immediately.';
                icon = 'Error';
                break;
            case 'medium':
                title = '🔔 Reminder Alert';
                message = 'You have a reminder notification.\\n\\nClick OK to acknowledge.';
                icon = 'Exclamation';
                break;
            case 'low':
                title = '🔕 Gentle Reminder';
                message = 'Friendly reminder notification.\\n\\nClick OK when ready.';
                icon = 'Information';
                break;
            default:
                title = '🔔 Reminder Alert';
                message = 'You have a reminder notification.';
                icon = 'Exclamation';
        }

        const messageBox = `powershell -c "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('${message}', '${title}', 'OK', '${icon}')"`;

        exec(messageBox, (error) => {
            if (error) {
                console.log('⚠️ Visual alert failed:', error.message);
            } else {
                console.log(`✅ ${priority} priority visual alert displayed`);
            }
        });
    }


    /**
     * Send push notification
     * @param {Object} subscription - Push subscription
     * @param {Object} payload - Notification payload
     */
    async sendPushNotification(subscription, payload) {
        try {
            await webpush.sendNotification(subscription, JSON.stringify(payload));
            console.log('Push notification sent successfully');
        } catch (error) {
            console.error('Error sending push notification:', error);
        }
    }

    /**
     * Load and schedule all active reminders on service start
     */
    async loadActiveReminders() {
        try {
            console.log('📋 Loading active reminders from database...');

            const activeReminders = await Reminder.find({
                isActive: true,
                triggerTime: { $gt: new Date() }
            });

            console.log(`📊 Found ${activeReminders.length} active reminders to schedule`);

            if (activeReminders.length === 0) {
                console.log('ℹ️ No active reminders found. Create some reminders to test the alarm system.');
            }

            for (const reminder of activeReminders) {
                console.log(`📅 Loading reminder: "${reminder.title}" scheduled for ${reminder.triggerTime}`);
                this.scheduleReminder(reminder);
            }

            console.log(`✅ Successfully loaded and scheduled ${activeReminders.length} reminders`);

        } catch (error) {
            console.error('❌ Error loading active reminders:', error);
        }
    }

    /**
    * Sends a push notification for a given reminder.
    * @param {Object} reminder - The reminder object.
    */
    async sendReminderNotification(reminder) {
        try {
             if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
                console.error('VAPID keys not found in environment variables. Push notifications disabled.');
                return;
            }

            if (!reminder) {
              console.log('Reminder not found or inactive');
              return;
            }

            const user = await require('../models/User').findById(reminder.userId);

            if (!user || !user.pushSubscription) {
                console.log('User or push subscription not found');
                return;
            }

            const payload = JSON.stringify({
                title: reminder.title,
                body: reminder.description || 'Time for your reminder!',
                icon: '/icons/icon-192x192.png',
                badge: '/icons/badge-72x72.png',
                data: {
                    reminderId: reminder._id,
                    type: 'reminder',
                    url: '/reminders'
                }
            });

            await webpush.sendNotification(user.pushSubscription, payload);
            console.log('Reminder push notification sent successfully');
        } catch (error) {
            console.error('Error sending reminder push notification:', error);
        }
    }

    /**
     * Cancel a scheduled reminder
     * @param {string} reminderId - Reminder ID
     */
    cancelReminder(reminderId) {
        const task = this.activeReminders.get(reminderId);
        if (task) {
            task.destroy();
            this.activeReminders.delete(reminderId);
            console.log(`Cancelled reminder: ${reminderId}`);
        }
    }

    /**
     * Reschedule a reminder with new time
     * @param {string} reminderId - Reminder ID
     * @param {Date} newTriggerTime - New trigger time
     */
    async rescheduleReminder(reminderId, newTriggerTime) {
        try {
            // Cancel existing schedule
            this.cancelReminder(reminderId);

            // Update reminder in database
            const reminder = await Reminder.findByIdAndUpdate(
                reminderId,
                { triggerTime: newTriggerTime },
                { new: true }
            );

            if (reminder) {
                // Schedule with new time
                this.scheduleReminder(reminder);
                console.log(`Rescheduled reminder "${reminder.title}" to ${newTriggerTime}`);
            }

        } catch (error) {
            console.error('Error rescheduling reminder:', error);
        }
    }
}

module.exports = new ReminderService();