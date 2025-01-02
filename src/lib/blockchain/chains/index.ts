import { Chain } from '../../types/blockchain';
import { ethereumConfig } from './ethereum';
import { xrplConfig } from './xrpl';
import { solanaConfig } from './solana';

export const supportedChains: Chain[] = [
  ethereumConfig,
  xrplConfig,
  solanaConfig
];

export * from './ethereum';
export * from './xrpl';
export * from './solana';