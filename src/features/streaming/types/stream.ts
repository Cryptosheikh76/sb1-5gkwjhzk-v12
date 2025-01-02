export interface StreamQuality {
  width: number;
  height: number;
  bitrate: number;
  fps: number;
  codec: string;
}

export interface StreamSettings {
  streamKey: string;
  serverUrl: string;
  resolution?: string;
  bitrate?: number;
  fps?: number;
  title?: string;
}

export interface StreamStatus {
  isLive: boolean;
  viewerCount: number;
  duration: number;
  health: 'good' | 'poor' | 'offline';
  quality: StreamQuality;
}

export interface Stream {
  id: string;
  title: string;
  url: string;
  isLive: boolean;
  creator?: {
    id: string;
    username: string;
    avatar_url?: string;
    wallet_address?: string;
  };
  startedAt?: string;
  endedAt?: string;
}