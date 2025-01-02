```typescript
import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { validateMessage, validateRecipient } from '../utils/validation';

export function useMessages() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const sendMessage = useCallback(async (recipientId: string, content: string) => {
    if (!user) throw new Error('Must be logged in');

    const messageError = validateMessage(content);
    if (messageError) throw new Error(messageError);

    const recipientError = validateRecipient(recipientId);
    if (recipientError) throw new Error(recipientError);

    try {
      setLoading(true);

      // Create or get conversation
      const { data: conversation } = await supabase
        .from('conversations')
        .insert({
          participant_ids: [user.id, recipientId]
        })
        .select()
        .single();

      if (!conversation) throw new Error('Failed to create conversation');

      // Send message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: user.id,
          recipient_id: recipientId,
          content: content.trim()
        });

      if (messageError) throw messageError;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { sendMessage, loading };
}
```