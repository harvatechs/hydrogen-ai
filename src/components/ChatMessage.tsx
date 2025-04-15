
import React, { useState, useRef } from "react";
import { ChatMessage as MessageType } from "@/types/message";
import { cn } from "@/lib/utils";
import { Bot, User, Copy, Check, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface ChatMessageProps {
  message: MessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isError = message.role === "error" || message.isError === true;
  const [copied, setCopied] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<"positive" | "negative" | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  // Function to handle copy button click
  const handleCopy = () => {
    if (messageRef.current) {
      const text = messageRef.current.innerText;
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopied(true);
          toast({
            title: "Copied to clipboard",
            description: "Message content has been copied to your clipboard.",
            duration: 2000,
          });
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          toast({
            title: "Copy failed",
            description: "Failed to copy the message. Please try again.",
            variant: "destructive",
          });
        });
    }
  };

  // Handle feedback submission
  const handleFeedback = (type: "positive" | "negative") => {
    setFeedbackGiven(type);
    toast({
      title: type === "positive" ? "Thank you for your feedback!" : "We'll work to improve",
      description: type === "positive" 
        ? "We're glad this was helpful." 
        : "Thank you for helping us improve our responses.",
      duration: 3000,
    });
  };

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
        <div 
          ref={messageRef}
          className={cn(
            "prose prose-invert prose-headings:text-gemini-yellow prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-muted-foreground prose-a:text-blue-400 prose-strong:text-white prose-strong:font-semibold prose-em:text-yellow-200 prose-blockquote:border-l-2 prose-blockquote:border-gemini-yellow/50 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground/80 max-w-none",
            isError && "text-red-500",
            "chat-message-content"
          )}
        >
          {message.content}
        </div>
        
        {/* Reference links section */}
        {urls.length > 0 && (
          <div className="pt-3 border-t border-white/10">
            <h4 className="text-xs font-medium text-gemini-yellow mb-2 flex items-center">
              <ExternalLink size={12} className="mr-1" /> Sources
            </h4>
            <div className="flex flex-wrap gap-2">
              {urls.map((url, i) => {
                // Extract domain name for display
                let domain = url.replace(/(^\w+:|^)\/\//, '').split('/')[0];
                // Limit display length
                const displayUrl = domain.length > 25 ? domain.substring(0, 22) + '...' : domain;
                
                return (
                  <a 
                    key={i}
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-black/30 hover:bg-black/50 text-blue-300 hover:text-blue-200 border border-white/10 transition-colors"
                  >
                    <ExternalLink size={10} className="mr-1" />
                    {displayUrl}
                  </a>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Feedback section for assistant messages */}
        {!isUser && !isError && (
          <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
            {feedbackGiven ? (
              <Badge variant="outline" className="text-xs bg-gemini-yellow/10 hover:bg-gemini-yellow/20 border-gemini-yellow/20">
                {feedbackGiven === "positive" ? "Feedback: Helpful" : "Feedback: Not helpful"}
              </Badge>
            ) : (
              <div className="flex items-center space-x-1">
                <span>Was this response helpful?</span>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6 rounded-full hover:bg-green-500/20 hover:text-green-400" 
                  onClick={() => handleFeedback("positive")}
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6 rounded-full hover:bg-red-500/20 hover:text-red-400" 
                  onClick={() => handleFeedback("negative")}
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className={cn(
        "py-5 first:pt-0 animate-fade-in", 
        message.isLoading && "opacity-70",
        isUser ? "border-b border-white/10" : ""
      )}
      onMouseEnter={() => !isUser && setShowFeedback(true)}
      onMouseLeave={() => !isUser && setShowFeedback(false)}
    >
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
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm font-medium text-white/80">
              {isUser ? "You" : "HydroGen AI"}
            </div>
            
            {!isUser && !message.isLoading && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground/70 hover:text-gemini-yellow hover:bg-gemini-yellow/10 rounded-full"
                      onClick={handleCopy}
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    {copied ? "Copied!" : "Copy message"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
