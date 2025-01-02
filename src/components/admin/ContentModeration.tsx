import { ContentModerationQueue } from '../../features/moderation/components/ContentModerationQueue';

export default function ContentModeration() {
  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Content Moderation</h2>
        <ContentModerationQueue />
      </div>
    </div>
  );
}