import { useState, useEffect } from 'react';
import { videoApi } from '../../services/api/videoApi';
import { handleStreamError } from '../../utils/errors';
import type { Video } from '../../types';

export function useVideos(initialPage = 1) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);

  const loadVideos = async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await videoApi.getVideos(pageNum);
      
      setVideos(prev => pageNum === 1 ? response.data! : [...prev, ...response.data!]);
      setHasMore(response.hasMore);
      setPage(response.nextPage);
    } catch (e) {
      setError(handleStreamError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos(initialPage);
  }, [initialPage]);

  return {
    videos,
    loading,
    error,
    hasMore,
    loadMore: () => loadVideos(page)
  };
}