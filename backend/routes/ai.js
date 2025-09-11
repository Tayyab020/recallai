const express = require('express');
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const { checkVoiceEnabled, checkEmotionDetectionEnabled } = require('../middleware/preferences');
const aiController = require('../controllers/aiController');

const router = express.Router();

// Transcribe audio
router.post('/transcribe', authMiddleware, checkVoiceEnabled, [
  body('audioData').notEmpty(),
  body('mimeType').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { audioData, mimeType } = req.body;

    const result = await aiController.transcribeAudio(audioData, mimeType);

    // Handle both old format (string) and new format (object with analysis)
    if (typeof result === 'string') {
      res.json({
        transcription: result,
        message: 'Audio transcribed successfully'
      });
    } else {
      res.json({
        transcription: result.transcription,
        analysis: result.analysis,
        message: 'Audio transcribed and analyzed successfully'
      });
    }
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ message: 'Transcription failed' });
  }
});

// Detect emotion in text
router.post('/emotion', authMiddleware, checkEmotionDetectionEnabled, [
  body('text').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { text } = req.body;

    const emotionData = await aiController.detectEmotion(text);

    res.json({
      emotion: emotionData,
      message: 'Emotion detected successfully'
    });
  } catch (error) {
    console.error('Emotion detection error:', error);
    res.status(500).json({ message: 'Emotion detection failed' });
  }
});

// Generate summary
router.post('/summarize', authMiddleware, [
  body('text').notEmpty().trim(),
  body('type').optional().isIn(['daily', 'weekly', 'monthly'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { text, type = 'daily' } = req.body;

    const summary = await aiController.generateSummary(text, type);

    res.json({
      summary,
      type,
      message: 'Summary generated successfully'
    });
  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({ message: 'Summary generation failed' });
  }
});

// Q&A over entries
router.post('/qa', authMiddleware, [
  body('question').notEmpty().trim(),
  body('context').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { question, context = [] } = req.body;

    const answer = await aiController.answerQuestion(req.user._id, question, context);

    res.json({
      answer,
      question,
      message: 'Question answered successfully'
    });
  } catch (error) {
    console.error('Q&A error:', error);
    res.status(500).json({ message: 'Q&A processing failed' });
  }
});

// Generate reminders based on patterns
router.post('/reminders/suggest', authMiddleware, async (req, res) => {
  try {
    const suggestions = await aiController.suggestReminders(req.user._id);

    res.json({
      suggestions,
      message: 'Reminder suggestions generated successfully'
    });
  } catch (error) {
    console.error('Reminder suggestion error:', error);
    res.status(500).json({ message: 'Reminder suggestion failed' });
  }
});

module.exports = router;
