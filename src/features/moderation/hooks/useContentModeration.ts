import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { FlaggedContent, ModerationAction } from '../types';
import { analytics } from '../../../lib/analytics';

export function useContentModeration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFlaggedContent = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: dbError } = await supabase
        .from('flagged_content')
        .select(`
          *,
          creator:users(
            id,
            username,
            avatar_url,
            is_verified
          )
        `)
        .order('flags_count', { ascending: false })
        .eq('status', 'pending');

      if (dbError) throw dbError;
      return data as FlaggedContent[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load flagged content');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const moderateContent = async (contentId: string, action: ModerationAction, reason: string) => {
    try {
      setLoading(true);

      // Start a Supabase transaction
      const { data: content, error: contentError } = await supabase
        .from('flagged_content')
        .update({ status: 'reviewed' })
        .eq('id', contentId)
        .select()
        .single();

      if (contentError) throw contentError;

      // Apply moderation action
      const { error: actionError } = await supabase
        .from('moderation_actions')
        .insert({
          content_id: contentId,
          action,
          reason,
          content_type: content.content_type
        });

      if (actionError) throw actionError;

      // Update content status based on action
      if (action === 'block') {
        await supabase
          .from(content.content_type + 's') // videos, streams, etc.
          .update({ status: 'blocked' })
          .eq('id', content.content_id);
      }

      analytics.trackEvent('content_moderated', {
        contentId,
        action,
        contentType: content.content_type
      });

      return content;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to moderate content');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loadFlaggedContent,
    moderateContent,
    loading,
    error
  };
}