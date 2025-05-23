
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          // Don't go to 100 to avoid janky transitions when content loads
          return 90; 
        }
        return prev + (90 - prev) * 0.1;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className={cn(
        "fixed inset-0 flex flex-col items-center justify-center bg-background z-50 transition-opacity duration-300",
        mounted ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="space-y-6 text-center">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{message}</h2>
          <p className="text-muted-foreground">We're setting things up for you</p>
        </div>
        
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
