import { supabase } from '../lib/supabase';
import type { Video, Creator } from '../types';

export const videoService = {
  async getVideos(page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        users (
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    return data as (Video & { users: Pick<Creator, 'username' | 'avatar_url'> })[];
  },

  async uploadVideo(userId: string, file: File, description: string) {
    // Upload video file to Supabase Storage
    const filename = `${userId}/${Date.now()}-${file.name}`;
    const { data: fileData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filename, file);

    if (uploadError) throw uploadError;

    // Create video record
    const { data, error } = await supabase
      .from('videos')
      .insert({
        user_id: userId,
        url: fileData.path,
        description
      })
      .select()
      .single();

    if (error) throw error;
    return data as Video;
  }
};