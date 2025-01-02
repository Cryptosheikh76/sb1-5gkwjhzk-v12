```typescript
export const XRPL_NETWORKS = {
  MAINNET: 'wss://xrplcluster.com',
  TESTNET: 'wss://s.altnet.rippletest.net:51233',
  DEVNET: 'wss://s.devnet.rippletest.net:51233'
} as const;

export const AGC_TOKEN = {
  currency: 'AGC',
  issuer: process.env.VITE_AGC_ISSUER_ADDRESS,
  decimals: 6
} as const;

export const TRANSACTION_TYPES = {
  PAYMENT: 'Payment',
  TRUST_SET: 'TrustSet'
} as const;

export const PLATFORM_FEE_ADDRESS = process.env.VITE_PLATFORM_WALLET;
```