import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

interface ModerationItem {
  id: string;
  userId: string;
  username: string;
  message: string;
  severity: 'high' | 'medium';
  createdAt: string;
}

interface BannedUser {
  id: string;
  username: string;
  bannedAt: string;
  reason: string;
}

export function useStreamModeration(streamId: string) {
  const [moderationQueue, setModerationQueue] = useState<ModerationItem[]>([]);
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const loadModeration = async () => {
      try {
        // Load moderation queue
        const { data: queueData } = await supabase
          .from('stream_moderation_queue')
          .select(`
            *,
            user:users(username)
          `)
          .eq('stream_id', streamId)
          .order('created_at', { ascending: false });

        if (queueData) {
          setModerationQueue(queueData);
        }

        // Load banned users
        const { data: bannedData } = await supabase
          .from('stream_bans')
          .select(`
            *,
            user:users(username)
          `)
          .eq('stream_id', streamId);

        if (bannedData) {
          setBannedUsers(bannedData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load moderation data');
      } finally {
        setLoading(false);
      }
    };

    loadModeration();

    // Subscribe to moderation updates
    const subscription = supabase
      .channel(`stream:${streamId}:moderation`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'stream_moderation_queue'
      }, () => loadModeration())
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [streamId, user]);

  const handleBanUser = async (userId: string) => {
    if (!user) return;

    const { error: banError } = await supabase
      .from('stream_bans')
      .insert({
        stream_id: streamId,
        user_id: userId,
        moderator_id: user.id
      });

    if (banError) throw banError;
  };

  const handleTimeoutUser = async (userId: string, duration: number) => {
    if (!user) return;

    const { error: timeoutError } = await supabase
      .from('stream_timeouts')
      .insert({
        stream_id: streamId,
        user_id: userId,
        moderator_id: user.id,
        duration
      });

    if (timeoutError) throw timeoutError;
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!user) return;

    const { error: deleteError } = await supabase
      .from('stream_messages')
      .delete()
      .eq('id', messageId);

    if (deleteError) throw deleteError;
  };

  const handleUnbanUser = async (userId: string) => {
    if (!user) return;

    const { error: unbanError } = await supabase
      .from('stream_bans')
      .delete()
      .eq('stream_id', streamId)
      .eq('user_id', userId);

    if (unbanError) throw unbanError;
  };

  return {
    moderationQueue,
    bannedUsers,
    loading,
    error,
    handleBanUser,
    handleTimeoutUser,
    handleDeleteMessage,
    handleUnbanUser
  };
}