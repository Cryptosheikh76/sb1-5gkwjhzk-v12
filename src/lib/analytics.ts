type EventName = 'video_view' | 'stream_start' | 'tip_sent' | 'error';

interface EventProperties {
  [key: string]: string | number | boolean;
}

export const analytics = {
  trackEvent: (name: EventName, properties?: EventProperties) => {
    try {
      // In development, just log to console
      if (import.meta.env.DEV) {
        console.log('[Analytics]', name, properties);
        return;
      }

      // TODO: Implement production analytics
    } catch (error) {
      console.error('Analytics Error:', error);
    }
  },

  trackError: (error: Error, context?: string) => {
    analytics.trackEvent('error', {
      message: error.message,
      context: context || 'unknown',
      stack: error.stack || 'no_stack',
    });
  }
};