import { User } from '../../types';

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  hashtags: string[];
  creatorId: string;
  creator?: User;
  duration: number;
  thumbnailUrl: string;
  ipfsHash: string;
  tokenGated: boolean;
  requiredTokens?: string[];
}

export interface VideoEngagement {
  likes: number;
  comments: number;
  tips: {
    amount: string;
    currency: string;
  }[];
}