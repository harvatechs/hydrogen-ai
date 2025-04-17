
import { useRef, useEffect, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Globe, BookOpen, FileText, PanelRight, Lightbulb, Zap, Code2, PenLine } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ChatHistory() {
  const {
    messages,
    sendMessage,
    isProcessing
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const renderSkeletonLoader = () => (
    <div className="py-4 animate-fade-in">
      <div className="flex gap-4 max-w-4xl mx-auto px-4 md:px-6">
        <div className="mt-1 flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-gemini-purple/20 flex items-center justify-center text-gemini-yellow">
            <Skeleton className="h-5 w-5 rounded-full bg-white/20" />
          </div>
        </div>
        
        <div className="min-w-0 flex-1">
          <Skeleton className="h-5 w-32 mb-3 bg-white/20" />
          
          <div className="space-y-3">
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-11/12 bg-white/10" />
            <Skeleton className="h-4 w-3/4 bg-white/10" />
            <div className="pt-2"></div>
            <Skeleton className="h-4 w-5/6 bg-white/10" />
            <Skeleton className="h-4 w-4/5 bg-white/10" />
            <div className="pt-2"></div>
            <Skeleton className="h-4 w-11/12 bg-white/10" />
            <Skeleton className="h-4 w-3/5 bg-white/10" />
            <div className="pt-3"></div>
            <div className="flex space-x-2">
              <Skeleton className="h-7 w-20 rounded-md bg-white/10" />
              <Skeleton className="h-7 w-24 rounded-md bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const emptyStateContent = () => (
    <div className="h-full flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="w-16 h-16 mb-6 bg-gemini-yellow/20 rounded-full flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-gemini-yellow" />
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3">
        Welcome to HydroGen AI
      </h1>
      
      <p className="text-md text-muted-foreground mb-8 max-w-2xl">
        Ask me anything about science, technology, philosophy, or any topic that sparks your curiosity.
      </p>
      
      <div className="w-full max-w-2xl mb-8">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10 glass-morphism mb-6">
          <h3 className="text-lg font-medium text-gemini-yellow mb-4 flex items-center">
            <Lightbulb className="h-4 w-4 mr-2 flex-shrink-0" />
            Quick Commands
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="justify-start text-left glass-morphism hover:bg-gemini-yellow/10 hover:border-gemini-yellow/30 transition-all"
              onClick={() => sendMessage("/youtube https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
            >
              <FileText className="h-4 w-4 mr-2 flex-shrink-0 text-gemini-yellow" />
              <span className="truncate">Summarize YouTube Video</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start text-left glass-morphism hover:bg-gemini-yellow/10 hover:border-gemini-yellow/30 transition-all"
              onClick={() => sendMessage("/flashcard What is quantum physics?")}
            >
              <PanelRight className="h-4 w-4 mr-2 flex-shrink-0 text-gemini-yellow" />
              <span className="truncate">Create Flashcards</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start text-left glass-morphism hover:bg-gemini-yellow/10 hover:border-gemini-yellow/30 transition-all"
              onClick={() => sendMessage("/web Latest AI breakthroughs")}
            >
              <Globe className="h-4 w-4 mr-2 flex-shrink-0 text-gemini-yellow" />
              <span className="truncate">Web Search</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start text-left glass-morphism hover:bg-gemini-yellow/10 hover:border-gemini-yellow/30 transition-all"
              onClick={() => sendMessage("/mindmap History of quantum physics")}
            >
              <Zap className="h-4 w-4 mr-2 flex-shrink-0 text-gemini-yellow" />
              <span className="truncate">Create Mind Map</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start text-left glass-morphism hover:bg-gemini-yellow/10 hover:border-gemini-yellow/30 transition-all col-span-1 sm:col-span-2"
              onClick={() => sendMessage("/studyguide Machine learning fundamentals")}
            >
              <BookOpen className="h-4 w-4 mr-2 flex-shrink-0 text-gemini-yellow" />
              <span className="truncate">Generate Study Guide</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Add null check for messages before checking its length
  return (
    <div className="flex-1 overflow-y-auto chat-history px-2 md:px-4">
      {!messages || messages.length === 0 || (messages.length === 1 && messages[0].role === "assistant") ? (
        emptyStateContent()
      ) : (
        <div className="py-4 max-w-4xl mx-auto">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isProcessing && renderSkeletonLoader()}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
