```typescript
export interface TokenBalance {
  currency: string;
  value: string;
  issuer: string;
}

export interface TokenTransaction {
  hash: string;
  amount: string;
  from: string;
  to: string;
  timestamp: string;
  type: 'send' | 'receive' | 'reward' | 'fee';
}

export interface WalletState {
  address: string;
  balance: TokenBalance[];
  isConnected: boolean;
}
```