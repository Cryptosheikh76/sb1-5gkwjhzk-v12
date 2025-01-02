import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { useChatHistory } from '../../hooks/useChatHistory';

interface ChatHistoryProps {
  streamId: string;
  maxMessages?: number;
}

export function ChatHistory({ streamId, maxMessages = 200 }: ChatHistoryProps) {
  const { messages, loading } = useChatHistory(streamId, maxMessages);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return <div className="p-4 text-center">Loading chat history...</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-1 p-2">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          username={message.username}
          content={message.content}
          timestamp={message.timestamp}
          badges={message.badges}
          isDeleted={message.isDeleted}
          isHighlighted={message.isHighlighted}
        />
      ))}
      <div ref={chatEndRef} />
    </div>
  );
}