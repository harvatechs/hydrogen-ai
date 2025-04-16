
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/components/ui/use-toast";

export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  lastUpdatedAt: Date;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  sendMessage: (content: string) => Promise<void>;
  isProcessing: boolean;
  clearMessages: () => void;
  clearConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  conversations: Conversation[];
  currentConversationId: string | null;
  setCurrentConversation: (conversationId: string | null) => void;
  updateConversationTitle: (conversationId: string, newTitle: string) => void;
  createNewConversation: () => void;
  theme: 'dark' | 'light' | 'system';
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  fontSize: 'small' | 'normal' | 'large';
  setFontSize: (size: 'small' | 'normal' | 'large') => void;
}

// Gemini API configuration with explicit type
interface GeminiMessage {
  role: "user" | "model" | "system";
  content: string;
}

// Function to call the Gemini API
const generateCompletionWithGemini = async (messages: GeminiMessage[]): Promise<string> => {
  const API_KEY = 'AIzaSyApy8Nw8M6PeUWtKapURmaZnuH4lWogN6I';
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        })),
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate response');
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected response format from API');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

export const ChatContext = createContext<ChatContextType>({
  messages: [],
  addMessage: () => {},
  sendMessage: async () => {},
  isProcessing: false,
  clearMessages: () => {},
  clearConversation: () => {},
  deleteConversation: () => {},
  conversations: [],
  currentConversationId: null,
  setCurrentConversation: () => {},
  updateConversationTitle: () => {},
  createNewConversation: () => {},
  theme: 'dark',
  setTheme: () => {},
  fontSize: 'normal',
  setFontSize: () => {},
});

export const useChat = () => useContext(ChatContext);

// Function to extract a title from the content
const extractTitleFromContent = (content: string) => {
  const maxLength = 50;
  const trimmedContent = content.trim();
  
  if (trimmedContent.length <= maxLength) {
    return trimmedContent;
  } else {
    return trimmedContent.substring(0, maxLength).trim() + "...";
  }
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');

  // Load conversations from local storage on mount
  useEffect(() => {
    const storedConversations = localStorage.getItem('conversations');
    if (storedConversations) {
      setConversations(JSON.parse(storedConversations));
    }
    
    const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | 'system' | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
    
    const storedFontSize = localStorage.getItem('fontSize') as 'small' | 'normal' | 'large' | null;
    if (storedFontSize) {
      setFontSize(storedFontSize);
    }
  }, []);

  // Save conversations to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const addMessage = useCallback((message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages(prevMessages =>
      prevMessages.map(msg => (msg.id === id ? { ...msg, ...updates } : msg))
    );
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const clearConversation = useCallback((conversationId: string) => {
    setMessages(prevMessages => prevMessages.filter(msg => {
      const firstMessage = prevMessages[0];
      return firstMessage && firstMessage.id !== conversationId;
    }));
  }, []);

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prevConversations =>
      prevConversations.filter(conversation => conversation.id !== conversationId)
    );
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
      clearMessages();
    }
  }, [clearMessages, currentConversationId]);

  const setCurrentConversation = useCallback((conversationId: string | null) => {
    setCurrentConversationId(conversationId);
    if (conversationId) {
      // Load messages for the selected conversation
      setMessages([]);
    } else {
      // Clear messages if no conversation is selected
      clearMessages();
    }
  }, [clearMessages]);

  const updateConversationTitle = useCallback((conversationId: string, newTitle: string) => {
    setConversations(prevConversations =>
      prevConversations.map(conversation =>
        conversation.id === conversationId ? { ...conversation, title: newTitle } : conversation
      )
    );
  }, []);

  const createNewConversation = useCallback(() => {
    const newConvId = uuidv4();
    setCurrentConversationId(newConvId);
    setConversations(prev => [
      {
        id: newConvId,
        title: "New Conversation",
        lastUpdatedAt: new Date(),
      },
      ...prev
    ]);
    clearMessages();
  }, [clearMessages]);

  const updateConversationTime = (conversationId: string | null) => {
    if (!conversationId) return;
    setConversations(prev =>
      prev.map(conversation =>
        conversation.id === conversationId ? { ...conversation, lastUpdatedAt: new Date() } : conversation
      )
    );
  };

  const sendMessage = async (content: string) => {
    // Create a temporary ID for the user message
    const tempUserMsgId = uuidv4();
    const tempAiMsgId = uuidv4();
    
    // Check if we're in an active conversation
    if (!currentConversationId) {
      const newConvId = uuidv4();
      setCurrentConversationId(newConvId);
      const newTitle = extractTitleFromContent(content);
      
      setConversations(prev => [
        {
          id: newConvId,
          title: newTitle,
          lastUpdatedAt: new Date(),
        },
        ...prev
      ]);
    }
    
    // Add the user message immediately
    const userMessage: Message = {
      id: tempUserMsgId,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    addMessage(userMessage);
    
    // Create a temporary AI message to show loading
    const loadingMessage: Message = {
      id: tempAiMsgId,
      role: 'assistant',
      content: '...',
      timestamp: new Date(),
      isLoading: true,
    };
    
    addMessage(loadingMessage);
    setIsProcessing(true);
    
    try {
      // Format messages for API
      const apiMessages = messages
        .filter(msg => !msg.isLoading) // Filter out loading messages
        .concat(userMessage) // Add the current user message
        .slice(-10) // Only take the last 10 messages for context
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          content: msg.content,
        })) as GeminiMessage[];
      
      // Add a system message for better context
      const systemMessage: GeminiMessage = {
        role: 'system',
        content: 'You are HydroGen AI, a helpful, respectful, and accurate assistant. Always provide factual information and cite sources when possible. If you\'re unsure about something, be honest about your limitations.'
      };
      
      // Get response from Gemini API
      const response = await generateCompletionWithGemini([
        systemMessage,
        ...apiMessages
      ]);
      
      // Check if the title needs to be updated (for new conversations)
      if (conversations.find(c => c.id === currentConversationId)?.title === "New Conversation") {
        const newTitle = extractTitleFromContent(content);
        updateConversationTitle(currentConversationId, newTitle);
      }
      
      // Update the AI message with the response
      updateMessage(tempAiMsgId, {
        content: response,
        isLoading: false,
      });
      
      // Update the conversation's last updated time
      updateConversationTime(currentConversationId);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update the AI message with an error
      updateMessage(tempAiMsgId, {
        content: 'Sorry, there was an error processing your request. Please try again later.',
        isLoading: false,
        isError: true,
      });
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const contextValue: ChatContextType = {
    messages,
    addMessage,
    sendMessage,
    isProcessing,
    clearMessages,
    clearConversation,
    deleteConversation,
    conversations,
    currentConversationId,
    setCurrentConversation,
    updateConversationTitle,
    createNewConversation,
    theme,
    setTheme,
    fontSize,
    setFontSize,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};
