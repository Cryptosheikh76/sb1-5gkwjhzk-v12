export interface Currency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface Chain {
  id: string;
  name: string;
  nativeCurrency: Currency;
  rpcUrl: string;
}

export interface TransactionRequest {
  to?: string;
  from?: string;
  value?: string;
  data?: Uint8Array;
  chainId?: string;
}

export interface WalletInfo {
  address: string;
  chainId: string;
  balance: string;
}