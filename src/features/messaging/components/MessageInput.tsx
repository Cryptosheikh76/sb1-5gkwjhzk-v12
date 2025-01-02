import { useState } from 'react';
import { useMessages } from '../hooks/useMessages';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export function MessageInput({ conversationId }: { conversationId: string }) {
  const [message, setMessage] = useState('');
  const { sendMessage } = useMessages(conversationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button type="submit" disabled={!message.trim()}>
        Send
      </Button>
    </form>
  );
}