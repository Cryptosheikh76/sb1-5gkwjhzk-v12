import { LiveChat } from '../features/streaming/components/LiveChat';
import { LiveTipButton } from '../features/streaming/components/LiveTipButton';
import { StreamStats } from '../components/stream/StreamStats';

export default function Live() {
  const streamId = "current-stream-id"; // This would come from route params or state
  const creatorAddress = "creator-ethereum-address"; // This would come from stream data

  return (
    <div className="pt-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Live Stream</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main content - Video and Stats */}
        <div className="lg:col-span-3 space-y-4">
          <div className="aspect-video bg-zinc-900 rounded-lg">
            {/* Video player would go here */}
          </div>

          <div className="flex justify-between items-center">
            <StreamStats streamId={streamId} />
            <LiveTipButton 
              streamId={streamId}
              creatorAddress={creatorAddress}
            />
          </div>
        </div>

        {/* Chat sidebar */}
        <div className="lg:col-span-1 h-[600px]">
          <LiveChat streamId={streamId} />
        </div>
      </div>
    </div>
  );
}