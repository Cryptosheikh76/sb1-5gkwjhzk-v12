import { useState } from 'react';
import { sendTokens } from '../lib/xrpl/token';
import { calculateFees } from '../lib/xrpl/fees';
import { useWallet } from './useWallet';

export function useTokenTransfer() {
  const { client } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transfer = async (to: string, amount: string) => {
    if (!client) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const { platformFee, creatorAmount } = calculateFees(amount);

      // Send creator amount
      const creatorTxHash = await sendTokens(client, to, creatorAmount);

      // Send platform fee
      const platformTxHash = await sendTokens(
        client,
        process.env.VITE_PLATFORM_WALLET!,
        platformFee
      );

      return { creatorTxHash, platformTxHash };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    transfer,
    loading,
    error
  };
}