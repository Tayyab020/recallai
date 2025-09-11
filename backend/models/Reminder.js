const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['pattern', 'manual', 'ai-suggested'],
    default: 'manual'
  },
  pattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly', 'once', 'custom']
    },
    daysOfWeek: [{
      type: Number,
      min: 0,
      max: 6
    }],
    time: {
      type: String,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    customPattern: String
  },
  triggerTime: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  soundEnabled: {
    type: Boolean,
    default: true
  },
  customSound: {
    type: String,
    default: 'remind.mp3'
  },
  lastTriggered: {
    type: Date,
    default: null
  },
  nextTrigger: {
    type: Date
  },
  triggerCount: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'health', 'family', 'finance', 'education', 'general'],
    default: 'general'
  },
  sourceType: {
    type: String,
    enum: ['manual', 'voice-analysis', 'text-analysis', 'calendar-import'],
    default: 'manual'
  },
  sourceEntryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entry'
  },
  metadata: {
    originalAnalysis: mongoose.Schema.Types.Mixed,
    analysisType: String,
    createdFromVoice: Boolean,
    confidence: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
reminderSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient queries
reminderSchema.index({ userId: 1, nextTrigger: 1 });
reminderSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);
