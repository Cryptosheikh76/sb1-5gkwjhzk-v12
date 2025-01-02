```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { LastMessage } from '../types/conversation';

export function useConversationMessages(conversationId: string) {
  const [messages, setMessages] = useState<LastMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data } = await supabase
          .from('messages_v3')
          .select('content, created_at')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: false });

        if (data) {
          setMessages(data);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages_v3',
        filter: `conversation_id=eq.${conversationId}`
      }, 
      payload => {
        setMessages(prev => [payload.new as LastMessage, ...prev]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId]);

  return { messages, loading };
}
```