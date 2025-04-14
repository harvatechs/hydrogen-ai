
"use client";

import { Mic, MicOff, AlertCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface AIVoiceInputProps {
  onStart?: () => void;
  onStop?: (duration: number) => void;
  onTextCapture?: (text: string) => void;
  visualizerBars?: number;
  demoMode?: boolean;
  demoInterval?: number;
  className?: string;
}

export function AIVoiceInput({
  onStart,
  onStop,
  onTextCapture,
  visualizerBars = 48,
  demoMode = false,
  demoInterval = 3000,
  className
}: AIVoiceInputProps) {
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isDemo, setIsDemo] = useState(demoMode);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [recognition, setRecognition] = useState<any>(null);

  // Check if we're on the client-side
  useEffect(() => {
    setIsClient(true);
    
    // Initialize speech recognition if browser supports it
    if (typeof window !== 'undefined') {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        try {
          const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
          const recognitionInstance = new SpeechRecognition();
          
          recognitionInstance.continuous = true;
          recognitionInstance.interimResults = true;
          recognitionInstance.lang = 'en-US';
          
          recognitionInstance.onresult = (event: any) => {
            const transcript = Array.from(event.results)
              .map((result: any) => result[0])
              .map(result => result.transcript)
              .join('');
            
            setRecognizedText(transcript);
            
            // If handler exists, send the text through
            if (onTextCapture) {
              onTextCapture(transcript);
            }
          };
          
          recognitionInstance.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setErrorState(event.error);
            setSubmitted(false);
          };
          
          recognitionInstance.onend = () => {
            // Sometimes recognition ends unexpectedly, this ensures we properly reset state
            if (submitted) {
              setSubmitted(false);
              if (onStop) onStop(time);
            }
          };
          
          setRecognition(recognitionInstance);
        } catch (e) {
          console.error("Error setting up speech recognition:", e);
          setErrorState("Failed to initialize speech recognition");
        }
      } else {
        setErrorState("Speech recognition not supported in this browser");
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

  // Timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (submitted) {
      onStart?.();
      intervalId = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      onStop?.(time);
      setTime(0);
    }

    return () => clearInterval(intervalId);
  }, [submitted, time, onStart, onStop]);

  // Demo mode effect
  useEffect(() => {
    if (!isDemo) return;

    let timeoutId: NodeJS.Timeout;
    const runAnimation = () => {
      setSubmitted(true);
      timeoutId = setTimeout(() => {
        setSubmitted(false);
        timeoutId = setTimeout(runAnimation, 1000);
      }, demoInterval);
    };

    const initialTimeout = setTimeout(runAnimation, 100);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
    };
  }, [isDemo, demoInterval]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = useCallback(() => {
    if (isDemo) {
      setIsDemo(false);
      setSubmitted(false);
      return;
    }
    
    if (errorState) {
      toast({
        title: "Voice recognition error",
        description: errorState,
        variant: "destructive"
      });
      return;
    }
    
    if (!recognition) {
      toast({
        title: "Voice recognition unavailable",
        description: "Your browser doesn't support this feature or it failed to initialize",
        variant: "destructive"
      });
      return;
    }
    
    if (submitted) {
      try {
        recognition.stop();
        setSubmitted(false);
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
    } else {
      try {
        setRecognizedText("");
        recognition.start();
        setSubmitted(true);
      } catch (e) {
        console.error("Error starting recognition:", e);
        toast({
          title: "Error starting voice recognition",
          description: "Please try again",
          variant: "destructive"
        });
      }
    }
  }, [isDemo, submitted, recognition, errorState]);

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-4">
        <Button
          className={cn(
            "group h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300",
            submitted
              ? "bg-gemini-purple hover:bg-gemini-purple/90 text-white"
              : "bg-gemini-purple/10 hover:bg-gemini-purple/20 text-gemini-purple"
          )}
          type="button"
          onClick={handleClick}
        >
          {submitted ? (
            <MicOff className="w-6 h-6 animate-pulse" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>

        <span
          className={cn(
            "font-mono text-sm transition-opacity duration-300",
            submitted
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          {formatTime(time)}
        </span>

        <div className="h-12 w-64 flex items-center justify-center gap-0.5">
          {[...Array(visualizerBars)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-0.5 rounded-full transition-all duration-300",
                submitted
                  ? "bg-gemini-purple/50 animate-pulse"
                  : "bg-muted"
              )}
              style={
                submitted && isClient
                  ? {
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.05}s`,
                    }
                  : undefined
              }
            />
          ))}
        </div>

        <p className="h-4 text-sm text-muted-foreground">
          {submitted ? "Listening... Click to stop" : "Click to start speaking"}
        </p>
        
        {recognizedText && (
          <div className="mt-4 p-4 rounded-lg glass-card w-full max-w-lg overflow-auto max-h-32">
            <p className="text-sm">
              <span className="font-medium text-gemini-purple">Recognized:</span> {recognizedText}
            </p>
          </div>
        )}
        
        {errorState && (
          <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive w-full max-w-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm font-medium">Error: {errorState}</p>
            </div>
            <p className="text-xs mt-1">Try using a different browser or check your microphone permissions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
