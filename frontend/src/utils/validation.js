// Validation utility functions
import { useState } from 'react';

export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  return { isValid: true, message: '' };
};

export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }

  if (password.length > 128) {
    return { isValid: false, message: 'Password must be less than 128 characters' };
  }

  // More lenient validation - just check for reasonable length
  // Removed the strict letter+number requirement
  return { isValid: true, message: '' };
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, message: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }

  return { isValid: true, message: '' };
};

export const validateJournalEntry = (text) => {
  if (!text || !text.trim()) {
    return { isValid: false, message: 'Journal entry cannot be empty' };
  }

  if (text.trim().length < 10) {
    return { isValid: false, message: 'Journal entry must be at least 10 characters long' };
  }

  if (text.length > 10000) {
    return { isValid: false, message: 'Journal entry must be less than 10,000 characters' };
  }

  return { isValid: true, message: '' };
};

export const validateTags = (tags) => {
  if (!Array.isArray(tags)) {
    return { isValid: false, message: 'Tags must be an array' };
  }

  if (tags.length > 10) {
    return { isValid: false, message: 'Maximum 10 tags allowed' };
  }

  for (const tag of tags) {
    if (typeof tag !== 'string') {
      return { isValid: false, message: 'All tags must be text' };
    }

    if (tag.length > 50) {
      return { isValid: false, message: 'Each tag must be less than 50 characters' };
    }

    if (!/^[a-zA-Z0-9\s-_]+$/.test(tag)) {
      return { isValid: false, message: 'Tags can only contain letters, numbers, spaces, hyphens, and underscores' };
    }
  }

  return { isValid: true, message: '' };
};

export const validateReminderTitle = (title) => {
  if (!title || !title.trim()) {
    return { isValid: false, message: 'Reminder title is required' };
  }

  if (title.trim().length < 3) {
    return { isValid: false, message: 'Reminder title must be at least 3 characters long' };
  }

  if (title.length > 100) {
    return { isValid: false, message: 'Reminder title must be less than 100 characters' };
  }

  return { isValid: true, message: '' };
};

export const validateReminderDescription = (description) => {
  if (description && description.length > 500) {
    return { isValid: false, message: 'Reminder description must be less than 500 characters' };
  }

  return { isValid: true, message: '' };
};

export const validateDateTime = (dateTime) => {
  if (!dateTime) {
    return { isValid: false, message: 'Date and time are required' };
  }

  const date = new Date(dateTime);
  const now = new Date();

  if (isNaN(date.getTime())) {
    return { isValid: false, message: 'Please enter a valid date and time' };
  }

  if (date <= now) {
    return { isValid: false, message: 'Reminder must be set for a future date and time' };
  }

  // Don't allow reminders more than 1 year in the future
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  if (date > oneYearFromNow) {
    return { isValid: false, message: 'Reminder cannot be more than 1 year in the future' };
  }

  return { isValid: true, message: '' };
};

export const validateSearchQuery = (query) => {
  if (!query || !query.trim()) {
    return { isValid: false, message: 'Search query cannot be empty' };
  }

  if (query.trim().length < 2) {
    return { isValid: false, message: 'Search query must be at least 2 characters long' };
  }

  if (query.length > 200) {
    return { isValid: false, message: 'Search query must be less than 200 characters' };
  }

  return { isValid: true, message: '' };
};

export const validateAudioFile = (file, isRecorded = false) => {
  if (!file) {
    return { isValid: false, message: 'No audio file provided' };
  }

  // Additional check: if file size is 0, it's invalid
  if (file.size === 0) {
    return { isValid: false, message: 'Audio file is empty' };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return { isValid: false, message: 'Audio file must be less than 10MB' };
  }

  // For recorded audio (from MediaRecorder), be more lenient with type checking
  if (isRecorded) {
    // Just check that it's not obviously not an audio file
    if (file.type && file.type.startsWith('image/')) {
      return { isValid: false, message: 'File appears to be an image, not audio' };
    }
    if (file.type && file.type.startsWith('video/') && !file.type.includes('audio')) {
      return { isValid: false, message: 'File appears to be video-only, not audio' };
    }
    return { isValid: true, message: '' };
  }

  // For uploaded files, be more strict about type checking
  const allowedTypes = [
    'audio/webm',
    'audio/wav',
    'audio/mp3',
    'audio/mpeg',
    'audio/m4a',
    'audio/ogg',
    'audio/mp4',
    'audio/aac'
  ];

  if (file.type && !allowedTypes.some(type => file.type.includes(type))) {
    return { isValid: false, message: 'Invalid audio format. Please use WebM, WAV, MP3, M4A, OGG, MP4, or AAC' };
  }

  return { isValid: true, message: '' };
};

