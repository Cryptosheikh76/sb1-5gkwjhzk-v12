import { useSystemHealth } from '../hooks/useSystemHealth';
import { Card } from '../../../components/ui/Card';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { Alert } from '../../../components/ui/Alert';

export function SystemHealth() {
  const { metrics, loading, error } = useSystemHealth();

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">System Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>CPU Usage</span>
              <span className={`font-medium ${
                metrics.cpu > 80 ? 'text-red-400' : 'text-green-400'
              }`}>{metrics.cpu}%</span>
            </div>
            <div className="w-full bg-surface-light rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-red-400 h-2 rounded-full transition-all"
                style={{ width: `${metrics.cpu}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Memory Usage</span>
              <span className={`font-medium ${
                metrics.memory > 80 ? 'text-red-400' : 'text-green-400'
              }`}>{metrics.memory}%</span>
            </div>
            <div className="w-full bg-surface-light rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-red-400 h-2 rounded-full transition-all"
                style={{ width: `${metrics.memory}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Active Services</h2>
        <div className="space-y-4">
          {metrics.services.map(service => (
            <div key={service.name} className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
              <div>
                <p className="font-medium">{service.name}</p>
                <p className="text-sm text-gray-400">{service.status}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                service.status === 'healthy' ? 'bg-green-400' : 'bg-red-400'
              }`} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}