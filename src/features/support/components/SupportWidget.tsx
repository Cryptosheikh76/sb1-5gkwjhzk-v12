```typescript
import { useState } from 'react';
import { useSupportTickets } from '../hooks/useSupportTickets';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { createTicket, loading, error } = useSupportTickets();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    try {
      await createTicket({ subject, message });
      setSubject('');
      setMessage('');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  return (
    <div className="fixed bottom-24 right-4">
      {isOpen ? (
        <div className="bg-surface p-4 rounded-lg shadow-lg w-80">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <Input
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              as="textarea"
              rows={4}
              required
            />
            {error && <Alert type="error" message={error} />}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading || !subject.trim() || !message.trim()}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="shadow-lg"
        >
          Need Help?
        </Button>
      )}
    </div>
  );
}
```