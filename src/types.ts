export interface User {
  id: string;
  email: string;
  nickname?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
  model: string;
}

export interface DietLog {
  id: string;
  user_id?: string;
  food_name: string;
  calories: number;
  nutrition_info: {
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    vitamins?: string[];
  };
  image_url?: string;
  visibility: 'private' | 'friends' | 'public';
  created_at: string;
  advice?: string;
}

export interface Channel {
  id: string;
  name: string;
  is_private: boolean;
  owner_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  description?: string;
}

export interface ChannelMessage {
  id: string;
  channel_id: string;
  user_id: string;
  user_email: string;
  user_nickname: string;
  user_avatar?: string;
  content: string;
  ip_location?: string;
  translated_content?: string;
  created_at: string;
}

export interface GameScore {
  id?: string;
  user_id: string;
  user_name?: string;
  game_id: 'tetris' | 'racing' | 'gomoku' | 'chess' | 'snake' | 'aeroplane';
  score: number;
  created_at?: string;
}

export type ViewMode = 'home' | 'chat' | 'recipe' | 'channel' | 'game';
