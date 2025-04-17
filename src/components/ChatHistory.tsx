
import { useRef, useEffect, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Globe, BookOpen, FileText, PanelRight, Lightbulb, Zap, Code2, PenLine, Youtube, Brain, Calendar } from "lucide-react";
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
      <div className="w-20 h-20 mb-6 bg-gradient-to-br from-gemini-yellow/30 to-gemini-purple/30 rounded-full flex items-center justify-center">
        <Sparkles className="h-10 w-10 text-gemini-yellow animate-pulse-slow" />
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gradient mb-6">
        Welcome to HydroGen AI
      </h1>
      
      <div className="w-full max-w-2xl mb-8">
        <div className="glass-morphism rounded-lg p-6 border border-white/10 shadow-lg backdrop-blur-lg mb-6 transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
          <h3 className="text-lg font-medium text-gemini-yellow mb-4 flex items-center">
            <Lightbulb className="h-4 w-4 mr-2 flex-shrink-0" />
            Popular Questions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="justify-start text-left glass-card hover:bg-gemini-yellow/10 hover:border-gemini-yellow/30 transition-all"
              onClick={() => sendMessage("Explain quantum computing in simple terms")}
            >
              <Brain className="h-4 w-4 mr-2 flex-shrink-0 text-gemini-yellow" />
              <span className="truncate">Explain quantum computing</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start text-left glass-card hover:bg-gemini-yellow/10 hover:border-gemini-yellow/30 transition-all"
              onClick={() => sendMessage("What are the latest breakthroughs in AI?")}
            >
              <Zap className="h-4 w-4 mr-2 flex-shrink-0 text-gemini-yellow" />
              <span className="truncate">Latest AI breakthroughs</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start text-left glass-card hover:bg-gemini-yellow/10 hover:border-gemini-yellow/30 transition-all"
              onClick={() => sendMessage("How does climate change affect biodiversity?")}
            >
              <Globe className="h-4 w-4 mr-2 flex-shrink-0 text-gemini-yellow" />
              <span className="truncate">Climate change effects</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start text-left glass-card hover:bg-gemini-yellow/10 hover:border-gemini-yellow/30 transition-all"
              onClick={() => sendMessage("Compare renewable vs non-renewable energy")}
            >
              <PenLine className="h-4 w-4 mr-2 flex-shrink-0 text-gemini-yellow" />
              <span className="truncate">Compare energy sources</span>
            </Button>
          </div>
        </div>
        
        <div className="glass-morphism rounded-lg p-6 border border-white/10 shadow-lg backdrop-blur-lg transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
          <h3 className="text-lg font-medium text-blue-400 mb-4 flex items-center">
            <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
            Special Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="justify-start text-left glass-card hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all"
              onClick={() => sendMessage("/youtube https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
            >
              <Youtube className="h-4 w-4 mr-2 flex-shrink-0 text-red-400" />
              <span className="truncate">YouTube Summarizer</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start text-left glass-card hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30 transition-all"
              onClick={() => sendMessage("/flashcard Introduction to quantum physics")}
            >
              <PanelRight className="h-4 w-4 mr-2 flex-shrink-0 text-blue-400" />
              <span className="truncate">Create Flashcards</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start text-left glass-card hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30 transition-all"
              onClick={() => sendMessage("/web Latest AI breakthroughs")}
            >
              <Search className="h-4 w-4 mr-2 flex-shrink-0 text-green-400" />
              <span className="truncate">Web Search</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start text-left glass-card hover:bg-yellow-500/10 hover:text-yellow-400 hover:border-yellow-500/30 transition-all"
              onClick={() => sendMessage("What are the major historical events in 2023?")}
            >
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-yellow-400" />
              <span className="truncate">Recent History</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto chat-history px-2 md:px-4 flex flex-col relative">
      {/* Subtle background effects */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-gemini-purple/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/3 bg-gradient-to-tr from-gemini-yellow/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {!messages || messages.length === 0 || (messages.length === 1 && messages[0].role === "assistant") ? (
        <div className="flex-1 flex items-center justify-center">
          {emptyStateContent()}
        </div>
      ) : (
        <div className="py-4 max-w-4xl mx-auto w-full relative z-10">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isProcessing && renderSkeletonLoader()}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Subtle scroll fade gradient at the bottom */}
      <div className="sticky bottom-0 h-12 w-full bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </div>
  );
}

