
import React, { createContext, useContext, useState, useCallback, useEffect, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { Message, MessageRole } from "../types/message";
import { AtomType } from "@/types/atoms";
import { useSettings } from "./SettingsContext";
import { generateConversationLabel } from "@/utils/conversationLabels";

// Default API configuration
const DEFAULT_API_CONFIG = {
  key: 'AIzaSyApy8Nw8M6PeUWtKapURmaZnuH4lWogN6I',
  url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
};

// Initial message shown to the user
const WELCOME_MESSAGE = `
<h2>Welcome to HydroGen</h2>
<p>I'm here to provide detailed answers, visualizations, and insights. Try asking me something!</p>
`;

// Types
interface ChatState {
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

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastUpdatedAt: Date;
}

type ChatAction =
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

interface ChatContextProps {
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

// Get stored API key or use default
const getStoredApiKey = () => {
  return localStorage.getItem("gemini-api-key") || DEFAULT_API_CONFIG.key;
};

// Get stored API URL or use default
const getStoredApiUrl = () => {
  return localStorage.getItem("gemini-api-url") || DEFAULT_API_CONFIG.url;
};

// Get stored model or use default
const getStoredModel = () => {
  return localStorage.getItem("app-model") || "gemini-2.0-flash";
};

// Get stored conversations
const getStoredConversations = (): Conversation[] => {
  const stored = localStorage.getItem("conversations");
  if (!stored) return [];
  
  try {
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    return parsed.map((conv: any) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      lastUpdatedAt: new Date(conv.lastUpdatedAt),
    }));
  } catch (e) {
    console.error("Error parsing stored conversations:", e);
    return [];
  }
};

// Create a new conversation with welcome message
const createInitialConversation = (): Conversation => {
  const now = new Date();
  return {
    id: uuidv4(),
    title: "New chat",
    messages: [
      {
        id: "welcome",
        role: "assistant",
        content: WELCOME_MESSAGE,
        timestamp: now,
      },
    ],
    createdAt: now,
    lastUpdatedAt: now,
  };
};

// Initial state
const initialState: ChatState = {
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content: WELCOME_MESSAGE,
      timestamp: new Date(),
    },
  ],
  apiKey: getStoredApiKey(),
  apiUrl: getStoredApiUrl(),
  isProcessing: false,
  conversations: getStoredConversations(),
  currentConversationId: null,
  model: getStoredModel(),
  activeAtom: null,
  atomParams: '',
};

// If no conversations exist, create an initial one
if (initialState.conversations.length === 0) {
  const initialConversation = createInitialConversation();
  initialState.conversations = [initialConversation];
  initialState.currentConversationId = initialConversation.id;
} else {
  // Use the first conversation as current if none is set
  initialState.currentConversationId = initialState.conversations[0].id;
  // Set initial messages to the current conversation's messages
  const currentConv = initialState.conversations.find(c => c.id === initialState.currentConversationId);
  if (currentConv) {
    initialState.messages = currentConv.messages;
  }
}

