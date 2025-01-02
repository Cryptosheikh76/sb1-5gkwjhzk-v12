import { useState, useEffect } from 'react';
import { TokenTransaction } from '../lib/xrpl/types';
import { getTransactionHistory } from '../lib/xrpl/transactions';
import { useWallet } from './useWallet';

export function useTransactionHistory() {
  const { wallet } = useWallet();
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wallet?.address) return;

    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const history = await getTransactionHistory(wallet.address);
        setTransactions(history);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
    // Refresh every minute
    const interval = setInterval(loadTransactions, 60000);
    return () => clearInterval(interval);
  }, [wallet?.address]);

  return { transactions, loading, error };
}