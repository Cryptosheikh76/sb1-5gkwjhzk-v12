```typescript
import { useState, useEffect } from 'react';
import { getTokenBalance } from '../lib/xrpl/token';
import { useWallet } from './useWallet';

export function useTokenBalance() {
  const { wallet } = useWallet();
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wallet?.address) return;

    const fetchBalance = async () => {
      try {
        setLoading(true);
        setError(null);
        const balance = await getTokenBalance(wallet.address);
        setBalance(balance);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch balance');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    // Poll balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [wallet?.address]);

  return { balance, loading, error };
}
```