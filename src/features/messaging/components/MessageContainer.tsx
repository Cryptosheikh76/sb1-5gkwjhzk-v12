```typescript
import { useState } from 'react';
import { ConversationList } from './ConversationList';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import { Card } from '../../../components/ui/Card';
import { useMessageStore } from '../hooks/useMessageStore';

export function MessageContainer() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const { conversations, markAsRead } = useMessageStore();

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    markAsRead(id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
      <Card className="lg:col-span-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="font-semibold">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <ConversationList onSelect={handleSelectConversation} />
          </div>
        </div>
      </Card>

      <Card className="lg:col-span-2 overflow-hidden">
        {selectedConversation ? (
          <div className="h-full flex flex-col">
            <MessageList 
              messages={conversations.find(c => c.id === selectedConversation)?.messages || []}
            />
            <MessageComposer recipientId={selectedConversation} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a conversation to start messaging
          </div>
        )}
      </Card>
    </div>
  );
}
```