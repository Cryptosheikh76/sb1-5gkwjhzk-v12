import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Sticker } from '../types/editor';

export function useStickerLibrary() {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStickers = async () => {
      try {
        const { data, error } = await supabase
          .from('stickers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setStickers(data);
      } finally {
        setLoading(false);
      }
    };

    fetchStickers();
  }, []);

  return { stickers, loading };
}