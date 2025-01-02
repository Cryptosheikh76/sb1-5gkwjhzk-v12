```typescript
export interface PerformanceMetrics {
  totalViews: number;
  uniqueViewers: number;
  averageWatchTime: number;
  totalRevenue: string;
  revenueGrowth: number;
}

export interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  timeSeriesData: Array<{
    date: string;
    views: number;
    likes: number;
    comments: number;
  }>;
}

export interface AudienceInsights {
  demographics: {
    age: Record<string, number>;
    location: Record<string, number>;
  };
  retention: {
    day1: number;
    day7: number;
    day30: number;
  };
  topSupporters: Array<{
    userId: string;
    username: string;
    totalSpent: string;
  }>;
}

export interface AnalyticsData {
  performance: PerformanceMetrics;
  engagement: EngagementMetrics;
  audience: AudienceInsights;
}
```