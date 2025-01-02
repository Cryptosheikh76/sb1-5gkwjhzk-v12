import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

export function useRevenue() {
  const [revenue, setRevenue] = useState({
    total: '0',
    thisMonth: '0',
    pending: '0',
    sources: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRevenue = async () => {
      if (!user) return;

      try {
        const { data } = await supabase
          .from('revenue_stats')
          .select('*')
          .eq('creator_id', user.id)
          .single();

        if (data) {
          setRevenue(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [user]);

  return { revenue, loading };
}