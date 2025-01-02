```typescript
import { Client } from 'xrpl';
import { PLATFORM_FEES, PLATFORM_WALLET } from './constants';
import { sendTokens } from '../token';
import { supabase } from '../../supabase';

export async function distributeFees(
  client: Client,
  amount: string,
  feeType: keyof typeof PLATFORM_FEES
): Promise<{platformFee: string; creatorAmount: string}> {
  const value = parseFloat(amount);
  const feePercent = PLATFORM_FEES[feeType];
  const platformFee = (value * feePercent) / 100;
  const creatorAmount = value - platformFee;

  // Send platform fee
  if (platformFee > 0) {
    await sendTokens(
      client,
      PLATFORM_WALLET!,
      platformFee.toFixed(6)
    );
  }

  return {
    platformFee: platformFee.toFixed(6),
    creatorAmount: creatorAmount.toFixed(6)
  };
}

export async function recordRevenue(data: {
  type: 'nft_sale' | 'tip' | 'subscription';
  amount: string;
  platformFee: string;
  creatorAmount: string;
  creatorId: string;
  transactionHash: string;
}) {
  const { error } = await supabase
    .from('revenue_transactions')
    .insert({
      ...data,
      timestamp: new Date().toISOString()
    });

  if (error) throw error;
}
```