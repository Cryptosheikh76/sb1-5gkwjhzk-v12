import { useState } from 'react';
import { useWallet } from '../../../hooks/blockchain/useWallet';
import { supabase } from '../../../lib/supabase';
import { analytics } from '../../../lib/analytics';

interface TipParams {
  creatorId: string;
  creatorAddress: string;
  amount: string;
}

export function useTipCreator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { connect } = useWallet();

  const sendTip = async ({ creatorId, creatorAddress, amount }: TipParams) => {
    try {
      setLoading(true);
      setError(null);

      // Connect wallet
      const signer = await connect();

      // Send transaction
      const tx = await signer.sendTransaction({
        to: creatorAddress,
        value: amount
      });

      // Wait for confirmation
      await tx.wait();

      // Record tip in database
      await supabase
        .from('stream_tips')
        .insert({
          creator_id: creatorId,
          amount,
          transaction_hash: tx.hash
        });

      // Track analytics
      analytics.trackEvent('tip_sent', {
        creatorId,
        amount
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send tip');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendTip, loading, error };
}