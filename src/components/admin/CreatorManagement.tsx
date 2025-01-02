import { useCreatorManagement } from '../../hooks/admin/useCreatorManagement';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

export default function CreatorManagement() {
  const { creators, promoteCreator, verifyCreator } = useCreatorManagement();

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Creator Management</h2>
        
        <div className="space-y-4">
          {creators?.map((creator) => (
            <div key={creator.id} className="flex items-center justify-between p-4 bg-zinc-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <img 
                  src={creator.avatar_url || '/default-avatar.png'} 
                  className="w-12 h-12 rounded-full"
                  alt={creator.username}
                />
                <div>
                  <p className="font-medium flex items-center">
                    {creator.username}
                    {creator.is_verified && (
                      <CheckBadgeIcon className="w-5 h-5 text-blue-400 ml-1" />
                    )}
                  </p>
                  <p className="text-sm text-gray-400">Followers: {creator.followers_count}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => verifyCreator(creator.id)}
                  className="px-4 py-2 text-sm rounded-lg bg-blue-500 hover:bg-blue-600"
                >
                  {creator.is_verified ? 'Remove Verification' : 'Verify'}
                </button>
                <button
                  onClick={() => promoteCreator(creator.id)}
                  className="px-4 py-2 text-sm rounded-lg bg-purple-500 hover:bg-purple-600"
                >
                  Promote Content
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}