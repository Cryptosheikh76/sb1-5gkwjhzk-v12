import type { Metric, Event } from './types';

export async function logMetric(
  name: string,
  value: number,
  tags?: Record<string, string>
) {
  const metric: Metric = {
    name,
    value,
    tags,
    timestamp: Date.now()
  };

  if (import.meta.env.DEV) {
    console.log('[Metric]', metric);
    return;
  }

  try {
    await fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric)
    });
  } catch (e) {
    console.error('Failed to log metric:', e);
  }
}

export async function logEvent(name: string, properties?: Record<string, any>) {
  const event: Event = {
    name,
    properties,
    timestamp: Date.now()
  };

  if (import.meta.env.DEV) {
    console.log('[Event]', event);
    return;
  }

  try {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
  } catch (e) {
    console.error('Failed to log event:', e);
  }
}