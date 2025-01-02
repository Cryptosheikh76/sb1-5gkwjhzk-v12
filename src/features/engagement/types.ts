```typescript
export interface Comment {
  id: string;
  content_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    username: string;
    avatar_url?: string;
  };
}

export interface VideoResponse {
  id: string;
  response_to_id: string;
  creator_id: string;
  url: string;
  created_at: string;
  creator: {
    username: string;
    avatar_url?: string;
  };
}

export interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
  responses: number;
}
```