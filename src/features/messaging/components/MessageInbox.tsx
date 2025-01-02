import { useState } from 'react';
import { ConversationList } from './ConversationList';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Card } from '../../../components/ui/Card';

export function MessageInbox() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="font-semibold">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <ConversationList onSelect={setSelectedConversation} />
          </div>
        </div>
      </Card>

      {/* Message Thread */}
      <Card className="lg:col-span-2 overflow-hidden">
        {selectedConversation ? (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <MessageList conversationId={selectedConversation} />
            </div>
            <div className="p-4 border-t border-zinc-800">
              <MessageInput conversationId={selectedConversation} />
            </div>
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