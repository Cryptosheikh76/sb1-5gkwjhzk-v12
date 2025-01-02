export interface UserMetrics {
  totalViews: number;
  uniqueViewers: number;
  watchTime: number;
  engagementRate: number;
  contentCount: number;
}

export interface ContentMetrics {
  id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  averageWatchTime: number;
  publishedAt: string;
}