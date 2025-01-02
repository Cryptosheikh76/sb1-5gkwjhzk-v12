```typescript
export interface StreamEvent {
  type: 'chat' | 'tip' | 'join' | 'leave';
  data: any;
  timestamp: number;
}

export interface StreamStats {
  viewerCount: number;
  chatCount: number;
  tipCount: number;
  totalTips: string;
}

export interface StreamMessage {
  id: string;
  streamId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
    avatarUrl?: string;
  };
}
```