
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Message } from '@/types/message';
import { useSettings } from './SettingsContext';

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
  setActiveAtom: (atomType: AtomType) => void;
  atomParams: string;
  setAtomParams: (params: string) => void;
  handleAtomResult: (result: string) => void;
}

const ChatContext = createContext<IChatContext | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme: setSettingsTheme, fontSize } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModelState] = useState<string>(() => {
    return localStorage.getItem('model') || 'gemini-2.0-pro';
  });
  const [activeAtom, setActiveAtom] = useState<AtomType>(null);
  const [atomParams, setAtomParams] = useState<string>('');

  // Track if this is the first render
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Load saved messages from local storage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-messages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Failed to parse saved messages:', e);
      }
    }
    setIsFirstRender(false);
  }, []);

  // Save messages to local storage when updated
  useEffect(() => {
    if (!isFirstRender) {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    }
  }, [messages, isFirstRender]);

  const sendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      isLoading: false
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Add assistant message with loading state
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: 'Thinking...',
      timestamp: new Date().toISOString(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    
    // Simulate AI response after delay
    setTimeout(() => {
      const response = `This is a simulated response to your message: "${content}".\n\nIn a real implementation, this would be replaced with an actual API call to the ${model} model.`;
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessageId 
            ? {...msg, content: response, isLoading: false} 
            : msg
        )
      );
    }, 1500);
  };
  
  const clearMessages = () => {
    setMessages([]);
  };
  
  const setTheme = (newTheme: 'dark' | 'light' | 'system') => {
    setSettingsTheme(newTheme);
  };
  
  const setModel = (newModel: string) => {
    setModelState(newModel);
    localStorage.setItem('model', newModel);
  };
  
  const handleAtomResult = (result: string) => {
    if (result) {
      sendMessage(result);
    }
    setActiveAtom(null);
    setAtomParams('');
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
        setActiveAtom,
        atomParams,
        setAtomParams,
        handleAtomResult
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