export const validateAudioDuration = (duration) => {
  if (duration <= 0) {
    return { isValid: false, message: 'Audio recording is too short' };
  }

  // Max 10 minutes
  const maxDuration = 10 * 60; // 10 minutes in seconds
  if (duration > maxDuration) {
    return { isValid: false, message: 'Audio recording must be less than 10 minutes' };
  }

  return { isValid: true, message: '' };
};

export const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, message: 'No image file provided' };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: 'Invalid image format. Please use JPEG, PNG, GIF, or WebP' };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { isValid: false, message: 'Image file must be less than 5MB' };
  }

  return { isValid: true, message: '' };
};

export const validateUrl = (url) => {
  if (!url) {
    return { isValid: true, message: '' }; // URL is optional
  }

  try {
    new URL(url);
    return { isValid: true, message: '' };
  } catch {
    return { isValid: false, message: 'Please enter a valid URL' };
  }
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate that input doesn't contain potentially dangerous content
export const validateSafeContent = (content) => {
  if (!content) {
    return { isValid: true, message: '' };
  }

  // Check for script tags
  if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(content)) {
    return { isValid: false, message: 'Content contains potentially unsafe script tags' };
  }

  // Check for javascript: URLs
  if (/javascript:/gi.test(content)) {
    return { isValid: false, message: 'Content contains potentially unsafe JavaScript URLs' };
  }

  // Check for data: URLs with scripts
  if (/data:.*script/gi.test(content)) {
    return { isValid: false, message: 'Content contains potentially unsafe data URLs' };
  }

  return { isValid: true, message: '' };
};

// Validate mood values
export const validateMood = (mood) => {
  const validMoods = ['happy', 'sad', 'angry', 'anxious', 'calm', 'excited', 'neutral'];

  if (!mood) {
    return { isValid: false, message: 'Mood is required' };
  }

  if (!validMoods.includes(mood)) {
    return { isValid: false, message: 'Invalid mood value' };
  }

  return { isValid: true, message: '' };
};

// Validate emotion score
export const validateEmotionScore = (score) => {
  if (typeof score !== 'number') {
    return { isValid: false, message: 'Emotion score must be a number' };
  }

  if (score < 0 || score > 1) {
    return { isValid: false, message: 'Emotion score must be between 0 and 1' };
  }

  return { isValid: true, message: '' };
};

// Form validation helper
export const validateForm = (fields, validators) => {
  const errors = {};
  let isValid = true;

  for (const [fieldName, value] of Object.entries(fields)) {
    if (validators[fieldName]) {
      const validation = validators[fieldName](value, fields);
      if (!validation.isValid) {
        errors[fieldName] = validation.message;
        isValid = false;
      }
    }
  }

  return { isValid, errors };
};

// Real-time validation hook
export const useFormValidation = (initialState, validators) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    if (validators[name]) {
      const validation = validators[name](value, values);
      setErrors(prev => ({
        ...prev,
        [name]: validation.isValid ? '' : validation.message
      }));
      return validation.isValid;
    }
    return true;
  };

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, values[name]);
  };

  const validateAll = () => {
    const { isValid, errors: allErrors } = validateForm(values, validators);
    setErrors(allErrors);
    setTouched(Object.keys(validators).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return isValid;
  };

  const reset = () => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0 || Object.values(errors).every(error => !error)
  };
};