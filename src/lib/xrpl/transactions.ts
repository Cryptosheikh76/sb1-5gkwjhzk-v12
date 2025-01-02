import { Client } from 'xrpl';
import { TokenTransaction } from './types';
import { supabase } from '../supabase';

export async function getTransactionHistory(address: string): Promise<TokenTransaction[]> {
  const { data, error } = await supabase
    .from('token_transactions')
    .select('*')
    .or(`from.eq.${address},to.eq.${address}`)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data as TokenTransaction[];
}

export async function recordTransaction(
  client: Client,
  transaction: Omit<TokenTransaction, 'timestamp'>
): Promise<void> {
  const { error } = await supabase
    .from('token_transactions')
    .insert({
      ...transaction,
      timestamp: new Date().toISOString()
    });

  if (error) throw error;
}