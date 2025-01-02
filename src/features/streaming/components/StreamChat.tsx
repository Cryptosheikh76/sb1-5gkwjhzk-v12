```typescript
import { useEffect, useRef } from 'react';
import { useStreamChat } from '../hooks/useStreamChat';
import { useAuth } from '../../../hooks/useAuth';
import { ChatMessage } from './chat/ChatMessage';
import { ChatInput } from './chat/ChatInput';
import { Card } from '../../../components/ui/Card';

interface StreamChatProps {
  streamId: string;
  className?: string;
}

export function StreamChat({ streamId, className }: StreamChatProps) {
  const { messages, sendMessage } = useStreamChat(streamId);
  const { user } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(message => (
          <ChatMessage
            key={message.id}
            message={message}
            isCurrentUser={message.userId === user?.id}
          />
        ))}
        <div ref={chatEndRef} />
      </div>

      <ChatInput
        onSendMessage={sendMessage}
        disabled={!user}
        className="border-t border-zinc-800 p-4"
      />
    </Card>
  );
}
```