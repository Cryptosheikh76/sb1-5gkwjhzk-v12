```typescript
import { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useMessages } from '../hooks/useMessages';

interface MessageComposerProps {
  recipientId: string;
  onSend?: () => void;
}

export function MessageComposer({ recipientId, onSend }: MessageComposerProps) {
  const [content, setContent] = useState('');
  const { sendMessage, loading } = useMessages();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await sendMessage(recipientId, content);
      setContent('');
      onSend?.();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800">
      <div className="flex gap-2">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !content.trim()}>
          Send
        </Button>
      </div>
    </form>
  );
}
```