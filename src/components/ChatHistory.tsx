
import { useRef, useEffect, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { Sparkles, Lightbulb } from "lucide-react";
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
  const renderSkeletonLoader = () => (
    <div className="py-6 px-4 chat-message assistant">
      <div className="flex gap-4 max-w-4xl mx-auto">
        <div className="mt-1 flex-shrink-0">
          <div className="h-8 w-8 rounded-sm bg-[#10a37f]/10 flex items-center justify-center text-[#10a37f]">
            <Skeleton className="h-5 w-5 rounded-full bg-[#10a37f]/20" />
          </div>
        </div>
        
        <div className="min-w-0 flex-1">
          <Skeleton className="h-5 w-32 mb-3 bg-gray-300/20 dark:bg-gray-600/20" />
          
          <div className="space-y-3">
            <Skeleton className="h-4 w-full bg-gray-300/20 dark:bg-gray-600/20" />
            <Skeleton className="h-4 w-11/12 bg-gray-300/20 dark:bg-gray-600/20" />
            <Skeleton className="h-4 w-3/4 bg-gray-300/20 dark:bg-gray-600/20" />
            <div className="pt-2"></div>
            <Skeleton className="h-4 w-5/6 bg-gray-300/20 dark:bg-gray-600/20" />
            <Skeleton className="h-4 w-4/5 bg-gray-300/20 dark:bg-gray-600/20" />
          </div>
        </div>
      </div>
    </div>
  );
    
  // Empty state with welcome message and recommended questions
  const emptyStateContent = () => (
    <div className="h-full flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-4 py-8">
      <div className="w-16 h-16 mb-6 bg-[#10a37f]/10 rounded-full flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-[#10a37f]" />
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
        How can I help you today?
      </h1>
      
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
        Ask me anything, from explaining complex topics to helping with creative tasks.
      </p>
      
      <div className="w-full max-w-2xl mb-8">
        <div className="rounded-xl p-5 mb-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 mr-2 flex-shrink-0 text-[#10a37f]" />
            Examples
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendedQuestions.slice(0, 4).map((question, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="justify-start text-left border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" 
                onClick={() => sendMessage(question)}
              >
                {question.length > 45 ? `${question.substring(0, 45)}...` : question}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
    
  return (
    <div className="flex-1 overflow-y-auto chat-history flex flex-col">
      {!messages || messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          {emptyStateContent()}
        </div>
      ) : (
        <div className="py-4 max-w-4xl mx-auto w-full">
          {messages.map(message => <ChatMessage key={message.id} message={message} />)}
          {isProcessing && renderSkeletonLoader()}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
