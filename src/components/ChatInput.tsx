
import { useState, ChangeEvent, FormEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Sparkles, Mic, SendHorizontal, FileUp, Image, Link2 } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const { sendMessage, isProcessing } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;
    
    const currentMessage = message;
    setMessage("");
    await sendMessage(currentMessage);
    
    // Focus the input field after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="sticky bottom-0 z-10 w-full bg-gradient-to-t from-background to-transparent pb-4 pt-2">
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto px-4">
        <div className="rounded-xl border bg-black/40 backdrop-blur-sm glass-morphism shadow-lg">
          <div className="flex items-center">
            <div className="flex items-center space-x-1 ml-2">
              <Button 
                type="button" 
                size="icon" 
                variant="ghost" 
                className="h-9 w-9 rounded-full text-muted-foreground"
                title="Attach file"
              >
                <FileUp className="h-4 w-4" />
              </Button>
              
              <Button 
                type="button"
                size="icon" 
                variant="ghost" 
                className="h-9 w-9 rounded-full text-muted-foreground"
                title="Search the web"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <Input
              ref={inputRef}
              placeholder="Ask anything..."
              value={message}
              onChange={handleInputChange}
              className="flex-grow border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-6 text-white placeholder:text-muted-foreground/70"
              disabled={isProcessing}
            />
            
            <div className="flex items-center space-x-1 mr-2">
              <Button 
                type="button"
                size="icon" 
                variant="ghost" 
                className={cn("h-9 w-9 rounded-full",
                  isProcessing ? "text-gemini-yellow animate-pulse" : "text-muted-foreground"
                )}
                disabled={isProcessing}
                title="Smart suggestions"
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              
              <Button 
                type="button"
                size="icon" 
                variant="ghost" 
                className="h-9 w-9 rounded-full text-muted-foreground"
                title="Voice input"
              >
                <Mic className="h-4 w-4" />
              </Button>
              
              <Button
                type="submit"
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-full transition-all duration-200",
                  message.trim() && !isProcessing
                    ? "bg-gemini-yellow text-black hover:bg-gemini-yellow/90"
                    : "bg-white/20 text-white/50 cursor-not-allowed"
                )}
                disabled={!message.trim() || isProcessing}
                title="Send message"
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {isProcessing && (
            <div className="px-4 py-1 text-xs text-muted-foreground/70 border-t border-white/5 bg-black/20">
              Generating response...
            </div>
          )}
        </div>
        <div className="mt-1 text-xs text-center text-muted-foreground/50">
          HydroGen AI may display inaccurate info, including about people, places, or facts
        </div>
      </form>
    </div>
  );
}
