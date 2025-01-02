import { useState } from 'react';
import { useWallet } from './useWallet';
import { getTokenContract } from '../utils/contracts';
import { parseTokenAmount } from '../utils/conversion';
import { TransactionError } from '../errors';

export function useTokenTransfer(tokenAddress: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address, chainId } = useWallet();

  const transfer = async (to: string, amount: string, symbol: string) => {
    try {
      setLoading(true);
      setError(null);

      const contract = await getTokenContract(tokenAddress, chainId!);
      const parsedAmount = parseTokenAmount(amount, symbol);
      
      const tx = await contract.transfer(to, parsedAmount);
      await tx.wait();

      return tx.hash;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transfer failed';
      setError(message);
      throw new TransactionError(message);
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