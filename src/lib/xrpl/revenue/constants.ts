```typescript
export const PLATFORM_FEES = {
  NFT_SALE: 5, // 5% platform fee on NFT sales
  CONTENT_TIP: 3, // 3% platform fee on content tips
  STREAM_TIP: 3, // 3% platform fee on stream tips
  SUBSCRIPTION: 10 // 10% platform fee on subscriptions
} as const;

export const REWARD_RATES = {
  LIKE: '0.1', // 0.1 AGC per like
  COMMENT: '0.2', // 0.2 AGC per comment
  SHARE: '0.5', // 0.5 AGC per share
  VIEW: '0.05' // 0.05 AGC per view
} as const;

export const PLATFORM_WALLET = process.env.VITE_PLATFORM_WALLET;
```