const checkVoiceEnabled = (req, res, next) => {
  if (!req.user.preferences.voiceEnabled) {
    return res.status(403).json({ message: 'Voice features are disabled' });
  }
  next();
};

const checkEmotionDetectionEnabled = (req, res, next) => {
  if (!req.user.preferences.emotionDetection) {
    return res.status(403).json({ message: 'Emotion detection is disabled' });
  }
  next();
};

module.exports = { checkVoiceEnabled, checkEmotionDetectionEnabled };