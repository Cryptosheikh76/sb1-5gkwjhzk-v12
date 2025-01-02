import { Card } from '../../../components/ui/Card';
import { formatNumber } from '../../../utils/format';
import type { RevenueStats } from '../types';

interface RevenueBreakdownProps {
  stats: RevenueStats;
}

export function RevenueBreakdown({ stats }: RevenueBreakdownProps) {
  const sources = [
    { label: 'NFT Sales', value: stats.revenueByType.nft_sales },
    { label: 'Content Tips', value: stats.revenueByType.tips },
    { label: 'Stream Revenue', value: stats.revenueByType.streams },
    { label: 'Engagement Rewards', value: stats.revenueByType.engagement }
  ];

  const total = sources.reduce((sum, source) => sum + parseFloat(source.value), 0);

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Revenue Sources</h2>
      <div className="space-y-4">
        {sources.map(source => {
          const percentage = (parseFloat(source.value) / total) * 100;
          
          return (
            <div key={source.label}>
              <div className="flex justify-between mb-1">
                <span>{source.label}</span>
                <span>{formatNumber(source.value)} AGC</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}