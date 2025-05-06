
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Message } from '@/types/message';
import { useSettings } from './SettingsContext';
import { generateConversationLabel } from '@/utils/conversationLabels';
import { v4 as uuidv4 } from 'uuid';
import { Conversation } from '@/types/conversation';

type AtomType = 'youtube' | 'flashcard' | 'websearch' | 'summarize' | null;

interface IChatContext {
  messages: Message[];
  sendMessage: (content: string) => void;
  clearMessages: () => void;
  fontSize: string;
  theme: string;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  model: string;
  setModel: (model: string) => void;
  activeAtom: AtomType;
  setActiveAtom: (atomType: AtomType, params?: string) => void;
  atomParams: string;
  setAtomParams: (params: string) => void;
  handleAtomResult: (result: string) => void;
  // Add conversation-related properties
  conversations: Conversation[];
  currentConversationId: string | null;
  setCurrentConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
  clearConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  createNewConversation: () => void;
  isProcessing: boolean;
  apiKey: string;
  setApiKey: (key: string) => void;
  apiUrl: string;
  setApiUrl: (url: string) => void;
  setFontSize: (size: string) => void;
}

const ChatContext = createContext<IChatContext | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme: setSettingsTheme, fontSize, setFontSize } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModelState] = useState<string>(() => {
    return localStorage.getItem('model') || 'gemini-2.0-pro';
  });
  const [activeAtom, setActiveAtom] = useState<AtomType>(null);
  const [atomParams, setAtomParams] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('apiKey') || '');
  const [apiUrl, setApiUrl] = useState<string>(() => localStorage.getItem('apiUrl') || 'https://api.openai.com/v1');

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      try {
        const parsedConversations = JSON.parse(savedConversations);
        // Convert string dates to Date objects
        return parsedConversations.map((conv: any) => ({
          ...conv,
          lastUpdatedAt: new Date(conv.lastUpdatedAt)
        }));
      } catch (e) {
        console.error('Failed to parse saved conversations:', e);
        return [];
      }
    }
    return [];
  });
  
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(() => {
    return localStorage.getItem('currentConversationId') || null;
  });

  // Track if this is the first render
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Initialize with a default conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      const newId = uuidv4();
      const newConversation: Conversation = {
        id: newId,
        title: 'New Conversation',
        messages: [],
        lastUpdatedAt: new Date()
      };
      
      setConversations([newConversation]);
      setCurrentConversationId(newId);
      localStorage.setItem('currentConversationId', newId);
    } else if (!currentConversationId || !conversations.find(c => c.id === currentConversationId)) {
      setCurrentConversationId(conversations[0].id);
      localStorage.setItem('currentConversationId', conversations[0].id);
    }
    
    setIsFirstRender(false);
  }, []);

  // Save conversations to local storage when updated
  useEffect(() => {
    if (!isFirstRender) {
      localStorage.setItem('conversations', JSON.stringify(conversations));
    }
  }, [conversations, isFirstRender]);

  // Save current conversation ID to local storage
  useEffect(() => {
    if (currentConversationId) {
      localStorage.setItem('currentConversationId', currentConversationId);
    }
  }, [currentConversationId]);

  // Update messages when current conversation changes
  useEffect(() => {
    if (currentConversationId) {
      const currentConversation = conversations.find(c => c.id === currentConversationId);
      if (currentConversation) {
        setMessages(currentConversation.messages);
      }
    }
  }, [currentConversationId, conversations]);

  // Save API key and URL to local storage
  useEffect(() => {
    localStorage.setItem('apiKey', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('apiUrl', apiUrl);
  }, [apiUrl]);

  const sendMessage = (content: string) => {
    // Don't process empty messages
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      isLoading: false
    };
    
    // Add assistant message with loading state
    const assistantMessageId = uuidv4();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: 'Thinking...',
      timestamp: new Date().toISOString(),
      isLoading: true
    };
    
    // Update messages state and conversation
    const updatedMessages = [...messages, userMessage, assistantMessage];
    setMessages(updatedMessages);
    setIsProcessing(true);
    
    // Update conversation in state
    if (currentConversationId) {
      const updatedConversations = conversations.map(conv => {
        if (conv.id === currentConversationId) {
          // Update title if this is the first message
          let title = conv.title;
          if (conv.messages.length === 0) {
            title = generateConversationLabel([userMessage]);
          }
          
          return {
            ...conv,
            messages: updatedMessages,
            title,
            lastUpdatedAt: new Date()
          };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
    }
    
    // Simulate AI response after delay
    setTimeout(() => {
      const response = `This is a simulated response to your message: "${content}".\n\nIn a real implementation, this would be replaced with an actual API call to the ${model} model.`;
      
      // Update the assistant message with the response
      const finalMessages = [...messages, userMessage, {
        id: assistantMessageId,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        isLoading: false
      }];
      
      setMessages(finalMessages);
      setIsProcessing(false);
      
      // Update conversation in state
      if (currentConversationId) {
        const updatedConversations = conversations.map(conv => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: finalMessages,
              lastUpdatedAt: new Date()
            };
          }
          return conv;
        });
        
        setConversations(updatedConversations);
      }
    }, 1500);
  };
  
  const clearMessages = () => {
    setMessages([]);
    
    // Also clear the current conversation's messages
    clearConversation(currentConversationId || '');
  };
  
  const setTheme = (newTheme: 'dark' | 'light' | 'system') => {
    setSettingsTheme(newTheme);
  };
  
  const setModel = (newModel: string) => {
    setModelState(newModel);
    localStorage.setItem('model', newModel);
  };
  
  // Fixed: Added optional params parameter
  const handleSetActiveAtom = (atomType: AtomType, params?: string) => {
    setActiveAtom(atomType);
    if (params !== undefined) {
      setAtomParams(params);
    } else {
      setAtomParams('');
    }
  };
  
  const handleAtomResult = (result: string) => {
    if (result) {
      sendMessage(result);
    }
    setActiveAtom(null);
    setAtomParams('');
  };

  // Conversation management functions
  const setCurrentConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const updateConversationTitle = (id: string, title: string) => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === id) {
        return {
          ...conv,
          title
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
  };

  const clearConversation = (id: string) => {
    if (!id) return;
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === id) {
        return {
          ...conv,
          messages: []
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    
    // If this is the current conversation, also clear the messages state
    if (id === currentConversationId) {
      setMessages([]);
    }
  };

  const deleteConversation = (id: string) => {
    const updatedConversations = conversations.filter(conv => conv.id !== id);
    setConversations(updatedConversations);
    
    // If we deleted the current conversation, select another one
    if (id === currentConversationId && updatedConversations.length > 0) {
      setCurrentConversationId(updatedConversations[0].id);
    } else if (updatedConversations.length === 0) {
      // Create a new conversation if we deleted the last one
      createNewConversation();
    }
  };

  const createNewConversation = () => {
    const newId = uuidv4();
    const newConversation: Conversation = {
      id: newId,
      title: 'New Conversation',
      messages: [],
      lastUpdatedAt: new Date()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newId);
    setMessages([]);
  };

  return (
    <ChatContext.Provider 
      value={{
        messages,
        sendMessage,
        clearMessages,
        fontSize,
        theme,
        setTheme,
        model,
        setModel,
        activeAtom,
        setActiveAtom: handleSetActiveAtom,
        atomParams,
        setAtomParams,
        handleAtomResult,
        conversations,
        currentConversationId,
        setCurrentConversation,
        updateConversationTitle,
        clearConversation,
        deleteConversation,
        createNewConversation,
        isProcessing,
        apiKey,
        setApiKey,
        apiUrl,
        setApiUrl,
        setFontSize
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
};
