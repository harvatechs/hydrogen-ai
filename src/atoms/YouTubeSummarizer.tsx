import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Youtube, X, ThumbsUp, Clock, CalendarDays, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

interface YouTubeSummarizerProps {
  videoUrl?: string;
  onClose: () => void;
  onSubmitResult: (summary: string) => void;
}

export function YouTubeSummarizer({ videoUrl = "", onClose, onSubmitResult }: YouTubeSummarizerProps) {
  const [url, setUrl] = useState(videoUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoInfoLoading, setIsVideoInfoLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoData, setVideoData] = useState<{
    id: string;
    title: string;
    channel: string;
    description: string;
    thumbnail: string;
    viewCount: string;
    uploadDate: string;
    duration: string;
  } | null>(null);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    if (videoUrl) {
      const videoId = extractVideoId(videoUrl);
      if (videoId) {
        fetchVideoInfo(videoId);
      }
    }
  }, [videoUrl]);

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const fetchVideoInfo = async (videoId: string) => {
    setIsVideoInfoLoading(true);
    setError("");

    try {
      // In a real implementation, this would fetch data from YouTube API
      // For now, we'll simulate it with mock data
      setTimeout(() => {
        setVideoData({
          id: videoId,
          title: "Understanding Machine Learning: A Comprehensive Guide",
          channel: "AI Explained",
          description: "This video provides a comprehensive overview of machine learning concepts, applications, and how they're transforming various industries.",
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          viewCount: "245,879",
          uploadDate: "May 12, 2023",
          duration: "18:42"
        });
        setIsVideoInfoLoading(false);
        toast({
          title: "Video found",
          description: "Ready to generate summary"
        });
      }, 1000);
    } catch (err) {
      setError("Failed to fetch video information. Please check the URL and try again.");
      setIsVideoInfoLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setVideoData(null);
    setSummary("");
  };

  const handleFetchVideo = () => {
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      setError("Invalid YouTube URL. Please enter a valid YouTube video link.");
      return;
    }

    fetchVideoInfo(videoId);
  };

  const handleSummarize = async () => {
    if (!videoData) return;

    setIsLoading(true);
    setError("");

    try {
      // In a real implementation, this would call the Gemini API to summarize the YouTube video
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        const generatedSummary = `
          <h2>Summary: ${videoData.title}</h2>
          <p>This video by ${videoData.channel} provides a comprehensive overview of machine learning concepts and applications.</p>
          
          <h3>Key Points:</h3>
          <ul>
            <li><strong>Introduction to ML:</strong> The video starts with an introduction to what machine learning is and how it differs from traditional programming.</li>
            <li><strong>Types of Learning:</strong> It covers supervised, unsupervised, and reinforcement learning with clear examples of each.</li>
            <li><strong>Neural Networks:</strong> The presenter explains how neural networks work, using visual diagrams and analogies to the human brain.</li>
            <li><strong>Real-world Applications:</strong> Various practical examples are demonstrated, including image recognition, natural language processing, and recommendation systems.</li>
            <li><strong>Future Trends:</strong> The video concludes with emerging trends in AI research and potential impact on various industries.</li>
          </ul>
          
          <h3>Main Takeaways:</h3>
          <p>Machine learning is transforming industries by enabling computers to learn from data rather than following explicit instructions. The video emphasizes that understanding core concepts is essential before diving into specific algorithms or frameworks.</p>
          
          <p><em>Source: <a href="https://www.youtube.com/watch?v=${videoData.id}" target="_blank">YouTube video by ${videoData.channel}</a></em></p>
        `;
        
        setSummary(generatedSummary);
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      setError("Failed to summarize the video. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (summary) {
      onSubmitResult(summary);
    }
  };

  const handleTryDifferent = () => {
    setIsLoading(false);
    setSummary("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-black/90 border border-white/10 rounded-lg w-full max-w-3xl p-6 shadow-xl">
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
            <div className="flex gap-2">
            <Input
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
                onChange={handleInputChange}
                className="bg-black/50 border-white/10 flex-grow"
              />
              <Button 
                onClick={handleFetchVideo}
                disabled={!url.trim() || isVideoInfoLoading}
                className="whitespace-nowrap bg-red-950 hover:bg-red-900 text-white"
              >
                {isVideoInfoLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Fetch Video'
                )}
              </Button>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>
          
          {videoData && !summary && (
            <Card className="bg-black/40 border-white/10 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3">
                  <img 
                    src={videoData.thumbnail} 
                    alt={videoData.title}
                    className="w-full rounded-md border border-white/10"
                    onError={(e) => {
                      // Fallback if thumbnail URL is invalid
                      (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${videoData.id}/hqdefault.jpg`;
                    }}
                  />
                </div>
                <div className="w-full sm:w-2/3">
                  <h3 className="font-medium text-lg mb-1 text-white">{videoData.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{videoData.channel}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <div className="flex items-center">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span>{videoData.viewCount} views</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{videoData.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      <span>{videoData.uploadDate}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-3 bg-white/5" />
                  
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {videoData.description}
                  </p>
                </div>
              </div>
            </Card>
          )}
          
          {videoData && !summary && (
            <div className="flex justify-end">
            <Button 
              onClick={handleSummarize}
                disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                    Generating summary...
                </>
              ) : (
                  'Generate Summary'
              )}
            </Button>
          </div>
          )}
          
          {summary && (
            <>
              <Card className="bg-black/40 border-white/10">
                <ScrollArea className="h-[40vh] p-4">
                  <div className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: summary }} />
                </ScrollArea>
              </Card>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handleTryDifferent}
                  className="border-white/10 hover:bg-white/5"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Different
                </Button>
                
                <Button 
                  onClick={handleSubmit}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Use This Summary
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
