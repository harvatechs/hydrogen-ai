import { useRef, useEffect, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { 
  Search, Sparkles, Globe, BookOpen, FileText, PanelRight, 
  Lightbulb, Zap, Code2, PenLine, Youtube, Brain, Calendar 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { generateConversationLabel } from "@/utils/conversationLabels";

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
      <div className="w-24 h-24 mb-6 bg-gradient-to-br from-gemini-purple/40 to-gemini-yellow/40 rounded-full flex items-center justify-center shadow-2xl">
        <Sparkles className="h-12 w-12 text-gemini-yellow animate-pulse-slow" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient mb-6 bg-gradient-to-br from-white via-white/90 to-white/70 bg-clip-text text-transparent">
        Welcome to HydroGen AI
      </h1>
      
      <div className="w-full max-w-2xl mb-8">
        <div className="glass-morphism rounded-2xl p-6 border border-white/10 shadow-2xl backdrop-blur-lg mb-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <h3 className="text-lg font-medium text-gemini-yellow mb-4 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 flex-shrink-0 animate-pulse" />
            Quick Knowledge Paths
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { 
                icon: Brain, 
                text: "Quantum Computing", 
                query: "Explain quantum computing in simple terms",
                color: "text-blue-400"
              },
              { 
                icon: Zap, 
                text: "AI Breakthroughs", 
                query: "What are the latest breakthroughs in AI?",
                color: "text-yellow-400"
              },
              { 
                icon: Globe, 
                text: "Climate Impact", 
                query: "How does climate change affect biodiversity?",
                color: "text-green-400"
              },
              { 
                icon: PenLine, 
                text: "Energy Sources", 
                query: "Compare renewable vs non-renewable energy",
                color: "text-purple-400"
              }
            ].map(({ icon: Icon, text, query, color }) => (
              <Button 
                key={text}
                variant="outline" 
                className={`
                  justify-start text-left glass-card 
                  hover:bg-white/10 hover:border-white/30 
                  transition-all group
                `}
                onClick={() => sendMessage(query)}
              >
                <Icon className={`h-4 w-4 mr-2 flex-shrink-0 ${color} group-hover:animate-pulse`} />
                <span className="truncate">{text}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto chat-history px-2 md:px-4 flex flex-col relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-50 z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-gemini-purple/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/3 bg-gradient-to-tr from-gemini-yellow/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {!messages || messages.length === 0 || 
       (messages.length === 1 && messages[0].role === "assistant") ? (
        <div className="flex-1 flex items-center justify-center z-10">
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

      {/* Smooth scroll fade gradient */}
      <div className="sticky bottom-0 h-16 w-full bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-20"></div>
    </div>
  );
}
