export const APP_CONFIG = {
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  SUPPORTED_VIDEO_FORMATS: ['video/mp4', 'video/webm'] as const,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_TIP_AMOUNT: '0.001',
  MAX_TIP_AMOUNT: '10',
  THEME: {
    colors: {
      primary: '#FFB800', // Bright yellow from the image
      secondary: '#00A3FF', // Bright blue from the image
      accent: '#FF4B4B', // Red accent
      background: '#0A0F1E', // Dark blue background
      surface: '#1A1F2E', // Slightly lighter surface color
      text: {
        primary: '#FFFFFF',
        secondary: '#B0B7C3'
      }
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '1rem'
    }
  }
} as const;