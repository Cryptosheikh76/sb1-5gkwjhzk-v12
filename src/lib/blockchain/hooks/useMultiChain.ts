import { useState, useCallback } from 'react';
import { Chain } from '../../types/blockchain';
import { supportedChains } from '../chains';
import { WalletError } from '../errors';
import { useWallet } from './useWallet';

export function useMultiChain() {
  const [selectedChain, setSelectedChain] = useState<Chain>(supportedChains[0]);
  const { connect, disconnect } = useWallet();

  const switchChain = useCallback(async (chainId: string) => {
    const chain = supportedChains.find(c => c.id === chainId);
    if (!chain) {
      throw new WalletError('Unsupported chain');
    }

    try {
      await disconnect();
      setSelectedChain(chain);
      await connect();
    } catch (error) {
      throw new WalletError('Failed to switch chain');
    }
  }, [connect, disconnect]);

  return {
    selectedChain,
    supportedChains,
    switchChain
  };
}