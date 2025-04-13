
import { useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Globe, BookOpen, FileText, PanelRight, Lightbulb, Zap, Code2, PenLine } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ChatHistory() {
  const { messages, sendMessage, isProcessing } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Improved conversation starters
  const starters = [
    "What is a buffer solution in chemistry?",
    "Explain quantum computing in simple terms",
    "How does machine learning work?",
    "What are the main causes of climate change?"
  ];

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
            <Skeleton className="h-4 w-4 rounded-full bg-white/20" />
          </div>
        </div>
        
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-24 mb-3 bg-white/20" />
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-11/12 bg-white/10" />
            <Skeleton className="h-4 w-3/4 bg-white/10" />
            <div className="pt-1"></div>
            <Skeleton className="h-4 w-5/6 bg-white/10" />
            <Skeleton className="h-4 w-3/5 bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto chat-history px-2 md:px-4">
      {messages.length === 0 || (messages.length === 1 && messages[0].role === "assistant") ? (
        <div className="h-full flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4 py-8 animate-fade-in">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-gemini-yellow mb-4">
            Ask me anything
          </h1>
          <p className="text-md md:text-lg text-muted-foreground mb-8 max-w-2xl">
            I can help with academic research, explanations, problem-solving, and more. Just ask your question in natural language.
          </p>
          
          <div className="grid grid-cols-1 gap-4 w-full max-w-3xl mb-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/10 glass-morphism">
              <h3 className="text-lg font-medium text-gemini-yellow mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 flex-shrink-0" />
                Popular topics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {starters.map((starter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto py-3 px-4 justify-start text-left glass-morphism hover:bg-gemini-yellow/10 hover:border-gemini-yellow/30 transition-all btn-hover-effect"
                    onClick={() => sendMessage(starter)}
                  >
                    <Search className="h-4 w-4 mr-2 flex-shrink-0 text-gemini-yellow" />
                    <span className="truncate text-slate-50">{starter}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10 glass-morphism">
                <h3 className="text-base font-medium text-gemini-yellow mb-2 flex items-center">
                  <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                  Research
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ask about academic topics, scientific research, or historical events
                </p>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10 glass-morphism">
                <h3 className="text-base font-medium text-gemini-yellow mb-2 flex items-center">
                  <Zap className="h-4 w-4 mr-2 flex-shrink-0" />
                  Learn
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get explanations for complex concepts, theories, and processes
                </p>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10 glass-morphism">
                <h3 className="text-base font-medium text-gemini-yellow mb-2 flex items-center">
                  <Code2 className="h-4 w-4 mr-2 flex-shrink-0" />
                  Solutions
                </h3>
                <p className="text-sm text-muted-foreground">
                  Find answers to problems, calculations, and technical questions
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-4 max-w-4xl mx-auto">
          {messages.map(message => <ChatMessage key={message.id} message={message} />)}
          {isProcessing && renderSkeletonLoader()}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
