import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  ChatMessage,
  Conversation,
  Theme,
  FontSize,
  OpenRouterResponse,
} from "@/types/message";
import { generateCompletionWithOpenRouter } from "@/utils/openRouterApi";

interface ChatContextType {
  conversations: Conversation[];
  currentConversationId: string | null;
  currentConversation: Conversation | null;
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  sendMessage: (content: string) => Promise<void>;
  startNewConversation: () => void;
  clearMessages: () => void;
  updateConversationTitle: (id: string, title: string) => void;
  setCurrentConversation: (id: string) => void;
  clearConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  createNewConversation: () => void;
  isProcessing: boolean;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
  model: string;
  setModel: (model: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  apiUrl: string;
  setApiUrl: (url: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] =
    useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [model, setModel] = useState<string>("openai/gpt-3.5-turbo");
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('openRouterApiKey') || "");
  const [apiUrl, setApiUrl] = useState<string>(localStorage.getItem('openRouterApiUrl') || "");

  useEffect(() => {
    const storedConversations = localStorage.getItem("conversations");
    if (storedConversations) {
      setConversations(JSON.parse(storedConversations));
    } else {
      const defaultConversation: Conversation = {
        id: uuidv4(),
        title: "New conversation",
        messages: [],
        lastUpdatedAt: new Date(),
      };
      setConversations([defaultConversation]);
      setCurrentConversationId(defaultConversation.id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('openRouterApiKey', apiKey);
    }
    if (apiUrl) {
      localStorage.setItem('openRouterApiUrl', apiUrl);
    }
  }, [apiKey, apiUrl]);

  const currentConversation = React.useMemo(() => {
    return (
      conversations.find((conversation) => conversation.id === currentConversationId) ||
      null
    );
  }, [conversations, currentConversationId]);

  const messages = React.useMemo(() => {
    return currentConversation?.messages || [];
  }, [currentConversation]);

  const addMessage = (message: ChatMessage) => {
    setConversations((prevConversations) => {
      return prevConversations.map((conversation) => {
        if (conversation.id === currentConversationId) {
          return {
            ...conversation,
            messages: [...conversation.messages, message],
            lastUpdatedAt: new Date(),
          };
        } else {
          return conversation;
        }
      });
    });
  };

  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentConversationId) {
        console.error("No conversation selected");
        return;
      }

      setIsProcessing(true);

      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: "user",
        content: content,
        timestamp: Date.now(),
      };

      addMessage(userMessage);

      try {
        const apiMessages = [
          ...currentConversation.messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          { role: userMessage.role, content: userMessage.content },
        ];

        const response: OpenRouterResponse = await generateCompletionWithOpenRouter(
          apiMessages,
          model
        );

        const aiMessage: ChatMessage = {
          id: uuidv4(),
          role: "assistant",
          content: response.choices[0].message.content,
          timestamp: Date.now(),
        };

        addMessage(aiMessage);
      } catch (error: any) {
        addMessage({
          id: uuidv4(),
          role: "assistant",
          content: `Sorry, I had an error: ${error.message}`,
          timestamp: Date.now(),
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [addMessage, currentConversation, currentConversationId, model]
  );

  const startNewConversation = () => {
    const newConversation: Conversation = {
      id: uuidv4(),
      title: "New conversation",
      messages: [],
      lastUpdatedAt: new Date(),
    };
    setConversations([newConversation, ...conversations]);
    setCurrentConversationId(newConversation.id);
  };

  const createNewConversation = () => {
    startNewConversation();
  };

  const clearMessages = () => {
    setConversations((prevConversations) => {
      return prevConversations.map((conversation) => {
        if (conversation.id === currentConversationId) {
          return { ...conversation, messages: [] };
        } else {
          return conversation;
        }
      });
    });
  };

  const updateConversationTitle = (id: string, title: string) => {
    setConversations((prevConversations) =>
      prevConversations.map((conversation) =>
        conversation.id === id ? { ...conversation, title } : conversation
      )
    );
  };

  const setCurrentConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const clearConversation = (id: string) => {
    setConversations((prevConversations) =>
      prevConversations.map((conversation) =>
        conversation.id === id ? { ...conversation, messages: [] } : conversation
      )
    );
  };

  const deleteConversation = (id: string) => {
    setConversations((prevConversations) =>
      prevConversations.filter((conversation) => conversation.id !== id)
    );
    if (currentConversationId === id) {
      if (conversations.length > 1) {
        const remainingConversations = conversations.filter(c => c.id !== id);
        setCurrentConversationId(remainingConversations[0].id);
      } else {
        const newConversation: Conversation = {
          id: uuidv4(),
          title: "New conversation",
          messages: [],
          lastUpdatedAt: new Date(),
        };
        setConversations([newConversation]);
        setCurrentConversationId(newConversation.id);
      }
    }
  };

  const value: ChatContextType = {
    conversations,
    currentConversationId,
    currentConversation,
    messages,
    addMessage,
    sendMessage,
    startNewConversation,
    clearMessages,
    updateConversationTitle,
    setCurrentConversation,
    clearConversation,
    deleteConversation,
    createNewConversation,
    isProcessing,
    theme,
    setTheme,
    fontSize,
    setFontSize,
    model,
    setModel,
    apiKey,
    setApiKey,
    apiUrl,
    setApiUrl
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
