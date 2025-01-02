import { useAnalytics } from '../../hooks/useAnalytics';
import {
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  HeartIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-zinc-800 p-6 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-zinc-700 rounded-full">
          {icon}
        </div>
        <div>
          <h3 className="text-gray-400 text-sm">{title}</h3>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const { stats, loading, error } = useAnalytics();

  if (loading) return <div className="text-center p-8">Loading analytics...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Analytics Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Views"
          value={stats.total_views.toLocaleString()}
          icon={<ChartBarIcon className="w-6 h-6 text-blue-400" />}
        />
        
        <StatCard
          title="Unique Viewers"
          value={stats.unique_viewers.toLocaleString()}
          icon={<UserGroupIcon className="w-6 h-6 text-green-400" />}
        />
        
        <StatCard
          title="Watch Time"
          value={`${Math.round(stats.watch_time / 60)} mins`}
          icon={<ClockIcon className="w-6 h-6 text-yellow-400" />}
        />
        
        <StatCard
          title="Engagement Rate"
          value={`${(stats.engagement_rate * 100).toFixed(1)}%`}
          icon={<HeartIcon className="w-6 h-6 text-pink-400" />}
        />
        
        <StatCard
          title="Bot Interactions"
          value={stats.bot_interactions.toLocaleString()}
          icon={<ShieldExclamationIcon className="w-6 h-6 text-red-400" />}
        />
      </div>
    </div>
  );
}