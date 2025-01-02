import { useEffect, useRef } from 'react';
import { Message } from '../types';
import { useAuth } from '../../../hooks/useAuth';
import { Avatar } from '../../../components/ui/Avatar';
import { formatRelativeTime } from '../../../utils/date';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const { user } = useAuth();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(message => {
        const isOwn = message.senderId === user?.id;
        
        return (
          <div
            key={message.id}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              max-w-[80%] rounded-lg p-3
              ${isOwn ? 'bg-primary text-black' : 'bg-zinc-800'}
            `}>
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-75">
                {formatRelativeTime(message.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}