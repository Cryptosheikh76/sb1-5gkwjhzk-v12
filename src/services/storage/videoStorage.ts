import { supabase } from '../../lib/supabase';
import { ApiError } from '../../utils/types';

export const videoStorage = {
  async upload(userId: string, file: File) {
    const filename = `${userId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(filename, file);

    if (error) {
      throw new ApiError('Failed to upload video', error.message);
    }

    return data.path;
  },

  getPublicUrl(path: string) {
    const { data } = supabase.storage
      .from('videos')
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
};