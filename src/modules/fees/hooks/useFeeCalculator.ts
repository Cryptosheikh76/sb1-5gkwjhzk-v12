import { useState, useCallback } from 'react';
import { calculateFees } from '../utils/calculations';
import { FeeCalculation } from '../types';

export function useFeeCalculator() {
  const [calculation, setCalculation] = useState<FeeCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const calculateTransactionFees = useCallback((amount: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = calculateFees(amount);
      setCalculation(result);
      return result;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to calculate fees';
      setError(errorMessage);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    calculation,
    loading,
    error,
    calculateTransactionFees
  };
}