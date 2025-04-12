
import { useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { SendIcon, Sparkles } from "lucide-react";

export function ChatHistory() {
  const { messages, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample conversation starters
  const starters = [
    "Explain quantum computing in simple terms",
    "What are the most effective strategies for language learning?",
    "Compare renewable energy sources and their environmental impacts",
    "What are the latest advancements in AI and machine learning?",
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.length === 0 || (messages.length === 1 && messages[0].role === "assistant") ? (
        <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto px-4">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
            What can I help with?
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Ask me anything - I'm powered by Gemini AI to provide helpful, accurate responses.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
            {starters.map((starter, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto py-3 px-4 justify-start text-left"
                onClick={() => sendMessage(starter)}
              >
                <Sparkles className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{starter}</span>
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
