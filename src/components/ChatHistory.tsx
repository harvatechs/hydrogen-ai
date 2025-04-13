import { useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { SendIcon, Sparkles } from "lucide-react";
export function ChatHistory() {
  const {
    messages,
    sendMessage
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample conversation starters
  const starters = ["Explain quantum computing in simple terms", "What are the most effective strategies for language learning?", "Compare renewable energy sources and their environmental impacts", "What are the latest advancements in AI and machine learning?"];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);
  return <div className="flex-1 overflow-y-auto chat-history px-2 md:px-4">
      {messages.length === 0 || messages.length === 1 && messages[0].role === "assistant" ? <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-gemini-yellow mb-4">
            What can I help with?
          </h1>
          <p className="text-md md:text-lg text-muted-foreground mb-8">
            Ask me anything - I'm powered by Gemini AI to provide helpful, accurate responses.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
            {starters.map((starter, index) => <Button key={index} variant="outline" className="h-auto py-3 px-4 justify-start text-left glass-morphism hover:bg-gemini-yellow/10 hover:border-gemini-yellow/30 transition-all" onClick={() => sendMessage(starter)}>
                <Sparkles className="h-4 w-4 mr-2 flex-shrink-0 text-gemini-yellow" />
                <span className="truncate text-slate-50">{starter}</span>
              </Button>)}
          </div>
        </div> : <div className="py-4">
          {messages.map(message => <ChatMessage key={message.id} message={message} />)}
          <div ref={messagesEndRef} />
        </div>}
    </div>;
}