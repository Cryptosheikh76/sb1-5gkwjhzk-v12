export function calculateStreamStats(viewerCounts: number[]): {
  peak: number;
  average: number;
} {
  if (!viewerCounts.length) {
    return { peak: 0, average: 0 };
  }

  const peak = Math.max(...viewerCounts);
  const average = Math.round(
    viewerCounts.reduce((sum, count) => sum + count, 0) / viewerCounts.length
  );

  return { peak, average };
}

export function formatViewerCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}