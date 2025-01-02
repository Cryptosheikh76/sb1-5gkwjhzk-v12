export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  is_staff?: boolean;
  is_verified?: boolean;
  followers_count?: number;
}

export interface Creator {
  username: string;
  avatar_url?: string;
}

export interface Video {
  id: string;
  user_id: string;
  url: string;
  description: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  thumbnail_url?: string;
  creator?: Creator;
}

export interface Stream {
  id: string;
  user_id: string;
  title: string;
  is_live: boolean;
  requires_invite: boolean;
  stream_key: string;
  started_at?: string;
  ended_at?: string;
  creator?: Creator;
}