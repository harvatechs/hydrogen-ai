
import React, { createContext, useContext } from "react";
import { useChatActions } from "@/hooks/useChatActions";
import { ChatContextProps } from "@/types/chat";

// Create the context
const ChatContext = createContext<ChatContextProps | undefined>(undefined);

// Provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const chatActions = useChatActions();

  return (
    <ChatContext.Provider value={chatActions}>
      {children}
    </ChatContext.Provider>
  );
};

// Hook for using the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
