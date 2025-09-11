const express = require('express');
const { body, validationResult } = require('express-validator');
const Entry = require('../models/Entry');
const { authMiddleware,  } = require('../middleware/auth');
const aiController = require('../controllers/aiController');

const router = express.Router();

// Get all entries for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, mood, tags } = req.query;
    const skip = (page - 1) * limit;

    let query = { userId: req.user._id };

    if (mood) {
      query.mood = mood;
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    const entries = await Entry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Decrypt entries
    const decryptedEntries = entries.map(entry => ({
      ...entry.toObject(),
      text: entry.decryptText()
    }));

    const total = await Entry.countDocuments(query);

    res.json({
      entries: decryptedEntries,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single entry
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await Entry.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({
      ...entry.toObject(),
      text: entry.decryptText()
    });
  } catch (error) {
    console.error('Get entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new entry
router.post('/', authMiddleware, [
  body('text').optional().trim(),
  body('description').optional().trim(),
  body('voiceUrl').optional().custom(value => {
    // Allow null, undefined, empty string, or valid URLs (including blob URLs)
    if (!value || value === '' || value.startsWith('http://') || value.startsWith('https://') || value.startsWith('blob:')) {
      return true;
    }
    throw new Error('Invalid URL format');
  }),
  body('tags').optional().isArray(),
  // Custom validation to ensure at least one content type is provided
  body().custom((value, { req }) => {
    const hasText = req.body.text && req.body.text.trim();
    const hasDescription = req.body.description && req.body.description.trim();
    const hasVoice = req.body.voiceUrl && req.body.voiceUrl.trim();

    if (!hasText && !hasDescription && !hasVoice) {
      throw new Error('Entry must have text, description, or voice content');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { text, description, voiceUrl, tags = [] } = req.body;

    console.log('Creating entry with data:', {
      text: text?.substring(0, 50) + '...',
      textLength: text?.length,
      description: description?.substring(0, 50) + '...',
      descriptionLength: description?.length,
      voiceUrl,
      tags,
      userId: req.user._id
    });

    // Create entry
    const entry = new Entry({
      userId: req.user._id,
      text: text || '',
      description: description || '',
      voiceUrl,
      tags
    });

    console.log('Entry created, before save:', {
      text: entry.text?.substring(0, 50) + '...',
      textLength: entry.text?.length,
      encryptedText: entry.encryptedText ? 'exists' : 'missing',
      isNew: entry.isNew,
      isModified: entry.isModified('text')
    });

    console.log('Calling entry.save()...');
    try {
      await entry.save();
    } catch (saveError) {
      console.error('Entry save failed:', saveError);
      if (saveError.message.includes('encryptedText')) {
        return res.status(500).json({
          message: 'Failed to encrypt entry data. Please try again.'
        });
      }
      throw saveError;
    }

    console.log('Entry saved successfully:', {
      id: entry._id,
      text: entry.text?.substring(0, 50) + '...',
      encryptedText: entry.encryptedText ? 'exists (' + entry.encryptedText.length + ' chars)' : 'missing'
    });

    // Process with AI if enabled
    if (req.user.preferences.emotionDetection) {
      try {
        const emotionData = await aiController.detectEmotion(text);
        entry.mood = emotionData.mood;
        entry.emotionScore = emotionData.score;
        await entry.save();
      } catch (aiError) {
        console.error('Emotion detection error:', aiError);
        // Continue without emotion detection
      }
    }

    // Analyze voice for reminders if audio is provided
    let voiceAnalysisResult = null;
    let createdReminders = [];

    if (voiceUrl && voiceUrl.startsWith('blob:') && req.body.audioData) {
      try {
        console.log('Analyzing voice recording for reminders...');

        // Convert base64 audio to buffer
        const audioBuffer = Buffer.from(req.body.audioData, 'base64');

        // Analyze voice for reminders
        voiceAnalysisResult = await aiController.analyzeVoiceForReminders(
          audioBuffer,
          req.body.mimeType || 'audio/webm'
        );

        if (voiceAnalysisResult.success && voiceAnalysisResult.analysis) {
          // Create reminders from analysis
          createdReminders = await aiController.createRemindersFromVoice(
            req.user._id,
            voiceAnalysisResult.analysis,
            entry._id
          );

          console.log(`Created ${createdReminders.length} reminders from voice analysis`);
        }
      } catch (voiceError) {
        console.error('Voice analysis error:', voiceError);
        // Continue without voice analysis
      }
    }

    res.status(201).json({
      message: 'Entry created successfully',
      entry: {
        ...entry.toObject(),
        text: entry.decryptText()
      },
      voiceAnalysis: voiceAnalysisResult ? {
        success: voiceAnalysisResult.success,
        remindersFound: voiceAnalysisResult.analysis?.reminders?.length || 0,
        eventsFound: voiceAnalysisResult.analysis?.events?.length || 0,
        summary: voiceAnalysisResult.analysis?.summary
      } : null,
      createdReminders: createdReminders.length,
      reminders: createdReminders.map(r => ({
        id: r._id,
        title: r.title,
        triggerTime: r.triggerTime,
        priority: r.priority
      }))
    });
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update entry
router.put('/:id', authMiddleware, [
  body('text').optional().notEmpty().trim(),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const entry = await Entry.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    const { text, tags } = req.body;

    if (text) {
      entry.text = text;
    }

    if (tags) {
      entry.tags = tags;
    }

    await entry.save();

    res.json({
      message: 'Entry updated successfully',
      entry: {
        ...entry.toObject(),
        text: entry.decryptText()
      }
    });
  } catch (error) {
    console.error('Update entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete entry
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search entries
router.post('/search', authMiddleware, [
  body('query').notEmpty().trim(),
  body('filters').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { query, filters = {} } = req.body;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Use AI for semantic search
    const searchResults = await aiController.searchEntries(req.user._id, query, filters);

    res.json({
      results: searchResults,
      query,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(searchResults.length / limit),
        total: searchResults.length
      }
    });
  } catch (error) {
    console.error('Search entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get weekly summary
router.get('/summary/weekly', authMiddleware, async (req, res) => {
  try {
    const { week } = req.query;

    const summary = await aiController.generateWeeklySummary(req.user._id, week);

    res.json({
      summary
    });
  } catch (error) {
    console.error('Get weekly summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
