import { StreamSettings } from '../types/stream';
import { ChatMessage } from '../types/chat';

export function validateStreamSettings(settings: StreamSettings): string[] {
  const errors: string[] = [];

  if (!settings.streamKey) {
    errors.push('Stream key is required');
  }

  if (!settings.serverUrl) {
    errors.push('Server URL is required');
  }

  if (settings.bitrate && (settings.bitrate < 1000 || settings.bitrate > 8000)) {
    errors.push('Bitrate must be between 1000 and 8000 Kbps');
  }

  if (settings.fps && ![30, 60].includes(settings.fps)) {
    errors.push('FPS must be either 30 or 60');
  }

  return errors;
}

export function validateChatMessage(message: string): string | null {
  if (!message.trim()) {
    return 'Message cannot be empty';
  }

  if (message.length > 500) {
    return 'Message too long (max 500 characters)';
  }

  return null;
}

export function validateStreamTitle(title: string): string | null {
  if (!title.trim()) {
    return 'Title is required';
  }

  if (title.length > 100) {
    return 'Title must be less than 100 characters';
  }

  return null;
}