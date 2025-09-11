const express = require('express');
const { body, validationResult } = require('express-validator');
const Reminder = require('../models/Reminder');
const { authMiddleware } = require('../middleware/auth');
const reminderService = require('../services/reminderService');

const router = express.Router();

// Get all reminders for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Get ALL reminders for the user, including past ones
    const reminders = await Reminder.find({ userId: req.user._id })
      .sort({
        isActive: -1,        // Active reminders first
        triggerTime: 1       // Then sort by trigger time (earliest first)
      });

    console.log(`📊 API Request: User ${req.user.email} (ID: ${req.user._id})`);
    console.log(`📊 Found ${reminders.length} reminders for this user`);

    if (reminders.length > 0) {
      console.log('📋 Reminders found:');
      reminders.forEach((reminder, index) => {
        console.log(`  ${index + 1}. ${reminder.title} (${reminder.isActive ? 'Active' : 'Inactive'})`);
      });
    } else {
      console.log('⚠️ No reminders found for this user');
    }

    res.json({ reminders });
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new reminder
router.post('/', authMiddleware, [
  body('title').notEmpty().trim(),
  body('description').optional().trim(),
  body('type').isIn(['pattern', 'manual', 'ai-suggested']),
  body('pattern').optional().isObject(),
  body('priority').optional().isIn(['low', 'medium', 'high'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, type, pattern, priority = 'medium' } = req.body;

    // Calculate next trigger time
    const nextTrigger = reminderService.calculateNextTrigger(new Date(), pattern);

    const reminder = new Reminder({
      userId: req.user._id,
      title,
      description,
      type,
      pattern,
      priority,
      nextTrigger
    });

    await reminder.save();

    res.status(201).json({
      message: 'Reminder created successfully',
      reminder
    });
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update reminder
router.put('/:id', authMiddleware, [
  body('title').optional().notEmpty().trim(),
  body('description').optional().trim(),
  body('isActive').optional().isBoolean(),
  body('priority').optional().isIn(['low', 'medium', 'high'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    const { title, description, isActive, priority } = req.body;

    if (title) reminder.title = title;
    if (description !== undefined) reminder.description = description;
    if (isActive !== undefined) reminder.isActive = isActive;
    if (priority) reminder.priority = priority;

    await reminder.save();

    res.json({
      message: 'Reminder updated successfully',
      reminder
    });
  } catch (error) {
    console.error('Update reminder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete reminder
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send test notification
router.post('/test-notification', authMiddleware, async (req, res) => {
  try {
     if (!req.user.pushSubscription) {
      return res.status(400).json({ message: 'No push subscription found' });
    }

    const payload = JSON.stringify({
      title: 'Recall.AI Test',
      body: 'This is a test notification from Recall.AI',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: {
        url: '/reminders'
      }
    });

     await reminderService.sendPushNotification(req.user.pushSubscription, payload);

    res.json({ message: 'Test notification sent successfully' });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
});

// Trigger reminder (for cron job)
router.post('/trigger/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder || !reminder.isActive) {
      return res.status(404).json({ message: 'Reminder not found or inactive' });
    }

     await reminderService.sendReminderNotification(reminder);


    res.json({ message: 'Reminder triggered successfully' });
  } catch (error) {
    console.error('Trigger reminder error:', error);
    res.status(500).json({ message: 'Failed to trigger reminder' });
  }
});

// Test reminder immediately (for debugging)
router.post('/test/:id', authMiddleware, async (req, res) => {
  try {
    await reminderService.testReminderNow(req.params.id);

    res.json({
      message: 'Test reminder triggered immediately',
      reminderId: req.params.id
    });
  } catch (error) {
    console.error('Test reminder error:', error);
    res.status(500).json({ message: 'Failed to test reminder' });
  }
});

// Create a test reminder that triggers in 30 seconds
router.post('/create-test', authMiddleware, async (req, res) => {
  try {
    const testReminder = await reminderService.createTestReminder(req.user._id);

    if (testReminder) {
      res.json({
        message: 'Test reminder created and will trigger in 30 seconds - watch server console!',
        reminder: {
          id: testReminder._id,
          title: testReminder.title,
          triggerTime: testReminder.triggerTime,
          description: testReminder.description
        },
        instructions: 'Watch the server console for alarm notifications in 30 seconds'
      });
    } else {
      res.status(500).json({ message: 'Failed to create test reminder' });
    }
  } catch (error) {
    console.error('Create test reminder error:', error);
    res.status(500).json({ message: 'Failed to create test reminder' });
  }
});

// Create an immediate test reminder (triggers in 5 seconds)
router.post('/create-immediate-test', authMiddleware, async (req, res) => {
  try {
    const Reminder = require('../models/Reminder');

    const testTime = new Date();
    testTime.setSeconds(testTime.getSeconds() + 5); // 5 seconds from now

    console.log(`🧪 Creating IMMEDIATE test reminder for ${req.user.email}`);
    console.log(`⏰ Current time: ${new Date().toISOString()}`);
    console.log(`🎯 Will trigger at: ${testTime.toISOString()}`);

    const testReminder = new Reminder({
      userId: req.user._id,
      title: 'IMMEDIATE Test Alarm - 5 Seconds!',
      description: 'This alarm should trigger in 5 seconds - watch the console!',
      type: 'ai-suggested',
      priority: 'high',
      category: 'general',
      triggerTime: testTime,
      isActive: true,
      sourceType: 'manual',
      metadata: {
        createdFromVoice: false,
        isTest: true,
        immediate: true
      }
    });

    await testReminder.save();
    console.log(`💾 Immediate test reminder saved with ID: ${testReminder._id}`);

    reminderService.scheduleReminder(testReminder);

    res.json({
      message: 'IMMEDIATE test reminder created - will trigger in 5 seconds! Watch the server console for alarm notifications.',
      reminder: {
        id: testReminder._id,
        title: testReminder.title,
        triggerTime: testTime.triggerTime,
        description: testReminder.description
      },
      currentTime: new Date().toISOString(),
      triggerTime: testTime.toISOString(),
      instructions: 'Watch server console for: 🔔 ALARM TRIGGERED messages'
    });
  } catch (error) {
    console.error('Create immediate test reminder error:', error);
    res.status(500).json({ message: 'Failed to create immediate test reminder' });
  }
});

// Get reminder service status
router.get('/status', authMiddleware, async (req, res) => {
  try {
    res.json({
      message: 'Reminder service status',
      activeReminders: reminderService.activeReminders.size,
      vapidConfigured: reminderService.initialized,
      userHasPushSubscription: !!req.user.pushSubscription
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ message: 'Failed to get status' });
  }
});



module.exports = router;
