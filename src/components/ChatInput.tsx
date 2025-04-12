
import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Sparkles, Mic, SendHorizontal } from "lucide-react";
import { useChat } from "@/context/ChatContext";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const { sendMessage, isProcessing } = useChat();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;
    
    const currentMessage = message;
    setMessage("");
    await sendMessage(currentMessage);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="rounded-xl border bg-secondary glass-morphism">
        <div className="flex items-center">
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            className="h-10 w-10 rounded-full ml-1 text-muted-foreground"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
          
          <Input
            placeholder="Ask anything..."
            value={message}
            onChange={handleInputChange}
            className="flex-grow border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-6 text-white"
            disabled={isProcessing}
          />
          
          <div className="flex items-center space-x-1 mr-2">
            <Button 
              type="button"
              size="icon" 
              variant="ghost" 
              className="h-9 w-9 rounded-full text-muted-foreground"
            >
              <Search className="h-4 w-4" />
            </Button>
            
            <Button 
              type="button"
              size="icon" 
              variant="ghost" 
              className="h-9 w-9 rounded-full text-muted-foreground"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
            
            <Button 
              type="button"
              size="icon" 
              variant="ghost" 
              className="h-9 w-9 rounded-full text-muted-foreground"
            >
              <Mic className="h-4 w-4" />
            </Button>
            
            <Button
              type="submit"
              size="icon"
              className="h-9 w-9 rounded-full bg-white text-black hover:bg-white/90"
              disabled={!message.trim() || isProcessing}
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
