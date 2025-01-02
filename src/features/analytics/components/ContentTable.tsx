import { ContentMetrics } from '../types/metrics';
import { formatRelativeTime } from '../../../utils/date';

interface ContentTableProps {
  metrics: ContentMetrics[];
}

export function ContentTable({ metrics }: ContentTableProps) {
  return (
    <div className="bg-zinc-800 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-zinc-700">
            <th className="p-4 text-left">Content</th>
            <th className="p-4 text-left">Views</th>
            <th className="p-4 text-left">Engagement</th>
            <th className="p-4 text-left">Published</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((item) => (
            <tr key={item.id} className="border-t border-zinc-700">
              <td className="p-4">{item.title}</td>
              <td className="p-4">{item.views.toLocaleString()}</td>
              <td className="p-4">
                {item.likes} likes • {item.comments} comments
              </td>
              <td className="p-4">{formatRelativeTime(item.publishedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}