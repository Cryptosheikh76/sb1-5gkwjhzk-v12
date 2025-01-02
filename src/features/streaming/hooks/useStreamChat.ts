```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { ChatMessage } from '../types';

export function useStreamChat(streamId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load initial messages
    const loadMessages = async () => {
      const { data } = await supabase
        .from('stream_messages')
        .select(`
          *,
          user:users(username, avatar_url)
        `)
        .eq('stream_id', streamId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (data) {
        setMessages(data as ChatMessage[]);
      }
    };

    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`stream:${streamId}:chat`)
      .on('broadcast', { event: 'new_message' }, ({ payload }) => {
        setMessages(prev => [...prev, payload as ChatMessage]);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [streamId]);

  const sendMessage = async (content: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('stream_messages')
      .insert({
        stream_id: streamId,
        user_id: user.id,
        content
      });

    if (error) throw error;
  };

  return { messages, sendMessage };
}
```