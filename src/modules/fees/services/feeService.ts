import { supabase } from '../../../lib/supabase';
import { FeeTransaction } from '../types';
import { calculateFees } from '../utils/calculations';

export const feeService = {
  async recordFeeTransaction(
    creatorId: string,
    amount: string
  ): Promise<FeeTransaction> {
    const fees = calculateFees(amount);
    
    const { data, error } = await supabase
      .from('fee_transactions')
      .insert({
        creator_id: creatorId,
        amount: fees.originalAmount,
        fee_amount: fees.feeAmount,
        creator_amount: fees.creatorAmount,
        status: 'pending'
      })
      .select()
      .single();
      
    if (error) throw error;
    return data as FeeTransaction;
  },
  
  async getFeeTransactions(creatorId: string): Promise<FeeTransaction[]> {
    const { data, error } = await supabase
      .from('fee_transactions')
      .select('*')
      .eq('creator_id', creatorId)
      .order('timestamp', { ascending: false });
      
    if (error) throw error;
    return data as FeeTransaction[];
  },
  
  async updateTransactionStatus(
    transactionId: string,
    status: FeeTransaction['status']
  ): Promise<void> {
    const { error } = await supabase
      .from('fee_transactions')
      .update({ status })
      .eq('id', transactionId);
      
    if (error) throw error;
  }
};