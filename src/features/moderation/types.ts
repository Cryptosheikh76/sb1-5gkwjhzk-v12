```typescript
export type ModerationSeverity = 'low' | 'medium' | 'high';
export type ModerationAction = 'approve' | 'warn' | 'block';
export type ModerationStatus = 'pending' | 'resolved';

export interface ModerationItem {
  id: string;
  content_id: string;
  reporter_id: string;
  reason: string;
  severity: ModerationSeverity;
  status: ModerationStatus;
  created_at: string;
  reporter: {
    username: string;
  };
  content: {
    title: string;
    type: string;
    url?: string;
  };
}

export interface AutoModConfig {
  profanityFilter: boolean;
  spamDetection: boolean;
  sensitiveContent: boolean;
  linkRestrictions: boolean;
}
```