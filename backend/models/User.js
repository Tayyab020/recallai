const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto-js');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  consentGiven: {
    type: Boolean,
    default: false,
    required: true
  },
  preferences: {
    voiceEnabled: {
      type: Boolean,
      default: true
    },
    emotionDetection: {
      type: Boolean,
      default: true
    },
    weeklySummaries: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: true
    }
  },
  pushSubscription: {
    endpoint: String,
    keys: {
      p256dh: String,
      auth: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Encrypt sensitive data
userSchema.methods.encryptData = function(data) {
  const secretKey = process.env.ENCRYPTION_KEY || 'default-secret-key';
  return crypto.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

// Decrypt sensitive data
userSchema.methods.decryptData = function(encryptedData) {
  const secretKey = process.env.ENCRYPTION_KEY || 'default-secret-key';
  const bytes = crypto.AES.decrypt(encryptedData, secretKey);
  return JSON.parse(bytes.toString(crypto.enc.Utf8));
};

module.exports = mongoose.model('User', userSchema);
