import { supabase } from '../../lib/supabase';
import { videoStorage } from '../storage/videoStorage';
import { ApiError } from '../../utils/errors';
import type { Video } from '../../types';
import type { PaginatedResponse } from '../../types/api';

export const videoApi = {
  async getVideos(page = 1, limit = 10): Promise<PaginatedResponse<Video[]>> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('videos')
      .select('*, users!inner(username, avatar_url)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new ApiError('Failed to fetch videos', error.code);
    }

    return {
      data: data as Video[],
      error: null,
      hasMore: count ? from + data.length < count : false,
      nextPage: page + 1
    };
  },

  async createVideo(userId: string, file: File, description: string): Promise<Video> {
    const path = await videoStorage.upload(userId, file);
    const url = videoStorage.getPublicUrl(path);

    const { data, error } = await supabase
      .from('videos')
      .insert({
        user_id: userId,
        url,
        description
      })
      .select()
      .single();

    if (error) {
      throw new ApiError('Failed to create video record', error.code);
    }

    return data as Video;
  }
};