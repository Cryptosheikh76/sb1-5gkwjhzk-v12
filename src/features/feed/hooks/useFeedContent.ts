import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { Video } from '../types';

const ITEMS_PER_PAGE = 5;

export function useFeedContent() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
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
        .from('videos')
        .select('*, users!inner(username, avatar_url), video_metrics!inner(view_count, like_count)')
        .range(from, to)
        .order('created_at', { ascending: false });

      // Apply personalization if user is logged in
      if (user?.id) {
        query = query.or(`creator_id.eq.${user.id},is_public.eq.true`);
      } else {
        query = query.eq('is_public', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      setVideos(prev => [...prev, ...(data as Video[])]);
      setHasMore(data.length === ITEMS_PER_PAGE);
      setPage(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [page, user?.id, loading, hasMore]);

  return {
    videos,
    loading,
    hasMore,
    loadMore
  };
}