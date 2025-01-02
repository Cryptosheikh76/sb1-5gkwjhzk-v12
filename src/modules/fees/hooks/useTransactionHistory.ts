import { useState, useEffect } from 'react';
import { FeeTransaction } from '../types';
import { feeService } from '../services/feeService';

export function useTransactionHistory(creatorId: string) {
  const [transactions, setTransactions] = useState<FeeTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTransactions() {
      try {
        setLoading(true);
        const data = await feeService.getFeeTransactions(creatorId);
        setTransactions(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [creatorId]);

  return { transactions, loading, error };
}