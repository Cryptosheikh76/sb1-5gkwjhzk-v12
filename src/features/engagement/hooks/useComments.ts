import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Comment } from '../types';

export function useComments(contentId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [contentId]);

  const loadComments = async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('comments')
        .select('*, users!inner(username, avatar_url)')
        .eq('content_id', contentId)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setComments(data as Comment[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  return { comments, loading, error };
}