```typescript
import { useState, useCallback } from 'react';
import { Client } from 'xrpl';
import { useAuth } from '../../../hooks/useAuth';

export function useXamanWallet() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const { user } = useAuth();

  const connect = useCallback(async () => {
    if (!user) {
      setError('Must be logged in to connect wallet');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Initialize XRPL client
      const client = new Client('wss://s.altnet.rippletest.net:51233');
      await client.connect();

      // Generate QR code payload
      const payload = {
        txjson: {
          TransactionType: 'SignIn',
          Account: user.id
        }
      };

      // Convert payload to QR code
      const qrData = btoa(JSON.stringify(payload));
      setQrCode(`data:image/png;base64,${qrData}`);

      // Start polling for connection status
      const interval = setInterval(async () => {
        try {
          const response = await client.request({
            command: 'account_info',
            account: user.id
          });

          if (response.result.account_data) {
            clearInterval(interval);
            setConnected(true);
            client.disconnect();
          }
        } catch (error) {
          // Continue polling
        }
      }, 2000);

      // Stop polling after 2 minutes
      setTimeout(() => {
        clearInterval(interval);
        if (!connected) {
          setError('Connection timeout');
        }
      }, 120000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const disconnect = useCallback(() => {
    setConnected(false);
    setQrCode(null);
  }, []);

  return {
    connect,
    disconnect,
    connected,
    loading,
    error,
    qrCode
  };
}
```