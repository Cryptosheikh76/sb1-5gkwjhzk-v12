```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface RevenueStats {
  totalEarnings: string;
  platformFees: string;
  revenueByType: {
    nft_sales: string;
    tips: string;
    subscriptions: string;
  };
  rewardsByType: {
    engagement: string;
    referrals: string;
  };
}

export function useRevenueStats(userId: string) {
  const [stats, setStats] = useState<RevenueStats>({
    totalEarnings: '0',
    platformFees: '0',
    revenueByType: {
      nft_sales: '0',
      tips: '0',
      subscriptions: '0'
    },
    rewardsByType: {
      engagement: '0',
      referrals: '0'
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [revenueResponse, rewardsResponse] = await Promise.all([
          supabase
            .from('revenue_transactions')
            .select('*')
            .eq('creator_id', userId),
          supabase
            .from('reward_distributions')
            .select('*')
            .eq('creator_address', userId)
        ]);

        if (revenueResponse.data && rewardsResponse.data) {
          const revenue = revenueResponse.data;
          const rewards = rewardsResponse.data;

          setStats({
            totalEarnings: calculateTotal([...revenue, ...rewards]),
            platformFees: calculatePlatformFees(revenue),
            revenueByType: {
              nft_sales: calculateByType(revenue, 'nft_sale'),
              tips: calculateByType(revenue, 'tip'),
              subscriptions: calculateByType(revenue, 'subscription')
            },
            rewardsByType: {
              engagement: calculateRewardsByType(rewards, 'engagement'),
              referrals: calculateRewardsByType(rewards, 'referral')
            }
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [userId]);

  return { stats, loading };
}

function calculateTotal(transactions: any[]): string {
  return transactions
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
    .toFixed(6);
}

function calculatePlatformFees(transactions: any[]): string {
  return transactions
    .reduce((sum, tx) => sum + parseFloat(tx.platform_fee), 0)
    .toFixed(6);
}

function calculateByType(transactions: any[], type: string): string {
  return transactions
    .filter(tx => tx.type === type)
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
    .toFixed(6);
}

function calculateRewardsByType(rewards: any[], type: string): string {
  return rewards
    .filter(reward => reward.type === type)
    .reduce((sum, reward) => sum + parseFloat(reward.amount), 0)
    .toFixed(6);
}
```