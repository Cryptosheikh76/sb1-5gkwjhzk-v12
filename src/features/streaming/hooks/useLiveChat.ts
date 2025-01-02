import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { ChatMessage } from '../types';

export function useLiveChat(streamId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

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
    const subscription = supabase
      .channel(`stream:${streamId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'stream_messages',
        filter: `stream_id=eq.${streamId}`
      }, payload => {
        setMessages(prev => [...prev, payload.new as ChatMessage]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [streamId]);

  const sendMessage = async (content: string) => {
    const { error } = await supabase
      .from('stream_messages')
      .insert({
        stream_id: streamId,
        content
      });

    if (error) throw error;
  };

  return { messages, sendMessage };
}