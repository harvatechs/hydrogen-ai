
export type MessageRole = "user" | "assistant" | "system" | "error";

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

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastUpdatedAt: Date;
}
