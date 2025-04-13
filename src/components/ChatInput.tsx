
import { useState, ChangeEvent, FormEvent, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, SendHorizontal, FileUp, Search, X, Lightning } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CommandItem, CommandList, CommandInput, CommandEmpty, CommandGroup, Command } from "@/components/ui/command";

// Suggested queries for auto-completion
const suggestedQueries = [
  "Explain quantum computing in simple terms",
  "What is the theory of relativity?",
  "How do neural networks work?",
  "What are the implications of climate change?",
  "Explain the concept of blockchain",
  "How does gene editing work?",
  "What is the difference between AI and machine learning?",
  "How do black holes form?",
  "Explain the process of photosynthesis",
  "What is the significance of the Higgs boson?"
];

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const { sendMessage, isProcessing } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (message.length > 0) {
      const filtered = suggestedQueries.filter(query => 
        query.toLowerCase().includes(message.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 5));
      setShowAutoComplete(filtered.length > 0);
    } else {
      setShowAutoComplete(false);
    }
  }, [message]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;
    
    const currentMessage = message;
    setMessage("");
    setShowAutoComplete(false);
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

  const handleSelectSuggestion = (suggestion: string) => {
    setMessage(suggestion);
    setShowAutoComplete(false);
    // Focus input after selection
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSearchWeb = () => {
    if (!message.trim()) {
      toast({
        title: "Please enter a search query",
        description: "Type what you want to search for first."
      });
      return;
    }
    
    toast({
      title: "Searching the web",
      description: `Looking up: "${message}"`,
    });
    
    // Simulate web search
    setTimeout(() => {
      sendMessage(`Search the web for: ${message}`);
      setMessage("");
    }, 800);
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
                accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.json,.md"
              />
              
              <Button 
                type="button" 
                size="icon" 
                variant="ghost" 
                className="h-9 w-9 rounded-full text-muted-foreground transition-all duration-300 hover:bg-gemini-yellow/10 hover:text-gemini-yellow"
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
                className="h-9 w-9 rounded-full text-muted-foreground transition-all duration-300 hover:bg-gemini-yellow/10 hover:text-gemini-yellow"
                title="Search the web"
                onClick={handleSearchWeb}
              >
                <Search className="h-4 w-4" />
              </Button>
              
              <Button 
                type="button"
                size="icon" 
                variant="ghost" 
                className="h-9 w-9 rounded-full text-muted-foreground transition-all duration-300 hover:bg-gemini-yellow/10 hover:text-gemini-yellow"
                title="Pro Search"
                onClick={handleProSearch}
              >
                <Lightning className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative flex-grow">
              <Input
                ref={inputRef}
                placeholder="Ask anything..."
                value={message}
                onChange={handleInputChange}
                className="flex-grow border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-6 text-white placeholder:text-muted-foreground/70 transition-all duration-300"
                disabled={isProcessing}
              />
              
              {message && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={handleClearInput}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground/70 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              
              {showAutoComplete && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-black/90 border border-white/10 rounded-md overflow-hidden shadow-lg">
                  <Command>
                    <CommandList>
                      <CommandGroup heading="Suggestions">
                        {filteredSuggestions.length === 0 ? (
                          <CommandEmpty>No suggestions found</CommandEmpty>
                        ) : (
                          filteredSuggestions.map((suggestion, index) => (
                            <CommandItem 
                              key={index} 
                              onSelect={() => handleSelectSuggestion(suggestion)}
                              className="cursor-pointer hover:bg-gemini-yellow/10 px-3 py-2"
                            >
                              <Search className="h-3 w-3 mr-2 text-gemini-yellow" />
                              <span className="text-sm">{suggestion}</span>
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-1 mr-2">
              <Dialog open={showVoiceInput} onOpenChange={setShowVoiceInput}>
                <DialogTrigger asChild>
                  <Button 
                    type="button"
                    size="icon" 
                    variant="ghost" 
                    className="h-9 w-9 rounded-full text-muted-foreground transition-all duration-300 hover:bg-gemini-yellow/10 hover:text-gemini-yellow"
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
