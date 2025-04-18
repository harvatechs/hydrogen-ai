import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, FileText, Copy, Loader2, RefreshCw, CornerRightDown, ScanText, Sparkles, CheckCheck, Share2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface AISummarizerProps {
  initialText?: string;
  onClose: () => void;
  onSubmitResult: (summary: string) => void;
}

export function AISummarizer({ initialText = "", onClose, onSubmitResult }: AISummarizerProps) {
  const [text, setText] = useState(initialText);
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("input");
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [summaryLength, setSummaryLength] = useState<"short" | "medium" | "detailed">("medium");
  const [includeBulletPoints, setIncludeBulletPoints] = useState(true);
  const [includeSourceInfo, setIncludeSourceInfo] = useState(true);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-focus on text input when component mounts
  React.useEffect(() => {
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  }, []);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setSummary("");
  };
  
  const generateSummary = async () => {
    if (!text.trim() || text.length < 100) {
      toast({
        title: "Text too short",
        description: "Please enter at least 100 characters to generate a meaningful summary",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsGenerating(true);
    setProgressPercent(0);
    setProgressText("Analyzing text...");
    setSummary("");
    
    try {
      // Simulate text analysis progress
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgressPercent(20);
      setProgressText("Identifying key points...");
      
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgressPercent(50);
      setProgressText("Generating summary...");
      
      await new Promise(resolve => setTimeout(resolve, 700));
      setProgressPercent(80);
      setProgressText("Refining content...");
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgressPercent(100);
      setProgressText("Summary complete!");
      
      // Generate a contextual summary based on text content
      const generatedSummary = generateContextualSummary(text);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setSummary(generatedSummary);
      setActiveTab("summary");
      
      toast({
        title: "Summary generated",
        description: "AI summary is now ready for review",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error generating summary",
        description: "Unable to generate summary. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const generateContextualSummary = (content: string): string => {
    // In a real implementation, this would call an AI model API
    // For this demo, we'll create a simplified version based on the text
    
    // Limit content to a reasonable size to avoid crashes
    const maxContentLength = 20000;
    if (content.length > maxContentLength) {
      content = content.substring(0, maxContentLength) + "...";
    }
    
    // Extract key sentences and points
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const wordCount = content.split(/\s+/).length;
    
    // Determine summary length based on settings and input text
    let summaryTargetSentences: number;
    switch (summaryLength) {
      case "short":
        summaryTargetSentences = Math.min(3, Math.max(1, Math.floor(sentences.length * 0.1)));
        break;
      case "detailed":
        summaryTargetSentences = Math.min(10, Math.max(3, Math.floor(sentences.length * 0.3)));
        break;
      case "medium":
      default:
        summaryTargetSentences = Math.min(5, Math.max(2, Math.floor(sentences.length * 0.2)));
    }
    
    // For longer texts, select key sentences from beginning, middle and end
    const selectedSentences: string[] = [];
    if (sentences.length <= summaryTargetSentences) {
      selectedSentences.push(...sentences);
    } else {
      // Take sentences from beginning
      selectedSentences.push(...sentences.slice(0, Math.ceil(summaryTargetSentences * 0.4)));
      
      // Take some from middle
      const middleStart = Math.floor(sentences.length * 0.4);
      const middleCount = Math.ceil(summaryTargetSentences * 0.3);
      selectedSentences.push(...sentences.slice(middleStart, middleStart + middleCount));
      
      // Take some from end
      selectedSentences.push(...sentences.slice(sentences.length - Math.ceil(summaryTargetSentences * 0.3)));
    }
    
    // Basic summary from selected sentences
    let mainSummary = selectedSentences.join(". ").trim() + ".";
    
    // Bullet points (if enabled)
    let bulletPoints = "";
    if (includeBulletPoints) {
      // Extract potential key phrases
      const words = content.toLowerCase().split(/\s+/);
      const commonWords = ["the", "and", "a", "of", "to", "in", "is", "that", "for", "on", "with"];
      const wordFrequency: Record<string, number> = {};
      
      words.forEach(word => {
        if (word.length > 3 && !commonWords.includes(word)) {
          wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        }
      });
      
      // Find most frequent words to determine key points
      const keyWords = Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);
      
      bulletPoints = "\n\nKey points:\n";
      keyWords.forEach((word, index) => {
        // Find a sentence that contains this key word
        const relevantSentence = sentences.find(s => s.toLowerCase().includes(word)) || 
          `This content includes information about ${word}`;
          
        bulletPoints += `• ${relevantSentence.trim()}.\n`;
      });
    }
    
    // Source information
    let sourceInfo = "";
    if (includeSourceInfo) {
      sourceInfo = `\n\nSource information:\n• ${wordCount} words analyzed\n• Approximately ${Math.ceil(wordCount / 200)} minute read\n• Summary covers approximately ${Math.round((selectedSentences.length / sentences.length) * 100)}% of main content`;
    }
    
    return `${mainSummary}${bulletPoints}${sourceInfo}`;
  };
  
  const useSummary = () => {
    if (!summary) return;
    onSubmitResult(summary);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onKeyDown={handleKeyDown}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-4xl h-[85vh] relative"
      >
        <Card className="w-full h-full shadow-xl border-white/20 bg-background/95 flex flex-col overflow-hidden">
          {/* Header */}
          <CardHeader className="p-4 border-b border-white/10 flex-shrink-0 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ScanText className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">AI Text Summarizer</CardTitle>
                <Badge variant="outline" className="ml-1 bg-primary/10 border-primary/30 text-primary">
                  Atom
                </Badge>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={onClose}
                      className="h-8 w-8 rounded-full hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">Close</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription>
              Summarize any text with AI to extract key information quickly
            </CardDescription>
          </CardHeader>
          
          {/* Main content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-4 border-b border-white/10">
              <TabsList className="w-full justify-start border-b-0">
                <TabsTrigger value="input">
                  <FileText className="h-4 w-4 mr-2" />
                  Input Text
                </TabsTrigger>
                <TabsTrigger value="summary" disabled={!summary}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Summary
                </TabsTrigger>
              </TabsList>
            </div>
            
            <CardContent className="p-0 overflow-hidden flex-1">
              {/* Input tab */}
              <TabsContent value="input" className="h-full m-0 data-[state=active]:flex-1 flex flex-col">
                <div className="p-4 h-full flex flex-col">
                  <div className="mb-4 flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="summary-length" className="text-sm whitespace-nowrap">Length:</Label>
                      <select 
                        id="summary-length"
                        value={summaryLength}
                        onChange={(e) => setSummaryLength(e.target.value as any)}
                        className="h-8 rounded-md border border-white/20 bg-background px-3 py-1 text-sm"
                      >
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="detailed">Detailed</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="bullet-points" 
                        checked={includeBulletPoints}
                        onCheckedChange={setIncludeBulletPoints}
                      />
                      <Label htmlFor="bullet-points" className="text-sm">Include key points</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="source-info" 
                        checked={includeSourceInfo}
                        onCheckedChange={setIncludeSourceInfo}
                      />
                      <Label htmlFor="source-info" className="text-sm">Include source stats</Label>
                    </div>
                  </div>
                  
                  <div className="relative flex-1">
                    <Textarea
                      ref={textareaRef}
                      value={text}
                      onChange={handleTextChange}
                      placeholder="Paste or type the text you want to summarize... (min. 100 characters)"
                      className="w-full h-full resize-none p-4 border-white/20 bg-background/50 focus-visible:ring-primary/50"
                    />
                    
                    <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {text.length} characters
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={generateSummary}
                      disabled={isGenerating || text.length < 100}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Summary
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {isGenerating && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{progressText}</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-1" />
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Summary tab */}
              <TabsContent value="summary" className="h-full m-0 data-[state=active]:flex-1 flex flex-col">
                <div className="flex-1 flex flex-col p-4">
                  <Card className="flex-1 border border-white/10 bg-black/20 shadow-md">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center">
                          <Sparkles className="h-4 w-4 mr-2 text-primary" />
                          AI Summary
                        </CardTitle>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                          {summaryLength === "short" ? "Concise" : summaryLength === "detailed" ? "Detailed" : "Balanced"}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        Generated summary of your text content
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <ScrollArea className="h-[45vh]">
                        <div className="whitespace-pre-line text-sm leading-relaxed">{summary}</div>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-white/10 p-4">
                      <div className="flex space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-9 text-sm border-white/10"
                                onClick={() => {
                                  navigator.clipboard.writeText(summary);
                                  toast({ title: "Summary copied to clipboard", duration: 2000 });
                                }}
                              >
                                <Copy className="h-4 w-4 mr-1.5" />
                                Copy
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Copy to clipboard</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-9 text-sm border-white/10"
                                onClick={() => {
                                  setActiveTab("input");
                                  setSummary("");
                                  generateSummary();
                                }}
                              >
                                <RefreshCw className="h-4 w-4 mr-1.5" />
                                Regenerate
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Generate a new summary</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      <Button
                        onClick={useSummary}
                        size="sm"
                        className="h-9 text-sm bg-primary hover:bg-primary/90"
                      >
                        <CornerRightDown className="h-4 w-4 mr-1.5" />
                        Use Summary in Chat
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
} 