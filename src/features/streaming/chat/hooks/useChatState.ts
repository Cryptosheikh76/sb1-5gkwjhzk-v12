import { useState, useCallback } from 'react';
import { ChatSettings } from '../types';
import { CHAT_SETTINGS } from '../constants';

export function useChatState() {
  const [settings, setSettings] = useState<ChatSettings>({
    slowMode: false,
    slowModeDelay: CHAT_SETTINGS.SLOW_MODE_DELAY,
    followersOnly: false,
    subscribersOnly: false,
    emoteOnly: false,
    blockedWords: []
  });

  const updateSettings = useCallback((updates: Partial<ChatSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const [lastMessageTime, setLastMessageTime] = useState(0);

  const updateLastMessageTime = useCallback(() => {
    setLastMessageTime(Date.now());
  }, []);

  return {
    settings,
    updateSettings,
    lastMessageTime,
    updateLastMessageTime
  };
}