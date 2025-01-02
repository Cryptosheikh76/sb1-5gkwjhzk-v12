import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Creator {
  id: string;
  username: string;
  avatar_url: string | null;
  is_verified: boolean;
  followers_count: number;
}

export function useCreatorManagement() {
  const [creators, setCreators] = useState<Creator[]>([]);

  useEffect(() => {
    loadCreators();
  }, []);

  const loadCreators = async () => {
    const { data } = await supabase
      .from('users')
      .select('id, username, avatar_url, is_verified, followers_count')
      .order('followers_count', { ascending: false });
    
    if (data) setCreators(data);
  };

  const verifyCreator = async (creatorId: string) => {
    const { error } = await supabase
      .from('users')
      .update({ is_verified: true })
      .eq('id', creatorId);
    
    if (!error) loadCreators();
  };

  const promoteCreator = async (creatorId: string) => {
    const { error } = await supabase
      .from('promoted_creators')
      .insert({ creator_id: creatorId });
    
    if (!error) loadCreators();
  };

  return {
    creators,
    verifyCreator,
    promoteCreator
  };
}