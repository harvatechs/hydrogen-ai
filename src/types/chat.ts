
import { Message, MessageRole } from "./message";
import { AtomType } from "./atoms";

export interface ChatState {
  messages: Message[];
  apiKey: string;
  apiUrl: string;
  isProcessing: boolean;
  conversations: Conversation[];
  currentConversationId: string | null;
  model: string;
  activeAtom: AtomType | null;
  atomParams: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastUpdatedAt: Date;
}

export type ChatAction =
  | { type: "ADD_MESSAGE"; message: Message; conversationId?: string }
  | { type: "UPDATE_MESSAGE"; id: string; content: string }
  | { type: "SET_LOADING"; id: string; isLoading: boolean }
  | { type: "SET_API_KEY"; apiKey: string }
  | { type: "SET_API_URL"; apiUrl: string }
  | { type: "SET_PROCESSING"; isProcessing: boolean }
  | { type: "CREATE_CONVERSATION"; conversation: Conversation }
  | { type: "SET_CURRENT_CONVERSATION"; id: string }
  | { type: "UPDATE_CONVERSATION_TITLE"; id: string; title: string }
  | { type: "CLEAR_CONVERSATION"; id: string }
  | { type: "DELETE_CONVERSATION"; id: string }
  | { type: "SET_MODEL"; model: string }
  | { type: "CLEAR_MESSAGES" }
  | { type: "SET_ACTIVE_ATOM"; atomType: AtomType | null; params?: string };

export interface ChatContextProps {
  messages: Message[];
  apiKey: string;
  apiUrl: string;
  conversations: Conversation[];
  currentConversationId: string | null;
  model: string;
  activeAtom: AtomType | null;
  atomParams: string;
  theme: string;
  fontSize: string;
  setApiKey: (key: string) => void;
  setApiUrl: (url: string) => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  isProcessing: boolean;
  setTheme: (theme: string) => void;
  setFontSize: (size: string) => void;
  createNewConversation: () => void;
  setCurrentConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
  clearConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  setModel: (model: string) => void;
  setActiveAtom: (type: AtomType | null, params?: string) => void;
  handleAtomResult: (result: string) => void;
  conversationLabel: string;
  setConversationLabel: (label: string) => void;
}
