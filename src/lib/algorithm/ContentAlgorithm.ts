```typescript
import { supabase } from '../supabase';
import { monitoring } from '../monitoring';

interface ContentScore {
  id: string;
  score: number;
  factors: {
    engagement: number;
    recency: number;
    relevance: number;
    quality: number;
  };
}

export class ContentAlgorithm {
  private static readonly WEIGHTS = {
    engagement: 0.4,
    recency: 0.2,
    relevance: 0.2,
    quality: 0.2
  };

  static async rankContent(userId?: string): Promise<ContentScore[]> {
    try {
      // Get content with metrics
      const { data: content } = await supabase
        .from('content_metrics_v2')
        .select(`
          content_id,
          views,
          likes,
          comments,
          shares,
          avg_watch_duration,
          created_at,
          creator:users!creator_id(
            followers_count,
            is_verified
          )
        `);

      if (!content) return [];

      // Calculate scores for each piece of content
      const scores = content.map(item => {
        const engagementScore = this.calculateEngagementScore(item);
        const recencyScore = this.calculateRecencyScore(item.created_at);
        const relevanceScore = this.calculateRelevanceScore(item, userId);
        const qualityScore = this.calculateQualityScore(item);

        const totalScore = 
          engagementScore * this.WEIGHTS.engagement +
          recencyScore * this.WEIGHTS.recency +
          relevanceScore * this.WEIGHTS.relevance +
          qualityScore * this.WEIGHTS.quality;

        return {
          id: item.content_id,
          score: totalScore,
          factors: {
            engagement: engagementScore,
            recency: recencyScore,
            relevance: relevanceScore,
            quality: qualityScore
          }
        };
      });

      // Sort by score
      return scores.sort((a, b) => b.score - a.score);
    } catch (error) {
      monitoring.captureError(error as Error);
      return [];
    }
  }

  private static calculateEngagementScore(metrics: any): number {
    const engagementRate = 
      (metrics.likes + metrics.comments * 2 + metrics.shares * 3) / 
      Math.max(metrics.views, 1);
    
    const watchTimeScore = 
      Math.min(metrics.avg_watch_duration / 60, 1); // Cap at 1 minute

    return (engagementRate + watchTimeScore) / 2;
  }

  private static calculateRecencyScore(createdAt: string): number {
    const ageInHours = 
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    return Math.exp(-ageInHours / 72); // Decay over 3 days
  }

  private static calculateRelevanceScore(content: any, userId?: string): number {
    if (!userId) return 0.5; // Default score for non-logged-in users

    // TODO: Implement personalized relevance based on user preferences
    return 0.5;
  }

  private static calculateQualityScore(content: any): number {
    const creatorScore = 
      (content.creator.is_verified ? 0.5 : 0.3) +
      Math.min(content.creator.followers_count / 10000, 0.5);

    return creatorScore;
  }
}
```