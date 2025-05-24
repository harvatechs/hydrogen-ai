
import { useRef, useEffect, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Globe, BookOpen, FileText, PanelRight, Lightbulb, Zap, Code2, PenLine, Youtube, Brain, Calendar, Rocket, PackageOpen, FlaskConical, BookMarked, Dna, TrendingUp, Database, Cpu, Atom } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import React from "react";

// Enhanced question categories with more professional options
const questionCategories = {
  technology: {
    icon: Cpu,
    color: "text-blue-500",
    questions: [
      "How does quantum computing work?",
      "What is the future of artificial intelligence?",
      "Explain blockchain technology and its applications",
      "How do neural networks learn and adapt?"
    ]
  },
  science: {
    icon: Atom,
    color: "text-green-500", 
    questions: [
      "What causes climate change and its effects?",
      "How do mRNA vaccines work?",
      "What is dark matter and dark energy?",
      "Can we achieve nuclear fusion energy?"
    ]
  },
  business: {
    icon: TrendingUp,
    color: "text-purple-500",
    questions: [
      "What causes economic recessions?",
      "How does cryptocurrency affect traditional finance?",
      "What are the principles of successful startups?",
      "How is AI transforming business operations?"
    ]
  },
  space: {
    icon: Rocket,
    color: "text-orange-500",
    questions: [
      "Are we alone in the universe?",
      "How do black holes work?",
      "What is the future of space colonization?",
      "Could we terraform Mars?"
    ]
  }
};

function generateRecommendedQuestions() {
  const allQuestions: string[] = [];
  Object.values(questionCategories).forEach(category => {
    allQuestions.push(...category.questions);
  });
  return allQuestions.sort(() => Math.random() - 0.5).slice(0, 8);
}

export function ChatHistory() {
  const { messages, sendMessage, isProcessing } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [recommendedQuestions] = useState(generateRecommendedQuestions());
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll to bottom when messages change with smooth animation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }, [messages]);

  // Enhanced skeleton loader with better animation
  const renderSkeletonLoader = () => (
    <div className="py-6 animate-fade-in">
      <div className="flex gap-4 max-w-4xl mx-auto px-4 md:px-6">
        <div className="mt-1 flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
            <Skeleton className="h-6 w-6 rounded-full bg-primary/30 animate-pulse" />
          </div>
        </div>
        
        <div className="min-w-0 flex-1 space-y-4">
          <Skeleton className="h-5 w-32 mb-4 bg-primary/20 animate-pulse" />
          
          <div className="space-y-3">
            <Skeleton className="h-4 w-full bg-muted/40 animate-pulse" />
            <Skeleton className="h-4 w-11/12 bg-muted/30 animate-pulse" />
            <Skeleton className="h-4 w-3/4 bg-muted/40 animate-pulse" />
            <div className="pt-2"></div>
            <Skeleton className="h-4 w-5/6 bg-muted/30 animate-pulse" />
            <Skeleton className="h-4 w-4/5 bg-muted/40 animate-pulse" />
            <div className="pt-2"></div>
            <Skeleton className="h-4 w-11/12 bg-muted/30 animate-pulse" />
            <Skeleton className="h-4 w-3/5 bg-muted/40 animate-pulse" />
            <div className="pt-3"></div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-24 rounded-md bg-muted/30 animate-pulse" />
              <Skeleton className="h-8 w-28 rounded-md bg-muted/30 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced empty state with better design and interactivity
  const emptyStateContent = () => (
    <div className="h-full flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4 animate-fade-in py-12">
      <div className="mb-8 relative">
        <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center mb-4 animate-pulse-slow">
          <Brain className="h-10 w-10 text-primary" />
        </div>
        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-bounce">
          <Sparkles className="h-3 w-3 text-white" />
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent mb-3">
        Welcome to HydroGen AI
      </h1>
      
      <h3 className="text-lg md:text-xl text-muted-foreground font-medium mb-2">
        Your Advanced AI Assistant
      </h3>
      
      <p className="text-sm text-muted-foreground mb-8 max-w-md">
        Ask questions, explore ideas, and discover insights across technology, science, business, and more.
      </p>
      
      <div className="w-full max-w-3xl mb-8">
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg mb-6">
          <div className="flex items-center justify-center mb-6">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Popular Questions
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(questionCategories).map(([category, config]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <config.icon className={`h-4 w-4 ${config.color}`} />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {category}
                  </span>
                </div>
                {config.questions.slice(0, 1).map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left w-full h-auto p-3 bg-background/50 hover:bg-accent/50 border-border/50 hover:border-primary/30 transition-all duration-200 group"
                    onClick={() => sendMessage(question)}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <config.icon className={`h-4 w-4 mt-0.5 ${config.color} group-hover:scale-110 transition-transform`} />
                      <span className="text-sm leading-relaxed">
                        {question.length > 45 ? question.substring(0, 42) + '...' : question}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border/30">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {recommendedQuestions.slice(4, 8).map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="justify-start text-left h-auto p-2 hover:bg-accent/30 transition-colors text-xs"
                  onClick={() => sendMessage(question)}
                >
                  <span className="truncate">
                    {question.split('?')[0].substring(0, 20)}...
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>AI Online</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
          <span>Secure & Private</span>
          <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
          <span>Professional Grade</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto chat-history px-2 md:px-4 flex flex-col">
      {!messages || messages.length === 0 || (messages.length === 1 && messages[0].role === "assistant") ? (
        <div className="flex-1 flex items-center justify-center">
          {emptyStateContent()}
        </div>
      ) : (
        <div className="py-4 max-w-4xl mx-auto w-full">
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
