
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect
} from "react";
import { Message, Conversation } from "@/types/message";
import { nanoid } from "nanoid";
import { toast } from "@/components/ui/use-toast";
import { useCompletion } from "ai/react";
import { useSettings } from "./SettingsContext";
import { generateConversationLabel } from "@/utils/conversationLabels";

interface ChatContextProps {
  messages: Message[];
  addMessage: (message: Message) => void;
  removeMessage: (id: string) => void;
  sendMessage: (message: string) => void;
  isProcessing: boolean;
  fontSize: string;
  theme: string;
  activeAtom: string | null;
  setActiveAtom: (atom: string | null, params?: string) => void;
  atomParams: string | null;
  handleAtomResult: (result: string) => void;
  conversationLabel: string;
  setConversationLabel: React.Dispatch<React.SetStateAction<string>>;
  
  // Add missing properties needed by other components
  apiKey: string;
  setApiKey: (key: string) => void;
  apiUrl: string;
  setApiUrl: (url: string) => void;
  model: string;
  setModel: (model: string) => void;
  setTheme: (theme: string) => void;
  setFontSize: (size: string) => void;
  
  // Conversation management properties
  conversations: Conversation[];
  currentConversationId: string | null;
  setCurrentConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
  clearConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  createNewConversation: () => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAtom, setActiveAtomState] = useState<string | null>(null);
  const [atomParams, setAtomParams] = useState<string | null>(null);
  const { 
    fontSize, 
    theme, 
    setTheme, 
    setFontSize,
    apiKey,
    setApiKey,
    apiUrl,
    setApiUrl,
    model,
    setModel 
  } = useSettings();
  const [conversationLabel, setConversationLabel] = useState<string>("New Conversation");
  
  // Adding conversation management state
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map(conv => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          lastUpdatedAt: new Date(conv.lastUpdatedAt)
        })) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(() => {
    const saved = localStorage.getItem('currentConversationId');
    return saved || null;
  });

  // Save conversations to localStorage
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Save current conversation ID
  useEffect(() => {
    if (currentConversationId) {
      localStorage.setItem('currentConversationId', currentConversationId);
    }
  }, [currentConversationId]);

  const { complete, stop } = useCompletion({
    api: "/api/completion",
    id: messages[messages.length - 1]?.id,
    onFinish: (prompt, completion) => {
      addMessage({
        id: nanoid(),
        role: "assistant",
        content: completion,
        timestamp: new Date()
      });
      setIsProcessing(false);
    },
    onError: (error: Error) => {
      setIsProcessing(false);
      addMessage({
        id: nanoid(),
        role: "error",
        content: `There was an error processing your request. Please try again. ${error.message}`,
        timestamp: new Date()
      });
      toast({
        title: "Something went wrong.",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update conversation label when messages change
  useEffect(() => {
    const label = generateConversationLabel(messages);
    setConversationLabel(label);
    
    // Update conversation in the list if it exists
    if (currentConversationId && messages.length > 0) {
      updateConversation();
    }
  }, [messages]);

  const updateConversation = () => {
    if (!currentConversationId) return;
    
    setConversations(prev => {
      const existing = prev.findIndex(c => c.id === currentConversationId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = {
          ...updated[existing],
          messages: [...messages],
          title: conversationLabel,
          lastUpdatedAt: new Date()
        };
        return updated;
      }
      return prev;
    });
  };

  const addMessage = useCallback((message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  }, []);

  const removeMessage = useCallback((id: string) => {
    setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
  }, []);

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;

    const newMessage: Message = {
      id: nanoid(),
      role: "user",
      content: messageContent,
      timestamp: new Date()
    };

    addMessage(newMessage);
    setIsProcessing(true);

    try {
      if (messageContent.startsWith("/")) {
        // Handle special commands
        if (messageContent.startsWith("/youtube")) {
          const videoUrl = messageContent.split(" ")[1];
          setActiveAtom("youtube", videoUrl);
        } else if (messageContent.startsWith("/flashcard")) {
          const query = messageContent.substring(10).trim();
          setActiveAtom("flashcard", query);
        } else if (messageContent.startsWith("/web")) {
          const query = messageContent.substring(4).trim();
          setActiveAtom("websearch", query);
        } else {
          addMessage({
            id: nanoid(),
            role: "assistant",
            content: "Invalid command. Please try again.",
            timestamp: new Date()
          });
          setIsProcessing(false);
        }
      } else {
        // Send normal message to the AI
        complete(messageContent);
      }
    } catch (error: any) {
      setIsProcessing(false);
      addMessage({
        id: nanoid(),
        role: "error",
        content: `There was an error processing your request. Please try again. ${error.message}`,
        timestamp: new Date()
      });
      toast({
        title: "Something went wrong.",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const setActiveAtom = (atom: string | null, params: string | undefined = undefined) => {
    setActiveAtomState(atom);
    setAtomParams(params || null);
  };

  const handleAtomResult = (result: string) => {
    addMessage({
      id: nanoid(),
      role: "assistant",
      content: result,
      timestamp: new Date()
    });
    setIsProcessing(false);
    setActiveAtomState(null);
    setAtomParams(null);
  };

  // Conversation management functions
  const createNewConversation = () => {
    const newId = nanoid();
    const newConversation: Conversation = {
      id: newId,
      title: "New Conversation",
      messages: [],
      createdAt: new Date(),
      lastUpdatedAt: new Date()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newId);
    setMessages([]);
    setConversationLabel("New Conversation");
  };

  const setCurrentConversation = (id: string) => {
    setCurrentConversationId(id);
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setMessages(conversation.messages);
      setConversationLabel(conversation.title);
    }
  };

  const updateConversationTitle = (id: string, title: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id 
          ? { ...conv, title, lastUpdatedAt: new Date() } 
          : conv
      )
    );
    
    if (id === currentConversationId) {
      setConversationLabel(title);
    }
  };

  const clearConversation = (id: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id 
          ? { ...conv, messages: [], lastUpdatedAt: new Date() } 
          : conv
      )
    );
    
    if (id === currentConversationId) {
      setMessages([]);
    }
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    if (id === currentConversationId) {
      const remaining = conversations.filter(conv => conv.id !== id);
      if (remaining.length > 0) {
        setCurrentConversation(remaining[0].id);
      } else {
        createNewConversation();
      }
    }
  };

  const clearMessages = () => {
    setMessages([]);
    if (currentConversationId) {
      clearConversation(currentConversationId);
    }
  };

  const value = {
    messages,
    addMessage,
    removeMessage,
    sendMessage,
    isProcessing,
    fontSize,
    theme,
    activeAtom,
    setActiveAtom,
    atomParams,
    handleAtomResult,
    conversationLabel,
    setConversationLabel,
    // Added properties
    apiKey,
    setApiKey,
    apiUrl,
    setApiUrl,
    model,
    setModel,
    setTheme,
    setFontSize,
    conversations,
    currentConversationId,
    setCurrentConversation,
    updateConversationTitle,
    clearConversation,
    deleteConversation,
    createNewConversation,
    clearMessages
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
