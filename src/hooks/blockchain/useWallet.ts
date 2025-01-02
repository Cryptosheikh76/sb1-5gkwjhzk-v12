import { useState, useCallback } from 'react';
import { connectWallet, WalletError } from '../../lib/blockchain/provider';
import { handleBlockchainError } from '../../lib/blockchain/errors';

export function useWallet() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const signer = await connectWallet();
      const address = await signer.getAddress();
      
      setAddress(address);
      setConnected(true);
      return signer;
    } catch (err) {
      const error = handleBlockchainError(err);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setConnected(false);
    setAddress(null);
    setError(null);
  }, []);

  return {
    connected,
    address,
    loading,
    error,
    connect,
    disconnect
  };
}