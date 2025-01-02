```typescript
import { createContext, useContext, useState } from 'react';
import { Message } from '../types/messaging';

interface MessageContextType {
  messages: Message[];
  sendMessage: (recipientId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
}

const MessageContext = createContext<MessageContextType | null>(null);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (recipientId: string, content: string) => {
    // Implementation
  };

  const deleteMessage = async (messageId: string) => {
    // Implementation
  };

  return (
    <MessageContext.Provider value={{ messages, sendMessage, deleteMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}
```