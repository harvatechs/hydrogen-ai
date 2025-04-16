
import { Message } from "@/context/ChatContext";
import { ChatMessage } from "@/types/message";

// This hook converts between Message from ChatContext and ChatMessage from types
export function useConvertMessageType() {
  // Convert Message from ChatContext to ChatMessage from types
  const convertToChatMessage = (message: Message): ChatMessage => {
    return {
      id: message.id,
      role: message.role,
      content: message.content,
      timestamp: typeof message.timestamp === 'number' ? message.timestamp : Date.now(),
      isLoading: message.isLoading,
      isError: message.isError
    };
  };

  // Convert ChatMessage from types to Message from ChatContext
  const convertToContextMessage = (chatMessage: ChatMessage): Message => {
    return {
      id: chatMessage.id,
      role: chatMessage.role,
      content: chatMessage.content,
      timestamp: chatMessage.timestamp,
      isLoading: chatMessage.isLoading,
      isError: chatMessage.isError
    };
  };

  return { convertToChatMessage, convertToContextMessage };
}

export default useConvertMessageType;
