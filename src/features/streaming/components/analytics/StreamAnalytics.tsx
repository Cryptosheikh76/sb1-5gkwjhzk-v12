import { Card } from '../../../../components/ui/Card';
import { useStreamAnalytics } from '../../hooks/useStreamAnalytics';
import { LoadingSpinner } from '../../../../components/common/LoadingSpinner';
import { formatNumber } from '../../../../utils/format';

export function StreamAnalytics() {
  const { stats, loading } = useStreamAnalytics();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-400">Peak Viewers</h3>
        <p className="text-2xl font-bold mt-1">{formatNumber(stats.peakViewers)}</p>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-400">Average Watch Time</h3>
        <p className="text-2xl font-bold mt-1">{stats.avgWatchTime} mins</p>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-400">Chat Messages</h3>
        <p className="text-2xl font-bold mt-1">{formatNumber(stats.chatMessages)}</p>
      </Card>

      <Card className="p-4 col-span-full">
        <h3 className="font-medium mb-4">Viewer Activity</h3>
        <div className="h-64 bg-zinc-800 rounded-lg">
          {/* Add viewer graph here */}
        </div>
      </Card>
    </div>
  );
}