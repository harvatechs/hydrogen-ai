
import React, { useState } from "react";
import { Message } from "@/types/message";
import { cn } from "@/lib/utils";
import { Bot, User, Copy, Check, ExternalLink, Code, ImageIcon } from "lucide-react";
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

  // Function to extract code blocks from content
  const extractCodeBlocks = (content: string) => {
    const regex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
    let match;
    const codeBlocks = [];
    let lastIndex = 0;
    
    while ((match = regex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        codeBlocks.push({
          type: 'text',
          content: content.substring(lastIndex, match.index)
        });
      }
      
      // Add code block
      codeBlocks.push({
        type: 'code',
        language: match[1] || 'plaintext',
        content: match[2]
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < content.length) {
      codeBlocks.push({
        type: 'text',
        content: content.substring(lastIndex)
      });
    }
    
    return codeBlocks.length > 0 ? codeBlocks : [{ type: 'text', content }];
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
    
    // Extract code blocks and regular text
    const blocks = extractCodeBlocks(message.content);
    
    return (
      <div className="space-y-4">
        {/* Main content */}
        <div className={cn(
          "prose prose-invert prose-headings:text-gemini-yellow prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-muted-foreground prose-a:text-blue-400 prose-strong:text-white prose-strong:font-semibold prose-em:text-yellow-200 prose-blockquote:border-l-2 prose-blockquote:border-gemini-yellow/50 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground/80 max-w-none",
          isError && "text-red-500",
          "chat-message-content"
        )}>
          {blocks.map((block, index) => {
            if (block.type === 'text') {
              return (
                <div key={index} dangerouslySetInnerHTML={{ __html: block.content }} />
              );
            } else if (block.type === 'code') {
              return (
                <div key={index} className="relative my-4 group">
                  <div className="absolute right-2 top-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 rounded-md bg-black/30 hover:bg-black/50 text-white/70 hover:text-white"
                      onClick={() => {
                        navigator.clipboard.writeText(block.content);
                        setCopied(true);
                        toast({
                          title: "Code copied to clipboard",
                          description: "You can now paste it anywhere you need.",
                        });
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </Button>
                  </div>
                  <div className="flex items-center bg-black/40 px-4 py-1 text-xs text-white/60 rounded-t-md border-t border-l border-r border-white/10">
                    <Code size={14} className="mr-2 text-gemini-yellow" />
                    <span>{block.language || 'code'}</span>
                  </div>
                  <pre className="bg-black/40 p-4 rounded-b-md overflow-x-auto border border-white/10">
                    <code className="text-white/90 text-sm font-mono">{block.content}</code>
                  </pre>
                </div>
              );
            }
          })}
        </div>
        
        {/* Reference links */}
        {urls.length > 0 && (
          <div className="pt-2 border-t border-white/10">
            <h4 className="text-xs font-medium text-gemini-yellow mb-2 flex items-center">
              <ExternalLink size={12} className="mr-1" /> References
            </h4>
            <div className="flex flex-wrap gap-2">
              {urls.slice(0, 3).map((url, i) => (
                <TooltipProvider key={i}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-black/30 hover:bg-black/50 text-blue-300 hover:text-blue-200 border border-white/10 transition-colors"
                      >
                        <ExternalLink size={10} className="mr-1" />
                        Source {i + 1}
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-xs max-w-60 truncate">{url}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              {urls.length > 3 && (
                <span className="text-xs text-white/50">+{urls.length - 3} more</span>
              )}
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
