```typescript
export interface Stream {
  id: string;
  title: string;
  url: string;
  isLive: boolean;
  viewerCount: number;
  startedAt?: string;
  creator?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface StreamQuality {
  width: number;
  height: number;
  bitrate: number;
  fps: number;
  label: string;
}

export interface ChatMessage {
  id: string;
  streamId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
    avatar_url?: string;
  };
}
```