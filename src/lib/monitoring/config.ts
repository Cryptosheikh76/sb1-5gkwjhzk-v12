export const MONITORING_CONFIG = {
  ERROR_ENDPOINT: '/api/errors',
  METRICS_ENDPOINT: '/api/metrics',
  EVENTS_ENDPOINT: '/api/events',
  MEMORY_CHECK_INTERVAL: 60000, // 1 minute
  PERFORMANCE_SAMPLE_RATE: 0.1, // 10% of users
} as const;

export const ERROR_TYPES = {
  RUNTIME: 'runtime_error',
  NETWORK: 'network_error',
  MEMORY: 'memory_error',
  PERFORMANCE: 'performance_error'
} as const;