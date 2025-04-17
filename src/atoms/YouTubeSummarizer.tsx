
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Youtube, X, ThumbsUp, Clock, CalendarDays, RefreshCw, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

interface YouTubeSummarizerProps {
  videoUrl?: string;
  onClose: () => void;
  onSubmitResult: (summary: string) => void;
}

interface VideoData {
  id: string;
  title: string;
  channel: string;
  description: string;
  thumbnail: string;
  viewCount: string;
  uploadDate: string;
  duration: string;
}

export function YouTubeSummarizer({ videoUrl = "", onClose, onSubmitResult }: YouTubeSummarizerProps) {
  const [url, setUrl] = useState(videoUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoInfoLoading, setIsVideoInfoLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [summary, setSummary] = useState("");
  const [summaryProgress, setSummaryProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

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
      // For a real implementation, we would call the YouTube Data API
      // Since we're simulating, we'll create mock data based on the video ID
      
      // In a real app, this would be:
      // const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUR_API_KEY}`);
      // const data = await response.json();
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample video data
      const mockTitles = [
        "Understanding Machine Learning: A Comprehensive Guide",
        "Quantum Computing Explained Simply",
        "The Future of Artificial Intelligence",
        "Web Development in 2025: New Trends"
      ];
      
      const mockChannels = [
        "AI Explained", 
        "Tech Insights", 
        "Future Technologies", 
        "Code Masters"
      ];
      
      const randomIndex = Math.floor(Math.random() * mockTitles.length);
      
      setVideoData({
        id: videoId,
        title: mockTitles[randomIndex],
        channel: mockChannels[randomIndex],
        description: "This video provides a comprehensive overview of important concepts and shows how they're transforming various industries with practical examples and case studies.",
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        viewCount: Math.floor(100000 + Math.random() * 900000).toLocaleString(),
        uploadDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        duration: `${Math.floor(5 + Math.random() * 25)}:${Math.floor(10 + Math.random() * 50)}`
      });
      
      toast({
        title: "Video found",
        description: "Ready to generate summary"
      });
    } catch (err) {
      setError("Failed to fetch video information. Please check the URL and try again.");
    } finally {
      setIsVideoInfoLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setVideoData(null);
    setSummary("");
    setSummaryProgress(0);
  };

  const handleFetchVideo = () => {
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }
    
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
    setSummaryProgress(0);
    setProgressText("Initializing...");

    try {
      // Simulate the summarization process with progress updates
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setSummaryProgress(i);
        
        switch(i) {
          case 0:
            setProgressText("Extracting video transcript...");
            break;
          case 20:
            setProgressText("Analyzing content...");
            break;
          case 40:
            setProgressText("Identifying key points...");
            break;
          case 60:
            setProgressText("Generating summary...");
            break;
          case 80:
            setProgressText("Formatting results...");
            break;
          case 100:
            setProgressText("Summary complete!");
            break;
        }
      }
      
      // In a real implementation, this would call a backend API to:
      // 1. Extract the video transcript
      // 2. Send to an LLM to generate a summary
      // 3. Return the formatted summary
      
      // Generate a summary based on the video title
      const generatedSummary = generateMockSummary(videoData);
      
      setSummary(generatedSummary);
    } catch (err) {
      setError("Failed to summarize the video. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateMockSummary = (video: VideoData): string => {
    const title = video.title.toLowerCase();
    
    let summaryTemplate = `
      <h2>Summary: ${video.title}</h2>
      <p>This video by <strong>${video.channel}</strong> provides a comprehensive overview of {MAIN_TOPIC} with practical insights and examples.</p>
      
      <h3>Key Points:</h3>
      <ul>
        {KEY_POINTS}
      </ul>
      
      <h3>Main Takeaways:</h3>
      <p>{MAIN_TOPIC} is revolutionizing industries by {IMPACT}. The video emphasizes that understanding core concepts is essential before diving into specific implementations.</p>
      
      <h3>Conclusion:</h3>
      <p>The video concludes by discussing future developments in {MAIN_TOPIC} and how it will continue to evolve in the coming years.</p>
      
      <p><em>Source: <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank">YouTube video by ${video.channel}</a></em></p>
    `;
    
    // Customize based on video title
    let mainTopic = "emerging technologies";
    let impact = "enabling new capabilities and efficiencies";
    let keyPoints = "";
    
    if (title.includes("machine learning")) {
      mainTopic = "machine learning concepts and applications";
      impact = "enabling computers to learn from data rather than following explicit instructions";
      keyPoints = `
        <li><strong>Introduction to ML:</strong> The video starts with an introduction to what machine learning is and how it differs from traditional programming.</li>
        <li><strong>Types of Learning:</strong> It covers supervised, unsupervised, and reinforcement learning with clear examples of each.</li>
        <li><strong>Neural Networks:</strong> The presenter explains how neural networks work, using visual diagrams and analogies to the human brain.</li>
        <li><strong>Real-world Applications:</strong> Various practical examples are demonstrated, including image recognition, natural language processing, and recommendation systems.</li>
        <li><strong>Future Trends:</strong> The video concludes with emerging trends in AI research and potential impact on various industries.</li>
      `;
    } else if (title.includes("quantum")) {
      mainTopic = "quantum computing principles and potential";
      impact = "promising computational power that could solve problems impossible for classical computers";
      keyPoints = `
        <li><strong>Quantum Bits (Qubits):</strong> The video explains how qubits differ from classical bits and can exist in superposition.</li>
        <li><strong>Quantum Superposition:</strong> A clear explanation of how quantum computers can process multiple possibilities simultaneously.</li>
        <li><strong>Quantum Entanglement:</strong> The presenter describes this phenomenon and why it's crucial for quantum computing.</li>
        <li><strong>Quantum Algorithms:</strong> Several key algorithms are discussed, including Shor's and Grover's algorithms.</li>
        <li><strong>Current Limitations:</strong> The video honestly addresses the challenges facing quantum computing today, including decoherence and error rates.</li>
      `;
    } else if (title.includes("artificial intelligence")) {
      mainTopic = "artificial intelligence advancements and ethical considerations";
      impact = "transforming how we live, work, and interact with technology";
      keyPoints = `
        <li><strong>AI Evolution:</strong> The video traces the development of AI from rule-based systems to modern deep learning.</li>
        <li><strong>Current Capabilities:</strong> It showcases impressive achievements in computer vision, natural language processing, and decision-making.</li>
        <li><strong>Ethical Challenges:</strong> The presenter thoughtfully discusses bias, transparency, privacy, and job displacement concerns.</li>
        <li><strong>AI Safety:</strong> Important considerations about alignment and control of advanced AI systems are explored.</li>
        <li><strong>Future Directions:</strong> The video concludes with predictions about general AI and how it might reshape society.</li>
      `;
    } else if (title.includes("web development")) {
      mainTopic = "modern web development practices and frameworks";
      impact = "enabling developers to create faster, more responsive, and more secure web applications";
      keyPoints = `
        <li><strong>Frontend Frameworks:</strong> The video compares modern frameworks and explains their strengths and trade-offs.</li>
        <li><strong>Backend Technologies:</strong> Key server-side approaches and architectures are discussed with practical examples.</li>
        <li><strong>Performance Optimization:</strong> The presenter shares techniques for improving load times and responsiveness.</li>
        <li><strong>Security Best Practices:</strong> Common vulnerabilities and protection strategies are outlined.</li>
        <li><strong>Development Workflow:</strong> Modern tools for testing, deployment, and collaboration are demonstrated.</li>
      `;
    } else {
      // Default key points for any other topic
      keyPoints = `
        <li><strong>Introduction:</strong> The video begins with a clear overview of the main concepts and their significance.</li>
        <li><strong>Core Principles:</strong> Several fundamental ideas are explained with helpful analogies and visual aids.</li>
        <li><strong>Practical Applications:</strong> The presenter demonstrates real-world examples and use cases.</li>
        <li><strong>Implementation Details:</strong> Key techniques and methods are discussed in an accessible way.</li>
        <li><strong>Future Outlook:</strong> The video concludes with emerging trends and potential developments in the field.</li>
      `;
    }
    
    return summaryTemplate
      .replace("{MAIN_TOPIC}", mainTopic)
      .replace("{IMPACT}", impact)
      .replace("{KEY_POINTS}", keyPoints)
      .replace("{MAIN_TOPIC}", mainTopic); // Replace twice because it appears twice
  };

  const handleSubmit = () => {
    if (summary) {
      onSubmitResult(summary);
    }
  };

  const handleTryDifferent = () => {
    setIsLoading(false);
    setSummary("");
    setSummaryProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-black/90 border border-white/10 rounded-lg w-full max-w-3xl p-6 shadow-xl animate-fade-in">
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
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Youtube className="h-4 w-4 mr-2" />
                )}
                {isVideoInfoLoading ? 'Loading...' : 'Fetch Video'}
              </Button>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>
          
          {videoData && !summary && !isLoading && (
            <Card className="bg-black/40 border-white/10 p-4 animate-fade-in">
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
          
          {isLoading && (
            <Card className="bg-black/40 border-white/10 p-6 animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-center">Generating Summary</h3>
                <Progress value={summaryProgress} className="h-2 w-full" />
                <p className="text-center text-sm text-muted-foreground">{progressText}</p>
              </div>
            </Card>
          )}
          
          {videoData && !summary && !isLoading && (
            <div className="flex justify-end">
              <Button 
                onClick={handleSummarize}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Youtube className="h-4 w-4 mr-2" />
                Generate Summary
              </Button>
            </div>
          )}
          
          {summary && (
            <>
              <Card className="bg-black/40 border-white/10 animate-fade-in">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm font-medium">Summary Complete</span>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                    Ready
                  </Badge>
                </div>
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
