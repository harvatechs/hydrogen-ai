import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect
} from "react";
import { Message } from "@/types/message";
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
  const { fontSize, theme } = useSettings();
  const [conversationLabel, setConversationLabel] = useState<string>("New Conversation");
  const { complete, stop } = useCompletion({
    api: "/api/completion",
    id: messages[messages.length - 1]?.id,
    onFinish: (prompt, completion) => {
      addMessage({
        id: nanoid(),
        role: "assistant",
        content: completion
      });
      setIsProcessing(false);
    },
    onError: (error: Error) => {
      setIsProcessing(false);
      addMessage({
        id: nanoid(),
        role: "error",
        content: `There was an error processing your request. Please try again. ${error.message}`
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
  }, [messages]);

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
      content: messageContent
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
            content: "Invalid command. Please try again."
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
        content: `There was an error processing your request. Please try again. ${error.message}`
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
      content: result
    });
    setIsProcessing(false);
    setActiveAtomState(null);
    setAtomParams(null);
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
    setConversationLabel
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
