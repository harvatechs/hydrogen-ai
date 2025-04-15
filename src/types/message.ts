
export type MessageRole = "user" | "assistant" | "system" | "function" | "error";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  isError?: boolean;
}

export interface ApiConfig {
  key: string;
  url: string;
  model: string;
}

export interface UserSettings {
  theme: string;
  fontSize: string;
  apiConfig: ApiConfig;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  isLoading?: boolean;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdatedAt: Date;
}

export type Theme = 'dark' | 'light' | 'system';
export type FontSize = 'small' | 'normal' | 'large';

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }[];
}
