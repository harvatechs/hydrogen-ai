
import React, { useState, useRef } from "react";
import { Message } from "@/types/message";
import { cn } from "@/lib/utils";
import { Bot, User, Copy, Check, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isError = message.role === "error";
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
          <Skeleton className="h-4 w-3/4 bg-gray-600/20" />
          <Skeleton className="h-4 w-1/2 bg-gray-600/20" />
          <Skeleton className="h-4 w-5/6 bg-gray-600/20" />
          <Skeleton className="h-4 w-2/3 bg-gray-600/20" />
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
            "prose dark:prose-invert max-w-none text-base",
            isError && "text-red-500",
            "chat-message-content"
          )}
        >
          <div dangerouslySetInnerHTML={{ __html: message.content }} />
        </div>
        
        {/* Reference links section */}
        {urls.length > 0 && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
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
                    className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
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
        {!isUser && !isError && showFeedback && (
          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
            {feedbackGiven ? (
              <Badge variant="outline" className="text-xs bg-gray-100 dark:bg-gray-800">
                {feedbackGiven === "positive" ? "Feedback: Helpful" : "Feedback: Not helpful"}
              </Badge>
            ) : (
              <div className="flex items-center space-x-1">
                <span>Was this response helpful?</span>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6 rounded-full hover:bg-green-500/20 hover:text-green-500" 
                  onClick={() => handleFeedback("positive")}
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6 rounded-full hover:bg-red-500/20 hover:text-red-500" 
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
        "py-6 px-4 chat-message", 
        message.isLoading && "opacity-70",
        isUser ? "user" : "assistant"
      )}
      onMouseEnter={() => !isUser && setShowFeedback(true)}
      onMouseLeave={() => !isUser && setShowFeedback(false)}
    >
      <div className="flex gap-4 max-w-4xl mx-auto">
        <div className="mt-1 flex-shrink-0">
          {isUser ? (
            <div className="h-8 w-8 rounded-sm bg-[#5436da]/10 flex items-center justify-center text-[#5436da]">
              <User size={16} />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-sm bg-[#10a37f]/10 flex items-center justify-center text-[#10a37f]">
              <Bot size={16} />
            </div>
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {isUser ? "You" : "Assistant"}
            </div>
            
            {!isUser && !message.isLoading && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
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
