import { Client } from 'xrpl';
import { sendTokens } from './token';

const REWARD_RATES = {
  like: '0.1',      // 0.1 AGC per like
  comment: '0.2',   // 0.2 AGC per comment
  share: '0.5',     // 0.5 AGC per share
  view: '0.05'      // 0.05 AGC per view
} as const;

export async function calculateEngagementRewards(metrics: {
  likes: number;
  comments: number;
  shares: number;
  views: number;
}): Promise<string> {
  const total = 
    metrics.likes * parseFloat(REWARD_RATES.like) +
    metrics.comments * parseFloat(REWARD_RATES.comment) +
    metrics.shares * parseFloat(REWARD_RATES.share) +
    metrics.views * parseFloat(REWARD_RATES.view);
    
  return total.toFixed(6);
}

export async function distributeRewards(
  client: Client,
  creatorAddress: string,
  amount: string
): Promise<string> {
  return sendTokens(client, creatorAddress, amount);
}