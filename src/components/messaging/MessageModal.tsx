```typescript
import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useMessages } from '../../context/MessageContext';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MessageModal({ isOpen, onClose }: MessageModalProps) {
  const [content, setContent] = useState('');
  const { sendMessage } = useMessages();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await sendMessage('recipient-id', content);
      setContent('');
      onClose();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Message">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          as="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message..."
          rows={4}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!content.trim()}>
            Send
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```