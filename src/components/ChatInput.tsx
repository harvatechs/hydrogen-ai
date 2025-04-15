
import { useState, ChangeEvent, FormEvent, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, SendHorizontal, FileUp, X, Zap, MicOff, Loader2, Search, Sparkles } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { searchGoogle } from "@/utils/searchUtils";
import { SearchResults } from "./SearchResults";
import { useIsMobile } from "@/hooks/use-mobile";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const {
    sendMessage,
    isProcessing,
    theme
  } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recognition, setRecognition] = useState<any>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';
        recognitionInstance.onstart = () => {
          setIsListening(true);
          toast({
            title: "Listening...",
            description: "Speak clearly into your microphone"
          });
        };
        recognitionInstance.onresult = (event: any) => {
          const transcript = Array.from(event.results).map((result: any) => result[0]).map(result => result.transcript).join('');
          setMessage(transcript);
        };
        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          toast({
            title: "Error with voice input",
            description: `${event.error}. Please try again.`,
            variant: "destructive"
          });
        };
        recognitionInstance.onend = () => {
          setIsListening(false);
        };
        setRecognition(recognitionInstance);
      }
    }
    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
      }
    };
  }, []);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;
    if (message.trim().startsWith('/web ')) {
      const searchTerm = message.trim().replace('/web ', '');
      await handleWebSearch(searchTerm);
      return;
    }
    const currentMessage = message;
    setMessage("");
    await sendMessage(currentMessage);
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
    try {
      const results = await searchGoogle(searchTerm);
      setIsSearching(false);
      if (results && results.items && results.items.length > 0) {
        setSearchResults(results);
        toast({
          title: "Search results found",
          description: `Found ${results.items.length} results for "${searchTerm}"`
        });
      } else {
        toast({
          title: "No results found",
          description: "Try a different search term",
          variant: "destructive"
        });
      }
    } catch (error) {
      setIsSearching(false);
      toast({
        title: "Search failed",
        description: "There was an error searching the web. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  
  const toggleVoiceRecognition = () => {
    if (!recognition) {
      toast({
        title: "Voice recognition not supported",
        description: "Your browser doesn't support voice recognition. Try a different browser.",
        variant: "destructive"
      });
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
      } catch (e) {
        console.error("Error starting recognition:", e);
        toast({
          title: "Error starting voice recognition",
          description: "Please try again",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleVoiceStart = useCallback(() => {
    toast({
      title: "Voice recording started",
      description: "Speak clearly and we'll convert your speech to text."
    });
  }, []);
  
  const handleVoiceStop = useCallback((duration: number) => {
    if (duration > 0) {
      toast({
        title: "Processing your voice input",
        description: `${duration} seconds of audio captured`
      });
      setShowVoiceInput(false);
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
      setTimeout(() => {
        setIsUploading(false);
        toast({
          title: "File uploaded successfully",
          description: `Analyzing ${files[0].name} (${(files[0].size / 1024).toFixed(1)} KB)`
        });
        setTimeout(() => {
          setMessage(prev => prev + (prev ? " " : "") + `Analyze the content of this ${files[0].name} file.`);
          e.target.value = '';
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
      description: `Deep analysis for: "${message}"`
    });
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
  
  // Quick prompts
  const quickPrompts = [
    { icon: <Sparkles className="h-4 w-4 text-yellow-500" />, label: "Creative", prompt: "Generate creative ideas for " },
    { icon: <Zap className="h-4 w-4 text-blue-500" />, label: "Analyze", prompt: "Analyze and explain " },
    { icon: <Search className="h-4 w-4 text-green-500" />, label: "Research", prompt: "Research and summarize " },
  ];
  
  const handleQuickPrompt = (promptPrefix: string) => {
    if (!message.trim()) {
      toast({
        title: "Please enter a topic",
        description: "Type what you want to learn about first."
      });
      return;
    }
    
    sendMessage(`${promptPrefix}${message}`);
    setMessage("");
  };

  return (
    <div className="sticky bottom-0 z-10 w-full bg-gradient-to-t from-background via-background/95 to-transparent pb-4 pt-2">
      {isMobile && quickPrompts.length > 0 && message.trim() && (
        <div className="px-4 mb-2 flex overflow-x-auto hide-scrollbar space-x-2 pb-1">
          {quickPrompts.map((item, index) => (
            <Button
              key={index}
              size="sm"
              variant="outline"
              className="whitespace-nowrap flex-shrink-0 py-1 h-auto text-xs dark:bg-black/30 dark:border-white/10 light:bg-white/80 light:border-black/10"
              onClick={() => handleQuickPrompt(item.prompt)}
            >
              {item.icon}
              <span className="ml-1">{item.label}</span>
            </Button>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto px-4">
        <div className="rounded-xl border glass-card shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center">
            <div className="flex items-center space-x-1 ml-2">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.json,.md" />
              
              <Button 
                type="button" 
                size="icon" 
                variant="ghost" 
                className="h-9 w-9 rounded-full text-muted-foreground transition-all duration-300 dark:hover:bg-white/5 dark:hover:text-white light:hover:bg-black/5 light:hover:text-black" 
                title="Upload file"
                onClick={handleFileUpload}
              >
                <FileUp className="h-4 w-4" />
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
              
              {message.trim().startsWith('/web') && (
                <span className="text-xs text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full">
                  Web Search Mode
                </span>
              )}
            </div>
            
            <div className="relative flex-grow">
              <div className="flex items-center">
                <div className="absolute left-3 text-muted-foreground">
                  <Search className="h-4 w-4" />
                </div>
                <Input 
                  ref={inputRef} 
                  placeholder="Ask anything or type /web to search the web..." 
                  value={message} 
                  onChange={handleInputChange} 
                  className="flex-grow border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-6 pl-10 dark:text-white light:text-black placeholder:text-muted-foreground/70 transition-all duration-300" 
                  disabled={isProcessing} 
                />
              </div>
              
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
                <DialogContent className="sm:max-w-md glass-card">
                  <DialogHeader>
                    <DialogTitle className="text-center dark:text-white light:text-black">Voice Search</DialogTitle>
                  </DialogHeader>
                  <AIVoiceInput onStart={handleVoiceStart} onStop={handleVoiceStop} className="py-8" />
                </DialogContent>
              </Dialog>
              
              <Button 
                type="submit" 
                size="icon" 
                className={cn(
                  "h-9 w-9 rounded-full transition-all duration-200", 
                  message.trim() && !isProcessing 
                    ? "bg-gemini-gradient text-white hover:opacity-90" 
                    : "bg-gemini-purple/20 text-gemini-purple/50 cursor-not-allowed"
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
      
      {isSearching && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-xl shadow-xl flex flex-col items-center gap-4 max-w-md w-full">
            <Loader2 className="h-10 w-10 text-gemini-purple animate-spin" />
            <h3 className="text-xl font-medium">Searching the web...</h3>
            <p className="text-muted-foreground text-center">Fetching the most relevant results for your query</p>
          </div>
        </div>
      )}
    </div>
  );
}
