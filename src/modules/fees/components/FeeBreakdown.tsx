import { FeeCalculation } from '../types';

interface FeeBreakdownProps {
  calculation: FeeCalculation;
  className?: string;
}

export function FeeBreakdown({ calculation, className }: FeeBreakdownProps) {
  return (
    <div className={className}>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Original Amount:</span>
          <span>{calculation.originalAmount} ETH</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Platform Fee:</span>
          <span>-{calculation.feeAmount} ETH</span>
        </div>
        <div className="flex justify-between font-medium border-t pt-2">
          <span>Creator Receives:</span>
          <span>{calculation.creatorAmount} ETH</span>
        </div>
      </div>
    </div>
  );
}