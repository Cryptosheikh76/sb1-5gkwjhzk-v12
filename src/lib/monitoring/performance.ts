import { monitoring } from './index';

export function measurePerformance() {
  // Core Web Vitals
  measureCoreWebVitals();
  // Resource timing
  measureResourceTiming();
  // Memory monitoring
  measureMemoryUsage();
}

function measureCoreWebVitals() {
  if ('web-vital' in window) {
    // @ts-ignore
    webVitals.getCLS((metric) => {
      monitoring.logMetric('cls', metric.value);
    });
    // @ts-ignore
    webVitals.getFID((metric) => {
      monitoring.logMetric('fid', metric.value);
    });
    // @ts-ignore
    webVitals.getLCP((metric) => {
      monitoring.logMetric('lcp', metric.value);
    });
  }
}

function measureResourceTiming() {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'resource') {
        monitoring.logMetric('resource_timing', entry.duration, {
          name: entry.name,
          type: entry.initiatorType
        });
      }
    });
  });

  observer.observe({ entryTypes: ['resource'] });
  return () => observer.disconnect();
}

function measureMemoryUsage() {
  if (performance.memory) {
    const interval = setInterval(() => {
      monitoring.logMetric('js_heap_size', performance.memory.usedJSHeapSize);
    }, 60000);
    return () => clearInterval(interval);
  }
}