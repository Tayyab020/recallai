import React, { createContext, useContext, useState, useEffect } from 'react';

const PWAContext = createContext();

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};

export const PWAProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      return { success: false, message: 'Install prompt not available' };
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        return { success: true, message: 'App installed successfully' };
      } else {
        return { success: false, message: 'Installation declined' };
      }
    } catch (error) {
      console.error('Installation error:', error);
      return { success: false, message: 'Installation failed' };
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      return { success: false, message: 'Notifications not supported' };
    }

    if (Notification.permission === 'granted') {
      return { success: true, message: 'Notifications already enabled' };
    }

    if (Notification.permission === 'denied') {
      return { success: false, message: 'Notifications blocked' };
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        return { success: true, message: 'Notifications enabled' };
      } else {
        return { success: false, message: 'Notifications denied' };
      }
    } catch (error) {
      console.error('Notification permission error:', error);
      return { success: false, message: 'Failed to request permission' };
    }
  };

  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator)) {
      return { success: false, message: 'Service workers are not supported.' };
    }

    if (!process.env.REACT_APP_VAPID_PUBLIC_KEY || process.env.REACT_APP_VAPID_PUBLIC_KEY === 'your-vapid-public-key-here') {
      return { success: false, message: 'Push notifications not configured. Please set VAPID key.' };
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      if (!registration.pushManager) {
        return { success: false, message: 'Push Manager is not supported.' };
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
      });

      return { success: true, subscription };
    } catch (error) {
      console.error('Push subscription error:', error);
      return { success: false, message: 'Failed to subscribe to push notifications' };
    }
  };

  const value = {
    isOnline,
    deferredPrompt,
    isInstalled,
    installApp,
    requestNotificationPermission,
    subscribeToPush
  };

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  );
};

