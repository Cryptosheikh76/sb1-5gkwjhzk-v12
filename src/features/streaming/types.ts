export interface ChatMessage {
  id: string;
  streamId: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
    avatar_url?: string;
  };
}

export interface StreamTip {
  id: string;
  streamId: string;
  amount: string;
  transactionHash: string;
  createdAt: string;
}