
import React from "react";
import { Message } from "@/types/message";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isError = message.role === "error";

  return (
    <div className={cn(
      "py-4 first:pt-0", 
      message.isLoading && "opacity-70",
      isUser ? "border-b border-white/10" : ""
    )}>
      <div className="flex gap-4 max-w-4xl mx-auto px-4 md:px-6">
        <div className="mt-1 flex-shrink-0">
          {isUser ? (
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User size={16} />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-gemini-purple/20 flex items-center justify-center text-gemini-yellow">
              <Bot size={16} />
            </div>
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium mb-1 text-white/80">
            {isUser ? "You" : "HydroGen AI"}
          </div>
          
          {isUser ? (
            <div className="text-primary pb-2">{message.content}</div>
          ) : (
            <div
              className={cn(
                "prose prose-invert prose-headings:text-gemini-yellow prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-muted-foreground prose-a:text-blue-400 prose-strong:text-white prose-strong:font-semibold prose-em:text-yellow-200 prose-code:bg-black/50 prose-code:text-yellow-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-blockquote:border-l-2 prose-blockquote:border-gemini-yellow/50 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground/80 max-w-none",
                isError && "text-red-500",
                message.isLoading && "animate-pulse",
                "chat-message-content"
              )}
              dangerouslySetInnerHTML={{ __html: message.content }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
