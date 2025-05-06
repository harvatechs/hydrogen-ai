
import { Message } from './message';

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastUpdatedAt: Date;
}
