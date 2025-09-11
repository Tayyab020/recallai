const { GoogleGenAI, createUserContent, createPartFromUri } = require('@google/genai');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class VoiceAnalysisService {
    constructor() {
        this.ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
    }

    /**
     * Analyze voice recording to extract important events and reminders
     * @param {Buffer} audioBuffer - Audio file buffer
     * @param {string} mimeType - Audio MIME type
     * @returns {Object} Analysis results with events and reminders
     */
    async analyzeVoiceForReminders(audioBuffer, mimeType = 'audio/webm') {
        try {
            console.log('Starting voice analysis for reminders...');

            // Create temporary file for upload
            const tempFileName = `temp_audio_${crypto.randomUUID()}.${this.getFileExtension(mimeType)}`;
            const tempFilePath = path.join(__dirname, '../temp', tempFileName);

            // Ensure temp directory exists
            const tempDir = path.dirname(tempFilePath);
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            // Write audio buffer to temporary file
            fs.writeFileSync(tempFilePath, audioBuffer);

            try {
                // Upload file to Gemini
                console.log('Uploading audio file to Gemini...');
                const myfile = await this.ai.files.upload({
                    file: tempFilePath,
                    config: { mimeType: mimeType }
                });

                console.log('File uploaded successfully:', myfile.uri);

                // Get current date and time for context
                const now = new Date();
                const currentDateTime = now.toISOString();

                // Analyze audio for events and reminders
                const analysisPrompt = `
You are an AI voice assistant. You will receive transcribed audio from a user's speech. Your job is to:

1. Detect and extract any important information such as:
   - Events (with time and date if mentioned)
   - Tasks and to-dos
   - Deadlines
   - Reminders (including recurring ones)

2. Convert relative times ("tomorrow at 5", "next Monday") into absolute times (e.g., 2025-09-08T17:00:00) using the current date and time: ${currentDateTime}

3. Classify each item by type:
   - Event
   - Task  
   - Reminder
   - Deadline
   - Note (if it's general info, not actionable)

4. Add a priority score:
   - High (urgent, time-sensitive, repeated, or critical words like "important", "urgent", "must")
   - Medium (should be done but no strict deadline)
   - Low (casual or optional)

5. Suggest the correct alarm/notification time for each item.
   - Example: Meeting at 2 PM → alarm at 1:45 PM (15 minutes before)

6. Generate summaries:
   - Hourly mini-summary (just for the last chunk)
   - Daily recap (all tasks, completed/pending)
   - Weekly digest (key events + trends)

7. Return output in **structured JSON format** like this:
{
  "events": [
    {
      "title": "Meeting with Sarah",
      "datetime": "2025-09-07T14:00:00",
      "reminder_time": "2025-09-07T13:45:00", 
      "priority": "high"
    }
  ],
  "tasks": [
    {
      "title": "Buy groceries",
      "due_time": "2025-09-07T18:00:00",
      "priority": "medium"
    }
  ],
  "deadlines": [
    {
      "title": "Pay electricity bill", 
      "due_time": "2025-09-07T20:00:00",
      "priority": "high"
    }
  ],
  "notes": ["Call Ali about the new project idea"],
  "summary": {
    "hourly": "You planned 1 meeting and 2 tasks in this hour.",
    "daily": "3 tasks planned, 2 completed, 1 pending.", 
    "weekly": "Main focus is work tasks and bill payments."
  }
}

If no important items are found, return an empty structure but keep the format.

Current date and time: ${currentDateTime}
`;

                const response = await this.ai.models.generateContent({
                    model: "gemini-2.0-flash-exp",
                    contents: createUserContent([
                        createPartFromUri(myfile.uri, myfile.mimeType),
                        analysisPrompt
                    ])
                });

                console.log('Analysis completed');

                // Parse the response
                const analysisText = response.text;
                console.log('Raw analysis response:', analysisText);

                // Extract JSON from response
                const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    throw new Error('No valid JSON found in analysis response');
                }

                const analysisResult = JSON.parse(jsonMatch[0]);

                // Clean up temporary file
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }

                return {
                    success: true,
                    analysis: analysisResult,
                    fileUri: myfile.uri
                };

            } catch (error) {
                // Clean up temporary file on error
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }
                throw error;
            }

        } catch (error) {
            console.error('Voice analysis error:', error);
            return {
                success: false,
                error: error.message,
                analysis: {
                    events: [],
                    reminders: [],
                    summary: 'Analysis failed'
                }
            };
        }
    }

    /**
     * Transcribe audio and analyze for reminders in one step
     * @param {Buffer} audioBuffer - Audio file buffer
     * @param {string} mimeType - Audio MIME type
     * @returns {Object} Transcription and analysis results
     */
    async transcribeAndAnalyze(audioBuffer, mimeType = 'audio/webm') {
        try {
            console.log('Starting transcription and analysis...');

            // Create temporary file for upload
            const tempFileName = `temp_audio_${crypto.randomUUID()}.${this.getFileExtension(mimeType)}`;
            const tempFilePath = path.join(__dirname, '../temp', tempFileName);

            // Ensure temp directory exists
            const tempDir = path.dirname(tempFilePath);
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            // Write audio buffer to temporary file
            fs.writeFileSync(tempFilePath, audioBuffer);

            try {
                // Upload file to Gemini
                console.log('Uploading audio file to Gemini...');
                const myfile = await this.ai.files.upload({
                    file: tempFilePath,
                    config: { mimeType: mimeType }
                });

                // Get current date and time for context
                const now = new Date();
                const currentDateTime = now.toISOString();

                // Get transcription and analysis in one request
                const combinedPrompt = `
You are an AI voice assistant. Please do two things with this audio:

1. TRANSCRIBE: Provide a complete, accurate transcription of the audio

2. ANALYZE: Extract important information and return in this exact JSON format:
{
  "transcription": "Full transcription here...",
  "events": [
    {
      "title": "Meeting with Sarah",
      "datetime": "2025-09-07T14:00:00",
      "reminder_time": "2025-09-07T13:45:00", 
      "priority": "high"
    }
  ],
  "tasks": [
    {
      "title": "Buy groceries",
      "due_time": "2025-09-07T18:00:00",
      "priority": "medium"
    }
  ],
  "deadlines": [
    {
      "title": "Pay electricity bill", 
      "due_time": "2025-09-07T20:00:00",
      "priority": "high"
    }
  ],
  "notes": ["Call Ali about the new project idea"],
  "summary": {
    "hourly": "You planned 1 meeting and 2 tasks in this hour.",
    "daily": "3 tasks planned, 2 completed, 1 pending.", 
    "weekly": "Main focus is work tasks and bill payments."
  }
}

Instructions:
- Convert relative times ("tomorrow at 5", "next Monday") into absolute ISO times using current date: ${currentDateTime}
- Set reminder_time 15 minutes before event datetime
- Classify priority as high (urgent/important), medium (should do), or low (optional)
- If no actionable items found, return empty arrays but keep the structure

Current date and time: ${currentDateTime}
`;

                const response = await this.ai.models.generateContent({
                    model: "gemini-2.0-flash-exp",
                    contents: createUserContent([
                        createPartFromUri(myfile.uri, myfile.mimeType),
                        combinedPrompt
                    ])
                });

                const responseText = response.text;
                console.log('Combined analysis completed');

                // Extract JSON from response
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    // Fallback: try to extract transcription manually
                    return {
                        success: true,
                        transcription: responseText,
                        analysis: {
                            events: [],
                            reminders: [],
                            summary: 'Could not parse structured analysis'
                        }
                    };
                }

                const result = JSON.parse(jsonMatch[0]);

                // Clean up temporary file
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }

                return {
                    success: true,
                    transcription: result.transcription || responseText,
                    analysis: {
                        events: result.events || [],
                        reminders: result.reminders || [],
                        summary: result.summary || 'Analysis completed'
                    }
                };

            } catch (error) {
                // Clean up temporary file on error
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }
                throw error;
            }

        } catch (error) {
            console.error('Transcription and analysis error:', error);
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

    /**
     * Get file extension from MIME type
     * @param {string} mimeType - MIME type
     * @returns {string} File extension
     */
    getFileExtension(mimeType) {
        const extensions = {
            'audio/webm': 'webm',
            'audio/wav': 'wav',
            'audio/mp3': 'mp3',
            'audio/mpeg': 'mp3',
            'audio/m4a': 'm4a',
            'audio/ogg': 'ogg',
            'audio/mp4': 'mp4'
        };
        return extensions[mimeType] || 'webm';
    }
}

module.exports = new VoiceAnalysisService();