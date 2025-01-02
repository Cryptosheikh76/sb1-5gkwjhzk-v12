```typescript
import { Client } from 'xrpl';
import { sendTokens } from './token';
import { PLATFORM_FEES, REWARD_RATES } from '../revenue/constants';
import { supabase } from '../../supabase';

export async function distributeEngagementRewards(
  client: Client,
  metrics: {
    contentId: string;
    creatorAddress: string;
    likes: number;
    comments: number;
    shares: number;
    views: number;
  }
): Promise<string> {
  // Calculate total reward
  const rewardAmount = (
    metrics.likes * parseFloat(REWARD_RATES.LIKE) +
    metrics.comments * parseFloat(REWARD_RATES.COMMENT) +
    metrics.shares * parseFloat(REWARD_RATES.SHARE) +
    metrics.views * parseFloat(REWARD_RATES.VIEW)
  ).toFixed(6);

  // Send tokens
  const txHash = await sendTokens(client, metrics.creatorAddress, rewardAmount);

  // Record distribution
  await supabase.from('token_distributions').insert({
    content_id: metrics.contentId,
    creator_address: metrics.creatorAddress,
    amount: rewardAmount,
    type: 'engagement',
    transaction_hash: txHash
  });

  return txHash;
}

export async function distributeSaleRevenue(
  client: Client,
  data: {
    amount: string;
    creatorAddress: string;
    saleType: keyof typeof PLATFORM_FEES;
  }
): Promise<{platformFee: string; creatorAmount: string}> {
  const value = parseFloat(data.amount);
  const feePercent = PLATFORM_FEES[data.saleType];
  
  // Calculate amounts
  const platformFee = (value * feePercent / 100).toFixed(6);
  const creatorAmount = (value - parseFloat(platformFee)).toFixed(6);

  // Send platform fee
  await sendTokens(client, process.env.VITE_PLATFORM_WALLET!, platformFee);

  // Send creator amount
  await sendTokens(client, data.creatorAddress, creatorAmount);

  return { platformFee, creatorAmount };
}
```