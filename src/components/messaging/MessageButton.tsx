```typescript
import { useState } from 'react';
import { Button } from '../ui/Button';
import { MessageModal } from '../../features/messaging/components/MessageModal';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

export function MessageButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="rounded-full shadow-neon hover:shadow-neon-blue transition-shadow"
      >
        <ChatBubbleLeftIcon className="w-5 h-5 hover-icon" />
      </Button>

      <MessageModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
```