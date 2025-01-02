```typescript
import { supabase } from '../supabase';
import { monitoring } from '../monitoring';

interface StreamScore {
  id: string;
  score: number;
  metrics: {
    viewers: number;
    engagement: number;
    duration: number;
  };
}

export class StreamRanking {
  private static readonly WEIGHTS = {
    viewers: 0.4,
    engagement: 0.3,
    duration: 0.2,
    creator: 0.1
  };

  static async rankLiveStreams(): Promise<StreamScore[]> {
    try {
      const { data: streams } = await supabase
        .from('streams')
        .select(`
          *,
          metrics:stream_metrics(
            viewer_count,
            chat_messages_count,
            tips_count,
            started_at
          ),
          creator:users!creator_id(
            followers_count,
            is_verified
          )
        `)
        .eq('is_live', true);

      if (!streams) return [];

      const scores = streams.map(stream => {
        const viewerScore = this.calculateViewerScore(stream.metrics);
        const engagementScore = this.calculateEngagementScore(stream.metrics);
        const durationScore = this.calculateDurationScore(stream.metrics.started_at);
        const creatorScore = this.calculateCreatorScore(stream.creator);

        const totalScore = 
          viewerScore * this.WEIGHTS.viewers +
          engagementScore * this.WEIGHTS.engagement +
          durationScore * this.WEIGHTS.duration +
          creatorScore * this.WEIGHTS.creator;

        return {
          id: stream.id,
          score: totalScore,
          metrics: {
            viewers: stream.metrics.viewer_count,
            engagement: stream.metrics.chat_messages_count + stream.metrics.tips_count,
            duration: this.getStreamDuration(stream.metrics.started_at)
          }
        };
      });

      return scores.sort((a, b) => b.score - a.score);
    } catch (error) {
      monitoring.captureError(error as Error);
      return [];
    }
  }

  private static calculateViewerScore(metrics: any): number {
    return Math.min(metrics.viewer_count / 1000, 1);
  }

  private static calculateEngagementScore(metrics: any): number {
    const engagementRate = 
      (metrics.chat_messages_count + metrics.tips_count * 3) / 
      Math.max(metrics.viewer_count, 1);
    
    return Math.min(engagementRate / 10, 1);
  }

  private static calculateDurationScore(startedAt: string): number {
    const durationInHours = this.getStreamDuration(startedAt);
    return Math.min(durationInHours / 2, 1); // Cap at 2 hours
  }

  private static calculateCreatorScore(creator: any): number {
    return (creator.is_verified ? 0.5 : 0.3) +
           Math.min(creator.followers_count / 10000, 0.5);
  }

  private static getStreamDuration(startedAt: string): number {
    return (Date.now() - new Date(startedAt).getTime()) / (1000 * 60 * 60);
  }
}
```