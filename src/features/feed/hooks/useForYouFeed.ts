import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { Video } from '../types';

interface FeedPreferences {
  watchTime: Record<string, number>;
  categories: string[];
  interactions: Record<string, number>;
}

export function useForYouFeed() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!user) return null;
      
      const { data } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      return data as FeedPreferences | null;
    };

    const fetchVideos = async () => {
      try {
        setLoading(true);
        const preferences = await fetchUserPreferences();
        
        let query = supabase
          .from('videos')
          .select(`
            *,
            creator:users(username, avatar_url),
            metrics:video_metrics(view_count, like_count)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (preferences?.categories?.length) {
          query = query.in('category', preferences.categories);
        }

        const { data, error } = await query.limit(20);
        
        if (error) throw error;
        
        // Sort videos based on user preferences
        const sortedVideos = data.sort((a, b) => {
          const scoreA = calculateRelevanceScore(a, preferences);
          const scoreB = calculateRelevanceScore(b, preferences);
          return scoreB - scoreA;
        });

        setVideos(sortedVideos);
      } catch (error) {
        console.error('Error fetching feed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [user]);

  return { videos, loading };
}

function calculateRelevanceScore(video: Video, preferences: FeedPreferences | null): number {
  if (!preferences) return 0;

  let score = 0;

  // Watch time weight
  const categoryWatchTime = preferences.watchTime[video.category] || 0;
  score += categoryWatchTime * 0.4;

  // Engagement weight
  const interactions = preferences.interactions[video.id] || 0;
  score += interactions * 0.3;

  // Recency weight
  const hoursAgo = (Date.now() - new Date(video.created_at).getTime()) / (1000 * 60 * 60);
  score += (1 / (hoursAgo + 1)) * 0.3;

  return score;
}