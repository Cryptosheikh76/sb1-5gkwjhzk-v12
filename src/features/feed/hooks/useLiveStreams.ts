import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { Stream } from '../types';

const ITEMS_PER_PAGE = 10;

export function useLiveStreams() {
  const { user } = useAuth();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('streams')
        .select('*, users!inner(username, avatar_url), stream_metrics!inner(viewer_count)')
        .eq('is_live', true)
        .range(from, to)
        .order('viewer_count', { ascending: false });

      // Filter private streams if user is not logged in
      if (!user) {
        query = query.eq('is_private', false);
      }

      const { data, error } = await query;

      if (error) throw error;

      setStreams(prev => [...prev, ...(data as Stream[])]);
      setHasMore(data.length === ITEMS_PER_PAGE);
      setPage(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [page, user, loading, hasMore]);

  return {
    streams,
    loading,
    hasMore,
    loadMore
  };
}