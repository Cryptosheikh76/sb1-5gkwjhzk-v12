export interface DuetVideo {
  id: string;
  originalVideoId: string;
  creatorId: string;
  url: string;
  layout: 'side-by-side' | 'picture-in-picture';
  created_at: string;
}

export interface Reaction {
  id: string;
  videoId: string;
  creatorId: string;
  type: 'laugh' | 'heart' | 'surprise' | 'fire';
  timestamp: number;
  created_at: string;
}