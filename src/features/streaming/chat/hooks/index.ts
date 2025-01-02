// Export all chat hooks
export * from './useChatState';
export * from './useChatModeration';
export * from './useChatHistory';
export * from './useChatInput';

// Re-export commonly used hooks with better names
export { useChatState as useChatSettings } from './useChatState';
export { useChatModeration as useModerationActions } from './useChatModeration';