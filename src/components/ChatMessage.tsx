
import React, { useState } from "react";
import { Message } from "@/types/message";
import { cn } from "@/lib/utils";
import { Bot, User, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isError = message.role === "error";
  const [copied, setCopied] = useState(false);

  // Function to safely handle the HTML content
  const renderContent = () => {
    if (isUser) {
      return <div className="text-primary pb-2">{message.content}</div>;
    }
    
    if (message.isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4 bg-white/10" />
          <Skeleton className="h-4 w-1/2 bg-white/10" />
          <Skeleton className="h-4 w-5/6 bg-white/10" />
          <Skeleton className="h-4 w-2/3 bg-white/10" />
        </div>
      );
    }
    
    // Extract URLs for reference links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.content.match(urlRegex) || [];
    
    return (
      <div className="space-y-4">
        {/* Main content */}
        <div className={cn(
          "prose prose-invert prose-headings:text-gemini-yellow prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-muted-foreground prose-a:text-blue-400 prose-strong:text-white prose-strong:font-semibold prose-em:text-yellow-200 prose-blockquote:border-l-2 prose-blockquote:border-gemini-yellow/50 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground/80 max-w-none",
          isError && "text-red-500",
          "chat-message-content"
        )}>
          <div dangerouslySetInnerHTML={{ __html: message.content }} />
        </div>
        
        {/* Reference links */}
        {urls.length > 0 && (
          <div className="pt-2 border-t border-white/10">
            <h4 className="text-xs font-medium text-gemini-yellow mb-2 flex items-center">
              <ExternalLink size={12} className="mr-1" /> References
            </h4>
            <div className="flex flex-wrap gap-2">
              {urls.map((url, i) => (
                <a 
                  key={i}
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-black/30 hover:bg-black/50 text-blue-300 hover:text-blue-200 border border-white/10 transition-colors"
                >
                  <ExternalLink size={10} className="mr-1" />
                  Source {i + 1}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "py-4 first:pt-0 animate-fade-in", 
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
          
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
