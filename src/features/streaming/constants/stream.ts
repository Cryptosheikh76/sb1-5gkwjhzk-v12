export const STREAM_SETTINGS = {
  DEFAULT_BITRATE: 6000,
  DEFAULT_FPS: 60,
  DEFAULT_RESOLUTION: {
    width: 1920,
    height: 1080
  },
  QUALITY_PRESETS: [
    { width: 1920, height: 1080, bitrate: 6000, fps: 60, label: '1080p' },
    { width: 1280, height: 720, bitrate: 4500, fps: 60, label: '720p' },
    { width: 852, height: 480, bitrate: 2500, fps: 30, label: '480p' }
  ]
} as const;

export const STREAM_ERRORS = {
  NOT_LOGGED_IN: 'Must be logged in to perform this action',
  INVALID_STREAM_KEY: 'Invalid stream key',
  CONNECTION_ERROR: 'Failed to connect to stream',
  CHAT_ERROR: 'Failed to send message'
} as const;