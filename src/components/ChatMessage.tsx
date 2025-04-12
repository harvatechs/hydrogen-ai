
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
    <div className={cn("py-6 first:pt-0", message.isLoading && "opacity-70")}>
      <div className="flex gap-4 max-w-4xl mx-auto px-4 md:px-6">
        <div className="mt-1 flex-shrink-0">
          {isUser ? (
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User size={16} />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Bot size={16} />
            </div>
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium mb-1 text-white/80">
            {isUser ? "You" : "HydroGen AI"}
          </div>
          
          {isUser ? (
            <div className="text-primary">{message.content}</div>
          ) : (
            <div
              className={cn(
                "prose prose-invert max-w-none text-muted-foreground",
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
