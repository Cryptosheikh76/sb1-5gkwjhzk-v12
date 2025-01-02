import { useEffect, useRef } from 'react';
import { useLiveChat } from '../hooks/useLiveChat';
import { useAuth } from '../../../hooks/useAuth';
import { Avatar } from '../../../components/ui/Avatar';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { formatRelativeTime } from '../../../utils/date';

interface LiveChatProps {
  streamId: string;
}

export function LiveChat({ streamId }: LiveChatProps) {
  const { messages, sendMessage } = useLiveChat(streamId);
  const { user } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    if (!input.value.trim()) return;
    
    sendMessage(input.value);
    input.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-3">
            <Avatar
              size="sm"
              src={message.user.avatar_url}
              fallback={message.user.username}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{message.user.username}</span>
                <span className="text-xs text-gray-400">
                  {formatRelativeTime(message.createdAt)}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800">
          <div className="flex gap-2">
            <Input
              name="message"
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit">Send</Button>
          </div>
        </form>
      ) : (
        <div className="p-4 text-center text-sm text-gray-400 border-t border-zinc-800">
          Sign in to join the chat
        </div>
      )}
    </div>
  );
}