import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { VideoMetadata } from '../types';
import { fetchVideos } from '../api/videoApi';
import { useVideoAccess } from './useVideoAccess';

export function useVideoFeed(initialPage = 1) {
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);
  const { ref, inView } = useInView();
  const { checkAccess } = useVideoAccess();

  const loadVideos = async () => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      const { data, hasMore: more } = await fetchVideos(page);
      
      // Filter videos based on token access
      const accessibleVideos = await Promise.all(
        data.map(async (video) => {
          const hasAccess = await checkAccess(video);
          return hasAccess ? video : null;
        })
      );

      setVideos(prev => [...prev, ...accessibleVideos.filter(Boolean) as VideoMetadata[]]);
      setHasMore(more);
      setPage(p => p + 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inView) {
      loadVideos();
    }
  }, [inView]);

  return { videos, loading, hasMore };
}