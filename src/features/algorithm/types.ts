```typescript
export interface AlgorithmSettings {
  weights: {
    engagement: number;
    recency: number;
    relevance: number;
    quality: number;
  };
  engagement: {
    likeWeight: number;
    commentWeight: number;
    shareWeight: number;
    minWatchTime: number;
  };
  quality: {
    minEngagementRate: number;
    spamThreshold: number;
    contentDiversity: number;
  };
}

export interface AlgorithmStats {
  userEngagement: {
    avgWatchTime: number;
    completionRate: number;
    returnRate: number;
  };
  contentPerformance: {
    viralityRate: number;
    creatorRetention: number;
    monetizationRate: number;
  };
  systemHealth: {
    diversityScore: number;
    fairnessScore: number;
    latency: number;
  };
}
```