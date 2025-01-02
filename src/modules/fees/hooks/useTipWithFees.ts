import { useState } from 'react';
import { useBlockchain } from '../../../hooks/useBlockchain';
import { feeService } from '../services/feeService';
import { useFeeCalculator } from './useFeeCalculator';
import { validateTipAmount } from '../utils/validation';
import { handleFeeError } from '../utils/errors';

export function useTipWithFees(creatorId: string) {
  const [processing, setProcessing] = useState(false);
  const { tipCreator } = useBlockchain();
  const { calculateTransactionFees } = useFeeCalculator();

  const sendTip = async (amount: string) => {
    const validationError = validateTipAmount(amount);
    if (validationError) {
      throw new Error(validationError);
    }

    try {
      setProcessing(true);
      
      // Record transaction before blockchain interaction
      const tx = await feeService.recordFeeTransaction(creatorId, amount);
      
      try {
        // Send tip through blockchain
        await tipCreator(creatorId, amount);
        // Update transaction status on success
        await feeService.updateTransactionStatus(tx.id, 'completed');
      } catch (error) {
        // Update transaction status on failure
        await feeService.updateTransactionStatus(tx.id, 'failed');
        throw error;
      }
      
      return tx;
    } catch (error) {
      throw handleFeeError(error);
    } finally {
      setProcessing(false);
    }
  };

  return {
    sendTip,
    processing
  };
}