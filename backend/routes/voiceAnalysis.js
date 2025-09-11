const express = require('express');
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const aiController = require('../controllers/aiController');
const multer = require('multer');

const router = express.Router();

// Configure multer for audio file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow audio files
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Only audio files are allowed'), false);
        }
    }
});

// Analyze voice recording for reminders and events
router.post('/analyze-reminders', authMiddleware, upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No audio file provided' });
        }

        console.log('Received audio file for reminder analysis:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        // Analyze voice for reminders
        const analysisResult = await aiController.analyzeVoiceForReminders(
            req.file.buffer,
            req.file.mimetype
        );

        if (!analysisResult.success) {
            return res.status(500).json({
                message: 'Voice analysis failed',
                error: analysisResult.error
            });
        }

        // Optionally create reminders automatically
        const { createReminders = false } = req.body;
        let createdReminders = [];

        if (createReminders && analysisResult.analysis) {
            createdReminders = await aiController.createRemindersFromVoice(
                req.user._id,
                analysisResult.analysis
            );
        }

        res.json({
            message: 'Voice analysis completed',
            analysis: analysisResult.analysis,
            createdReminders: createdReminders.length,
            reminders: createdReminders
        });

    } catch (error) {
        console.error('Voice analysis route error:', error);
        res.status(500).json({
            message: 'Voice analysis failed',
            error: error.message
        });
    }
});

// Transcribe and analyze voice in one step
router.post('/transcribe-analyze', authMiddleware, upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No audio file provided' });
        }

        console.log('Received audio file for transcription and analysis:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        // Transcribe and analyze voice
        const result = await aiController.transcribeAndAnalyzeVoice(
            req.file.buffer,
            req.file.mimetype
        );

        if (!result.success) {
            return res.status(500).json({
                message: 'Transcription and analysis failed',
                error: result.error
            });
        }

        // Optionally create reminders automatically
        const { createReminders = false } = req.body;
        let createdReminders = [];

        if (createReminders && result.analysis) {
            createdReminders = await aiController.createRemindersFromVoice(
                req.user._id,
                result.analysis
            );
        }

        res.json({
            message: 'Transcription and analysis completed',
            transcription: result.transcription,
            analysis: result.analysis,
            createdReminders: createdReminders.length,
            reminders: createdReminders
        });

    } catch (error) {
        console.error('Transcribe and analyze route error:', error);
        res.status(500).json({
            message: 'Transcription and analysis failed',
            error: error.message
        });
    }
});

// Analyze voice from base64 data (for existing transcription endpoint compatibility)
router.post('/analyze-base64', authMiddleware, [
    body('audioData').notEmpty().withMessage('Audio data is required'),
    body('mimeType').optional().isString()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { audioData, mimeType = 'audio/webm', createReminders = false } = req.body;

        console.log('Received base64 audio for analysis:', {
            mimeType,
            dataLength: audioData.length,
            createReminders
        });

        // Convert base64 to buffer
        const audioBuffer = Buffer.from(audioData, 'base64');

        // Analyze voice for reminders
        const analysisResult = await aiController.analyzeVoiceForReminders(
            audioBuffer,
            mimeType
        );

        if (!analysisResult.success) {
            return res.status(500).json({
                message: 'Voice analysis failed',
                error: analysisResult.error
            });
        }

        // Optionally create reminders automatically
        let createdReminders = [];
        if (createReminders && analysisResult.analysis) {
            createdReminders = await aiController.createRemindersFromVoice(
                req.user._id,
                analysisResult.analysis
            );
        }

        res.json({
            message: 'Voice analysis completed',
            analysis: analysisResult.analysis,
            createdReminders: createdReminders.length,
            reminders: createdReminders
        });

    } catch (error) {
        console.error('Base64 voice analysis route error:', error);
        res.status(500).json({
            message: 'Voice analysis failed',
            error: error.message
        });
    }
});

// Create reminders from analysis results
router.post('/create-reminders', authMiddleware, [
    body('analysis').isObject().withMessage('Analysis object is required'),
    body('entryId').optional().isMongoId()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { analysis, entryId } = req.body;

        console.log('Creating reminders from analysis:', {
            userId: req.user._id,
            entryId,
            eventsCount: analysis.events?.length || 0,
            remindersCount: analysis.reminders?.length || 0
        });

        // Create reminders from analysis
        const createdReminders = await aiController.createRemindersFromVoice(
            req.user._id,
            analysis,
            entryId
        );

        res.json({
            message: `Created ${createdReminders.length} reminders`,
            reminders: createdReminders
        });

    } catch (error) {
        console.error('Create reminders route error:', error);
        res.status(500).json({
            message: 'Failed to create reminders',
            error: error.message
        });
    }
});

module.exports = router;