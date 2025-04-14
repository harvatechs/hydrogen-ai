
import { useState, ChangeEvent, FormEvent, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, SendHorizontal, FileUp, X, Zap } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { searchGoogle } from "@/utils/searchUtils";
import { SearchResults } from "./SearchResults";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { sendMessage, isProcessing, theme } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;
    
    // Check for "/web" command
    if (message.trim().startsWith('/web ')) {
      const searchTerm = message.trim().replace('/web ', '');
      await handleWebSearch(searchTerm);
      return;
    }
    
    const currentMessage = message;
    setMessage("");
    await sendMessage(currentMessage);
    
    // Focus the input field after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleWebSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      toast({
        title: "Please enter a search query",
        description: "Type what you want to search for after /web"
      });
      return;
    }
    
    toast({
      title: "Searching the web",
      description: `Looking up: "${searchTerm}"`
    });
    
    setIsSearching(true);
    setMessage("");
    
    const results = await searchGoogle(searchTerm);
    setIsSearching(false);
    
    if (results && results.items) {
      setSearchResults(results);
    } else {
      toast({
        title: "No results found",
        description: "Try a different search term"
      });
    }
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
    if (duration > 0) {
      // In production this would connect to a real speech-to-text API
      toast({
        title: "Processing your voice input",
        description: `${duration} seconds of audio captured`,
      });
      
      // Simulate voice recognition delay
      setTimeout(() => {
        // Simulate real voice recognition with a random question from our list
        const allQuestions = [
          "What causes a recession?",
          "Are we alone in the universe?",
          "What is the blockchain used for?",
          "Why did the dinosaurs go extinct?",
          "How does machine learning impact finance?",
          "What is quantum computing?",
          "How do black holes work?"
        ];
        
        const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
        setMessage(randomQuestion);
        setShowVoiceInput(false);
        
        // Focus input after voice recognition
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
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
      
      // Simulated file processing with a realistic delay
      setTimeout(() => {
        setIsUploading(false);
        toast({
          title: "File uploaded successfully",
          description: `Analyzing ${files[0].name} (${(files[0].size / 1024).toFixed(1)} KB)`,
        });
        
        // Simulate file analysis
        setTimeout(() => {
          setMessage(prev => prev + (prev ? " " : "") + `Analyze the content of this ${files[0].name} file.`);
          
          // Clear the input so the same file can be uploaded again
          e.target.value = '';
          
          // Focus input after file upload
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }, 800);
      }, 1500);
    }
  };

  const handleProSearch = () => {
    if (!message.trim()) {
      toast({
        title: "Please enter a search query",
        description: "Type what you want to research first."
      });
      return;
    }
    
    toast({
      title: "Advanced research in progress",
      description: `Deep analysis for: "${message}"`,
    });
    
    // Simulate advanced search
    setTimeout(() => {
      sendMessage(`Conduct comprehensive research on: ${message}`);
      setMessage("");
    }, 800);
  };

  const handleClearInput = () => {
    setMessage("");
    inputRef.current?.focus();
  };
  
  const handleCloseSearch = () => {
    setSearchResults(null);
  };

  return (
    <div className="sticky bottom-0 z-10 w-full bg-gradient-to-t from-background to-transparent pb-4 pt-2">
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto px-4">
        <div className="rounded-xl border dark:bg-black/40 dark:border-white/10 light:bg-white/95 light:border-black/10 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl dark:hover:border-white/20 light:hover:border-black/20">
          <div className="flex items-center">
            <div className="flex items-center space-x-1 ml-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.json,.md"
              />
              
              <Button 
                type="button" 
                size="icon" 
                variant="ghost" 
                className="h-9 w-9 rounded-full text-muted-foreground transition-all duration-300 dark:hover:bg-white/5 dark:hover:text-white light:hover:bg-black/5 light:hover:text-black"
                title="Attach file"
                onClick={handleFileUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-white/30 dark:border-t-white light:border-black/30 light:border-t-black"></div>
                ) : (
                  <FileUp className="h-4 w-4" />
                )}
              </Button>
              
              <Button 
                type="button"
                size="icon" 
                variant="ghost" 
                className="h-9 w-9 rounded-full text-muted-foreground transition-all duration-300 dark:hover:bg-white/5 dark:hover:text-white light:hover:bg-black/5 light:hover:text-black"
                title="Pro Search"
                onClick={handleProSearch}
              >
                <Zap className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative flex-grow">
              <Input
                ref={inputRef}
                placeholder="Ask anything or type /web to search the web..."
                value={message}
                onChange={handleInputChange}
                className="flex-grow border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-6 dark:text-white light:text-black placeholder:text-muted-foreground/70 transition-all duration-300"
                disabled={isProcessing}
              />
              
              {message && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={handleClearInput}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground/70 dark:hover:text-white light:hover:text-black"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-1 mr-2">
              <Dialog open={showVoiceInput} onOpenChange={setShowVoiceInput}>
                <Button 
                  type="button"
                  size="icon" 
                  variant="ghost" 
                  className="h-9 w-9 rounded-full text-muted-foreground transition-all duration-300 dark:hover:bg-white/5 dark:hover:text-white light:hover:bg-black/5 light:hover:text-black"
                  title="Voice input"
                  onClick={() => setShowVoiceInput(true)}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <DialogContent className="sm:max-w-md dark:bg-black/90 dark:border-white/10 light:bg-white/95 light:border-black/10 backdrop-blur-lg">
                  <DialogHeader>
                    <DialogTitle className="text-center dark:text-white light:text-black">Voice Search</DialogTitle>
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
                    ? "dark:bg-white/10 dark:text-white dark:hover:bg-white/20 light:bg-black/10 light:text-black light:hover:bg-black/20"
                    : "bg-white/20 text-white/50 cursor-not-allowed light:bg-black/10 light:text-black/50"
                )}
                disabled={!message.trim() || isProcessing}
                title="Send message"
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {isProcessing && (
            <div className="px-4 py-1 text-xs text-muted-foreground/70 border-t dark:border-white/5 light:border-black/5 dark:bg-black/20 light:bg-black/5">
              <div className="flex items-center">
                <div className="mr-2 typing-animation w-24 h-3 dark:bg-white/20 light:bg-black/10 rounded-full"></div>
                <span>Generating response...</span>
              </div>
            </div>
          )}
        </div>
        <div className="mt-1 text-xs text-center text-muted-foreground/50">
          HydroGen AI may display inaccurate info, including about people, places, or facts
        </div>
      </form>
      
      {searchResults && (
        <SearchResults 
          results={searchResults.items} 
          searchInfo={searchResults.searchInformation}
          searchTerm={message || ""}
          onClose={handleCloseSearch}
        />
      )}
    </div>
  );
}
