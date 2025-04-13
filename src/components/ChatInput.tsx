
import { useState, ChangeEvent, FormEvent, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, SendHorizontal, FileUp, Search } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { sendMessage, isProcessing } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleVoiceStart = useCallback(() => {
    toast({
      title: "Voice recording started",
      description: "Speak clearly and we'll convert your speech to text.",
    });
  }, []);

  const handleVoiceStop = useCallback((duration: number) => {
    // In a real app, this would process the voice recording through a speech-to-text API
    if (duration > 0) {
      toast({
        title: "Voice recorded",
        description: `${duration} seconds of audio captured. Processing...`,
      });
      
      // Simulate voice processing delay
      setTimeout(() => {
        const demoQuestions = [
          "What are the main principles of quantum computing?",
          "Explain the concept of neural networks in machine learning",
          "What is the difference between artificial intelligence and machine learning?",
          "How does climate change affect biodiversity?"
        ];
        
        const randomQuestion = demoQuestions[Math.floor(Math.random() * demoQuestions.length)];
        setMessage(randomQuestion);
        setShowVoiceInput(false);
      }, 1500);
    } else {
      setShowVoiceInput(false);
    }
  }, []);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      setIsUploading(true);
      
      // Simulate file upload
      setTimeout(() => {
        setIsUploading(false);
        toast({
          title: "File uploaded",
          description: `${files[0].name} has been attached to your conversation.`,
        });
        
        // Clear the input so the same file can be uploaded again
        e.target.value = '';
      }, 1500);
    }
  };

  return (
    <div className="sticky bottom-0 z-10 w-full bg-gradient-to-t from-background to-transparent pb-4 pt-2">
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto px-4">
        <div className="rounded-xl border bg-black/40 backdrop-blur-sm glass-morphism shadow-lg transition-all duration-300 hover:shadow-xl hover:border-white/20">
          <div className="flex items-center">
            <div className="flex items-center space-x-1 ml-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              
              <Button 
                type="button" 
                size="icon" 
                variant="ghost" 
                className="h-9 w-9 rounded-full text-muted-foreground transition-all duration-300 hover:bg-black/30 hover:text-white"
                title="Attach file"
                onClick={handleFileUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                ) : (
                  <FileUp className="h-4 w-4" />
                )}
              </Button>
              
              <Button 
                type="button"
                size="icon" 
                variant="ghost" 
                className="h-9 w-9 rounded-full text-muted-foreground transition-all duration-300 hover:bg-black/30 hover:text-white"
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
              className="flex-grow border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-6 text-white placeholder:text-muted-foreground/70 transition-all duration-300"
              disabled={isProcessing}
            />
            
            <div className="flex items-center space-x-1 mr-2">
              <Dialog open={showVoiceInput} onOpenChange={setShowVoiceInput}>
                <DialogTrigger asChild>
                  <Button 
                    type="button"
                    size="icon" 
                    variant="ghost" 
                    className="h-9 w-9 rounded-full text-muted-foreground transition-all duration-300 hover:bg-black/30 hover:text-white"
                    title="Voice input"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-black/80 border-white/10 backdrop-blur-lg">
                  <DialogHeader>
                    <DialogTitle className="text-center text-gemini-yellow">Voice Search</DialogTitle>
                  </DialogHeader>
                  <AIVoiceInput 
                    onStart={handleVoiceStart}
                    onStop={handleVoiceStop}
                    className="py-8"
                  />
                </DialogContent>
              </Dialog>
              
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
              <div className="flex items-center">
                <div className="mr-2 typing-animation w-24 h-3 bg-white/20 rounded-full"></div>
                <span>Generating response...</span>
              </div>
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
