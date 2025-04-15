
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useChat } from '@/context/ChatContext';
import { Loader2, Youtube, FileText, Copy, Check, X } from 'lucide-react';

export function YouTubeSummarizer({ onClose }: { onClose: () => void }) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoDetails, setVideoDetails] = useState<{ title: string; channelName: string; thumbnail: string; } | null>(null);
  const [summaryType, setSummaryType] = useState<'brief' | 'detailed' | 'notes'>('brief');
  const { sendMessage } = useChat();
  const [isCopied, setIsCopied] = useState(false);

  const validateYoutubeUrl = (url: string) => {
    // Simple validation for YouTube URLs
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
    return regex.test(url);
  };

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const checkVideo = async () => {
    if (!validateYoutubeUrl(youtubeUrl)) {
      toast({
        title: 'Invalid YouTube URL',
        description: 'Please enter a valid YouTube video URL',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // In a real implementation, we would fetch video details from the YouTube API
      // For now, we'll simulate that with a timeout
      const videoId = extractVideoId(youtubeUrl);
      
      setTimeout(() => {
        if (videoId) {
          setVideoDetails({
            title: 'Example YouTube Video Title',
            channelName: 'Example Channel',
            thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
          });
        }
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error fetching video',
        description: 'Could not load video details. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const summarizeVideo = () => {
    let prompt = '';
    
    switch (summaryType) {
      case 'brief':
        prompt = `Create a brief summary of this YouTube video: ${youtubeUrl}. Include only the main points and key takeaways.`;
        break;
      case 'detailed':
        prompt = `Create a detailed summary of this YouTube video: ${youtubeUrl}. Include all important points, arguments, and explanations.`;
        break;
      case 'notes':
        prompt = `Create structured study notes from this YouTube video: ${youtubeUrl}. Format them with headers, bullet points, and include any important formulas, definitions, or concepts.`;
        break;
    }
    
    toast({
      title: 'Processing video',
      description: 'Generating summary based on video content...'
    });
    
    sendMessage(prompt);
    onClose();
  };

  const copyLink = () => {
    navigator.clipboard.writeText(youtubeUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b dark:border-white/10 light:border-black/10">
        <h2 className="text-xl font-semibold mb-1">YouTube Summarizer</h2>
        <p className="text-sm text-muted-foreground">Generate summaries and notes from YouTube videos</p>
      </div>
      
      <div className="p-4 flex-1 overflow-auto">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">YouTube Video URL</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="pr-10"
                />
                {youtubeUrl && (
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setYoutubeUrl('')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={copyLink}
                className="shrink-0"
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button 
                onClick={checkVideo} 
                disabled={isLoading || !youtubeUrl}
                className="shrink-0"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check Video'}
              </Button>
            </div>
          </div>
          
          {videoDetails && (
            <div className="border rounded-lg overflow-hidden dark:border-white/10 light:border-black/10">
              <div className="aspect-video bg-muted relative">
                <img 
                  src={videoDetails.thumbnail} 
                  alt={videoDetails.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 rounded-full p-4">
                    <Youtube className="h-8 w-8 text-red-500" />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium truncate">{videoDetails.title}</h3>
                <p className="text-sm text-muted-foreground">{videoDetails.channelName}</p>
              </div>
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium mb-1 block">Summary Type</label>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={summaryType === 'brief' ? 'default' : 'outline'}
                onClick={() => setSummaryType('brief')}
                className="w-full"
              >
                Brief
              </Button>
              <Button 
                variant={summaryType === 'detailed' ? 'default' : 'outline'}
                onClick={() => setSummaryType('detailed')}
                className="w-full"
              >
                Detailed
              </Button>
              <Button 
                variant={summaryType === 'notes' ? 'default' : 'outline'}
                onClick={() => setSummaryType('notes')}
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                Notes
              </Button>
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={summarizeVideo}
              disabled={!videoDetails}
              className="w-full"
            >
              Generate Summary
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground mt-2">
            Note: Processing longer videos may take more time. The quality of the summary depends on the video content.
          </div>
        </div>
      </div>
    </div>
  );
}
