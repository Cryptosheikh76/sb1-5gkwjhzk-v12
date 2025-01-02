import { captureError, captureEvent } from './errorReporting';
import { logMetric, logEvent } from './metrics';
import type { ErrorReport, Metric, Event } from './types';

class MonitoringService {
  private static instance: MonitoringService;
  private initialized = false;

  private constructor() {}

  static getInstance(): MonitoringService {
    if (!this.instance) {
      this.instance = new MonitoringService();
    }
    return this.instance;
  }

  initialize(): void {
    if (this.initialized) return;

    // Set up error handlers
    window.addEventListener('error', (event) => {
      this.captureError(event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(event.reason);
    });

    this.startPerformanceMonitoring();
    this.initialized = true;
  }

  captureError(error: Error, context?: Record<string, any>): void {
    if (import.meta.env.DEV) {
      console.error('[Error]', error, context);
      return;
    }
    captureError(error, context);
  }

  logMetric(name: string, value: number, tags?: Record<string, string>): void {
    if (import.meta.env.DEV) {
      console.log('[Metric]', { name, value, tags });
      return;
    }
    logMetric(name, value, tags);
  }

  logEvent(name: string, properties?: Record<string, any>): void {
    if (import.meta.env.DEV) {
      console.log('[Event]', name, properties);
      return;
    }
    logEvent(name, properties);
  }

  private startPerformanceMonitoring(): void {
    // Monitor page load performance
    window.addEventListener('load', () => {
      if (performance.timing) {
        const { loadEventEnd, navigationStart } = performance.timing;
        this.logMetric('page_load_time', loadEventEnd - navigationStart);
      }
    });

    // Monitor network requests
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.logMetric('resource_load_time', entry.duration, {
              resource_type: entry.initiatorType,
              resource_name: entry.name
            });
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  }
}

export const monitoring = MonitoringService.getInstance();