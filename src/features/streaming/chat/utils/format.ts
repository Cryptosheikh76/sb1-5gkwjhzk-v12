import { ChatMessage } from '../types';

export function formatChatMessage(message: string): string {
  return message
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/:\w+:/g, match => `<emote>${match}</emote>`); // Format emotes
}

export function parseEmotes(message: string): string[] {
  return (message.match(/:\w+:/g) || [])
    .map(emote => emote.slice(1, -1));
}

export function filterBlockedWords(message: string, blockedWords: string[]): string {
  let filteredMessage = message;
  blockedWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filteredMessage = filteredMessage.replace(regex, '***');
  });
  return filteredMessage;
}