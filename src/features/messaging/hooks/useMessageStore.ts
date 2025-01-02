```typescript
import { create } from 'zustand';
import { Message, Conversation } from '../types';

interface MessageStore {
  conversations: Conversation[];
  activeConversation: string | null;
  setActiveConversation: (id: string | null) => void;
  addMessage: (message: Message) => void;
  markAsRead: (conversationId: string) => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  conversations: [],
  activeConversation: null,
  setActiveConversation: (id) => set({ activeConversation: id }),
  addMessage: (message) => set((state) => {
    const conversations = [...state.conversations];
    const conversationIndex = conversations.findIndex(
      (c) => c.id === message.conversationId
    );

    if (conversationIndex > -1) {
      conversations[conversationIndex].lastMessage = message;
      conversations[conversationIndex].unreadCount += 1;
    }

    return { conversations };
  }),
  markAsRead: (conversationId) => set((state) => ({
    conversations: state.conversations.map((c) =>
      c.id === conversationId ? { ...c, unreadCount: 0 } : c
    )
  }))
}));
```