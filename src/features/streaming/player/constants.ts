```typescript
export const PLAYER_SETTINGS = {
  VOLUME_STEPS: 5,
  SEEK_STEPS: 10, // seconds
  QUALITY_PRESETS: [
    { width: 1920, height: 1080, bitrate: 6000, fps: 60, label: '1080p60' },
    { width: 1280, height: 720, bitrate: 4500, fps: 60, label: '720p60' },
    { width: 852, height: 480, bitrate: 2500, fps: 30, label: '480p' }
  ],
  BUFFER_THRESHOLD: 2, // seconds
  AUTO_HIDE_CONTROLS: 3000 // ms
} as const;

export const PLAYER_SHORTCUTS = {
  PLAY_PAUSE: ' ',
  MUTE: 'm',
  FULLSCREEN: 'f',
  SEEK_FORWARD: 'ArrowRight',
  SEEK_BACKWARD: 'ArrowLeft',
  VOLUME_UP: 'ArrowUp',
  VOLUME_DOWN: 'ArrowDown'
} as const;
```