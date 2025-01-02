import { Payment, Client } from 'xrpl';
import { getXrplClient } from './client';

export const AGC_TOKEN = {
  currency: 'AGC',
  issuer: process.env.VITE_AGC_ISSUER_ADDRESS
};

export async function sendTokens(
  client: Client,
  destination: string,
  amount: string
): Promise<string> {
  const payment: Payment = {
    TransactionType: 'Payment',
    Account: client.wallet!.address,
    Destination: destination,
    Amount: {
      currency: AGC_TOKEN.currency,
      issuer: AGC_TOKEN.issuer,
      value: amount
    }
  };

  const result = await client.submitAndWait(payment);
  return result.result.hash;
}

export async function getTokenBalance(address: string): Promise<string> {
  const client = await getXrplClient();
  
  try {
    const response = await client.request({
      command: 'account_lines',
      account: address,
      peer: AGC_TOKEN.issuer
    });

    const balance = response.result.lines.find(
      line => line.currency === AGC_TOKEN.currency
    );

    return balance?.balance || '0';
  } finally {
    client.disconnect();
  }
}