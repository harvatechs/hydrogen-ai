import { useReducer, useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { ChatApiService } from "@/services/ChatApiService";
import { useSettings } from "@/context/SettingsContext";
import { chatReducer } from "@/reducers/chatReducer";
import { initializeChatState, createInitialConversation } from "@/utils/chatUtils";
import { generateConversationLabel } from "@/utils/conversationLabels";
import { ChatContextProps } from "@/types/chat";
import { Message } from "@/types/message";
import { AtomType } from "@/types/atoms";

export const useChatActions = (): ChatContextProps => {
  const [state, dispatch] = useReducer(chatReducer, initializeChatState());
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

  // Auto-title generation for new conversations when they reach 3+ messages
  useEffect(() => {
    const autoGenerateTitle = async () => {
      if (state.currentConversationId && state.apiKey) {
        const currentConversation = state.conversations.find(c => c.id === state.currentConversationId);
        
        if (currentConversation && 
            currentConversation.title === "New chat" && 
            currentConversation.messages.length >= 3 && 
            currentConversation.messages.some(m => m.role === 'user')) {
          
          try {
            await generateTitle(state.currentConversationId, currentConversation.messages);
          } catch (error) {
            console.error("Failed to auto-generate title:", error);
          }
        }
      }
    };
    
    autoGenerateTitle();
  }, [state.messages, state.currentConversationId]);

  // Update conversation label when messages change
  useEffect(() => {
    if (state.messages.length > 1 && state.currentConversationId) {
      const currentConversation = state.conversations.find(c => c.id === state.currentConversationId);
      if (currentConversation && currentConversation.title === "New chat") {
        const label = generateConversationLabel(state.messages);
        setConversationLabel(label);
        
        // Update the conversation title
        if (label !== "New Conversation") {
          dispatch({ 
            type: "UPDATE_CONVERSATION_TITLE", 
            id: state.currentConversationId, 
            title: label 
          });
        }
      }
    }
  }, [state.messages, state.currentConversationId, state.conversations]);

  const setApiKey = useCallback((key: string) => {
    dispatch({ type: "SET_API_KEY", apiKey: key });
  }, []);
  
  const setApiUrl = useCallback((url: string) => {
    dispatch({ type: "SET_API_URL", apiUrl: url });
  }, []);

  const clearMessages = useCallback(() => {
    dispatch({ type: "CLEAR_MESSAGES" });
  }, []);
  
  const setTheme = useCallback((newTheme: string) => {
    setThemeSettings(newTheme as any);
  }, [setThemeSettings]);
  
  const setFontSize = useCallback((newSize: string) => {
    setFontSizeSettings(newSize as any);
  }, [setFontSizeSettings]);
  
  const setModel = useCallback((model: string) => {
    dispatch({ type: "SET_MODEL", model });
  }, []);
  
  const createNewConversation = useCallback(() => {
    const conversation = createInitialConversation();
    dispatch({ type: "CREATE_CONVERSATION", conversation });
  }, []);
  
  const setCurrentConversation = useCallback((id: string) => {
    dispatch({ type: "SET_CURRENT_CONVERSATION", id });
  }, []);
  
  const updateConversationTitle = useCallback((id: string, title: string) => {
    dispatch({ type: "UPDATE_CONVERSATION_TITLE", id, title });
  }, []);
  
  const clearConversation = useCallback((id: string) => {
    dispatch({ type: "CLEAR_CONVERSATION", id });
  }, []);
  
  const deleteConversation = useCallback((id: string) => {
    dispatch({ type: "DELETE_CONVERSATION", id });
  }, []);

  const setActiveAtom = useCallback((atomType: AtomType | null, params: string = '') => {
    dispatch({ type: "SET_ACTIVE_ATOM", atomType, params });
  }, []);
  
  const handleAtomResult = useCallback((result: string) => {
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
  }, [setActiveAtom]);

  const sendMessage = useCallback(async (content: string) => {
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
      
      // Get temperature and response length settings
      const temperature = parseFloat(localStorage.getItem("app-temperature") || "0.7");
      const responseLength = parseFloat(localStorage.getItem("app-response-length") || "0.5");
      
      // Calculate max output tokens based on response length preference
      // Shorter = ~500 tokens, Medium = ~1000 tokens, Longer = ~2000 tokens
      const maxOutputTokens = Math.floor(500 + (responseLength * 1500));
      
      // Extract previous context for follow-up questions
      const relevantContext = state.messages.slice(-6); // Get recent messages for context
      const conversationContext = relevantContext.map(msg => 
        `${msg.role === 'user' ? 'Human' : 'AI'}: ${msg.content.replace(/<[^>]*>/g, '')}`
      ).join('\n');
      
      // Get custom system prompt if available
      const systemPrompt = localStorage.getItem("app-system-prompt") || "";
      
      try {
        const generatedText = await ChatApiService.sendMessageToApi(
          state.apiUrl,
          state.apiKey,
          content,
          conversationContext,
          systemPrompt,
          temperature,
          maxOutputTokens,
          controller
        );
        
        // Update the assistant message with the response
        dispatch({
          type: "UPDATE_MESSAGE",
          id: assistantMessageId,
          content: generatedText,
        });
      } catch (error) {
        throw error;
      }
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
  }, [state.apiKey, state.apiUrl, state.model, state.messages]);

  // Generate title using Gemini API based on conversation content
  const generateTitle = useCallback(async (conversationId: string, messages: Message[]) => {
    if (!state.apiKey) {
      throw new Error("API key is required");
    }
    
    // Filter out system messages and keep only user and assistant messages
    const relevantMessages = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => `${m.role === 'user' ? 'Human' : 'AI'}: ${m.content.replace(/<[^>]*>/g, '').substring(0, 200)}`)
      .slice(-6)  // Only use most recent messages for context
      .join('\n');
    
    if (relevantMessages.length === 0) {
      return;
    }
    
    try {
      const titlePrompt = `Based on this conversation, generate a very short, concise title (maximum 40 characters) that captures the main topic. The title should be descriptive but brief, like "Travel Plan to Japan" or "Python Error Debugging". DO NOT include any quotation marks, formatting, or prefixes in your response. Just respond with the title text directly.

Conversation:
${relevantMessages}`;

      const generatedTitle = await ChatApiService.generateShortTitle(
        state.apiUrl,
        state.apiKey,
        titlePrompt
      );
      
      // Cleanup and format the title
      const cleanTitle = generatedTitle
        .replace(/^["']|["']$/g, '')  // Remove any quotes
        .replace(/^Title: /i, '')     // Remove any "Title:" prefix
        .replace(/[\n\r]/g, '')       // Remove line breaks
        .trim();
        
      if (cleanTitle) {
        dispatch({ type: "UPDATE_CONVERSATION_TITLE", id: conversationId, title: cleanTitle });
        return cleanTitle;
      }
    } catch (error) {
      console.error("Failed to generate title:", error);
      throw error;
    }
  }, [state.apiKey, state.apiUrl]);

  return {
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
    generateTitle,
  };
};
