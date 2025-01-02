import { useState, useCallback } from 'react';
import { Client, Wallet } from 'xrpl';
import { getXrplClient } from '../lib/xrpl/client';

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const xrplClient = await getXrplClient();
      const fundResult = await xrplClient.fundWallet();
      
      setWallet(fundResult.wallet);
      setClient(xrplClient);
      
      return fundResult.wallet;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (client) {
      await client.disconnect();
      setClient(null);
    }
    setWallet(null);
  }, [client]);

  return {
    wallet,
    client,
    loading,
    error,
    connect,
    disconnect
  };
}