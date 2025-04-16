
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Youtube, FileText, Copy, Check, X, Play, Clipboard, ClipboardCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

export function YouTubeSummarizer({ onClose }: { onClose: () => void }) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoDetails, setVideoDetails] = useState<{ title: string; channelName: string; thumbnail: string; videoId: string } | null>(null);
  const [summaryType, setSummaryType] = useState<'brief' | 'detailed' | 'notes'>('brief');
  const [summary, setSummary] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

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
      // Extract video ID
      const videoId = extractVideoId(youtubeUrl);
      
      if (!videoId) {
        throw new Error('Could not extract video ID');
      }
      
      // In a real implementation, we would fetch video details from the YouTube API
      // For now, we'll simulate fetching the title and channel name with a timeout
      setTimeout(() => {
        // Use YouTube's thumbnail API to get a real thumbnail
        setVideoDetails({
          title: 'Example YouTube Video Title',
          channelName: 'Example Channel',
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          videoId
        });
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

  const summarizeVideo = async () => {
    if (!videoDetails) return;
    
    setSummaryLoading(true);
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would call an API that processes the YouTube video
      // For now, we'll simulate with a timeout
      setTimeout(() => {
        let summaryContent = '';
        
        switch (summaryType) {
          case 'brief':
            summaryContent = `
              <h2>Video Summary</h2>
              <p>This is a brief summary of the YouTube video. In a real implementation, this would contain the key points and main ideas from the video, condensed into a short format that's easy to digest.</p>
              
              <h3>Key Points</h3>
              <ul>
                <li>The video discusses the main topic in detail</li>
                <li>Several important concepts are introduced and explained</li>
                <li>The presenter provides examples to illustrate the points</li>
                <li>A conclusion summarizes the main takeaways</li>
              </ul>
              
              <p>This summary was generated from the video URL: ${youtubeUrl}</p>
            `;
            break;
            
          case 'detailed':
            summaryContent = `
              <h2>Detailed Video Summary</h2>
              <p>This is a comprehensive summary of the YouTube video. In a real implementation, this would contain a thorough analysis of the content, capturing all major points, examples, and nuances from the video.</p>
              
              <h3>Introduction</h3>
              <p>The video begins with an introduction to the topic, setting the context and explaining why this subject is important.</p>
              
              <h3>Main Content</h3>
              <p>The presenter then delves into the core content, exploring several subtopics:</p>
              
              <h4>First Subtopic</h4>
              <p>This section covers the first major area, with detailed explanations and examples.</p>
              
              <h4>Second Subtopic</h4>
              <p>Next, the video transitions to another important aspect of the topic, providing thorough analysis.</p>
              
              <h4>Third Subtopic</h4>
              <p>The final major section addresses additional considerations and edge cases related to the main topic.</p>
              
              <h3>Conclusion</h3>
              <p>The video concludes with a summary of the key takeaways and potential applications or future developments.</p>
              
              <p>This detailed summary was generated from the video URL: ${youtubeUrl}</p>
            `;
            break;
            
          case 'notes':
            summaryContent = `
              <h2>Study Notes</h2>
              <p>These structured study notes capture the essential information from the video in a format optimized for learning and review.</p>
              
              <h3>Topic Overview</h3>
              <ul>
                <li><strong>Main concept:</strong> <em>Definition and importance</em></li>
                <li><strong>Historical context:</strong> <em>Background information provided in the video</em></li>
                <li><strong>Key terminology:</strong> <em>Important terms defined in the video</em></li>
              </ul>
              
              <h3>Core Principles</h3>
              <ol>
                <li>
                  <strong>Principle 1:</strong>
                  <ul>
                    <li>Explanation of the first principle</li>
                    <li>Example application</li>
                    <li>Related concepts</li>
                  </ul>
                </li>
                <li>
                  <strong>Principle 2:</strong>
                  <ul>
                    <li>Explanation of the second principle</li>
                    <li>Example application</li>
                    <li>Related concepts</li>
                  </ul>
                </li>
                <li>
                  <strong>Principle 3:</strong>
                  <ul>
                    <li>Explanation of the third principle</li>
                    <li>Example application</li>
                    <li>Related concepts</li>
                  </ul>
                </li>
              </ol>
              
              <h3>Formulas and Equations</h3>
              <code>E = mc²</code>
              <p><em>(Example formula that would be relevant to the video content)</em></p>
              
              <h3>Summary Diagram</h3>
              <p><em>In a full implementation, this might include a text representation of a concept map or diagram shown in the video.</em></p>
              
              <h3>Practice Questions</h3>
              <ol>
                <li>What is the main concept discussed in the video?</li>
                <li>How do the principles relate to each other?</li>
                <li>Apply the concept to a real-world scenario described in the video.</li>
              </ol>
              
              <p>These study notes were generated from the video URL: ${youtubeUrl}</p>
            `;
            break;
        }
        
        setSummary(summaryContent);
        setSummaryLoading(false);
      }, 3000);
    } catch (error) {
      setSummaryLoading(false);
      toast({
        title: 'Error generating summary',
        description: 'Failed to summarize the video. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Summary has been copied to your clipboard.",
      duration: 2000,
    });
  };

  const handleCopyTextWithoutHTML = () => {
    if (!summary) return;
    
    // Create a temporary div to render the HTML and extract text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = summary;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    copyToClipboard(textContent);
  };
  
  const handleCopyHTML = () => {
    if (!summary) return;
    copyToClipboard(summary);
  };

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      <div className="p-4 border-b dark:border-white/10 light:border-black/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-1">YouTube Summarizer</h2>
          <p className="text-sm text-muted-foreground">Generate summaries from YouTube videos</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <Tabs defaultValue="input" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="summary" disabled={!summary}>Result</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="input" className="flex-1 overflow-auto p-4">
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
                  onClick={checkVideo} 
                  disabled={isLoading || !youtubeUrl}
                  className="shrink-0"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check Video'}
                </Button>
              </div>
            </div>
            
            {videoDetails && (
              <Card className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <img 
                    src={videoDetails.thumbnail} 
                    alt={videoDetails.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to medium quality thumbnail if maxresdefault is not available
                      const target = e.target as HTMLImageElement;
                      target.src = `https://img.youtube.com/vi/${videoDetails.videoId}/mqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a 
                      href={youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-red-600 rounded-full p-3 hover:bg-red-700 transition-colors"
                    >
                      <Play className="h-6 w-6 text-white" />
                    </a>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium truncate">{videoDetails.title}</h3>
                  <p className="text-sm text-muted-foreground">{videoDetails.channelName}</p>
                </div>
              </Card>
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
                disabled={!videoDetails || summaryLoading}
                className="w-full"
              >
                {summaryLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Video...
                  </>
                ) : (
                  'Generate Summary'
                )}
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground mt-2">
              Note: Processing longer videos may take more time. The quality of the summary depends on the video content.
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="summary" className="flex-1 overflow-hidden flex flex-col">
          {isProcessing && !summary && (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
              <p className="text-center text-muted-foreground">
                Analyzing video content and generating your {summaryType} summary...
              </p>
            </div>
          )}
          
          {summary && (
            <>
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-medium">{summaryType.charAt(0).toUpperCase() + summaryType.slice(1)} Summary</h3>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopyTextWithoutHTML}
                    className="h-8 flex items-center gap-1 text-xs"
                  >
                    {isCopied ? <ClipboardCheck className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
                    <span>Copy Text</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopyHTML}
                    className="h-8 flex items-center gap-1 text-xs"
                  >
                    {isCopied ? <ClipboardCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>Copy HTML</span>
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div 
                  className="prose prose-invert dark:prose-invert prose-headings:text-gemini-yellow prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-muted-foreground prose-a:text-blue-400 prose-strong:text-white prose-strong:font-semibold prose-em:text-yellow-200 prose-blockquote:border-l-2 prose-blockquote:border-gemini-yellow/50 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground/80 max-w-none"
                  dangerouslySetInnerHTML={{ __html: summary }}
                />
              </ScrollArea>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
