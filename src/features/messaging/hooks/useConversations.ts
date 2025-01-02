```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Conversation } from '../types/conversation';
import { useAuth } from '../../../hooks/useAuth';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const loadConversations = async () => {
      try {
        const { data } = await supabase
          .from('conversations_v3')
          .select(`
            id,
            title,
            type,
            created_at,
            updated_at,
            participants:conversation_participants_v3(
              user:users(username, avatar_url)
            ),
            messages:messages_v3(
              content,
              created_at
            )
          `)
          .order('updated_at', { ascending: false });

        if (data) {
          const formattedConversations = data.map(conv => ({
            ...conv,
            last_message: conv.messages?.[0]
          }));
          setConversations(formattedConversations);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();

    // Subscribe to updates
    const subscription = supabase
      .channel('conversations')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'conversations_v3'
      }, 
      () => loadConversations())
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return { conversations, loading };
}
```