
import { useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { ChatMessage } from "./ChatMessage";

export function ChatHistory() {
  const { messages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto px-4">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
            What can I help with?
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Ask me anything - I'm powered by Gemini AI to provide helpful, accurate responses.
          </p>
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
