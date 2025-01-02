export interface ErrorReport {
  message: string;
  stack?: string;
  context?: Record<string, any>;
  timestamp: number;
  url: string;
  userAgent: string;
}

export interface Metric {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp: number;
}

export interface Event {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
}