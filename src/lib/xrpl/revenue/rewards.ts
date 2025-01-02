```typescript
import { Client } from 'xrpl';
import { REWARD_RATES } from './constants';
import { sendTokens } from '../token';
import { supabase } from '../../supabase';

export async function calculateEngagementRewards(metrics: {
  likes: number;
  comments: number;
  shares: number;
  views: number;
}): Promise<string> {
  const total = 
    metrics.likes * parseFloat(REWARD_RATES.LIKE) +
    metrics.comments * parseFloat(REWARD_RATES.COMMENT) +
    metrics.shares * parseFloat(REWARD_RATES.SHARE) +
    metrics.views * parseFloat(REWARD_RATES.VIEW);
    
  return total.toFixed(6);
}

export async function distributeRewards(
  client: Client,
  creatorAddress: string,
  amount: string,
  contentId: string
): Promise<string> {
  // Send reward tokens
  const txHash = await sendTokens(client, creatorAddress, amount);

  // Record reward distribution
  await supabase
    .from('reward_distributions')
    .insert({
      content_id: contentId,
      creator_address: creatorAddress,
      amount,
      transaction_hash: txHash,
      timestamp: new Date().toISOString()
    });

  return txHash;
}
```