
import React from "react";
import { Message } from "@/types/message";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isError = message.role === "error";

  return (
    <div
      className={cn(
        "flex gap-3 mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-gemini-purple flex items-center justify-center text-white">
          <Bot size={18} />
        </div>
      )}
      
      <Card
        className={cn(
          "px-4 py-3 max-w-[85%] shadow-sm",
          isUser ? "bg-gemini-purple text-white" : "bg-white",
          message.isLoading && "animate-pulse-slow"
        )}
      >
        {isUser ? (
          <div>{message.content}</div>
        ) : (
          <div
            className={cn(
              "prose prose-sm dark:prose-invert max-w-none",
              isError && "text-destructive",
              "chat-message-content"
            )}
            dangerouslySetInnerHTML={{ __html: message.content }}
          />
        )}
      </Card>
      
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
          <User size={18} />
        </div>
      )}
    </div>
  );
}
