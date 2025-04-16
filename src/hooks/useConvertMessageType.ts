
import { Message, Role } from "@/context/ChatContext";
import { ChatMessage, MessageRole } from "@/types/message";

// This hook converts between Message from ChatContext and ChatMessage from types
export function useConvertMessageType() {
  // Convert Message from ChatContext to ChatMessage from types
  const convertToChatMessage = (message: Message): ChatMessage => {
    return {
      id: message.id,
      role: message.role as MessageRole, // Ensure proper type casting
      content: message.content,
      timestamp: typeof message.timestamp === 'number' ? message.timestamp : Date.now(),
      isLoading: message.isLoading,
      isError: message.isError
    };
  };

  // Convert ChatMessage from types to Message from ChatContext
  const convertToContextMessage = (chatMessage: ChatMessage): Message => {
    // Filter out roles not compatible with Context Message role
    let safeRole: Role = 'assistant'; // Default fallback
    
    // Only assign role if it's compatible with Context Message Role
    if (chatMessage.role === 'user' || chatMessage.role === 'assistant') {
      safeRole = chatMessage.role as Role;
    }
    
    return {
      id: chatMessage.id,
      role: safeRole, 
      content: chatMessage.content,
      timestamp: chatMessage.timestamp,
      isLoading: chatMessage.isLoading,
      isError: chatMessage.isError
    };
  };

  return { convertToChatMessage, convertToContextMessage };
}

export default useConvertMessageType;
