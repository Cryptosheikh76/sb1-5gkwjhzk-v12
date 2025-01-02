import { useState, useCallback } from 'react';
import { useLocalStorage } from './common/useLocalStorage';

interface Settings {
  darkMode: boolean;
  reducedMotion: boolean;
  lowLatency: boolean;
  bufferSize: number;
  streamNotifications: boolean;
  chatMentions: boolean;
}

const defaultSettings: Settings = {
  darkMode: true,
  reducedMotion: false,
  lowLatency: true,
  bufferSize: 2,
  streamNotifications: true,
  chatMentions: true
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage('app-settings', defaultSettings);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings(prev => ({
      ...prev,
      ...updates
    }));
  }, [setSettings]);

  return { settings, updateSettings };
}