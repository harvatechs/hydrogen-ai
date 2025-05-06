import { useRef, useEffect, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Globe, BookOpen, FileText, PanelRight, Lightbulb, Zap, Code2, PenLine, Youtube, Brain, Calendar, Rocket, PackageOpen, FlaskConical, BookMarked, Dna } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import React from "react";

// Generate 8 randomized questions from our pool of interesting questions
function generateRecommendedQuestions() {
  const allQuestions = [
    "What causes a recession?",
    "Are we alone in the universe?",
    "What is the blockchain used for?",
    "Why did the dinosaurs go extinct?",
    "How does machine learning impact finance?",
    "Can you help me learn Python?", 
    "What are the latest breakthroughs in fusion energy?",
    "How do black holes work?",
    "What is quantum computing?",
    "How does the human brain create memories?",
    "What causes climate change?",
    "How do mRNA vaccines work?",
    "What is artificial general intelligence?",
    "How do solid-state batteries work?",
    "What is dark matter?",
    "Can we reverse aging?",
    "How do psychedelics affect consciousness?",
    "What is the future of space colonization?",
    "How does quantum entanglement work?",
    "What are parallel universes?",
    "How do plants communicate?",
    "What is the origin of consciousness?",
    "How do self-driving cars make decisions?",
    "What are supervolcanoes?",
    "How do coral reefs survive?",
    "What causes northern lights?",
    "How do birds navigate?",
    "What is the future of human evolution?",
    "How do tardigrades survive extreme conditions?",
    "What are gravitational waves?",
    "Could advanced civilizations exist in other dimensions?",
    "How might the universe ultimately end?",
    "What existed before the Big Bang?",
    "Is time travel theoretically possible?",
    "Could we upload human consciousness to computers?",
    "Are we living in a simulation?",
    "What lies at the bottom of Earth's deepest oceans?",
    "How do animals experience emotions?",
    "Could humans develop new senses?",
    "What happens inside a quantum computer?",
    "How did life first begin on Earth?",
    "Could we terraform other planets?",
    "What is dark energy's true nature?",
    "How does quantum tunneling work?",
    "Could we achieve immortality through technology?",
    "What causes déjà vu?",
    "How do migrating animals navigate?",
    "What lies beneath Europa's icy surface?",
    "Could we harness zero-point energy?",
    "How do quantum computers maintain coherence?"
  ];
    
  // Shuffle array and take first 8 items
  return allQuestions
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);
}

// Icons for the question buttons
const questionIcons = [
  Brain,
  Zap,
  Globe,
  PenLine,
  Rocket,
  BookMarked,
  FlaskConical,
  Dna
];

export function ChatHistory() {
  const {
    messages,
    sendMessage,
    isProcessing
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [recommendedQuestions] = useState(generateRecommendedQuestions());

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);
  
  // Skeleton loader for when a response is being generated
  const renderSkeletonLoader = () => <div className="py-4 animate-fade-in">
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
    </div>;
    
  // Empty state with welcome message and recommended questions
  const emptyStateContent = () => <div className="h-full flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="w-16 h-16 mb-6 bg-gemini-yellow/20 rounded-full flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-gemini-yellow" />
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
        Welcome to HydroGen AI
      </h1>
      
      <h3 className="text-lg text-gemini-yellow/90 font-medium mb-8">
        Where Curiosity Meets AI Magic
      </h3>
      
      <div className="w-full max-w-2xl mb-8">
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-white/10 glass-morphism mb-6 shadow-lg">
          <h3 className="text-lg font-medium text-gemini-yellow mb-4 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 mr-2 flex-shrink-0" />
            Popular Questions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendedQuestions.map((question, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="justify-start text-left glass-morphism 
                  hover:bg-gemini-yellow/10 hover:border-gemini-yellow/50 hover:text-white 
                  hover:shadow-md hover:shadow-gemini-yellow/10 hover:scale-105
                  transition-all duration-200" 
                onClick={() => sendMessage(question)}
              >
                {React.createElement(questionIcons[index], { className: "h-4 w-4 mr-2 flex-shrink-0 text-gemini-yellow" })}
                <span className="truncate">{question.split('?')[0].length > 28 
                  ? question.split('?')[0].substring(0, 28) + '...' 
                  : question.split('?')[0]}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>;
    
  return <div className="flex-1 overflow-y-auto chat-history px-2 md:px-4 flex flex-col">
      {!messages || messages.length === 0 || messages.length === 1 && messages[0].role === "assistant" ? <div className="flex-1 flex items-center justify-center">
          {emptyStateContent()}
        </div> : <div className="py-4 max-w-4xl mx-auto w-full">
          {messages.map(message => <ChatMessage key={message.id} message={message} />)}
          {isProcessing && renderSkeletonLoader()}
          <div ref={messagesEndRef} />
        </div>}
    </div>;
}