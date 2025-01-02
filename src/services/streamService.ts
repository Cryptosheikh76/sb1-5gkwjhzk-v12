import { supabase } from '../lib/supabase';
import type { Stream } from '../types';

export const streamService = {
  async getPublicStreams() {
    const { data, error } = await supabase
      .from('streams')
      .select(`
        *,
        users (
          username,
          avatar_url
        )
      `)
      .eq('is_live', true)
      .eq('requires_invite', false)
      .order('started_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createStream(title: string, requiresInvite: string) {
    const streamKey = crypto.randomUUID();
    
    const { data, error } = await supabase
      .from('streams')
      .insert({
        title,
        requires_invite: requiresInvite === 'true',
        stream_key: streamKey
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Stream;
  },

  async updateStreamStatus(streamId: string, isLive: boolean) {
    const updates = isLive 
      ? { is_live: true, started_at: new Date().toISOString() }
      : { is_live: false, ended_at: new Date().toISOString() };

    const { data, error } = await supabase
      .from('streams')
      .update(updates)
      .eq('id', streamId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Stream;
  }
};