// Reducer
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "ADD_MESSAGE": {
      const newMessages = [...state.messages, action.message];
      
      // Update the conversation if we have one
      if (state.currentConversationId) {
        const updatedConversations = state.conversations.map(conv => 
          conv.id === state.currentConversationId 
            ? { 
                ...conv, 
                messages: newMessages,
                lastUpdatedAt: new Date(),
                // Update title if this is the second message (after welcome)
                title: conv.title === "New chat" && newMessages.length === 3 
                  ? newMessages[1].content.substring(0, 30) + "..." 
                  : conv.title
              } 
            : conv
        );

        return {
          ...state,
          messages: newMessages,
          conversations: updatedConversations,
        };
      }
      
      return {
        ...state,
        messages: newMessages,
      };
    }
    case "UPDATE_MESSAGE": {
      const updatedMessages = state.messages.map((msg) =>
        msg.id === action.id
          ? { ...msg, content: action.content }
          : msg
      );
      
      // Update the conversation if we have one
      if (state.currentConversationId) {
        const updatedConversations = state.conversations.map(conv => 
          conv.id === state.currentConversationId 
            ? { 
                ...conv, 
                messages: updatedMessages,
                lastUpdatedAt: new Date() 
              } 
            : conv
        );

        return {
          ...state,
          messages: updatedMessages,
          conversations: updatedConversations,
        };
      }
      
      return {
        ...state,
        messages: updatedMessages,
      };
    }
    case "SET_LOADING": {
      const updatedMessages = state.messages.map((msg) =>
        msg.id === action.id
          ? { ...msg, isLoading: action.isLoading }
          : msg
      );
      
      // Update the conversation if we have one
      if (state.currentConversationId) {
        const updatedConversations = state.conversations.map(conv => 
          conv.id === state.currentConversationId 
            ? { ...conv, messages: updatedMessages } 
            : conv
        );

        return {
          ...state,
          messages: updatedMessages,
          conversations: updatedConversations,
        };
      }
      
      return {
        ...state,
        messages: updatedMessages,
      };
    }
    case "SET_API_KEY":
      return {
        ...state,
        apiKey: action.apiKey,
      };
    case "SET_API_URL":
      return {
        ...state,
        apiUrl: action.apiUrl,
      };
    case "SET_PROCESSING":
      return {
        ...state,
        isProcessing: action.isProcessing,
      };
    case "SET_MODEL":
      return {
        ...state,
        model: action.model,
      };
    case "CREATE_CONVERSATION":
      return {
        ...state,
        conversations: [...state.conversations, action.conversation],
        currentConversationId: action.conversation.id,
        messages: action.conversation.messages,
      };
    case "SET_CURRENT_CONVERSATION": {
      const conversation = state.conversations.find(c => c.id === action.id);
      return {
        ...state,
        currentConversationId: action.id,
        messages: conversation ? conversation.messages : state.messages,
      };
    }
    case "UPDATE_CONVERSATION_TITLE": {
      const updatedConversations = state.conversations.map(conv => 
        conv.id === action.id 
          ? { ...conv, title: action.title, lastUpdatedAt: new Date() } 
          : conv
      );
      return {
        ...state,
        conversations: updatedConversations,
      };
    }
    case "CLEAR_CONVERSATION": {
      const now = new Date();
      const updatedConversations = state.conversations.map(conv => 
        conv.id === action.id 
          ? { 
              ...conv, 
              messages: [
                {
                  id: `welcome-${action.id}`,
                  role: "assistant" as MessageRole,
                  content: WELCOME_MESSAGE,
                  timestamp: now,
                },
              ],
              lastUpdatedAt: now
            } 
          : conv
      );
      
      // If this is the current conversation, update messages too
      if (state.currentConversationId === action.id) {
        return {
          ...state,
          conversations: updatedConversations,
          messages: [
            {
              id: `welcome-${action.id}`,
              role: "assistant" as MessageRole,
              content: WELCOME_MESSAGE,
              timestamp: now,
            },
          ],
        };
      }
      
      return {
        ...state,
        conversations: updatedConversations,
      };
    }
    case "DELETE_CONVERSATION": {
      const updatedConversations = state.conversations.filter(conv => conv.id !== action.id);
      
      // If this was the current conversation, switch to another one
      if (state.currentConversationId === action.id) {
        if (updatedConversations.length > 0) {
          const newCurrentConv = updatedConversations[0];
          return {
            ...state,
            conversations: updatedConversations,
            currentConversationId: newCurrentConv.id,
            messages: newCurrentConv.messages,
          };
        } else {
          // Create a new conversation if there are none left
          const newConversation = createInitialConversation();
          return {
            ...state,
            conversations: [newConversation],
            currentConversationId: newConversation.id,
            messages: newConversation.messages,
          };
        }
      }
      
      return {
        ...state,
        conversations: updatedConversations,
      };
    }
    case "CLEAR_MESSAGES": {
      const now = new Date();
      const newMessages = [
        {
          id: "welcome-new",
          role: "assistant" as MessageRole,
          content: WELCOME_MESSAGE,
          timestamp: now,
        },
      ];
      
      // Also update the current conversation if we have one
      if (state.currentConversationId) {
        const updatedConversations = state.conversations.map(conv => 
          conv.id === state.currentConversationId 
            ? { 
                ...conv, 
                messages: newMessages,
                title: "New chat",
                lastUpdatedAt: now
              } 
            : conv
        );

        return {
          ...state,
          messages: newMessages,
          conversations: updatedConversations,
        };
      }
      
      return {
        ...state,
        messages: newMessages,
      };
    }
    case "SET_ACTIVE_ATOM":
      return {
        ...state,
        activeAtom: action.atomType,
        atomParams: action.params || '',
      };
    default:
      return state;
  }
};

