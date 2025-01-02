import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="pt-4 pb-20 text-center">
        <p>Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <p className="text-gray-400">{user.username}</p>
      </div>

      <AnalyticsDashboard />
    </div>
  );
}