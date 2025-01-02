import { Chain } from '../../types/blockchain';

export const SUPPORTED_NETWORKS: Chain[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrl: import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/'
  },
  {
    id: 'xrpl',
    name: 'XRP Ledger',
    nativeCurrency: {
      name: 'XRP',
      symbol: 'XRP',
      decimals: 6
    },
    rpcUrl: import.meta.env.VITE_XRPL_RPC_URL || 'wss://s1.ripple.com'
  },
  {
    id: 'solana',
    name: 'Solana',
    nativeCurrency: {
      name: 'SOL',
      symbol: 'SOL',
      decimals: 9
    },
    rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
  }
];