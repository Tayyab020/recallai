import soundService from './soundService';

class NotificationService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
    }

    /**
     * Initialize WebSocket connection for real-time notifications
     */
    connect(userId) {
        try {
            // Connect to WebSocket server
            const wsUrl = `ws://localhost:5000/ws?userId=${userId}`;
            this.socket = new WebSocket(wsUrl);

            this.socket.onopen = () => {
                console.log('✅ WebSocket connected for notifications');
                this.isConnected = true;
                this.reconnectAttempts = 0;
            };

            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleNotification(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.socket.onclose = () => {
                console.log('WebSocket connection closed');
                this.isConnected = false;
                this.attemptReconnect(userId);
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
        }
    }

    /**
     * Handle incoming notifications
     */
    handleNotification(data) {
        console.log('📨 Received notification:', data);

        switch (data.type) {
            case 'reminder_alarm':
                this.handleReminderAlarm(data);
                break;
            case 'test_notification':
                this.handleTestNotification(data);
                break;
            default:
                console.log('Unknown notification type:', data.type);
        }
    }

    /**
     * Handle reminder alarm notifications
     */
    handleReminderAlarm(data) {
        const { reminder } = data;

        console.log(`🔔 REMINDER ALARM: ${reminder.title}`);
        console.log(`⏰ Time: ${new Date().toLocaleString()}`);
        console.log(`📋 Priority: ${reminder.priority}`);

        // Play alarm sound based on priority
        soundService.playAlarmSound(reminder.priority);

        // Show browser notification if permission granted
        this.showBrowserNotification({
            title: `🔔 Reminder: ${reminder.title}`,
            body: reminder.description || 'Tap to view details',
            icon: '/favicon.ico',
            tag: `reminder-${reminder._id}`,
            requireInteraction: reminder.priority === 'high'
        });

        // Show in-app notification
        this.showInAppNotification(reminder);
    }

    /**
     * Handle test notifications
     */
    handleTestNotification(data) {
        console.log('🧪 Test notification received');
        soundService.playNotification();

        this.showBrowserNotification({
            title: '🧪 Test Notification',
            body: 'WebSocket connection is working!',
            icon: '/favicon.ico'
        });
    }

    /**
     * Show browser notification
     */
    async showBrowserNotification(options) {
        if (!('Notification' in window)) {
            console.warn('Browser notifications not supported');
            return;
        }

        // Request permission if not granted
        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.warn('Notification permission denied');
                return;
            }
        }

        if (Notification.permission === 'granted') {
            const notification = new Notification(options.title, {
                body: options.body,
                icon: options.icon,
                tag: options.tag,
                requireInteraction: options.requireInteraction || false
            });

            // Auto-close after 10 seconds unless it requires interaction
            if (!options.requireInteraction) {
                setTimeout(() => notification.close(), 10000);
            }

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
    }

    /**
     * Show in-app notification (you can customize this)
     */
    showInAppNotification(reminder) {
        // Create a temporary notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f44336;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 300px;
      font-family: Arial, sans-serif;
      animation: slideIn 0.3s ease-out;
    `;

        notification.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 5px;">
        🔔 ${reminder.title}
      </div>
      <div style="font-size: 14px; opacity: 0.9;">
        ${reminder.description || 'Reminder notification'}
      </div>
      <div style="font-size: 12px; margin-top: 5px; opacity: 0.8;">
        Priority: ${reminder.priority} | ${new Date().toLocaleTimeString()}
      </div>
    `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove after 8 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 8000);

        // Click to dismiss
        notification.onclick = () => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        };
    }

    /**
     * Attempt to reconnect WebSocket
     */
    attemptReconnect(userId) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

            setTimeout(() => {
                this.connect(userId);
            }, this.reconnectDelay);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    /**
     * Disconnect WebSocket
     */
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.isConnected = false;
        }
    }

    /**
     * Send test notification
     */
    sendTestNotification() {
        if (this.isConnected && this.socket) {
            this.socket.send(JSON.stringify({
                type: 'test_notification',
                message: 'Testing WebSocket connection'
            }));
        } else {
            console.warn('WebSocket not connected');
        }
    }

    /**
     * Request notification permissions
     */
    async requestPermissions() {
        // Request browser notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            console.log('Notification permission:', permission);
        }

        // Enable audio context
        soundService.enableAudio();
    }
}

export default new NotificationService();