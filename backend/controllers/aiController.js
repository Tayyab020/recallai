const { GoogleGenerativeAI } = require('@google/generative-ai');
const Entry = require('../models/Entry');
const Reminder = require('../models/Reminder');
const voiceAnalysisService = require('../services/voiceAnalysisService');
const reminderService = require('../services/reminderService');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class AIController {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  // Helper function to fetch entries and format them into a string
  async getEntriesText(userId, queryOptions) {
    const entries = await Entry.find(queryOptions)
      .sort({ createdAt: -1 })
      .limit(queryOptions.limit);

    if (entries.length === 0) {
      return null;
    }

    return entries.map(entry =>
      `${entry.createdAt.toDateString()}: ${entry.decryptText()}`
    ).join('\n\n');
  }

  // Transcribe audio and analyze for reminders using new voice analysis service
  async transcribeAudio(audioData, mimeType) {
    try {
      console.log('Using enhanced transcription with voice analysis...');

      // Convert base64 audio to buffer
      const audioBuffer = Buffer.from(audioData, 'base64');

      // Use the new voice analysis service for combined transcription and analysis
      const result = await voiceAnalysisService.transcribeAndAnalyze(audioBuffer, mimeType);

      if (result.success) {
        // Return both transcription and analysis
        return {
          transcription: result.transcription,
          analysis: result.analysis
        };
      } else {
        // Fallback to simple transcription if analysis fails
        return await this.fallbackTranscription(audioData, mimeType);
      }
    } catch (error) {
      console.error('Enhanced transcription error:', error);

      // Fallback to Google Cloud Speech-to-Text if everything fails
      try {
        return await this.fallbackTranscription(audioData, mimeType);
      } catch (fallbackError) {
        console.error('Fallback transcription error:', fallbackError);
        throw new Error('Audio transcription failed');
      }
    }
  }

  // Fallback transcription using Google Cloud Speech-to-Text
  async fallbackTranscription(audioData, mimeType) {
    try {
      // Import Google Cloud Speech-to-Text (optional dependency)
      const speech = require('@google-cloud/speech');

      const client = new speech.SpeechClient({
        // Use service account key file or default credentials
        keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
      });

      // Convert base64 to buffer
      const audioBuffer = Buffer.from(audioData, 'base64');

      const request = {
        audio: {
          content: audioBuffer.toString('base64'),
        },
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: 'en-US',
          enableAutomaticPunctuation: true,
          model: 'latest_long',
        },
      };

      const [response] = await client.recognize(request);
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

      return transcription || "Could not transcribe audio. Please try again.";
    } catch (error) {
      console.error('Google Cloud Speech-to-Text error:', error);

      // If Google Cloud Speech-to-Text is not configured, return helpful message
      if (error.code === 'ENOENT' || error.message.includes('credentials')) {
        return "Audio transcription service not configured. Please contact support or type your entry manually.";
      }

      throw new Error('Transcription service unavailable');
    }
  }

  // Detect emotion in text
  async detectEmotion(text) {
    try {
      const prompt = `
        Analyze the emotional tone of the following text and respond with a JSON object containing:
        - mood: one of ['happy', 'sad', 'angry', 'anxious', 'calm', 'excited', 'neutral']
        - score: a number between 0 and 1 representing confidence
        - reasoning: brief explanation of the detected emotion
        
        Text: "${text}"
        
        Respond only with valid JSON, no additional text.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const emotionData = JSON.parse(response.text());

      return {
        mood: emotionData.mood || 'neutral',
        score: emotionData.score || 0.5,
        reasoning: emotionData.reasoning || 'No specific emotion detected'
      };
    } catch (error) {
      console.error('Emotion detection error:', error);
      return {
        mood: 'neutral',
        score: 0.5,
        reasoning: 'Emotion detection failed'
      };
    }
  }

  // Generate summary
  async generateSummary(text, type = 'daily') {
    try {
      const prompt = `
        Generate a ${type} summary of the following journal entry. 
        Focus on key themes, emotions, and important events.
        Keep it concise but meaningful.
        
        Text: "${text}"
        
        Summary:
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Summary generation error:', error);
      throw new Error('Summary generation failed');
    }
  }

  // Generate weekly summary from multiple entries
  async generateWeeklySummary(userId, week) {
    try {
      const startDate = week ? new Date(week) : new Date();
      startDate.setDate(startDate.getDate() - 7);

      const queryOptions = {
          userId,
          createdAt: { $gte: startDate }
      };

      const entriesText = await this.getEntriesText(userId, queryOptions);

      if (!entriesText) {
        return 'No entries found for this week.';
      }

      const prompt = `
        Generate a comprehensive weekly summary based on these journal entries.
        Include:
        - Overall mood and emotional patterns
        - Key themes and topics
        - Notable events or insights
        - Suggestions for the upcoming week
        
        Entries:
        ${entriesText}
        
        Weekly Summary:
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Weekly summary error:', error);
      throw new Error('Weekly summary generation failed');
    }
  }

  // Answer questions about past entries
  async answerQuestion(userId, question, context = []) {
    try {
      const queryOptions = {
        userId
      };
      const entriesText = await this.getEntriesText(userId, queryOptions);

      if (!entriesText) {
        return 'No entries found to answer your question.';
      }

      const prompt = `
        Based on the following journal entries, answer this question: "${question}"
        
        Context: ${context.join(', ') || 'No additional context provided'}
        
        Journal Entries:
        ${entriesText}
        
        Please provide a helpful answer based on the journal entries. If the question cannot be answered from the available entries, say so clearly.
        
        Answer:
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Q&A error:', error);
      throw new Error('Question answering failed');
    }
  }

  // Search entries using semantic search
  async searchEntries(userId, query, filters = {}) {
    try {
      const queryOptions = {
        userId
      };
      const entriesText = await this.getEntriesText(userId, queryOptions);

      if (!entriesText) {
        return [];
      }

      const entries = await Entry.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);

      const prompt = `
        Search through these journal entries for content related to: "${query}"
        
        Filters: ${JSON.stringify(filters)}
        
        Return a JSON array of relevant entries with:
        - entryId: the index number of the entry
        - relevance: score from 0-1
        - excerpt: relevant text snippet
        - date: entry date
        
        Journal Entries:
        ${entriesText}
        
        Return only valid JSON array, no additional text.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const searchResults = JSON.parse(response.text());

      // Map results back to actual entries
      return searchResults.map(result => {
        const entryIndex = result.entryId - 1;
        const entry = entries[entryIndex];
        return {
          ...entry.toObject(),
          text: entry.decryptText(),
          relevance: result.relevance,
          excerpt: result.excerpt
        };
      }).filter(result => result.relevance > 0.3);
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Search failed');
    }
  }

  // Suggest reminders based on patterns
  async suggestReminders(userId) {
    try {
      const queryOptions = {
        userId
      };
      const entriesText = await this.getEntriesText(userId, queryOptions);

      if (!entriesText) {
        return [];
      }

      const prompt = `
        Analyze these journal entries to identify patterns and suggest helpful reminders.
        Look for:
        - Recurring tasks or activities
        - Mood patterns that might benefit from reminders
        - Important events or appointments mentioned
        - Self-care activities that could be scheduled
        
        Journal Entries:
        ${entriesText}
        
        Return a JSON array of reminder suggestions with:
        - title: short reminder title
        - description: detailed description
        - type: 'pattern', 'manual', or 'ai-suggested'
        - frequency: 'daily', 'weekly', 'monthly', or 'custom'
        - priority: 'low', 'medium', or 'high'
        - reasoning: why this reminder was suggested
        
        Return only valid JSON array, no additional text.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const suggestions = JSON.parse(response.text());

      return suggestions.map(suggestion => ({
        ...suggestion,
        userId,
        isActive: true,
        nextTrigger: this.calculateNextTrigger(suggestion.frequency)
      }));
    } catch (error) {
      console.error('Reminder suggestion error:', error);
      throw new Error('Reminder suggestion failed');
    }
  }

  // Analyze voice for reminders and events using new GenAI service
  async analyzeVoiceForReminders(audioBuffer, mimeType) {
    try {
      console.log('Analyzing voice for reminders using GenAI service...');
      return await voiceAnalysisService.analyzeVoiceForReminders(audioBuffer, mimeType);
    } catch (error) {
      console.error('Voice analysis error:', error);
      return {
        success: false,
        error: error.message,
        analysis: {
          events: [],
          reminders: [],
          summary: 'Voice analysis failed'
        }
      };
    }
  }

  // Transcribe and analyze voice in one step
  async transcribeAndAnalyzeVoice(audioBuffer, mimeType) {
    try {
      console.log('Transcribing and analyzing voice using GenAI service...');
      return await voiceAnalysisService.transcribeAndAnalyze(audioBuffer, mimeType);
    } catch (error) {
      console.error('Transcribe and analyze error:', error);
      return {
        success: false,
        error: error.message,
        transcription: '',
        analysis: {
          events: [],
          reminders: [],
          summary: 'Analysis failed'
        }
      };
    }
  }

  // Create reminders from voice analysis
  async createRemindersFromVoice(userId, analysisResult, entryId = null) {
    try {
      console.log('Creating reminders from voice analysis...');
      return await reminderService.createRemindersFromAnalysis(userId, analysisResult, entryId);
    } catch (error) {
      console.error('Error creating reminders from voice:', error);
      return [];
    }
  }

  // Calculate next trigger time based on frequency
  calculateNextTrigger(frequency) {
    const now = new Date();

    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }
}

module.exports = new AIController();
