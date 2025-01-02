import { ChatMessage } from '../types/chat';

export function formatChatMessage(message: string): string {
  return message.trim();
}

export function validateChatMessage(message: string): boolean {
  return message.length > 0 && message.length <= 500;
}

export function filterBlockedWords(message: string, blockedWords: string[]): string {
  let filteredMessage = message;
  blockedWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filteredMessage = filteredMessage.replace(regex, '***');
  });
  return filteredMessage;
}