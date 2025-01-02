```typescript
export interface Participant {
  user: {
    username: string;
    avatar_url?: string;
  };
}

export interface LastMessage {
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  type: 'direct' | 'group';
  created_at: string;
  updated_at: string;
  participants: Participant[];
  last_message?: LastMessage;
}
```