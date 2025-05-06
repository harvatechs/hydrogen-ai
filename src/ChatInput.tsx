import { useState, ChangeEvent, FormEvent, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, SendHorizontal, FileUp, X, Zap, MicOff, Loader2, Search, Wand2 } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { parseAtomCommand, AtomType } from "@/types/atoms";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(false);
  const {
    sendMessage,
    isProcessing,
    theme,
    setActiveAtom
  } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recognition, setRecognition] = useState<any>(null);

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
          setShowVoiceTooltip(true);
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
          setShowVoiceTooltip(false);
          toast({
            title: "Error with voice input",
            description: `${event.error}. Please try again.`,
            variant: "destructive"
          });
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
          setShowVoiceTooltip(false);
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
    
    // Check if it's an atom command
    const atomCommand = parseAtomCommand(message.trim());
    if (atomCommand) {
      // Activate the corresponding atom
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
      setShowVoiceTooltip(false);
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

  const handleClearInput = () => {
    setMessage("");
    inputRef.current?.focus();
  };
  
  const getCommandBadge = () => {
    if (message.trim().startsWith('/youtube') || message.trim().startsWith('/yt')) {
      return <Badge className="text-xs bg-red-500/20 text-red-400 border-red-500/30">YouTube Summarizer</Badge>;
    } else if (message.trim().startsWith('/flashcard') || message.trim().startsWith('/fc')) {
      return <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">Flashcard Maker</Badge>;
    } else if (message.trim().startsWith('/web') || message.trim().startsWith('/search')) {
      return <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">Web Search</Badge>;
    } else if (message.trim().startsWith('/mindmap') || message.trim().startsWith('/mm')) {
      return <Badge className="text-xs bg-purple-500/20 text-purple-400 border-purple-500/30">Mind Map</Badge>;
    } else if (message.trim().startsWith('/studyguide') || message.trim().startsWith('/sg')) {
      return <Badge className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Study Guide</Badge>;
    }
    return null;
  };

  return (
    <div className="sticky bottom-0 z-10 w-full bg-gradient-to-t from-background via-background/95 to-transparent pb-4 pt-2">
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
                title="Add Files"
                onClick={handleFileUpload}
              >
                <FileUp className="h-4 w-4" />
              </Button>
              
              <Button 
                type="button" 
                size="icon" 
                variant="ghost" 
                className="h-9 w-9 rounded-full text-muted-foreground transition-all duration-300 dark:hover:bg-white/5 dark:hover:text-white light:hover:bg-black/5 light:hover:text-black" 
                title="Web Search"
                onClick={() => setActiveAtom('websearch')}
              >
                <Search className="h-4 w-4" />
              </Button>
              
              <Button 
                type="button" 
                size="icon" 
                variant="ghost" 
                className={cn(
                  "h-9 w-9 rounded-full text-muted-foreground transition-all duration-300", 
                  message.trim().startsWith('/') ? "bg-gemini-yellow/10 text-gemini-yellow" : "dark:hover:bg-white/5 dark:hover:text-white light:hover:bg-black/5 light:hover:text-black"
                )}
                title="Command Mode"
              >
                <Wand2 className="h-4 w-4" />
              </Button>
              
              {getCommandBadge()}
            </div>
            
            <div className="relative flex-grow">
              <div className="flex items-center">
                <div className="absolute left-3 text-muted-foreground">
                  <Search className="h-4 w-4" />
                </div>
                <Input ref={inputRef} placeholder="Ask anything, or try /youtube, /flashcard, /web..." value={message} onChange={handleInputChange} className="flex-grow border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-6 pl-10 dark:text-white light:text-black placeholder:text-muted-foreground/70 transition-all duration-300" disabled={isProcessing} />
              </div>
              
              {message && <Button type="button" size="icon" variant="ghost" onClick={handleClearInput} className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground/70 dark:hover:text-white light:hover:text-black">
                  <X className="h-3 w-3" />
                </Button>}
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
              
              <Button type="submit" size="icon" className={cn("h-9 w-9 rounded-full transition-all duration-200", message.trim() && !isProcessing ? "dark:bg-gemini-purple dark:text-white dark:hover:opacity-90 light:bg-gemini-purple light:text-white light:hover:opacity-90" : "bg-gemini-purple/20 text-gemini-purple/50 cursor-not-allowed")} disabled={!message.trim() || isProcessing} title="Send message">
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {isProcessing && <div className="px-4 py-1 text-xs text-muted-foreground/70 border-t dark:border-white/5 light:border-black/5 dark:bg-black/20 light:bg-black/5">
              <div className="flex items-center">
                <div className="mr-2 typing-animation w-24 h-3 dark:bg-white/20 light:bg-black/10 rounded-full"></div>
                <span>Generating response...</span>
              </div>
            </div>}
          
          {showVoiceTooltip && (
            <div className="px-4 py-2 text-xs text-gemini-yellow bg-gemini-yellow/10 border-t border-gemini-yellow/20 rounded-b-xl">
              <div className="flex items-center justify-between">
                <span>Listening... Speak clearly into your microphone</span>
                <Button size="sm" variant="ghost" className="h-5 px-2 text-xs" onClick={() => setShowVoiceTooltip(false)}>
                  <X className="h-3 w-3 mr-1" /> Dismiss
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
