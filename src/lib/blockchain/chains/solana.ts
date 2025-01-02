import { Connection, Transaction, PublicKey } from '@solana/web3.js';
import { Chain, TransactionRequest } from '../../types/blockchain';

export const solanaConfig: Chain = {
  id: 'solana',
  name: 'Solana',
  nativeCurrency: {
    name: 'SOL',
    symbol: 'SOL',
    decimals: 9
  },
  rpcUrl: 'https://api.mainnet-beta.solana.com'
};

export async function sendSolanaTransaction(tx: TransactionRequest) {
  const connection = new Connection(solanaConfig.rpcUrl);
  const transaction = Transaction.from(tx.data);
  return connection.sendTransaction(transaction);
}