import { supabase } from '../../../lib/supabase';
import { STREAM_ERRORS } from '../constants';
import type { Stream, StreamSettings } from '../types';

export const streamService = {
  async createStream(userId: string, settings: StreamSettings): Promise<Stream> {
    const { data, error } = await supabase
      .from('streams')
      .insert({
        user_id: userId,
        title: settings.title,
        is_live: false,
        stream_key: settings.streamKey
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateStreamStatus(streamId: string, isLive: boolean): Promise<void> {
    const { error } = await supabase
      .from('streams')
      .update({ 
        is_live: isLive,
        [isLive ? 'started_at' : 'ended_at']: new Date().toISOString()
      })
      .eq('id', streamId);

    if (error) throw new Error(error.message);
  },

  async getStreamByKey(streamKey: string): Promise<Stream | null> {
    const { data, error } = await supabase
      .from('streams')
      .select(`
        *,
        creator:users(
          id,
          username,
          avatar_url,
          wallet_address
        )
      `)
      .eq('stream_key', streamKey)
      .single();

    if (error) return null;
    return data;
  }
};