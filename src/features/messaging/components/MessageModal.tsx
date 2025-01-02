```typescript
import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useMessages } from '../hooks/useMessages';
import { validateMessage } from '../utils/validation';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId?: string;
}

export function MessageModal({ isOpen, onClose, recipientId }: MessageModalProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { sendMessage, loading } = useMessages();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateMessage(content);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await sendMessage(recipientId || '', content);
      setContent('');
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send message');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Message">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          as="textarea"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError(null);
          }}
          placeholder="Type your message..."
          rows={4}
          error={error}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading || !content.trim()}
            loading={loading}
          >
            Send
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```