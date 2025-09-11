const mongoose = require('mongoose');
const crypto = require('crypto-js');

// Test encryption on module load
console.log('Loading Entry model...');
try {
  const testKey = 'test-key';
  const testText = 'test-text';
  const encrypted = crypto.AES.encrypt(testText, testKey).toString();
  const decrypted = crypto.AES.decrypt(encrypted, testKey).toString(crypto.enc.Utf8);
  console.log('Crypto-js test successful:', {
    encrypted: !!encrypted,
    decrypted: decrypted === testText,
    encryptedLength: encrypted.length
  });
} catch (error) {
  console.error('Crypto-js test failed:', error);
  throw error; // Fail fast if encryption doesn't work
}

const entrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: false,
    default: ''
  },
  description: {
    type: String,
    required: false,
    default: ''
  },
  encryptedText: {
    type: String,
    required: false
  },
  voiceUrl: {
    type: String,
    default: null
  },
  transcription: {
    type: String,
    default: null
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'anxious', 'calm', 'excited', 'neutral'],
    default: 'neutral'
  },
  emotionScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5
  },
  summary: {
    type: String,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  isEncrypted: {
    type: Boolean,
    default: true
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

// Pre-save hook for timestamp and encryption
entrySchema.pre('save', function (next) {
  console.log('Pre-save hook triggered for entry');

  try {
    // Update timestamp
    this.updatedAt = new Date();

    // Validate that we have either text, description, or voice content
    const hasText = this.text && this.text.trim() !== '';
    const hasDescription = this.description && this.description.trim() !== '';
    const hasVoice = this.voiceUrl && this.voiceUrl.trim() !== '';

    if (!hasText && !hasDescription && !hasVoice) {
      console.error('Entry validation failed: no content provided');
      return next(new Error('Entry must have text, description, or voice content'));
    }

    // Use description as text if no text provided (for voice-only entries)
    if (!hasText && hasDescription) {
      this.text = this.description;
    } else if (!hasText && hasVoice) {
      this.text = 'Voice entry';
    }

    // Always encrypt text for new entries or when text is modified
    console.log('Checking encryption conditions:', {
      isNew: this.isNew,
      isTextModified: this.isModified('text'),
      hasEncryptedText: !!this.encryptedText,
      textLength: this.text.length
    });

    if (this.isNew || this.isModified('text') || !this.encryptedText) {
      const secretKey = process.env.ENCRYPTION_KEY;
      console.log('Starting encryption process...');

      if (!secretKey) {
        console.error('No encryption key available');
        return next(new Error('Encryption key not configured'));
      }

      try {
        this.encryptedText = crypto.AES.encrypt(this.text, secretKey).toString();
        console.log('Encryption successful:', {
          originalLength: this.text.length,
          encryptedLength: this.encryptedText.length,
          encryptedPreview: this.encryptedText.substring(0, 20) + '...'
        });
      } catch (encryptError) {
        console.error('Encryption failed:', encryptError);
        return next(new Error('Failed to encrypt text: ' + encryptError.message));
      }
    }

    // Final validation to ensure encryptedText exists
    if (!this.encryptedText) {
      console.error('Final validation failed: encryptedText is still missing');
      return next(new Error('Failed to encrypt text - encryptedText is missing'));
    }

    console.log('Pre-save hook completed successfully');
    next();
  } catch (error) {
    console.error('Pre-save hook error:', error);
    next(error);
  }
});

// Decrypt text when retrieving
entrySchema.methods.decryptText = function () {
  if (this.isEncrypted && this.encryptedText) {
    const secretKey = process.env.ENCRYPTION_KEY;
    if (!secretKey) {
        console.error('No encryption key available');
        return 'Encryption key not configured';
      }
    const bytes = crypto.AES.decrypt(this.encryptedText, secretKey);
    return bytes.toString(crypto.enc.Utf8);
  }
  return this.text;
};

// Virtual for decrypted text
entrySchema.virtual('decryptedText').get(function () {
  return this.decryptText();
});

// Index for efficient queries
entrySchema.index({ userId: 1, createdAt: -1 });
entrySchema.index({ userId: 1, mood: 1 });
entrySchema.index({ userId: 1, tags: 1 });

module.exports = mongoose.model('Entry', entrySchema);
