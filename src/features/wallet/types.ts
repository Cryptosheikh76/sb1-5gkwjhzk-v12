```typescript
export interface WalletConnection {
  address: string;
  network: string;
  connected: boolean;
}

export interface WalletTransaction {
  hash: string;
  amount: string;
  currency: string;
  timestamp: string;
}

export interface WalletBalance {
  currency: string;
  value: string;
}
```