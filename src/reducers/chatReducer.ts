
import { ChatState, ChatAction } from "@/types/chat";
import { createInitialConversation, WELCOME_MESSAGE } from "@/utils/chatUtils";
import { generateConversationLabel } from "@/utils/conversationLabels";
import { MessageRole } from "@/types/message";

export const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
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
                // Auto-generate title when this is the second message (after welcome and first user message)
                title: conv.title === "New chat" && newMessages.length === 3 
                  ? generateConversationLabel(newMessages)
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
