import { Client } from 'xrpl';
import { Chain, TransactionRequest } from '../../types/blockchain';

export const xrplConfig: Chain = {
  id: 'xrpl',
  name: 'XRP Ledger',
  nativeCurrency: {
    name: 'XRP',
    symbol: 'XRP',
    decimals: 6
  },
  rpcUrl: 'wss://s1.ripple.com'
};

export async function sendXRPLTransaction(tx: TransactionRequest) {
  const client = new Client(xrplConfig.rpcUrl);
  await client.connect();
  const response = await client.submitAndWait(tx);
  await client.disconnect();
  return response;
}