// Context
const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { theme, fontSize, setTheme: setThemeSettings, setFontSize: setFontSizeSettings } = useSettings();
  const [conversationLabel, setConversationLabel] = useState("New Conversation");

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (state.apiKey) {
      localStorage.setItem("gemini-api-key", state.apiKey);
    }
  }, [state.apiKey]);
  
  // Save API URL to localStorage when it changes
  useEffect(() => {
    if (state.apiUrl) {
      localStorage.setItem("gemini-api-url", state.apiUrl);
    }
  }, [state.apiUrl]);
  
  // Save model to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("app-model", state.model);
  }, [state.model]);
  
  // Save conversations to localStorage when they change
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(state.conversations));
  }, [state.conversations]);

  // Update conversation label when messages change
  useEffect(() => {
    if (state.messages.length > 0) {
      const label = generateConversationLabel(state.messages);
      setConversationLabel(label);
    }
  }, [state.messages]);

  const setApiKey = (key: string) => {
    dispatch({ type: "SET_API_KEY", apiKey: key });
  };
  
  const setApiUrl = (url: string) => {
    dispatch({ type: "SET_API_URL", apiUrl: url });
  };

  const clearMessages = () => {
    dispatch({ type: "CLEAR_MESSAGES" });
  };
  
  const setTheme = (newTheme: string) => {
    setThemeSettings(newTheme as any);
  };
  
  const setFontSize = (newSize: string) => {
    setFontSizeSettings(newSize as any);
  };
  
  const setModel = (model: string) => {
    dispatch({ type: "SET_MODEL", model });
  };
  
  const createNewConversation = () => {
    const conversation = createInitialConversation();
    dispatch({ type: "CREATE_CONVERSATION", conversation });
  };
  
  const setCurrentConversation = (id: string) => {
    dispatch({ type: "SET_CURRENT_CONVERSATION", id });
  };
  
  const updateConversationTitle = (id: string, title: string) => {
    dispatch({ type: "UPDATE_CONVERSATION_TITLE", id, title });
  };
  
  const clearConversation = (id: string) => {
    dispatch({ type: "CLEAR_CONVERSATION", id });
  };
  
  const deleteConversation = (id: string) => {
    dispatch({ type: "DELETE_CONVERSATION", id });
  };

  const setActiveAtom = (atomType: AtomType | null, params: string = '') => {
    dispatch({ type: "SET_ACTIVE_ATOM", atomType, params });
  };
  
  const handleAtomResult = (result: string) => {
    // Create a system message with the result
    const assistantMessageId = `assistant-${Date.now()}`;
    
    dispatch({
      type: "ADD_MESSAGE",
      message: {
        id: assistantMessageId,
        role: "assistant",
        content: result,
        timestamp: new Date(),
      },
    });
    
    // Clear the active atom
    setActiveAtom(null);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Generate unique IDs
    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;
    
    // Add user message
    dispatch({
      type: "ADD_MESSAGE",
      message: {
        id: userMessageId,
        role: "user",
        content,
        timestamp: new Date(),
      },
    });
    
    // Add placeholder for assistant message
    dispatch({
      type: "ADD_MESSAGE",
      message: {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isLoading: true,
      },
    });
    
    dispatch({ type: "SET_PROCESSING", isProcessing: true });
    
    // Check if API key exists
    if (!state.apiKey) {
      dispatch({
        type: "UPDATE_MESSAGE",
        id: assistantMessageId,
        content:
          "<p>Please set your Google Gemini API key in the settings first.</p>",
      });
      dispatch({ type: "SET_LOADING", id: assistantMessageId, isLoading: false });
      dispatch({ type: "SET_PROCESSING", isProcessing: false });
      return;
    }
    
    try {
      const controller = new AbortController();
      
      // Extract model ID from the URL or use the one in state
      let modelId = state.model;
      // If URL contains a model ID, parse it
      if (state.apiUrl.includes('/models/')) {
        const urlParts = state.apiUrl.split('/models/');
        if (urlParts.length > 1) {
          const modelPart = urlParts[1].split(':')[0];
          if (modelPart) {
            modelId = modelPart;
          }
        }
      }
      
      // Extract previous context for follow-up questions
      const relevantContext = state.messages.slice(-6); // Get recent messages for context
      const conversationContext = relevantContext.map(msg => 
        `${msg.role === 'user' ? 'Human' : 'AI'}: ${msg.content.replace(/<[^>]*>/g, '')}`
      ).join('\n');
        
      const response = await fetch(`${state.apiUrl}?key=${state.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are HydroGen AI, a helpful, advanced assistant powered by Google's Gemini technology.

              CONVERSATION HISTORY FOR CONTEXT (use this for follow-up questions):
              ${conversationContext}

              Answer this question accurately and helpfully: "${content}"

              RESPONSE FORMAT:
              - Use HTML for structure (<h2>, <h3> for headings, <p> for paragraphs)
              - Use <strong> for key concepts and <em> for definitions
              - Use <ul>, <ol>, <li> for lists
              - Use <blockquote> for quotes
              - Use <table>, <tr>, <th>, <td> for data tables
              - Use <code> for code snippets and equations
              - Always use semantic HTML5 for proper structure`
            }]
          }]
        }),
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      let generatedText = data.candidates[0].content.parts[0].text || "No response generated.";
      
      // Update the assistant message with the response
      dispatch({
        type: "UPDATE_MESSAGE",
        id: assistantMessageId,
        content: generatedText,
      });
      
    } catch (error) {
      let errorMessage = "Failed to get a response.";
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
        console.error(error);
      }
      
      dispatch({
        type: "UPDATE_MESSAGE",
        id: assistantMessageId,
        content: `<p class="text-red-500">${errorMessage}</p>`,
      });
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      dispatch({ type: "SET_LOADING", id: assistantMessageId, isLoading: false });
      dispatch({ type: "SET_PROCESSING", isProcessing: false });
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages: state.messages,
        apiKey: state.apiKey,
        apiUrl: state.apiUrl,
        theme,
        fontSize,
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
        model: state.model,
        activeAtom: state.activeAtom,
        atomParams: state.atomParams,
        setApiKey,
        setApiUrl,
        sendMessage,
        clearMessages,
        isProcessing: state.isProcessing,
        setTheme,
        setFontSize,
        createNewConversation,
        setCurrentConversation,
        updateConversationTitle,
        clearConversation,
        deleteConversation,
        setModel,
        setActiveAtom,
        handleAtomResult,
        conversationLabel,
        setConversationLabel,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
