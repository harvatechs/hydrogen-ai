
import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import { Message, MessageRole } from "../types/message";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

// Default API configuration
const DEFAULT_API_CONFIG = {
  key: 'AIzaSyApy8Nw8M6PeUWtKapURmaZnuH4lWogN6I',
  url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
};

// Initial message shown to the user
const WELCOME_MESSAGE = `
<h2>Welcome to HydroGen</h2>
<p>Ask me anything, and I'll provide detailed, structured answers using Google's Gemini AI.</p>
<ul>
  <li>Ask questions on any topic</li>
  <li>Get detailed explanations with references</li>
  <li>View response history in your current session</li>
</ul>
<p>How can I help you today?</p>
`;

// Types
interface ChatState {
  messages: Message[];
  apiKey: string;
  apiUrl: string;
  isProcessing: boolean;
  theme: string;
  fontSize: string;
  conversations: Conversation[];
  currentConversationId: string | null;
  model: string;
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
  | { type: "SET_THEME"; theme: string }
  | { type: "SET_FONT_SIZE"; fontSize: string }
  | { type: "CREATE_CONVERSATION"; conversation: Conversation }
  | { type: "SET_CURRENT_CONVERSATION"; id: string }
  | { type: "UPDATE_CONVERSATION_TITLE"; id: string; title: string }
  | { type: "CLEAR_CONVERSATION"; id: string }
  | { type: "DELETE_CONVERSATION"; id: string }
  | { type: "SET_MODEL"; model: string }
  | { type: "CLEAR_MESSAGES" };

interface ChatContextProps {
  messages: Message[];
  apiKey: string;
  apiUrl: string;
  theme: string;
  fontSize: string;
  conversations: Conversation[];
  currentConversationId: string | null;
  model: string;
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
}

// Get stored API key or use default
const getStoredApiKey = () => {
  return localStorage.getItem("gemini-api-key") || DEFAULT_API_CONFIG.key;
};

// Get stored API URL or use default
const getStoredApiUrl = () => {
  return localStorage.getItem("gemini-api-url") || DEFAULT_API_CONFIG.url;
};

// Get stored theme or use default
const getStoredTheme = () => {
  return localStorage.getItem("app-theme") || "dark";
};

// Get stored font size or use default
const getStoredFontSize = () => {
  return localStorage.getItem("app-font-size") || "medium";
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
  theme: getStoredTheme(),
  fontSize: getStoredFontSize(),
  conversations: getStoredConversations(),
  currentConversationId: null,
  model: getStoredModel(),
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
    case "SET_THEME":
      return {
        ...state,
        theme: action.theme,
      };
    case "SET_FONT_SIZE":
      return {
        ...state,
        fontSize: action.fontSize,
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
  
  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem("app-theme", state.theme);
  }, [state.theme]);
  
  // Apply font size
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', state.fontSize);
    localStorage.setItem("app-font-size", state.fontSize);
  }, [state.fontSize]);

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

  const setApiKey = (key: string) => {
    dispatch({ type: "SET_API_KEY", apiKey: key });
  };
  
  const setApiUrl = (url: string) => {
    dispatch({ type: "SET_API_URL", apiUrl: url });
  };

  const clearMessages = () => {
    dispatch({ type: "CLEAR_MESSAGES" });
  };
  
  const setTheme = (theme: string) => {
    dispatch({ type: "SET_THEME", theme });
  };
  
  const setFontSize = (fontSize: string) => {
    dispatch({ type: "SET_FONT_SIZE", fontSize });
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

  // Function to send a message and get a response
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
      
      const response = await fetch(`${state.apiUrl}?key=${state.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Answer this question accurately and helpfully: "${content}"

              RESPONSE FORMAT:
              - Use HTML for structure (<h2>, <h3> for headings, <p> for paragraphs)
              - Use <strong> for key concepts and <em> for definitions
              - Use <ul>, <ol>, <li> for lists
              - Use <blockquote> for quotes
              - Use <table>, <tr>, <th>, <td> for data tables
              - Use <code> for code snippets and equations
              - Use <a href=""> for citations

              CONTENT STRUCTURE:
              1. Begin with a clear, direct answer to the question (2-3 sentences)
              2. Provide an executive summary with key takeaways (bullet points)
              3. Give necessary background information and context
              4. Present a detailed explanation with:
              • Step-by-step breakdowns when applicable
              • Evidence and data from reliable sources
              • Multiple perspectives when the topic is debated
              • Visual descriptions or analogies for complex concepts
              5. Address common misconceptions or frequently asked questions
              6. Include practical applications or real-world examples
              7. Conclude with future implications or next steps
              8. Add references to credible sources

              QUALITY GUIDELINES:
              - Ensure factual accuracy and cite reliable sources
              - Use clear, accessible language for all expertise levels
              - Explain technical terms when they first appear
              - Provide balanced coverage of different viewpoints
              - Distinguish clearly between facts and opinions
              - Acknowledge limitations in current knowledge
              - Organize information logically with smooth transitions
              - Use concrete examples to illustrate abstract concepts
              - Tailor depth based on the complexity of the question

              Respond in a helpful, informative tone that's accessible to beginners but substantive enough for experts.`
            }]
          }]
        }),
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text || "No response generated.";
      
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
        theme: state.theme,
        fontSize: state.fontSize,
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
        model: state.model,
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
