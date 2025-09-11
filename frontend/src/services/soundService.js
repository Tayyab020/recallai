class SoundService {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.initializeAudioContext();
    }

    initializeAudioContext() {
        try {
            // Create audio context (requires user interaction first)
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Audio context not supported:', error);
        }
    }

    /**
     * Play a beep sound with specified frequency and duration
     * @param {number} frequency - Frequency in Hz (default: 800)
     * @param {number} duration - Duration in milliseconds (default: 1000)
     * @param {string} type - Wave type (sine, square, sawtooth, triangle)
     */
    playBeep(frequency = 800, duration = 1000, type = 'sine') {
        if (!this.audioContext) {
            console.warn('Audio context not available');
            return;
        }

        try {
            // Resume audio context if suspended (required by browser policies)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            // Fade in and out to avoid clicks
            const now = this.audioContext.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000 - 0.01);

            oscillator.start(now);
            oscillator.stop(now + duration / 1000);

            console.log(`🔊 Playing beep: ${frequency}Hz for ${duration}ms`);
        } catch (error) {
            console.error('Error playing beep:', error);
        }
    }

    /**
     * Play alarm sound based on priority
     * @param {string} priority - Priority level (high, medium, low)
     */
    playAlarmSound(priority = 'medium') {
        switch (priority) {
            case 'high':
                // Urgent alarm - multiple beeps
                this.playUrgentAlarm();
                break;
            case 'medium':
                // Standard alarm - single long beep
                this.playBeep(800, 1500);
                break;
            case 'low':
                // Gentle notification - soft beep
                this.playBeep(600, 800);
                break;
            default:
                this.playBeep(800, 1000);
        }
    }

    /**
     * Play urgent alarm with multiple beeps
     */
    playUrgentAlarm() {
        // Play 3 urgent beeps
        this.playBeep(1000, 300);
        setTimeout(() => this.playBeep(1200, 300), 400);
        setTimeout(() => this.playBeep(1000, 300), 800);
    }

    /**
     * Play notification sound
     */
    playNotification() {
        this.playBeep(800, 500, 'sine');
    }

    /**
     * Play success sound
     */
    playSuccess() {
        this.playBeep(600, 200);
        setTimeout(() => this.playBeep(800, 200), 250);
    }

    /**
     * Play error sound
     */
    playError() {
        this.playBeep(300, 800, 'square');
    }

    /**
     * Initialize audio context on user interaction
     * Call this on first user click/touch to enable audio
     */
    enableAudio() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('✅ Audio context enabled');
            });
        }
    }

    /**
     * Test all alarm sounds
     */
    testAllSounds() {
        console.log('🧪 Testing all alarm sounds...');

        this.playAlarmSound('low');
        setTimeout(() => this.playAlarmSound('medium'), 2000);
        setTimeout(() => this.playAlarmSound('high'), 4000);
        setTimeout(() => this.playNotification(), 6000);
        setTimeout(() => this.playSuccess(), 7000);
    }
}

export default new SoundService();