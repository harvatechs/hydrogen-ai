
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { Message, MessageRole } from "../types/message";
import { toast } from "@/components/ui/use-toast";

// Initial message shown to the user
const WELCOME_MESSAGE = `
<h2>Welcome to Quest Scribe</h2>
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
  apiKey: string | null;
  isProcessing: boolean;
}

type ChatAction =
  | { type: "ADD_MESSAGE"; message: Message }
  | { type: "UPDATE_MESSAGE"; id: string; content: string }
  | { type: "SET_LOADING"; id: string; isLoading: boolean }
  | { type: "SET_API_KEY"; apiKey: string }
  | { type: "SET_PROCESSING"; isProcessing: boolean }
  | { type: "CLEAR_MESSAGES" };

interface ChatContextProps {
  messages: Message[];
  apiKey: string | null;
  setApiKey: (key: string) => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  isProcessing: boolean;
}

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
  apiKey: localStorage.getItem("gemini-api-key"),
  isProcessing: false,
};

// Reducer
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    case "UPDATE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.id
            ? { ...msg, content: action.content }
            : msg
        ),
      };
    case "SET_LOADING":
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.id
            ? { ...msg, isLoading: action.isLoading }
            : msg
        ),
      };
    case "SET_API_KEY":
      return {
        ...state,
        apiKey: action.apiKey,
      };
    case "SET_PROCESSING":
      return {
        ...state,
        isProcessing: action.isProcessing,
      };
    case "CLEAR_MESSAGES":
      return {
        ...state,
        messages: [
          {
            id: "welcome",
            role: "assistant",
            content: WELCOME_MESSAGE,
            timestamp: new Date(),
          },
        ],
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

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (state.apiKey) {
      localStorage.setItem("gemini-api-key", state.apiKey);
    }
  }, [state.apiKey]);

  const setApiKey = (key: string) => {
    dispatch({ type: "SET_API_KEY", apiKey: key });
  };

  const clearMessages = () => {
    dispatch({ type: "CLEAR_MESSAGES" });
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
      const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
      
      const response = await fetch(`${API_URL}?key=${state.apiKey}`, {
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
        setApiKey,
        sendMessage,
        clearMessages,
        isProcessing: state.isProcessing,
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
