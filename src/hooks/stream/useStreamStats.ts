import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

interface StreamStats {
  tipCount: number;
  totalTips: string;
}

export function useStreamStats(streamId: string) {
  const [stats, setStats] = useState<StreamStats>({
    tipCount: 0,
    totalTips: '0'
  });

  const updateStats = useCallback(async () => {
    const { data, error } = await supabase
      .from('stream_tips')
      .select('amount')
      .eq('stream_id', streamId);

    if (!error && data) {
      const tipCount = data.length;
      const totalTips = data.reduce((sum, tip) => sum + Number(tip.amount), 0).toString();
      setStats({ tipCount, totalTips });
    }
  }, [streamId]);

  return { stats, updateStats };
}