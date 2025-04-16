
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Youtube, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface YouTubeSummarizerProps {
  onClose: () => void;
  onSubmit: (summary: string) => void;
}

export function YouTubeSummarizer({ onClose, onSubmit }: YouTubeSummarizerProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSummarize = async () => {
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      setError("Invalid YouTube URL. Please enter a valid YouTube video link.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // In a real implementation, this would call the Gemini API to summarize the YouTube video
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        const summary = `
          <h2>Video Summary</h2>
          <p>This is a summary of the YouTube video with ID: ${videoId}</p>
          <h3>Key Points:</h3>
          <ul>
            <li>The video discusses important concepts related to AI and machine learning</li>
            <li>It covers neural networks and their applications</li>
            <li>The presenter demonstrates several practical examples</li>
            <li>The video concludes with future trends in AI research</li>
          </ul>
          <p>This summary was generated based on the transcript and content of the video.</p>
        `;
        
        onSubmit(summary);
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      setError("Failed to summarize the video. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-black/90 border border-white/10 rounded-lg w-full max-w-lg p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Youtube className="h-5 w-5 text-red-500 mr-2" />
            <h2 className="text-xl font-semibold text-white">YouTube Summarizer</h2>
          </div>
          <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
            Atom
          </Badge>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Enter YouTube Video URL
            </label>
            <Input
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-black/50 border-white/10"
            />
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSummarize}
              disabled={!url.trim() || isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                  Summarizing...
                </>
              ) : (
                'Summarize Video'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
