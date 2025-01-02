import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import { getProvider } from '../provider';
import { AGC_TOKEN } from '../constants/tokens';
import { formatTokenAmount } from '../utils/conversion';

export function useTokenBalance(chainId: string) {
  const { address } = useWallet();
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || !chainId) return;

    const fetchBalance = async () => {
      try {
        setLoading(true);
        setError(null);

        const provider = await getProvider(chainId);
        const tokenAddress = AGC_TOKEN[chainId as keyof typeof AGC_TOKEN];
        
        if (!tokenAddress) {
          throw new Error('Token not supported on this network');
        }

        const contract = new ethers.Contract(
          tokenAddress,
          ['function balanceOf(address) view returns (uint256)'],
          provider
        );

        const balance = await contract.balanceOf(address);
        setBalance(formatTokenAmount(balance.toString(), 'AGC'));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch balance');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [address, chainId]);

  return { balance, loading, error };
}