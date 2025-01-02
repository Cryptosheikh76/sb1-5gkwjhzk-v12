```typescript
import { useState } from 'react';
import { useWallet } from '../../../hooks/useWallet';
import { supabase } from '../../../lib/supabase';
import { sendTokens } from '../../../lib/xrpl/token';

export function useLiveTipping(streamId: string) {
  const { client } = useWallet();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendTip = async (creatorAddress: string, amount: string) => {
    if (!client) {
      throw new Error('Wallet not connected');
    }

    try {
      setProcessing(true);
      setError(null);

      // Send tokens on XRPL
      const txHash = await sendTokens(client, creatorAddress, amount);

      // Record tip in database
      await supabase.from('stream_tips').insert({
        stream_id: streamId,
        amount,
        transaction_hash: txHash
      });

      // Emit tip event for real-time updates
      const channel = supabase.channel(`stream:${streamId}`);
      channel.send({
        type: 'broadcast',
        event: 'tip',
        payload: { amount, txHash }
      });

      return txHash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send tip');
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  return {
    sendTip,
    processing,
    error
  };
}
```