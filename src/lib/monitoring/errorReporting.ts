import type { ErrorReport } from './types';

export async function captureError(error: Error, context?: Record<string, any>) {
  const errorReport: ErrorReport = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent
  };

  if (import.meta.env.DEV) {
    console.error('[Error]', errorReport);
    return;
  }

  try {
    await fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorReport)
    });
  } catch (e) {
    console.error('Failed to report error:', e);
  }
}