```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { VideoPlayer } from '../../components/video/VideoPlayer';
import { describe, it, expect, vi } from 'vitest';

describe('VideoPlayer', () => {
  const mockProps = {
    src: 'test-video.mp4',
    poster: 'test-poster.jpg',
    onTimeUpdate: vi.fn(),
    onEnded: vi.fn()
  };

  it('renders video element with correct props', () => {
    render(<VideoPlayer {...mockProps} />);
    const video = screen.getByRole('video') as HTMLVideoElement;
    
    expect(video).toBeInTheDocument();
    expect(video.src).toContain('test-video.mp4');
    expect(video.poster).toContain('test-poster.jpg');
  });

  it('handles play/pause correctly', () => {
    render(<VideoPlayer {...mockProps} />);
    const video = screen.getByRole('video') as HTMLVideoElement;
    const playButton = screen.getByRole('button', { name: /play/i });

    // Mock video methods
    video.play = vi.fn();
    video.pause = vi.fn();

    // Test play
    fireEvent.click(playButton);
    expect(video.play).toHaveBeenCalled();

    // Test pause
    fireEvent.click(playButton);
    expect(video.pause).toHaveBeenCalled();
  });

  it('calls onTimeUpdate when video time changes', () => {
    render(<VideoPlayer {...mockProps} />);
    const video = screen.getByRole('video');

    fireEvent.timeUpdate(video);
    expect(mockProps.onTimeUpdate).toHaveBeenCalled();
  });
});
```