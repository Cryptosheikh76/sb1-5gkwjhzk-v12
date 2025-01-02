import { useState } from 'react';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { EmoteMenu } from './EmoteMenu';
import { validateChatMessage } from '../../utils/chat';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showEmotes, setShowEmotes] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateChatMessage(message)) return;
    
    onSendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800">
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message..."
          disabled={disabled}
          className="flex-1"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowEmotes(!showEmotes)}
        >
          😊
        </Button>
        <Button type="submit" disabled={disabled || !message.trim()}>
          Send
        </Button>
      </div>

      {showEmotes && (
        <div className="absolute bottom-full right-0 mb-2">
          <EmoteMenu onSelect={(emote) => {
            setMessage(prev => prev + emote);
            setShowEmotes(false);
          }} />
        </div>
      )}
    </form>
  );
}