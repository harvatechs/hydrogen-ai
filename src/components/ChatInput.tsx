import { useState, ChangeEvent, FormEvent, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, SendHorizontal, FileUp, X, Zap, MicOff, Loader2, Search, Sparkles, BookOpen, Brain, Globe, Youtube, FileText } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { parseAtomCommand, AtomType } from "@/types/atoms";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showQuickCommands, setShowQuickCommands] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  
  const {
    sendMessage,
    isProcessing,
    theme,
    setActiveAtom
  } = useChat();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recognition, setRecognition] = useState<any>(null);
  
  // Track sidebar state changes
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    
    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    // Listen for sidebar toggle events
    const handleSidebarChange = (e: CustomEvent) => {
      setSidebarOpen(e.detail.open);
    };
    
    window.addEventListener('sidebar-state-changed', handleSidebarChange as EventListener);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('sidebar-state-changed', handleSidebarChange as EventListener);
    };
  }, []);
  
  const quickCommands = [
    {
      icon: <Youtube className="h-4 w-4 text-red-500" />,
      title: "YouTube Summary",
      description: "Summarize any YouTube video",
      command: "/youtube https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      color: "bg-red-500/10 text-red-400 border-red-500/30"
    }, 
    {
      icon: <FileText className="h-4 w-4 text-blue-500" />,
      title: "Flashcards",
      description: "Create study flashcards",
      command: "/flashcard The principles of quantum physics",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/30"
    }, 
    {
      icon: <Globe className="h-4 w-4 text-green-500" />,
      title: "Web Search",
      description: "Search the web for current info",
      command: "/web Latest AI research breakthroughs",
      color: "bg-green-500/10 text-green-400 border-green-500/30"
    }, 
    {
      icon: <Sparkles className="h-4 w-4 text-purple-500" />,
      title: "AI Summarizer",
      description: "Summarize any text content",
      command: "/summarize Paste your text to get a concise summary",
      color: "bg-purple-500/10 text-purple-400 border-purple-500/30"
    }, 
    {
      icon: <Brain className="h-4 w-4 text-orange-500" />,
      title: "Compare & Contrast",
      description: "Compare two concepts",
      command: "Compare quantum computing and classical computing",
      color: "bg-orange-500/10 text-orange-400 border-orange-500/30"
    }, 
    {
      icon: <BookOpen className="h-4 w-4 text-yellow-500" />,
      title: "Explain Like I'm 5",
      description: "Simple explanation of complex topics",
      command: "Explain quantum entanglement like I'm 5 years old",
      color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
    }
  ];
  
  // Speech recognition setup
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
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map(result => result.transcript)
            .join('');
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
    
    const atomCommand = parseAtomCommand(message.trim());
    if (atomCommand) {
      setActiveAtom(atomCommand.type, atomCommand.params);
      setMessage("");
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
    setActiveAtom('websearch', searchTerm);
    setMessage("");
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

  const applyQuickCommand = (command: string) => {
    setMessage(command);
    setShowQuickCommands(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const getCommandBadge = () => {
    if (message.trim().startsWith('/web') || message.trim().startsWith('/search')) {
      return <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
        Web Search Mode
      </span>;
    } else if (message.trim().startsWith('/youtube')) {
      return <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
        YouTube Summary Mode
      </span>;
    } else if (message.trim().startsWith('/flashcard')) {
      return <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
        Flashcard Mode
      </span>;
    } else if (message.trim().startsWith('/summarize') || message.trim().startsWith('/sum')) {
      return <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
        AI Summarizer Mode
      </span>;
    }
    return null;
  };

  // Calculate dynamic styles based on sidebar state
  const containerStyle = cn(
    "fixed bottom-0 left-0 right-0 z-20 pb-4 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent",
    sidebarOpen ? "md:pl-[280px]" : ""
  );

  return (
    <div className={containerStyle}>
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto px-4">
        <div className="rounded-xl border glass-card shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center">
            <div className="flex items-center space-x-1 ml-2">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.json,.md" />
              
              <Popover open={showQuickCommands} onOpenChange={setShowQuickCommands}>
                <PopoverTrigger asChild>
                  <Button type="button" size="icon" variant="ghost" className="h-9 w-9 rounded-full text-muted-foreground transition-all duration-300 dark:hover:bg-white/5 dark:hover:text-white light:hover:bg-black/5 light:hover:text-black" title="Quick Commands">
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start" sideOffset={10}>
                  <div className="p-4 border-b border-border">
                    <h3 className="text-sm font-medium">Quick Commands</h3>
                    <p className="text-xs text-muted-foreground">Select a template to get started</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {quickCommands.map((cmd, index) => (
                      <Button 
                        key={index} 
                        variant="ghost" 
                        className={`w-full justify-start mb-1 p-2 hover:${cmd.color.split(' ')[0]}/20`} 
                        onClick={() => applyQuickCommand(cmd.command)}
                      >
                        <div className={`p-2 rounded-full mr-3 ${cmd.color}`}>{cmd.icon}</div>
                        <div className="text-left">
                          <div className="font-medium text-sm">{cmd.title}</div>
                          <div className="text-xs text-muted-foreground">{cmd.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button 
                type="button" 
                size="icon" 
                variant="ghost" 
                className="h-9 w-9 rounded-full text-muted-foreground transition-all duration-300 dark:hover:bg-white/5 dark:hover:text-white light:hover:bg-black/5 light:hover:text-black" 
                title="Web Search" 
                onClick={() => setActiveAtom('websearch', '')}
              >
                <Search className="h-4 w-4" />
              </Button>
              
              {getCommandBadge()}
            </div>
            
            <div className="relative flex-grow">
              <div className="flex items-center">
                <Input 
                  ref={inputRef} 
                  placeholder="Ask anything or use a quick command..." 
                  value={message} 
                  onChange={handleInputChange} 
                  className="flex-grow border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-6 pl-4 dark:text-white light:text-black placeholder:text-muted-foreground/70 transition-all duration-300" 
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
                  variant={isListening ? "default" : "ghost"} 
                  className={cn(
                    "h-9 w-9 rounded-full transition-all duration-300", 
                    isListening 
                      ? "bg-gemini-yellow text-black voice-input-button active" 
                      : "text-muted-foreground dark:hover:bg-white/5 dark:hover:text-white light:hover:bg-black/5 light:hover:text-black"
                  )} 
                  title="Voice input" 
                  onClick={toggleVoiceRecognition}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
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
                    ? "dark:bg-gemini-purple dark:text-white dark:hover:opacity-90 light:bg-gemini-purple light:text-white light:hover:opacity-90" 
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
          
          {isListening && (
            <div className="px-4 py-2 text-xs text-gemini-yellow bg-gemini-yellow/10 border-t border-gemini-yellow/20 rounded-b-xl">
              <div className="flex items-center justify-between">
                <span>Listening... Speak clearly into your microphone</span>
                <Button size="sm" variant="ghost" className="h-5 px-2 text-xs" onClick={() => setIsListening(false)}>
                  <X className="h-3 w-3 mr-1" /> Stop
                </Button>
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
