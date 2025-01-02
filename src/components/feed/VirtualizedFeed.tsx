import { useCallback, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { VideoCard } from '../video/VideoCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useInView } from 'react-intersection-observer';

interface VirtualizedFeedProps {
  items: any[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  estimateSize?: number;
}

export function VirtualizedFeed({
  items,
  loading,
  hasMore,
  onLoadMore,
  estimateSize = 400
}: VirtualizedFeedProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { ref: loadMoreRef, inView } = useInView();

  // Load more when bottom is visible
  if (inView && hasMore && !loading && onLoadMore) {
    onLoadMore();
  }

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 5
  });

  const renderItem = useCallback((index: number) => {
    const item = items[index];
    return (
      <div
        key={item.id}
        ref={index === items.length - 1 ? loadMoreRef : undefined}
        className="py-2"
      >
        <VideoCard video={item} />
      </div>
    );
  }, [items, loadMoreRef]);

  return (
    <div 
      ref={parentRef} 
      className="h-screen overflow-auto"
      style={{ contain: 'strict' }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            {renderItem(virtualItem.index)}
          </div>
        ))}
      </div>
      {loading && <LoadingSpinner className="my-4" />}
    </div>
  );
}