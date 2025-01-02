import { useState, useCallback } from 'react';
import { supabase } from '../../../../lib/supabase';

export function useChatModeration(streamId: string) {
  const [loading, setLoading] = useState(false);

  const timeoutUser = useCallback(async (userId: string, duration: number) => {
    try {
      setLoading(true);
      await supabase
        .from('stream_timeouts')
        .insert({
          stream_id: streamId,
          user_id: userId,
          duration
        });
    } finally {
      setLoading(false);
    }
  }, [streamId]);

  const banUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      await supabase
        .from('stream_bans')
        .insert({
          stream_id: streamId,
          user_id: userId
        });
    } finally {
      setLoading(false);
    }
  }, [streamId]);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      setLoading(true);
      await supabase
        .from('stream_messages')
        .update({ is_deleted: true })
        .eq('id', messageId);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    timeoutUser,
    banUser,
    deleteMessage,
    loading
  };
}