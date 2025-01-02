import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { ChatMessage } from '../types/chat';

export function useChatHistory(streamId: string, maxMessages: number) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial messages
    const loadMessages = async () => {
      const { data } = await supabase
        .from('stream_messages')
        .select(`
          *,
          user:users(username, badges)
        `)
        .eq('stream_id', streamId)
        .order('created_at', { ascending: false })
        .limit(maxMessages);

      if (data) {
        setMessages(data.reverse());
      }
      setLoading(false);
    };

    loadMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`stream:${streamId}:chat`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'stream_messages',
        filter: `stream_id=eq.${streamId}`
      }, payload => {
        setMessages(prev => {
          const newMessages = [...prev, payload.new as ChatMessage];
          if (newMessages.length > maxMessages) {
            return newMessages.slice(-maxMessages);
          }
          return newMessages;
        });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [streamId, maxMessages]);

  return { messages, loading };
}