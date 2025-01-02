import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface FlaggedContent {
  id: string;
  title: string;
  creator_username: string;
  flags_count: number;
}

interface CreatorData {
  username: string;
}

export function useContentModeration() {
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>([]);

  useEffect(() => {
    loadFlaggedContent();
  }, []);

  const loadFlaggedContent = async () => {
    const { data } = await supabase
      .from('flagged_content')
      .select(`
        id,
        title,
        creator:users(username),
        flags_count
      `)
      .order('flags_count', { ascending: false });
    
    if (data) {
      const formattedData: FlaggedContent[] = data.map(item => ({
        id: item.id,
        title: item.title,
        creator_username: (item.creator as CreatorData[])[0]?.username || 'Unknown',
        flags_count: item.flags_count
      }));
      setFlaggedContent(formattedData);
    }
  };

  const blockContent = async (contentId: string) => {
    const { error } = await supabase
      .from('videos')
      .update({ status: 'blocked' })
      .eq('id', contentId);
    
    if (!error) loadFlaggedContent();
  };

  const limitContent = async (contentId: string) => {
    const { error } = await supabase
      .from('videos')
      .update({ reach_limited: true })
      .eq('id', contentId);
    
    if (!error) loadFlaggedContent();
  };

  return {
    flaggedContent,
    blockContent,
    limitContent
  };
}