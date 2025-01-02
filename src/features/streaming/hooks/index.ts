// Export all streaming hooks
export * from './useStreamSetup';
export * from './useStreamStatus';
export * from './useStreamAnalytics';
export * from './useChatHistory';
export * from './useStreamChat';
export * from './useTipCreator';
export * from './useFollowCreator';

// Re-export commonly used hooks with better names
export { useStreamSetup as useGoLive } from './useStreamSetup';
export { useStreamStatus as useLiveStatus } from './useStreamStatus';
export { useStreamAnalytics as useStreamInsights } from './useStreamAnalytics';