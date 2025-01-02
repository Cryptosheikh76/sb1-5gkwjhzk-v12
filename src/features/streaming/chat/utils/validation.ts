import { CHAT_SETTINGS, CHAT_ERRORS } from '../constants';

export function validateChatMessage(message: string): string | null {
  if (!message.trim()) {
    return 'Message cannot be empty';
  }

  if (message.length > CHAT_SETTINGS.MAX_MESSAGE_LENGTH) {
    return CHAT_ERRORS.MESSAGE_TOO_LONG;
  }

  const emoteCount = (message.match(/:\w+:/g) || []).length;
  if (emoteCount > CHAT_SETTINGS.EMOTE_LIMIT) {
    return CHAT_ERRORS.EMOTE_LIMIT;
  }

  const linkCount = (message.match(/https?:\/\/[^\s]+/g) || []).length;
  if (linkCount > CHAT_SETTINGS.LINK_LIMIT) {
    return CHAT_ERRORS.LINK_LIMIT;
  }

  return null;
}

export function validateSlowMode(lastMessageTime: number): string | null {
  const timeSinceLastMessage = Date.now() - lastMessageTime;
  const remainingTime = Math.ceil((CHAT_SETTINGS.SLOW_MODE_DELAY * 1000 - timeSinceLastMessage) / 1000);

  if (remainingTime > 0) {
    return CHAT_ERRORS.SLOW_MODE.replace('{seconds}', remainingTime.toString());
  }

  return null;
}