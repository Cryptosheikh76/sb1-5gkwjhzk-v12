export interface Sound {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  waveform: number[];
  usageCount: number;
  category: string;
  tags: string[];
}

export interface SoundUsage {
  id: string;
  soundId: string;
  videoId: string;
  startTime: number;
  duration: number;
}