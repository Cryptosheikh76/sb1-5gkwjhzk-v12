import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { PaymentTransaction } from '../types';

export function usePaymentHistory(userId: string) {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const { data, error: dbError } = await supabase
          .from('payment_transactions')
          .select(`
            *,
            sender:users!sender_id(username),
            recipient:users!recipient_id(username)
          `)
          .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
          .order('created_at', { ascending: false });

        if (dbError) throw dbError;
        setTransactions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [userId]);

  return { transactions, loading, error };
}